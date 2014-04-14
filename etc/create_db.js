var mongoose = require('lib/mongoose.js');
var async = require('async');

var firstPageObjectId = new mongoose.Types.ObjectId();
var lastPageObjectId = new mongoose.Types.ObjectId();

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
			hints: [
				'Ищем английские цифры в словах. P.S. В некоторых словах без ошибок они тоже есть.',
				'Развалюха в Стрельниково (Долгота: 40° 49\' 58» Широта: 57° 48\' 05»)',
				'Соберите все символы и расшифруйте.'
			],
			bonuses: [
				'ГИПНОЖАБА',
				'ДОНБОТ'
			],
			_id: firstPageObjectId
		},
		{
			topic : '4-ое измерение',
			question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
			answers : ['PING', "ПИНГ"],
			hints: [
				'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.',
				'Недострой церкви на стрелке рек Костромы и Волги.',
				'Найдите метку и смотрите на столбы.'
			]
		},
        {
            topic : 'задание 3',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            hints: [
                'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.',
                'Недострой церкви на стрелке рек Костромы и Волги.',
                'Найдите метку и смотрите на столбы.'
            ]
        },
        {
            topic : 'задание 4',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            hints: [
                'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.',
                'Недострой церкви на стрелке рек Костромы и Волги.',
                'Найдите метку и смотрите на столбы.'
            ]
        },
        {
            topic : 'задание 5',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            hints: [
                'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.',
                'Недострой церкви на стрелке рек Костромы и Волги.',
                'Найдите метку и смотрите на столбы.'
            ]
        },
        {
            topic : 'задание 6',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            hints: [
                'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.',
                'Недострой церкви на стрелке рек Костромы и Волги.',
                'Найдите метку и смотрите на столбы.'
            ]
        },
        {
            topic : 'задание 7',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            hints: [
                'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.',
                'Недострой церкви на стрелке рек Костромы и Волги.',
                'Найдите метку и смотрите на столбы.'
            ]
        },
        {
            topic : 'задание 8',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            hints: [
                'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.',
                'Недострой церкви на стрелке рек Костромы и Волги.',
                'Найдите метку и смотрите на столбы.'
            ]
        },
        {
            topic : 'задание 9',
            question : 'Фрай читал летопись Футурамы:\n«В тот день, когда BMW превратилось в ТЬБ, EUI - в ВАП, а FGC - в НГШ, пришел Дворак и произнес речь: Fynhjbdh\' ,ydpex fu jbdytpy dyp Phjbdhko x Ehtgx»',
            answers : ['PING', "ПИНГ"],
            hints: [
                'Переведите речь из раскладки Дворака в раскладку Йцукен.тоже есть.',
                'Недострой церкви на стрелке рек Костромы и Волги.',
                'Найдите метку и смотрите на столбы.'
            ]
        }
    ];
	
	async.each(problems, function(problemData, callback) {
		var problem = new mongoose.models.Problem(problemData);
		problem.save(callback);
	}, callback);
}

function createUsers(callback) {

    var users = [
        {username: 'vasya', password: '123', problemId: firstPageObjectId},
        {username: 'petya', password: '123', problemId: firstPageObjectId},
        {username: 'admin', password: '123', problemId: firstPageObjectId, admin: true}
    ];

    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function createFields(callback) {

    var fields = [
        {X: 10,Y : 14 }, {X: 10,Y : 15 }, {X: 10,Y : 16 }, {X: 10,Y : 17 }, {X: 10,Y : 18 }, {X: 10,Y : 19 }, {X: 10,Y : 20 }, {X: 10,Y : 20 }, {X: 10,Y : 21 },{X: 10,Y : 22 }, {X: 10,Y : 23 },{X: 10,Y : 24 }, {X: 10,Y : 25 }, {X: 10,Y : 26 },
        {X: 9,Y : 14 }, {X: 9,Y : 15 }, {X: 9,Y : 16 }, {X: 9,Y : 17 }, {X: 9,Y : 18 }, {X: 9,Y : 19 }, {X: 9,Y : 20 }, {X: 9,Y : 20 }, {X: 9,Y : 21 },{X: 9,Y : 22 }, {X: 9,Y : 23 },{X: 9,Y : 24 }, {X: 9,Y : 25 }, {X: 9,Y : 26 },
        {X: 8,Y : 14 }, {X: 8,Y : 15 }, {X: 8,Y : 16 }, {X: 8,Y : 17 }, {X: 8,Y : 18 }, {X: 8,Y : 19 }, {X: 8,Y : 20 }, {X: 8,Y : 21 },
        {X: 7,Y : 14 }, {X: 7,Y : 15 }, {X: 7,Y : 16 }, {X: 7,Y : 17 }, {X: 7,Y : 18 }, {X: 7,Y : 19 }, {X: 7,Y : 20 },
        {X: 6,Y : 13 }, {X: 6,Y : 14 }, {X: 6,Y : 15 }, {X: 6,Y : 16 }, {X: 6,Y : 17 }, {X: 6,Y : 18 }, {X: 6,Y : 19 }, {X: 6,Y : 20 }, {X: 6,Y : 21 },
        {X: 5,Y : 14 }, {X: 5,Y : 15 }, {X: 5,Y : 16 }, {X: 5,Y : 17 }, {X: 5,Y : 18 }, {X: 5,Y : 19 }, {X: 5,Y : 20 }, {X: 6,Y : 20 }, {X: 6,Y : 21 },{X: 5,Y : 22 }, {X: 5,Y : 23 },{X: 5,Y : 24 }, {X: 5,Y : 25 }, {X: 5,Y : 26 }, {X: 5,Y : 27 }

    ];

    async.each(fields, function(fieldData, callback) {

        var field = new mongoose.models.FieldMap(fieldData);
        field.save(callback);
    }, callback);
}
