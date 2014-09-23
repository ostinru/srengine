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
    require('models/fieldMap');

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
    var problems = [
        {
            topic : 'Глобальный бонус',
            question : 'Оценка за костюмы + количество артефактов',
            answers : ['1'],
            cost: 0,
            hints: [
                { text: 'п10', cost: 10},
                { text: 'п20', cost: 20},
                { text: 'п30', cost: 30},
                { text: 'п40', cost: 40},
                { text: 'п50', cost: 50}
            ],
            bonuses: [
                { text: 'б10', cost: 10},
                { text: 'б20', cost: 20},
                { text: 'б30', cost: 30},
                { text: 'б40', cost: 40},
                { text: 'б50', cost: 50},
                { text: 'б60', cost: 60},
                { text: 'б70', cost: 70},
                { text: 'б80', cost: 80},
                { text: 'б90', cost: 90},
                { text: 'б100', cost: 100},
                { text: 'б110', cost: 110}
            ],
            _id: Problem.getGlobalObjectId()
        }
    ];

    async.each(problems, function (problemData, callback) {
        var problem = new mongoose.models.Problem(problemData);
        problem.save(callback);
    }, callback);
}

function createUsers(callback) {
    //example of user: {username: 'admin', password: '123123123', admin: true}

    var users = [
        {username: 'superAdmin', password: '1',admin: true}
    ];

    async.each(users, function (userData, callback) {
        var user = new mongoose.models.User(userData);
        user.problemHistory.push({problemId: Problem.getGlobalObjectId(),solved:true});
        user.save(callback);
    }, callback);
}

function createFields(callback) {
    //example of fieldmap: {X:1, Y:1, BS:false, ProblemId: ids[1]}

    var fields = [
     ];


    async.each(fields, function (fieldData, callback) {
        if(!fieldData.ProblemId){
            fieldData.ProblemId = Problem.getGlobalObjectId();
        }
        var field = new mongoose.models.FieldMap(fieldData);
        field.save(callback);
    }, callback);
}
