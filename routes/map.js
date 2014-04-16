var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var FieldMap = require('models/fieldMap').FieldMap;
var User = require('models/user').User;
exports.get = function (req, res, next) {
    if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
        res.json(req.user.position);
    } else {
        res.render('map');
    }
}

exports.post = function (req, res, next) {
    logger.info('POST on "' + req.path + '": ', req.body);
    validatePosition(req.user.position, req.body.position,function(err,isValid){
       if(err){
           return res.json({ error: err });
       };
        if(isValid){
            req.user.position.X = req.body.position.X; //TODO validate X Y
            req.user.position.Y = req.body.position.Y;
           /* запись истории
            var query = {_id: req.user._id};
            var update = {$push:{"problemHistory":{problemID:{},takenBonuses:{},takenHints:{}}}}
            User.update(query,update,function(err){
                    if (err) {
                        callback(err);
                        return;
                    }
            });
             */

            req.user.save();
            logger.info("Тише едешь, дальше будешь ) Новые координаты сохранены.");
        }
        else {
            logger.info("воу-воу! не так быстро! отказано в переходе");
        };
        res.json({ error: null, position: req.user.position });
    });
};

function validatePosition(oldPosition, newPosition, callback) {
    FieldMap.findOne({ X: newPosition.X, Y: newPosition.Y }, function (err, field) {
        if (err) {
            callback(err);
            return;
        };

        console.log(field);
        callback (null,((Math.abs(oldPosition.X - newPosition.X) === 1 && Math.abs(oldPosition.Y - newPosition.Y) === 0
            || Math.abs(oldPosition.Y - newPosition.Y) === 1 && Math.abs(oldPosition.X - newPosition.X) === 0))
        && !!field);
    });
}
