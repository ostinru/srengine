// TODO: auth support
module.exports = function(app) {
	app.get('/', require('./root').get);
	app.post('/', require('./root').post);
	
	app.get('/login', require('./login').get);
	app.post('/login', require('./login').post);
	
	app.post('/logout', require('./logout').post);
}
