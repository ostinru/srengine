var Baobab = require('baobab');

var problems = new Baobab({
	problems: []
	}, {
	syncwrite: true,  // Applying modifications immediately
	asynchronous:true // commit on next tick
});

module.exports = {
	problems : problems
}