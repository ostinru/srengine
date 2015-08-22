var mongoose = require('lib/mongoose.js');
var HttpError = require('error').HttpError;
var User = require('models/user').User;
var Coords = require('models/coords').Coords;
var Problem = require('models/problem').Problem;
var _ = require('underscore');
var aDistance = require('../config').get("aDistance");

exports.post = function(req,res,next) {
    var user = req.user;

    var coords = new Coords({
        sessionID: req.sessionID,
        userId: req.user._id,
        x: req.body.lat,
        y: req.body.lon,
        timestamp: Date.now(),
        userAgent: ''});
      coords.save(function(err){
        if (err) {
            return res.sendHttpError(new HttpError(500, err));
        }
        var problem = _.find(user.problems, function(problem) {
            var opened  = _.find(user.problemHistory, function(strProblem){
                 return strProblem.problem._id.equals(problem._id);
            });
            return !opened  && inProblem(problem,coords);
        });
        console.log(problem);
        if(!problem){
            //мы еще никуда не приехали
            res.json({status:"Success"})
        }
        user.problemHistory.push({
            problem:problem._id,
            solved:false,
            takenBonuses:[],
            takenHints:[],
            timeStart:Date.now()});
        console.log(user.problemHistory);
        user.markModified("problemHistory");
        user.save(function(err){
            if (err) {
                return res.sendHttpError(new HttpError(500, err));
            }
            return res.json({
                status:"Success",
                message:"problem " + problem.topic + " is opened",
                reload:true
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
    console.log(loc1);
    console.log(loc2);
    return earth_radius * M.acos(
            (M.sin(lat1) * M.sin(lat2)) + (M.cos(lat1) * M.cos(lat2) * M.cos(dlon))
        );
}

inProblem = function(problem,coords){
    deltaR = arcDistance({lat:coords.x,lng:coords.y},{lat:problem.x,lng:problem.y})*1000; // в метрах
    console.log(deltaR);
    return intersects(deltaR, aDistance);
}
