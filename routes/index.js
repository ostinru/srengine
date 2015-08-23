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
    app.get('/', checkAuth, checkTime, checkFinished, require('./root').renderPage);
    // Gamer's REST API
    // FIXME: add checkREST 
    app.post(REST_PREFIX + '/coords',checkAuth, checkTime, require('./coords').post);
    app.get(REST_PREFIX + '/message', checkAuth, checkTime, require('./message').get);
    app.get(REST_PREFIX + '/', checkAuth, checkTime, checkFinished, require('./root').get);
    app.post(REST_PREFIX + '/', checkAuth, checkTime, checkFinished, require('./root').post);

	// Admin's URLs
    app.get('/administration',checkAdmin, require('./administration').get);

    // Admin's REST API
    // FIXME: mount to /rest/...
    app.get(REST_PREFIX + '/user', checkAdmin, require('./user').getAllUsers  );
    app.get(REST_PREFIX + '/user/:userId', checkAdmin, require('./user').getUser);
    app.post(REST_PREFIX + '/user', checkAdmin,  require('./user').createUser);
    app.put(REST_PREFIX + '/user/:userId', checkAdmin, require('./user').updateUser);
    app.delete(REST_PREFIX + '/user/:userId', checkAdmin, require('./user').deleteUser);
    
    app.get(REST_PREFIX + '/problem', checkAdmin, require('./problem').getAllProblems);
    app.get(REST_PREFIX + '/problem/:problemId', checkAdmin, require('./problem').get);
    app.post(REST_PREFIX + '/problem', checkAdmin, require('./problem').createProblem);
    app.put(REST_PREFIX + '/problem/:problemId', checkAdmin,  require('./problem').updateProblem);
    app.delete(REST_PREFIX + '/problem/:problemId', checkAdmin, require('./problem').deleteProblem);

    app.get(REST_PREFIX + '/statistics', checkAdmin, require('./statistics').get);

    app.post(REST_PREFIX + '/message', checkAdmin, require('./message').post);

    app.get(REST_PREFIX + '/time', checkAdmin, require('./game').get);
    app.post(REST_PREFIX + '/time', checkAdmin, require('./game').post);
}
