// TODO: auth support
var User = require('models/user').User;
var HttpError = require('error').HttpError;
var ObjectID = require('mongodb').ObjectID;
var checkAuth = require('middleware/checkAuth');
var checkAdmin = require('middleware/checkAdmin');

module.exports = function(app) {
	app.get('/', checkAuth, require('./root').get);
	app.post('/', checkAuth, require('./root').post);
	
	app.get('/login', require('./login').get);
	app.post('/login', require('./login').post);

    app.get('/logout', require('./logout').get);
    app.post('/logout', require('./logout').post);

    app.get('/users', checkAdmin, function (req, res, next) {
        User.find({}, function (err, users) {
            if (err) return next(err);
            res.json(users);
        })
    });

    app.get('/user/:username', checkAdmin, function (req, res, next) {
        User.findOne({'username' : req.params.username }, function (err, user) { // ObjectID
            if (err) return next(err);
            if (!user) {
                return next(404);
            }
            res.json(user);
        });
    });

    app.get('/map', checkAuth, require('./map').get);
    app.post('/map', checkAuth, require('./map').post);

}
