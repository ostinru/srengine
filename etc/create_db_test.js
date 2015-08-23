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
    var problems = [];

    var problem3 = new Problem;
    problem3.topic = "Топик " + 3;
    problem3.number = 3;
    problem3.question = "Текст задания";
    problem3.answers = ['1'];
    problem3.cost = 10;
    problem3.hints = [];
    problem3.bonuses = [];
    problem3._id = ids[3];
    problem3.nextProblems = [];
    problem3.x = 57.765055;
    problem3.y = 40.951276;
    problems.push(problem3);

    var problem2 = new Problem;
    problem2.topic = "Топик " + 2;
    problem2.number = 2;
    problem2.question = "Текст задания";
    problem2.answers = ['1'];
    problem2.cost = 10;
    problem2.hints = [];
    problem2.bonuses = [];
    problem2._id = ids[2];
    problem2.nextProblems = [];
    problem2.x = 57.768488;
    problem2.y = 40.950868;
    problems.push(problem2);

    var problem1 = new Problem;
    problem1.topic = "Топик " + 1;
    problem1.number = 1;
    problem1.question = "Текст задания";
    problem1.answers = ['1'];
    problem1.cost = 10;
    problem1.hints = [];
    problem1.bonuses = [];
    problem1._id = ids[1];
    problem1.nextProblems = [problem2._id,problem3._id];
    problem1.x = 57.762085;
    problem1.y = 40.951845;
    problems.push(problem1);

    async.each(problems, function (problemData, callback) {
        var problem = new mongoose.models.Problem(problemData);
        problem.save(callback);
    }, callback);
}

function createUsers(callback) {
    //example of user: {username: 'admin', password: '123123123', admin: true}
    Problem.find({number: 1}, function (err, problems) {
        var admin = new mongoose.models.User({username: 'superAdmin', password: '1', admin: true});
        admin.save(callback);
        var user = new mongoose.models.User({
            username: 'user1',
            password: '1',
            admin: false,
            problemHistory: [],
            problems:[]
        });
        var problem = problems[0];
        user.problems.push(problem._id);
        user.save(callback);
    })
}