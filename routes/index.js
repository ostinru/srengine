var User = require('models/user').User;
var Problem = require('models/problem').Problem;
var FieldMap = require('models/fieldMap').FieldMap;
var HttpError = require('error').HttpError;
var ObjectID = require('mongodb').ObjectID;
var checkAuth = require('middleware/checkAuth');
var checkFinished = require('middleware/checkFinished');
var checkAdmin = require('middleware/checkAdmin');
var checkTime = require('middleware/checkTime');

var REST_PREFIX = '/rest';

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

    // Gamer's REST API
    app.get(REST_PREFIX + '/message', checkAuth, require('./message').get);

	// Admin's URLs
    app.get('/administration',checkAdmin, require('./administration').get);

    // Admin's REST API
    // FIXME: mount to /rest/...
    app.get(REST_PREFIX + '/user', checkAdmin, require('./user').getAllUsers);
    app.get(REST_PREFIX + '/user/:userId', checkAdmin, require('./user').getUser);
    app.post(REST_PREFIX + '/user/:userId', checkAdmin, require('./user').updateUser);
    app.post(REST_PREFIX + '/user', checkAdmin,  require('./user').createUser);

    app.get(REST_PREFIX + '/problem', checkAdmin, require('./problem').getAllProblems);
    app.get(REST_PREFIX + '/problem/:problemId', checkAdmin, require('./problem').get);
    app.post(REST_PREFIX + '/problem/:problemId', checkAdmin, require('./problem').post);

    app.get('/fieldsMap', checkAdmin, function (req, res, next) {
        FieldMap.find({}, function (err, fieldsMap) {
            if (err) return next(err);
            res.json(fieldsMap);
        })
    });

    app.get('/statistics', checkAdmin, require('./statistics').get);

    app.post(REST_PREFIX + '/message', checkAdmin, require('./message').post);

    app.get(REST_PREFIX + '/globalbonus', checkAdmin, require('./globalbonus').get);
    app.post(REST_PREFIX + '/globalbonus', checkAdmin, require('./globalbonus').post);

    app.post(REST_PREFIX + '/time', checkAdmin, require('./game').post);

}
