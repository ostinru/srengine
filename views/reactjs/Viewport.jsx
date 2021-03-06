var React = require('react');
var ReactDOM = require('react-dom');
var RouterMixin = require('react-mini-router').RouterMixin;
var Menu = require('./Menu.jsx');
var Times = require('./Times.jsx');
var Problems = require('./Problems.jsx');
var Users = require('./Users.jsx');
var Message = require('./Message.jsx');
var Map = require('./Map.jsx');
var Statistics = require('./Statistics.jsx');

var Viewport = React.createClass({

    mixins: [RouterMixin],

    root: '/administration',

    routes: {
        '/': 'renderTimes', // default URL
        '/times': 'renderTimes',
        '/problems': 'renderProblems',
        '/users': 'renderUsers',
        '/statistics': 'renderStatistics',
        '/message': 'renderMessage',
        '/map': 'renderMap',
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
        return <Statistics />
    },
    renderMessage : function() {
        return <Message />
    },
    renderMap : function() {
        return <Map />
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


ReactDOM.render(
    <Viewport/>,
    document.getElementById('react-content')
);

module.exports = Viewport;
