// TODO: auth support
var User = require('models/user').User;
var HttpError = require('error').HttpError;
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app) {
	app.get('/', require('./root').get);
	app.post('/', require('./root').post);
	
	app.get('/login', require('./login').get);
	app.post('/login', require('./login').post);

    app.get('/logout', require('./logout').get);
    app.post('/logout', require('./logout').post);

    app.get('/users', function (req, res, next) {
        User.find({}, function (err, users) {
            if (err) return next(err);
            res.json(users);
        })
    });

    app.get('/user/:id', function (req, res, next) {
        /*        try {
         var id = new ObjectID(req.params.id);
         } catch (e) {
         next(404);
         return;
         }
         */
        User.findById(id, function (err, user) { // ObjectID
            if (err) return next(err);
            if (!user) {
                return next(404);
            }
            res.json(user);
        });
    });

}
