var mongoose = require('lib/mongoose.js');
var async = require('async');

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

    var Problem = require('models/problem').Problem;

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
            topic : 'Задание 2',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            cost: 50,
            hints: [
                { text: 'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.', cost: 10},
                { text: 'Недострой церкви на стрелке рек Костромы и Волги.', cost: 10},
                { text: 'Найдите метку и смотрите на столбы.', cost: 10}
            ]
        },
        {
            topic : 'Задание 3',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            cost: 50,
            hints: [
                { text: 'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.', cost: 10},
                { text: 'Недострой церкви на стрелке рек Костромы и Волги.', cost: 10},
                { text: 'Найдите метку и смотрите на столбы.', cost: 10}
            ]
        },
        {
            topic : 'Задание 4',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            cost: 50,
            hints: [
                { text: 'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.', cost: 10},
                { text: 'Недострой церкви на стрелке рек Костромы и Волги.', cost: 10},
                { text: 'Найдите метку и смотрите на столбы.', cost: 10}
            ]
        },
        {
            topic : 'Задание 5',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            cost: 50,
            hints: [
                { text: 'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.', cost: 10},
                { text: 'Недострой церкви на стрелке рек Костромы и Волги.', cost: 10},
                { text: 'Найдите метку и смотрите на столбы.', cost: 10}
            ]
        },
        {
            topic : 'Задание 6',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            cost: 50,
            hints: [
                { text: 'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.', cost: 10},
                { text: 'Недострой церкви на стрелке рек Костромы и Волги.', cost: 10},
                { text: 'Найдите метку и смотрите на столбы.', cost: 10}
            ]
        },
        {
            topic : 'Задание 7',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            cost: 50,
            hints: [
                { text: 'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.', cost: 10},
                { text: 'Недострой церкви на стрелке рек Костромы и Волги.', cost: 10},
                { text: 'Найдите метку и смотрите на столбы.', cost: 10}
            ]
        },
        {
            topic : 'Задание 8',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            cost: 50,
            hints: [
                { text: 'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.', cost: 10},
                { text: 'Недострой церкви на стрелке рек Костромы и Волги.', cost: 10},
                { text: 'Найдите метку и смотрите на столбы.', cost: 10}
            ]
        },
        {
            topic : 'Задание 9',
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
    
    async.each(problems, function(problemData, callback) {
        var problem = new mongoose.models.Problem(problemData);
        problem.save(callback);
    }, callback);
}

function createUsers(callback) {

    var Problem = require('models/problem').Problem;

    var users = [
        {username: 'vasya', password: '123', problemId: Problem.getFirstPageObjectId() },
        {username: 'petya', password: '123', problemId: Problem.getFirstPageObjectId() },
        {username: 'admin', password: '123', problemId: Problem.getFirstPageObjectId(), admin: true}
    ];

    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function createFields(callback) {

    var fields = [
        {X: 2,Y : 1 }, {X: 2,Y : 2 }, {X: 2,Y : 3 }, {X: 2,Y : 4 }, {X: 2,Y : 5 }, {X: 2,Y : 6 }, {X: 2,Y : 7 },
        {X: 3,Y : 1 }, {X: 3,Y : 2 }, {X: 3,Y : 3 }, {X: 3,Y : 4 }, {X: 3,Y : 5 }, {X: 3,Y : 6 }, {X: 3,Y : 7 }, {X: 3,Y : 8 },
        {X: 4,Y : 1 }, {X: 4,Y : 2 }, {X: 4,Y : 3 }, {X: 4,Y : 4 }, {X: 4,Y : 5 }, {X: 4,Y : 6 }, {X: 4,Y : 7 }, {X: 4,Y : 8 },
        {X: 5,Y : 1 }, {X: 5,Y : 2 }, {X: 5,Y : 3 }, {X: 5,Y : 4 }, {X: 5,Y : 5 }, {X: 5,Y : 6 }, {X: 5,Y : 7 }, {X: 5,Y : 8 },
        {X: 6,Y : 1 }, {X: 6,Y : 2 }, {X: 6,Y : 3 }, {X: 6,Y : 4 }, {X: 6,Y : 5 }, {X: 6,Y : 6 }, {X: 6,Y : 7 }, {X: 6,Y : 8 },
        {X: 7,Y : 2 }, {X: 7,Y : 3 }, {X: 7,Y : 4 }, {X: 7,Y : 5 }, {X: 7,Y : 6 }, {X: 7,Y : 7 }, {X: 7,Y : 8 }, {X: 7,Y : 9 }, {X: 7,Y : 10 },
        {X: 8,Y : 2 }, {X: 8,Y : 3 }, {X: 8,Y : 4 }, {X: 8,Y : 5 }, {X: 8,Y : 6 }, {X: 7,Y : 7 }, {X: 8,Y : 8 }
    ];

    async.each(fields, function(fieldData, callback) {

        var field = new mongoose.models.FieldMap(fieldData);
        field.save(callback);
    }, callback);
}
