var React = require('react');
var RouterMixin = require('react-mini-router').RouterMixin;
var Menu = require('./Menu.jsx');
var Times = require('./Times.jsx');
var Problems = require('./Problems.jsx');
var Users = require('./Users.jsx');
var Message = require('./Message.jsx');
var GlobalBonus = require('./GlobalBonus.jsx');
var store = require('./store.js')

var Viewport = React.createClass({

    mixins: [RouterMixin],

    root: '/administration',

    routes: {
        '/times': 'renderTimes',
        '/problems': 'renderProblems',
        '/users': 'renderUsers',
        '/statistics': 'renderStatistics',
        '/globalbonus': 'renderGlobalBonus',
        '/message': 'renderMessage'
    },

    getInitialState: function() {
        return {};
    },

    renderTimes: function() {
        var gameOptions = store.select('game').get();
        return <Times startTime={gameOptions.startTime} endTime={gameOptions.endTime} />
    },
    renderProblems: function() {
        var problems = store.select('problems').get();
        return <Problems problems={problems} />;
    },
    renderUsers: function() {
        var users = store.select('users').get();
        return <Users users={users} />
    },
    renderStatistics: function() {
        return (
            <div className='statistics'>
            </div>
        );
    },
    renderMessage : function() {
        return <Message />
    },
    renderGlobalBonus: function() {
        return <GlobalBonus />
    },
    notFound: function(path) {
        return <div class="not-found">Page Not Found: {path}</div>;
    },

    render: function () {
        return (
        	<div cassName='body'>
        		<Menu />
                {this.renderCurrentRoute()}
        	</div>
        );
    },
});


React.render(
    <Viewport/>,
    document.getElementById('react-content')
);

module.exports = Viewport;
