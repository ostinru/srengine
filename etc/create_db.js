var mongoose = require('lib/mongoose.js');
var async = require('async');
var Problem = require('models/problem').Problem;

var ids = [];

async.series([
    open,
    dropDatabase,
    requireModels,
    generateIds,
    createProblems,
    createUsers
], function (err) {
    console.log(arguments);
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

    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function generateIds(callback) {
    for (var i = 0; i <= 100; i++) {
        ids.push(mongoose.Types.ObjectId(i));
    }
    callback(null);
}

function createProblems(callback) {
    var problems = [ ];

    for (var i=1;i<10;i++){
        var problem = new Problem;
        problem.topic = "Топик " + i;
        problem.question = "Текст задания";
        problem.answers = ['1'];
        problem.cost = 10;
        problem.hints = [];
        problem.bonuses = [{text:'1',cost:20}];
        problem._id = ids[i];
        problems.push(problem);
    }

    async.each(problems, function (problemData, callback) {
        var problem = new mongoose.models.Problem(problemData);
        problem.save(callback);
    }, callback);
}

function createUsers(callback) {
    //example of user: {username: 'admin', password: '123123123', admin: true}

    Problem.find({}, function (err, problems) {
        var admin = new mongoose.models.User({username: 'superAdmin' , password: '1', admin: true});
        admin.save(callback);
        for (var i = 1; i < problems.length; i++) {
            var user = new mongoose.models.User({username: 'user' + i.toString(), password: '1', admin: false, problemHistory: []});
            for (var j = 1; j <= i; j++) {
                 if (err) {
                    throw err;
                }
                var problem = problems[j];
                user.problemHistory.push({problem: problem._id, solved: true, takenBonuses:[problem.bonuses[0]._id]});
            }
            user.save(callback);
        }
    })
}