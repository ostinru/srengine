var mongoose = require('lib/mongoose.js');
var async = require('async');
var Problem = require('models/problem').Problem;

async.series([
    open,
    dropDatabase,
    requireModels,
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
            _id: Problem.getFirstPageObjectId()
        },
        {
            _id: mongoose.Types.ObjectId(2),
            topic : 'Задание 2',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            cost: 50,
            hints: [
                { text: 'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.', cost: 10},
                { text: 'Недострой церкви на стрелке рек Костромы и Волги.', cost: 10},
                { text: 'Найдите метку и смотрите на столбы.', cost: 10}
            ]
        }
    ];

    for(var i=2; i<10; i++) {
        problems.push(
            {
                _id: mongoose.Types.ObjectId(i+1),
                topic : 'Задание ' + (i+1).toString(),
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

    console.log('problems created');
    
    async.each(problems, function(problemData, callback) {
        var problem = new mongoose.models.Problem(problemData);
        problem.save(callback);
    }, callback);
}

function createUsers(callback) {

    var users = [
        {username: 'vasya', password: '123', currentProblemId: Problem.getFirstPageObjectId()},
        {username: 'petya', password: '123', currentProblemId: Problem.getFirstPageObjectId() },
        {username: 'admin', password: '123', currentProblemId: Problem.getFirstPageObjectId(), admin: true}
    ];

    console.log('users created');

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
           fields.push({X:i, Y:j,ProblemId: mongoose.Types.ObjectId(i) });
        }
    }
    fields.push({X:1, Y:1,BS:true});

    console.log('fieldsMap created');

    async.each(fields, function(fieldData, callback) {

        var field = new mongoose.models.FieldMap(fieldData);
        field.save(callback);
    }, callback);
}
