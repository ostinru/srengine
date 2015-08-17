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

    app.get('/map', checkAuth, checkTime, checkFinished, require('./map').get);
    app.post('/map', checkAuth, checkTime, checkFinished, require('./map').post);

    // Gamer's REST API
    app.get(REST_PREFIX + '/message', checkAuth, require('./message').get);

	// Admin's URLs
    app.get('/administration',checkAdmin, require('./administration').get);

    // Admin's REST API
    // FIXME: mount to /rest/...
    app.get(REST_PREFIX + '/user', checkAdmin, require('./user').getAllUsers  );
    app.get(REST_PREFIX + '/user/:userId', checkAdmin, require('./user').getUser);
    app.post(REST_PREFIX + '/user', checkAdmin,  require('./user').createUser);
    app.put(REST_PREFIX + '/user/:userId', checkAdmin, require('./user').updateUser);
    app.delete(REST_PREFIX + '/user/:userId', checkAdmin, require('./user').deleteUser);
    
    app.post(REST_PREFIX + '/user/:userId/adminbonus/', checkAdmin, require('./user').addAdminBonus);
    app.put(REST_PREFIX + '/user/:userId/adminbonus/:bonusId', checkAdmin, require('./user').updateAdminBonus);
    app.delete(REST_PREFIX + '/user/:userId/adminbonus/:bonusId', checkAdmin, require('./user').deleteAdminBonus);

    app.get(REST_PREFIX + '/problem', checkAdmin, require('./problem').getAllProblems);
    app.get(REST_PREFIX + '/problem/:problemId', checkAdmin, require('./problem').get);
    app.put(REST_PREFIX + '/problem', checkAdmin,  require('./problem').put);
    app.post(REST_PREFIX + '/problem/:problemId', checkAdmin, require('./problem').post);
    app.delete(REST_PREFIX + '/problem/:problemId', checkAdmin, require('./problem').delete);

    app.get(REST_PREFIX + '/statistics', checkAdmin, require('./statistics').get); // ложит движок! не заходить!

    app.post(REST_PREFIX + '/message', checkAdmin, require('./message').post);

    app.get(REST_PREFIX + '/time', checkAdmin, require('./game').get);
    app.post(REST_PREFIX + '/time', checkAdmin, require('./game').post);

}
