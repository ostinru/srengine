var User = require('models/user').User;
var Problem = require('models/problem').Problem;
var FieldMap = require('models/fieldMap').FieldMap;
var HttpError = require('error').HttpError;
var ObjectID = require('mongodb').ObjectID;
var checkAuth = require('middleware/checkAuth');
var checkFinished = require('middleware/checkFinished');
var checkAdmin = require('middleware/checkAdmin');
var checkTime = require('middleware/checkTime');

module.exports = function(app) {
	// Public URLs:
    app.get('/login', require('./login').get);
    app.post('/login', require('./login').post);

    app.get('/logout', require('./logout').get);
    app.post('/logout', require('./logout').post);

    // Gamer's URLs
    app.get('/', checkAuth, checkTime, checkFinished, require('./root').get);
    app.post('/', checkAuth, checkTime, checkFinished, require('./root').post);

    app.get('/map', checkAuth, checkTime, checkFinished, require('./map2').get);
    app.post('/map', checkAuth, checkTime, checkFinished, require('./map2').post);

	// Admin's URLs
    app.get('/users', checkAdmin, require('./user').getUsers);
    app.get('/user/:userId', checkAdmin, require('./user').get);
    app.post('/user/:userId', checkAdmin, require('./user').post);
    app.get('/user',checkAdmin,  require('./users').get);
    app.post('/user',checkAdmin,  require('./users').post);

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

    app.get('/statistics', checkAdmin, require('./statistics').get);

    app.get('/message', checkAuth, require('./message').get);
    app.post('/message', checkAdmin, require('./message').post);

    app.get('/globalbonus', checkAdmin, require('./globalbonus').get);
    app.post('/globalbonus', checkAdmin, require('./globalbonus').post);

    app.get('/administration',checkAdmin, require('./administration').get);
    app.post('/administration',checkAdmin, require('./administration').post);

}
