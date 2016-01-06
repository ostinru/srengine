var Baobab = require('baobab');
var server = require('./server');

var store = new Baobab({
    problems: [],
    users: [],
    messages: [],
    game: {}
    }, {
    syncwrite: true,  // Applying modifications immediately
    asynchronous:true // commit on next tick
});

server.fetchMessages(
    () => {
        console.error('failed to load admin messages', arguments);
    },
    (result) => {
        store.root.set('messages', result);
    }
);

server.fetchProblems(
    () => {
        console.error('failed to load problems', arguments);
    },
    (result) => {
        store.root.set('problems', result);
    }
);

server.fetchUsers(
    () => {
        console.error('failed to load users', arguments);
    },
    (result) => {
        store.set('users', result);
    }
);

server.fetchTimes(
    () => {
        console.error('failed to load times', arguments);
    },
    (result) => {
        store.set('game', {
            startTime : result.startTime,
            finishTime: result.finishTime,
            loaded : true
        });
    }
);




module.exports = {
    store : store,

    problems: store.select('problems'),
    users: store.select('users'),
    messages: store.select('messages'),
    game: store.select('game')
}
