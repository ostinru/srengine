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
    for(var i=0; i<100; i++) {
        ids.push(mongoose.Types.ObjectId(1));
    }
    callback(null);
}

function createProblems(callback) {

    var problems = [
        {
            topic : 'Planet Express',
            question : '«Вот это фоуртуна! - воскликнул Бендер. - Все на зеро!» «И как это тебе удается?» - поинтересовалась Лила. «Несколько бутылок пива - вот моя фоурмула успеха, - ответил Бендер. - И никаких тебе найнотехнологий!» «Да, ты сегодня явный файворит, - сказал Лила. - Эйто настоящий успех!». «Еще фишек, пор файвор, - обратился Бендер к крупье. - Мне нужно выиграть еще немного денег на севениры!» «Устроили тут благотворительный фоурум, - неожиданно наехал сосед Бендера по столу на крупье. - Эйто респектабельное место, а не прибежище для всяких там роботов». «Да я тебя в козерога загну! - рассердился Бендер. - Сейчас я тебе устрою файв о-клок ти!»\n На локации агенты.',
            answers : ['ОТМОРОЗОК'],
            cost: 50,
            hints: [
                { text: 'Ищем английские цифры в словах. P.S. В некоторых словах без ошибок они тоже есть.', cost: 10 },
                { text: 'Развалюха в Стрельниково (Долгота: 40° 49\' 58» Широта: 57° 48\' 05»)', cost: 10 },
                { text: 'Соберите все символы и расшифруйте.', cost: 10 }
            ],
            bonuses: [
                { text: 'ГИПНОЖАБА', cost: 20 },
                { text: 'ДОНБОТ', cost: 20}
            ],
            _id: ids[0]
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
                    { text: 'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.', cost: 10},
                    { text: 'Недострой церкви на стрелке рек Костромы и Волги.', cost: 10},
                    { text: 'Найдите метку и смотрите на столбы.', cost: 10}
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
                problemId: ids[0],
                solved:true,
                takenBonuses:[],
                takenHints:[]
            },
            {
                problemId: ids[1],
                solved:true,
                takenBonuses:[],
                takenHints:[]
            },
            {
                problemId: ids[2],
                solved:true,
                takenBonuses:[],
                takenHints:[]
            }
        ]},

        {username: 'petya', password: '123' },
        {username: 'admin', password: '123', admin: true}
    ];

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
    fields.push({X:1, Y:1, BS:true});

    async.each(fields, function(fieldData, callback) {

        var field = new mongoose.models.FieldMap(fieldData);
        field.save(callback);
    }, callback);
}
