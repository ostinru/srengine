var mongoose = require('lib/mongoose.js');
var async = require('async');

var firstPageObjectId = new mongoose.Types.ObjectId();
var lastPageObjectId = new mongoose.Types.ObjectId();

async.series([
    open,
    dropDatabase,
    requireModels,
    createProblems,
    createUsers
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
			],
		},
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
        {username: 'admin', password: '123', problemId: firstPageObjectId, admin: true},
    ];

    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}
