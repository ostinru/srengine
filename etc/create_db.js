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
    createUsers,
    createFields
], function(err) {
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

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function generateIds(callback) {
    for(var i=0; i<=100; i++) {
        ids.push(mongoose.Types.ObjectId(1));
    }
    callback(null);
}

function createProblems(callback) {

    var problems = [
        {
            topic : 'GlobalProblem',
            question : 'The Ultimate Question of Life, the Universe, and Everything',
            answers : ['42'],
            cost: 0,
            hints: [],
            bonuses: [
                { text: 'global1', cost: 20 },
                { text: 'global2', cost: 20}
            ],
            _id: Problem.getGlobalObjectId()
        }, {
            topic : 'Base 1',
            question : 'Move to XX.XXX YY.YYY',
            answers : ['answer'],
            cost: 100,
            hints: [],
            bonuses: [
                { text: 'base1', cost: 20 },
                { text: 'base2', cost: 20}
            ],
            _id: ids[100]
        }
    ];

    for(var i=1; i<10; i++) {
        problems.push(
            {
                _id: ids[i],
                topic : 'Задание ' + (i).toString(),
                question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
                answers : ['PING', "ПИНГ"],
                cost: 50,
                hints: [
                    { _id:ids[i+20],text: 'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.', cost: 10},
                    { _id:ids[i+21],text: 'Недострой церкви на стрелке рек Костромы и Волги.', cost: 10},
                    { _id:ids[i+22],text: 'Найдите метку и смотрите на столбы.', cost: 10}
                ],
                bonuses: [
                    { _id:ids[i+23],text: 'ъ', cost: 20 },
                    { _id:ids[i+24],text: 'ъ', cost: 20 },
                ]
            });
    }
    
    async.each(problems, function(problemData, callback) {
        var problem = new mongoose.models.Problem(problemData);
        problem.save(callback);
    }, callback);
}

function createUsers(callback) {

    var users = [
        {username: 'vasya', password: '123',problemHistory: [
            {
                problemId: ids[1],
                solved:true,
                takenBonuses:[
                    ids[1+23],
                    ids[1+24]
                ],
                takenHints:[
                    ids[1+20],
                    ids[1+21],
                    ids[1+22],
                ]
            },
            {
                problemId: ids[2],
                solved:true,
                takenBonuses:[
                    ids[2+23],
                ],
                takenHints:[
                    ids[2+20],
                ]
            },
            {
                problemId: ids[3],
                solved:true,
                takenBonuses:[],
                takenHints:[]
            }
        ]},
        //{username: 'vasya', password: '123' },
        {username: 'petya', password: '123' },
        {username: 'admin', password: '123', admin: true}
    ];
    
    for (var i=0; i<20; i++) {
        users.push({username : 'user'+i, password : '123'});
        users.push({username : 'nft'+i, password : '123'});
    }

    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function createFields(callback) {

    var fields = [];

    for(var i=2; i<=8; i++) {
        var k = 1;
        for (var j=1; j<=8; j++)
        {
           fields.push({X:i, Y:j, ProblemId: ids[i] });
        }
    }
    fields.push({X:1, Y:1, BS:true, ProblemId: ids[100]});

    async.each(fields, function(fieldData, callback) {

        var field = new mongoose.models.FieldMap(fieldData);
        field.save(callback);
    }, callback);
}
