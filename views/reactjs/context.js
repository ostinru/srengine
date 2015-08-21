var Baobab = require('baobab');

var problems = new Baobab({
	problems: []
	}, {
	syncwrite: true,  // Applying modifications immediately
	asynchronous:true // commit on next tick
});

var users = new Baobab({
	users: []
	}, {
	syncwrite: true,  // Applying modifications immediately
	asynchronous:true // commit on next tick
});

module.exports = {
	problems : problems,
	users: users
}