var mongoose = require('lib/mongoose.js');
var HttpError = require('error').HttpError;
var User = require('models/user').User;
var Coords = require('models/coords').Coords;
var Problem = require('models/problem').Problem;
var _ = require('lodash');
var aDistance = require('../config').get("aDistance");
var logger = require('lib/logger')(module);

var store = {};

exports.get = function(req, res, next) {
    var now = Date.now(); // milliseconds
    // cleanup store:
    store = _.pick(store, function(value, key) {
        return value.timestamp + 5*60*1000 > now; // store sessions's coords 5 minutes
    });
    res.json(store);
};

exports.getArchive = function(req, res, next) {
    if (!req.query.timestamp)
        return res.sendHttpError(new HttpError(400, 'Invalid \'timestamp\' query parameter\'s value'));

    var timestamp = + req.query.timestamp * 1000;
    var from = timestamp - 120*1000;
    var to = timestamp;

    // logger.info(`Fetching archiv coords from ${from} to ${to}`);

    Coords.find(
        {timestamp : {"$gte":  from, "$lte": to }},
        { _id: 0, userId: 1, x: 1, y: 1, timestamp: 1, sessionID: 1 },
        {sort: {timestamp : 1}})
        .populate('userId', 'username -_id')
        .exec(function (err, coords) {
            if (err) {
                logger.error(err);
                return next(err);
            }
            var r = {};
            _.each(coords, function(coord) {
                var name = coord.userId.username;
                var sessionID = coord.sessionID;
                var obj = r[sessionID];
                if (!obj) {
                    obj = r[sessionID] = {
                         username: name,
                         points: []
                    };
                }
                obj.points.push({
                     x: coord.x,
                     y: coord.y,
                     timestamp: timestamp
                });
            });
            return res.json(_.values(r));
    });
}

exports.post = function(req,res,next) {
    var user = req.user;

    var coords = new Coords({
        sessionID: req.sessionID,
        userId: req.user._id,
        x: req.body.lat,
        y: req.body.lon,
        timestamp: Date.now(),
        userAgent: ''
    });

    coords.save(function(err){
        if (err) {
            logger.info('[%s] coords not saved', user.username);
            return res.json({status: 'Fail', userV: user.__v}); // ERROR
        }

        var plainCoords = coords.toObject();
        plainCoords.notes = '';
        store[plainCoords.sessionID] = plainCoords;

         var problem = _.find(user.problems, function(problem) {
            // проверяем читинг:
            if (problem.x == coords.x && problem.y == coords.y) {
                logger.info('[%s] Anti-cheat', user.username, coords.x, coords.y);
                plainCoords.note = 'Exact hit!'
                return false;
            }
            // проверяем расстояние
            if (!inProblem(problem, coords)) {
                return false;
            }
            var opened = _.find(user.problemHistory, function (strProblem) {
                return strProblem.problem._id.equals(problem._id);
            });
            return !opened;
        });
        if(!problem){
            //мы еще никуда не приехали
            return res.json({status:"Success", userV: user.__v})
        }

        // Приехали. Проверяем читинг:
        if (user.problemHistory.length != 0) {
            var last = user.problemHistory[user.problemHistory.length-1];
            var tdiff = (new Date()).getTime() - last.timeStart.getTime();
            tdiff = tdiff / 1000 / 3600;

            var dist = arcDistance({lat: last.problem.x, lng:last.problem.y}, {lat: problem.x, lng: problem.y});

            var speed = dist / tdiff;

            logger.info('[%s] SpeedCheck', user.username, dist, tdiff, speed);

            if (speed > 60) {
                plainCoords.note = 'Faster than light! Speed: ' + speed;
                return res.json({status: 'Fail', message: 'Faster than light!', userV: user.__v, navigate: 'images/speed.jpeg'});
            }
        }

        // Ок
        user.problemHistory.push({
            problem:problem._id,
            solved:false,
            takenBonuses:[],
            takenHints:[],
            timeStart:Date.now()
        });
        user.markModified("problemHistory");
        user.save(function(err){
            if (err) {
                logger.info('user ' + user.username + ' not saved', err);
                return res.json({status: fail, message: 'DB error: user not saved', userV: user.__v});
            }
            logger.info('problem ' + problem.topic + ' is opend for ' + user.username);
            return res.json({
                status:"Success",
                message:"problem " + problem.topic + " is opened",
                userV: user.__v,
                visited:true
            })
        });
    })
}

//Функция проверки на вхождение в круг на сфере
intersects = function(rPoint,rCircle) {
     return rPoint-rCircle <= 0
}

//Функция расстояния в км между 2мя точками (коорд)
arcDistance = function(loc1, loc2) {
    var rad = Math.PI / 180,
        earth_radius = 6371.009, // close enough
        lat1 = loc1.lat * rad,
        lat2 = loc2.lat * rad,
        dlon = Math.abs(loc1.lng - loc2.lng) * rad,
        M = Math;
    return earth_radius * M.acos(
            (M.sin(lat1) * M.sin(lat2)) + (M.cos(lat1) * M.cos(lat2) * M.cos(dlon))
        );
}

inProblem = function(problem,coords){
    deltaR = arcDistance({lat:coords.x,lng:coords.y},{lat:problem.x,lng:problem.y})*1000; // в метрах
    return intersects(deltaR, aDistance);
}
