var mongoose = require('lib/mongoose.js');
var async = require('async');
var Problem = require('models/problem').Problem;

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function (err) {
    console.log(err);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('models/user');
    require('models/problem');
    require('models/coords');
    require('models/message');

    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}


function createUsers(callback) {
    //example of user: {username: 'admin', password: '123123123', admin: true}
	var admin = new mongoose.models.User(
		{username: 'superAdmin' , password: '1', admin: true}
	);
    admin.save(callback);
}