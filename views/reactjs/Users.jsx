var React = require('react');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var server = require('./server.js');

var Users = React.createClass({

    propTypes: {
        users: React.PropTypes.array.isRequired
    },

    getInitialState: function() {
        return {
            users: []
        };
    },

	// https://facebook.github.io/react/tips/initial-ajax.html
	componentDidMount: function() {
		var me = this;
	    server.fetchMessages(
	    	function() {
	    		console.error('failed to load users', arguments);
	    	},
	    	function(result) {
	    		debugger;
		    	if (me.isMounted()) {
					me.setState({
						users : result
					});
				}
		    });
	},

	render: function() {
		return (
			<div className='users'>
			{this.props.users.map(function(user, index) {
				return (
					<div className='user'>
						<div id="wrapper">
					        <div class="title">Имя пользователя:</div>
					        <div class="input"><input type="text" name="username" value="{this.props.user.username}" /></div>
					    </div>
					    <div id="wrapper">
					        <div class="title">Пароль:</div>
					        <div class="input"><input type="text" name="password" value="{this.props.user.password}" /></div>
					    </div>
					    <div id="wrapper">
					        <div class="input"><label><input type="checkbox" checked={this.props.user.admin} name="admin" id="admin" /> администратор</label></div>
					    </div>
					    <div id = "wrapper">
					        <div>Порядок заданий: </div>
					        {this.props.user.problemQueue.map(function(problem) {
					        	// FIXME: do something
					        	return null;
					        })};
					    </div>
					    <Button>Save</Button>
					</div>
				);
			})}
			</div>
		);
	}
});

module.exports = Users;
