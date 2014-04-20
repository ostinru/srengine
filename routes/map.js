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
    if (!req.body.position) {
        return res.sendHttpError(new HttpError(400, 'Position not set'));
    }
    var newPosition = {
        X: req.body.position.X,
        Y: req.body.position.Y
    };
    FieldMap.findOne(newPosition, function (err, field) {
        if (err) {
            logger.info("Игроку %s отказано в переходе на клетку", req.user.username, newPosition);
            return res.json({ error: err, position: req.user.position });
        }
        if (! field) {
            // we can't visit this field
            return res.json({ error: err, position: req.user.position });
        }

        var user = req.user;

        if (user.problemId) {
          return res.json({ error: "Вам нужно 'закрыть' уровень. Например, 'автопереход'-ом.", position: user.position });
        }
        if (! isValidStep(user.position, newPosition)) {
            logger.info("Игроку %s отказано в переходе на клетку", user.username, newPosition);
            return res.json({ error: err, position: req.user.position });
        }

        user.position = newPosition;
        if (! user.getProblemHistory(field.ProblemId)) {
            user.problemId = field.ProblemId;
            user.problemHistory.push({
                problemId: field.ProblemId,
                takenBonuses:[],
                takenHints:[]
            });
            user.markModified('problemHistory');
        }

        user.save(function (err) {
            if (err) {
                logger.error("Новые координаты игрока %s не сохранены", user.username, err);
            }
            logger.info("Новые координаты игрока %s сохранены.", user.username, newPosition);
            return res.json({ error: err, position: user.position });
        });
    });
};

function isValidStep(oldPosition, newPosition) {
    var dx = Math.abs(oldPosition.X - newPosition.X);
    var dy = Math.abs(oldPosition.Y - newPosition.Y);
    return (dx + dy) === 1;
}
