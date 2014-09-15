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
    //createFields
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
            topic: 'ЗАДАНИЕ № 1',
            serial: 1,
            question:
                'Сегодня 26 апреля 2014 г.<br>\
                Банда «Бабдитов» не спит. Вернее спит мало, потому что пьет допоздна и работает по ночам.<br>\
                Благодарю их, они хорошо решают проблемы. Есть заказ следующий, и они там постараются нормально. Бабдиты вышли на волю. И сразу в пекло.<br>\
                Ёжик – главный отморозок леса, Анка – стреляет редко, но метко, Мара – в лесу с ней лучше не встречаться. Они готовят бомбу, которая взорвет лес.<br>\
                Работа - эксклюзивная! Следите за ними. Настроение прочувствуйте.<br>\
                Взяли бардоотпускное отделение. Положили где-то за 49 из 51 бойцов… а у них без потерь.<br>\
                Ожидайте встречи с ними.<br>\
                Опасайтесь, ощиплют грамотно. Но их не обойти. Эта зона их.',
            answers: ['1'],
            cost: 60,
            hints: [
                { text: 'ул. Лесная, между домами 49 и 51', cost: 25}
             ],
            bonuses: [],
            _id: ids[1]
        },
        {
            topic: 'ЗАДАНИЕ № 2',
            serial: 2,
            question:
                'Дань времени, бабдиты  на осколках золотоносной империи. Без суждений о морали и вере! Под гнетом новой хищной стратегии - золотой лихорадки,\
                симптом которой – артефакты и деньги.\
                Здесь руки безглазой Фемиды не дотягиваются…Разбитые старые баяны-здания, среди жилых. Их щемят и щемят молодые борзые.\
                Ещё не изданный в мае числа первого, но видимый издали, на ходу щемящий  искрами, лепит инстинкты молочной клыкастой поросли, играет лязгом стали в охрипшем голосе. Меняются лица на морды и рыла, руки - на лапы с когтями, копыта и крылья. И что получишь ты, затеяв спор с зоной? Будь осторожен, сталкер! Держись правее границ угодий.',
            answers: ['1'],
            cost: 60,
            hints: [
                { text: 'Координаты: 57.766523 40.921294', cost: 25}
            ],
            bonuses: [],
            _id: ids[2]
        },
        {
            topic: 'ЗАДАНИЕ № 3',
            serial: 3,
            question:
                'Резко, четко, как удары плетки, как остров кидал, больно, как жало, нужно как водка, жирно как сало и так много - что аж плохо стало… Хватит пялиться - ослабится зрение. Надо работать мозгом – упорото, по-моему мнению! Опытный сталкер, герой  - бравый парень. Против тебя неукротимый остров местный, опасный одиночке, ремонтируемый кем-то. И там все делай быстро, четко, чисто. А не то полетят искры. Аккуратно зайди в зону и вскоре, не то 53 бюрера упакоют.  ',
            answers: ['1'],
            cost: 60,
            hints: [
                { text: 'Островского, 53', cost: 25}
            ],
            bonuses: [],
            _id: ids[3]
        },
        {
            topic: 'ЗАДАНИЕ № 4',
            serial: 4,
            question:
                'Прочесывая зону, мы забрели в бывшую студию звукозаписи. Проклятые карлики и бюреры побывали и здесь. Разломано всё. Стулья, шкафы, аппаратура…хаос!  Бумаг на полу…хоть жопой жуй! Мы нашли чьи-то зарисовочки. Логика в них есть. Писали они годно.<br>\
                Полупустой вагон ж/д когда-то стоял<br>\
                Меня везет ночной экспресс на старый вокзал<br>\
                И пусть меня никто не ждет у дверей<br>\
                Вези меня ночной экспресс к дядьке Яру скорей.<br>\
                Город плывет в море цветных огней<br>\
                Город живет Славой своих людей<br>\
                Старый вокзал стены свои открой<br>\
                Там мы найдем 3 части кода! Хой!<br>\
                Далее текст размыт. Интересно автор сам бывал там? Посетите зону, будьте осторожны… Монстры не дремлют. Попробуйте собрать все 3 части кода. Безопасный радиус поиска 25-30 метров.',
            answers: ['1'],
            cost: 60,
            hints: [
                { text: 'Координаты: 57.755528 40.896354', cost: 25}
            ],
            bonuses: [],
            _id: ids[4]
        },
        {
            topic: 'ЗАДАНИЕ № 5',
            serial: 5,
            question:
                'Дневник:<br>\
                26.04.2013<br>\
                Упоротые эти жители были. Строили завод. Нашли нефть. Радостно прыгали. Машут и машут руками. Эй-богу, как дети. А в итоге все равно часть забросили. Стоят они такие брошенные за активными. Будьте осторожны… водные аномалии отгорожены остатками сетки и проволоки. Обойдите их. То, что нам нужно находится дальше, почти под прямым от них. Примерно в 200 метрах.',
            answers: ['1'],
            cost: 60,
            hints: [
                { text: 'Координаты: 57.742458, 40.878735', cost: 25},
                { text: 'Если вы не нашли все бумажки или не можете решить - Найдите код маркером около двери на 3м этаже (на крыше) здания слева', cost: 15}
            ],
            bonuses: [],
            _id: ids[5]
        },
        {
            topic: 'ЗАДАНИЕ № 6',
            serial: 6,
            question:
                'Прогулки по Зоне вещь крайне опасная. Есть улицы полные монстров. Есть относительно безопасные. Есть промзоны, укрепленные баррикадами. Пройди по цветной улице, сверни на улицу древнего города, выезжая на нужную улицу, аккуратно проедьте мимо фонтана. Будьте осторожны. Там дикие банды. Не вступайте с ними в диалог. Двигайтесь дальше примерно 100 метров. Поверните направо. Там вы увидите «деревню кровососов». Внимательно обыщите оба дома.  ',
            answers: ['1'],
            cost: 60,
            hints: [
                { text: 'пос. фанерник, ул. центральная 2а', cost: 25}
            ],
            bonuses: [],
            _id: ids[6]
        },
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
        {username: 'adminb', password: 'finalfantasy13',admin: true},
        {username: 'admins', password: 'finalfantasy13', admin:true},
        {username: 'adminv', password: 'finalfantasy13',admin: true},
        {username: 'alpaltus', password: 'gic5b4',problemQueue:[1,2,3,7,4,6,5]},
        {username: 'orgi', password: 'g029p9',problemQueue:[1,2,3,7,4,6,5]}
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
        {X: 8, Y: 1},{X: 9, Y: 1, ProblemId: ids[3]},{X: 10, Y: 1},{X: 11, Y: 1},{X: 12, Y: 1},{X: 13, Y: 1},{X: 14, Y: 1},
        {X: 1, Y: 2},{X: 2, Y: 2},{X: 3, Y: 2},{X: 4, Y: 2},{X: 5, Y: 2},{X: 6, Y: 2},{X: 7, Y: 2},{X: 10, Y: 2},{X: 11, Y: 2},{X: 12, Y: 2},{X: 13, Y: 2},{X: 14, Y: 2},{X: 15, Y: 2},{X: 16, Y: 2},{X: 17, Y: 2},{X: 18, Y: 2},
        {X: 1, Y: 3},{X: 2, Y: 3},{X: 3, Y: 3, ProblemId : ids[4]},{X: 4, Y: 3},{X: 5, Y: 3},{X: 6, Y: 3},{X: 7, Y: 3},{X: 8, Y: 3},{X: 10, Y: 3},{X: 11, Y: 3},{X: 12, Y: 3},{X: 13, Y: 3},{X: 14, Y: 3, ProblemId: ids[2]},{X: 15, Y: 3},{X: 16, Y: 3},{X: 17, Y: 3},{X: 18, Y: 3},{X: 19, Y: 3, ProblemId: ids[6]},
        {X: 1, Y: 4},{X: 2, Y: 4},{X: 3, Y: 4},{X: 4, Y: 4},{X: 5, Y: 4},{X: 6, Y: 4},{X: 7, Y: 4},{X: 8, Y: 4},{X: 10, Y: 4},{X: 11, Y: 4},{X: 12, Y: 4},{X: 13, Y: 4},{X: 14, Y: 4},{X: 15, Y: 4},{X: 16, Y: 4},{X: 17, Y: 4},{X: 18, Y: 4},{X: 19, Y: 4},{X: 20, Y: 4},
        {X: 1, Y: 5},{X: 2, Y: 5},{X: 3, Y: 5},{X: 4, Y: 5},{X: 5, Y: 5},{X: 6, Y: 5},{X: 7, Y: 5},{X: 8, Y: 5, ProblemId: ids[5]},{X: 10, Y: 5, BS: true, ProblemId: ids[11]},{X: 11, Y: 5},{X: 12, Y: 5},{X: 13, Y: 5},{X: 14, Y: 5},{X: 15, Y: 5},{X: 16, Y: 5},{X: 17, Y: 5},{X: 18, Y: 5},{X: 19, Y: 5},{X: 20, Y: 5},
        {X: 1, Y: 6},{X: 2, Y: 6},{X: 3, Y: 6},{X: 4, Y: 6},{X: 5, Y: 6},{X: 6, Y: 6},{X: 7, Y: 6},{X: 8, Y: 6},{X: 10, Y: 6},{X: 11, Y: 6},{X: 12, Y: 6},{X: 13, Y: 6},{X: 14, Y: 6},{X: 15, Y: 6},{X: 16, Y: 6},{X: 17, Y: 6},{X: 18, Y: 6},{X: 19, Y: 6},{X: 20, Y: 6},
        {X: 2, Y: 7, BS: true, ProblemId: ids[14]},{X: 3, Y: 7},{X: 4, Y: 7},{X: 5, Y: 7},{X: 6, Y: 7},{X: 7, Y: 7},{X: 8, Y: 7, ProblemId: ids[15]},{X: 9, Y: 7},{X: 10, Y: 7},{X: 11, Y: 7},{X: 12, Y: 7},{X: 13, Y: 7},{X: 14, Y: 7, ProblemId: ids[8]},{X: 15, Y: 7},{X: 16, Y: 7},{X: 17, Y: 7},{X: 18, Y: 7, ProblemId: ids[17]},{X: 19, Y: 7, BS: true, ProblemId: ids[13]},{X: 20, Y: 7},
        {X: 2, Y: 8, ProblemId: ids[18]},{X: 3, Y: 8},{X: 4, Y: 8},{X: 5, Y: 8, ProblemId: ids[9]},{X: 6, Y: 8},{X: 7, Y: 8},{X: 8, Y: 8},{X: 10, Y: 8},{X: 11, Y: 8},{X: 12, Y: 8},{X: 13, Y: 8},{X: 14, Y: 8},{X: 15, Y: 8},{X: 16, Y: 8},{X: 17, Y: 8},{X: 18, Y: 8},{X: 19, Y: 8},{X: 20, Y: 8},
        {X: 10, Y: 9},{X: 11, Y: 9, ProblemId: ids[1]},{X: 12, Y: 9},{X: 13, Y: 9},{X: 14, Y: 9},{X: 15, Y: 9},{X: 16, Y: 9},{X: 17, Y: 9},{X: 18, Y: 9},{X: 19, Y: 9},{X: 20, Y: 9, ProblemId: ids[7]},
        {X: 9, Y: 10},{X: 10, Y: 10},{X: 11, Y: 10},{X: 12, Y: 10},{X: 13, Y: 10},{X: 14, Y: 10, ProblemId: ids[10]},{X: 15, Y: 10},{X: 16, Y: 10},{X: 17, Y: 10},{X: 18, Y: 10},{X: 19, Y: 10},{X: 20, Y: 10},
        {X: 9, Y: 11},{X: 10, Y: 11},{X: 11, Y: 11},{X: 12, Y: 11},{X: 13, Y: 11},{X: 14, Y: 11},{X: 15, Y: 11},{X: 16, Y: 11},{X: 17, Y: 11, ProblemId: ids[16]},{X: 18, Y: 11, BS: true, ProblemId: ids[12]},{X: 19, Y: 11},{X: 20, Y: 11},
        {X: 8, Y: 12},{X: 9, Y: 12},{X: 10, Y: 12},{X: 11, Y: 12},{X: 12, Y: 12},{X: 13, Y: 12},{X: 14, Y: 12},{X: 15, Y: 12},{X: 16, Y: 12},{X: 17, Y: 12},{X: 18, Y: 12}
    ];


    async.each(fields, function (fieldData, callback) {
        if(!fieldData.ProblemId){
            fieldData.ProblemId = Problem.getGlobalObjectId();
        }
        var field = new mongoose.models.FieldMap(fieldData);
        field.save(callback);
    }, callback);
}
