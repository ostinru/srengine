var React = require('react');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var server = require('./server.js');

var Users = React.createClass({

    propTypes: {
    },

    getInitialState: function() {
        return {
            users: []
        };
    },

	// https://facebook.github.io/react/tips/initial-ajax.html
	componentDidMount: function() {
		var me = this;
	    server.fetchUsers(
	    	function() {
	    		console.error('failed to load users', arguments);
	    	},
	    	function(result) {
		    	if (me.isMounted()) {
					me.setState({
						users : result
					});
				}
		    });
	},

	render: function() {
		var me = this;
		return (
			<div className='users'>
			{this.state.users.map(function(user, index) {
				return (
					<div className='user'>
						<div id="wrapper">
					        <div className="title">Имя пользователя:</div>
					        <div className="input"><input type="text" ref="username" value={user.username}/></div>
					    </div>
					    <div id="wrapper">
					        <div className="title">Пароль:</div>
					        <div className="input"><input type="text" ref="password" value={user.password} /></div>
					    </div>
					    <div id="wrapper">
					        <div className="input"><label><input type="checkbox" ref="admin" checked={user.admin} /> администратор</label></div>
					    </div>
					    <div id = "wrapper">
					        <div>Порядок заданий: </div>
					        {user.problemQueue.map(function(problem) {
					        	// FIXME: do something
					        	return null;
					        })}
					    </div>
					    <Button onClick={me.save(user.username)}>Save</Button>
					</div>
				);
			})}
			</div>
		);
	},

	save: function(username) {
		return;
	}
});

module.exports = Users;
