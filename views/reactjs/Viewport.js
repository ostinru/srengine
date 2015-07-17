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
        '/': 'renderTimes', // default URL
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
        return <Times />
    },
    renderProblems: function() {
        return <Problems />;
    },
    renderUsers: function() {
        return <Users />
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
        return <div className="not-found">Page Not Found: {path}</div>;
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
