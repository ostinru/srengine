var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var FieldMap = require('models/fieldMap').FieldMap;
var User = require('models/user').User;

exports.get = function (req, res, next) {
    if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
        if (req.query.full == 'true') {
            FieldMap.find({ /* all */ }, 'X Y BS -_id', function(err, result) {
                if (err) {
                    logger.error(err);
                    return res.json({error: err});
                }
                res.json(result);
            });
        }
        else {
            res.json(req.user.position);
        }
    } else {
        res.render('map');
    }
}

exports.post = function (req, res, next) {
    logger.info('POST on "' + req.path + '": ', req.body);
    var newPosition = {
        X: req.body.position.X,
        Y: req.body.position.Y
    };
    FieldMap.findOne(newPosition, function (err, field) {
        if (err) {
            logger.info("Игроку %s отказано в переходе на клетку", req.user.username, newPosition);
            return res.json({ error: err, position: req.user.position });
        }
        if (! isValidStep(req.user.position, newPosition)) {
            logger.info("Игроку %s отказано в переходе на клетку", req.user.username, newPosition);
            return res.json({ error: err, position: req.user.position });
        }
        
        req.user.position = newPosition;
        req.user.problemId = field.ProblemId;
        req.user.save(function (err) {
            if (err) {
                logger.error("Новые координаты игрока %s не сохранены", req.user.username, err);
            }
            logger.info("Новые координаты игрока %s сохранены.", req.user.username, newPosition);
            return res.json({ error: err, position: req.user.position });
        });
/*
            var query = {_id: req.user._id};
            var update = {$push:{"problemHistory":{problemId:{},takenBonuses:[],takenHints:[]}}};
            User.update(query, update, function(err){
                    if (err) {
                        callback(err);
                        return;
                    }
            });
*/
    });
};

function isValidStep(oldPosition, newPosition) {
    var dx = Math.abs(oldPosition.X - newPosition.X);
    var dy = Math.abs(oldPosition.Y - newPosition.Y);
    return (dx + dy) === 1;
}
