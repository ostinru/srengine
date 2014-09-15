var User = require('models/user').User;
var Problem = require('models/problem').Problem;
var FieldMap = require('models/fieldMap').FieldMap;
var HttpError = require('error').HttpError;
var ObjectID = require('mongodb').ObjectID;
var checkAuth = require('middleware/checkAuth');
var checkAdmin = require('middleware/checkAdmin');
var checkTime = require('middleware/checkTime');

module.exports = function(app) {
    app.get('/', checkAuth, checkTime, require('./root').get);
    app.post('/', checkAuth, checkTime, require('./root').post);

    app.get('/login', require('./login').get);
    app.post('/login', require('./login').post);

    app.get('/logout', require('./logout').get);
    app.post('/logout', require('./logout').post);

    app.get('/user', checkAdmin, function (req, res, next) {
        User.find({}, function (err, users) {
            if (err) return next(err);
            res.json(users);
        })
    });
    app.get('/user/:username', checkAdmin, function (req, res, next) {
        User
        .findOne({'username' : req.params.username })
        .exec(function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(404);
            }
            res.json(user);
        });
    });
    app.get('/user',checkAdmin,  require('./users').get);
    app.post('/user',checkAdmin,  require('./users').post);

    //просмотр и редактирование заданий
    app.get('/problems',checkAdmin,  function (req, res, next) {
        Problem.find({}, function (err, problems) {
            if (err) return next(err);
            res.json(problems);
        })
    });
    app.get('/problem',checkAdmin,  require('./problems').get);
    app.post('/problem',checkAdmin,  require('./problems').post);
    app.get('/problem/:problemId',checkAdmin,  require('./problem').get);
    app.post('/problem/:problemId',checkAdmin,  require('./problem').post);

    app.get('/fieldsMap', checkAdmin, function (req, res, next) {
        FieldMap.find({}, function (err, fieldsMap) {
            if (err) return next(err);
            res.json(fieldsMap);
        })
    });

    app.get('/map', checkAuth, checkTime, require('./map').get);
    app.post('/map', checkAuth, checkTime, require('./map').post);

    app.get('/statistics', checkAdmin, require('./statistics').get);

    app.get('/message', checkAuth, require('./message').get);
    app.post('/message', checkAdmin, require('./message').post);

    app.post('/globalbonus', checkAdmin,require('./globalbonus').post);

    app.get('/globalbonus', checkAdmin,function(req,res,next){
        res.render('globalbonus');
    });

    app.get('/administration',checkAdmin,function(req,res,next){
        res.render('administration');
    })
}
