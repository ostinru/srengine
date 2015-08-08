var React = require('react');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var Panel = Bootstrap.Panel;
var Input = require('./controls/Input.jsx');
var server = require('./server.js');


var NewAdminBonus = React.createClass({

    propTypes: {
    	user: React.PropTypes.object.isRequired
    },

	render: function() {
		var me = this;
		var user = this.props.user;
		return (
	    	<form className='form-inline' action="javascript:void(0);">
	    		<Input label="Cost" type="number" ref="cost" />
	    		<Input label="Message" type="text" ref="message" />
	    		<Button onClick={me.addAdminBonus}>Add</Button>
	    	</form>
		);
	},

	addAdminBonus: function() {
		var request = {
			cost : this.refs.cost.getValue(),
			message : this.refs.message.getValue()
		};
		server.addAdminBonus(this.props.user._id, 'adminbonus', request);
	},
});

var AdminBonusEditor = React.createClass({

    propTypes: {
    	user: React.PropTypes.object.isRequired,
    	bonus: React.PropTypes.object.isRequired,
    },

	render: function() {
		var me = this;
		var bonus = this.props.bonus;
		return (
			<form className='form-inline' action="javascript:void(0);" key={bonus.id}>
    			<Input label="Cost" type="number" ref="cost" initValue={bonus.cost}/>
    			<Input label="Message" type="text" ref="message" initValue={bonus.message} />
    			<Button onClick={me.updateAdminBonus}>Update</Button>
    			<Button onClick={me.removeAdminBonus}>Remove</Button>
			</form>
		);
	},

	updateAdminBonus: function() {
		var request = {
			cost : this.refs.cost.getValue(),
			message : this.refs.message.getValue(),
		};
		server.updateAdminBonus(this.props.user._id, 'adminbonus', this.props.bonus.id, request);
	},

	removeAdminBonus: function() {
		server.removeAdminBonus(this.props.user._id, 'adminbonus', this.props.bonus.id);
	}
});

var NewUser = React.createClass({
	render: function() {
		var me = this;
		return (
			<Panel header="New User" key="newUser" bsStyle='primary'>
				<Input label="Username" type="text" ref="username" />
			    <Input label="Password" type="text" ref="password" />
			    <Input label="IsAdmin"  type="checkbox" ref="admin" />
			    <Button onClick={me.addUser} bsStyle='success'>Save</Button>
			</Panel>
		);
	},

	addUser: function() {
		var request = {
			username : this.refs.username.getValue(),
			password : this.refs.password.getValue(),
			admin : this.refs.admin.getValue()
		}

		server.addUser(request);
	}
});

var UserEditor = React.createClass({

    propTypes: {
    	user: React.PropTypes.object.isRequired
    },

	render: function() {
		var me = this;
		var user = this.props.user;
		return (
			<Panel header={"User " + user.username} key={user.id} >
				<Input label="Username" type="text" ref="username" initValue={user.username} />
			    <Input label="Password" type="text" ref="password" initValue={user.password} />
			    <Input label="IsAdmin"  type="checkbox" ref="admin" checked={user.admin} />
			    <Panel header="Admin bonuses and punishments">
			    	{user.adminBonuses && user.adminBonuses.map(function(bonus) {
			    		return (
			    			<AdminBonusEditor user={user} bonus={bonus} />
			    		);
			    	})}
			    	<NewAdminBonus user={user} />
			    </Panel>
			    <Button onClick={me.save} bsStyle='success'>Save</Button>
			    <Button onClick={me.remove} bsStyle='danger'>Remove</Button>
			</Panel>
		);
	},


	save: function() {
		var request = {
			username : this.refs.username.getValue(),
			password : this.refs.password.getValue(),
			admin : this.refs.admin.getValue(),
			// adminBonuses
		}

		server.updateUser(this.props.user._id, request);
	},

	remove: function() {
		server.removeUser(this.props.user.id);
	},


});

var Users = React.createClass({

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
						<UserEditor user={user} />
					);
				})}
				<NewUser />
			</div>
		);
	}

});

module.exports = Users;