var React = require('react');
var Baobab = require('baobab');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var Panel = Bootstrap.Panel;
var Glyphicon = Bootstrap.Glyphicon;
var Input = require('./controls/Input.jsx');
var Checkbox = require('./controls/Checkbox.jsx');
var server = require('./server.js');

var context = require('./context');

var buildPath = function() {
	if (arguments.length === 0)
		throw 'No arguments!';
	if (arguments.length === 1)
		return arguments[0].slice();

	var result = arguments[0].slice();
	var rest = Array.prototype.slice.call(arguments, 1);
	Array.prototype.push.apply(result, rest);
	return result;
}

var ProblemsEditor = React.createClass({

	propTypes: {
		path: React.PropTypes.array.isRequired
    },

	render: function() {
		var path = this.props.path;
		var problemId = context.users.select(path).get()._id;
		var problems = context.problems.select('problems').get();
		// FIXME: KEY!!
		return (
    		<form className='form-inline' action="javascript:void(0);" key={problemId}>
    			<Input type="select" ref="ProblemId" initValue={problemId} >
    			{ problems.map(function(problem) {
    				return (
    					<option value={problem._id}> {problem._id} - {problem.topic}</option>
    				);
    			})}
    			</Input>
    			<Button bsSize='small' onClick={this.updateProblem} ><Glyphicon glyph='ok' /></Button>
	            <Button bsSize='small' onClick={this.removeProblem} ><Glyphicon glyph='remove' /></Button>
    		</form>
		);
	},

	updateProblem: function() {
		var cursor = context.users.select(this.props.path);
		cursor.set(
			this.refs.ProblemId.getValue()
		);
	},

	removeProblem: function() {
		var path = this.props.path;
		var index = path[path.length - 1];
		var cursor = context.users.select(path);
		cursor.up().splice([index, 1]);
	}
});


var NewProblems = React.createClass({

	propTypes: {
		path: React.PropTypes.array.isRequired
    },

	render: function() {
		var problems = context.problems.select('problems').get();
		return (
    		<form className='form-inline' action="javascript:void(0);">
    			<Input type="select" ref="newProblem" >
    			{problems.map(function(problem) {
    				return (
    					<option value={problem._id}> {problem._id} - {problem.topic}</option>
    				);
    			})}
    			</Input>
    			<Button bsSize='small' onClick={this.addProblem} ><Glyphicon glyph='plus' /></Button>
    		</form>
		);
	},

	addProblem: function() {
		var cursor = context.users.select(this.props.path);
		cursor.push(
			this.refs.newProblem.getValue()
		);
		this.refs.newProblem.clear();
	}
});


var NewAdminBonus = React.createClass({

    propTypes: {
    	user: React.PropTypes.object.isRequired
    },

	render: function() {
		var me = this;
		return (
	    	<form className='form-inline' action="javascript:void(0);">
	    		<Input label="Cost" type="number" ref="cost" />
	    		<Input label="Message" type="text" ref="message" />
	    		<Button onClick={me.addAdminBonus}>Add</Button>
	    	</form>
		);
	},

	addAdminBonus: function() {
		var cursor = context.users.select(this.props.path);
		cursor.push({
			cost : this.refs.cost.getValue(),
			message : this.refs.message.getValue()
		});

		this.refs.cost.clear();
		this.refs.message.clear();
	},
});

var AdminBonusEditor = React.createClass({

	propTypes: {
		path: React.PropTypes.array.isRequired
    },

	render: function() {
		var me = this;
		var bonus = context.users.select(this.props.path).get();
		return (
			<form className='form-inline' action="javascript:void(0);" key={bonus._id}>
    			<Input label="Cost" type="number" ref="cost" initValue={bonus.cost}/>
    			<Input label="Message" type="text" ref="message" initValue={bonus.message} />
    			<Button onClick={me.updateAdminBonus}><Glyphicon glyph='ok' /></Button>
    			<Button onClick={me.removeAdminBonus}><Glyphicon glyph='remove' /></Button>
			</form>
		);
	},

	updateAdminBonus: function() {
		var cursor = context.users.select(this.props.path);
		cursor.set({
			cost : this.refs.cost.getValue(),
			message : this.refs.message.getValue(),
		});
	},

	removeAdminBonus: function() {
		var path = this.props.path;
		var index = path[path.length - 1];
		var cursor = context.users.select(path);
		cursor.up().splice([index, 1]);
	}
});

var NewUser = React.createClass({
	render: function() {
		var me = this;
		return (
			<Panel header="New User" key="newUser" bsStyle='primary'>
				<Input label="Username" type="text" ref="username" />
			    <Input label="Password" type="text" ref="password" />
			    <Checkbox label="IsAdmin" ref="admin" />
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
    	path: React.PropTypes.array.isRequired
    },

	render: function() {
		var me = this;
		var path = this.props.path;
		var user = context.users.select(path).get();
		return (
			<Panel header={"User " + user.username} key={user._id} >
				<Input label="Username" type="text" ref="username" initValue={user.username} />
			    <Input label="Password" type="text" ref="password" initValue={user.password} />
			    <Checkbox label="IsAdmin" ref="admin" initValue={user.admin} />
			    <Panel header="Availeble Problems" >
			    	{user.problems && user.problems.map(function(problem, index) {
		            	return (
		            		<ProblemsEditor key={problem._id} path={buildPath(path, 'problems', index)} />
		            	);
		       		})}
		       		<NewProblems path={buildPath(path, 'problems')} />
			    </Panel>
			    <Panel header="Admin bonuses and punishments">
			    	{user.adminBonuses && user.adminBonuses.map(function(bonus, index) {
			    		return (
			    			<AdminBonusEditor path={buildPath(path, 'problems', index)} />
			    		);
			    	})}
			    	<NewAdminBonus path={buildPath(path, 'adminBonuses')} />
			    </Panel>
			    <Input label="AvailebleHints" type="number" ref="availebleHints" initValue={user.availebleHints} />
			    <Button onClick={me.save} bsStyle='success'>Save</Button>
			    <Button onClick={me.remove} bsStyle='danger'>Remove</Button>
			</Panel>
		);
	},


	save: function() {
		var path = this.props.path;
		var user = context.users.select(path).get();

		var request = {
			username : this.refs.username.getValue(),
			password : this.refs.password.getValue(),
			admin : this.refs.admin.getValue(),
			problems: user.problems,
			adminBonuses: user.adminBonuses,
			availebleHints: this.refs.availebleHints.getValue()
		}

		server.updateUser(user._id, request);
	},

	remove: function() {
		var path = this.props.path;
		var user = context.users.select(path).get();
		server.removeUser(user._id);
	},


});

var Users = React.createClass({

	// https://facebook.github.io/react/tips/initial-ajax.html
	componentDidMount: function() {
		var me = this;

		context.users.on('update', function() {
			me.forceUpdate();
		});

		context.problems.on('update', function() {
			me.forceUpdate();
		});

	    server.fetchUsers(
	    	function() {
	    		console.error('failed to load users', arguments);
	    	},
	    	function(result) {
	    		context.users.root.set({users : result});
		    });
	    
	    server.fetchProblems(
	    	function() {
	    		console.error('failed to load problems', arguments);
	    	},
	    	function(result) {
	    		context.problems.root.set({problems : result});
		    });
	},

	render: function() {
		var me = this;
		var users = context.users.root.get().users;
		return (
			<div className='users'>
				{users.map(function(user, index) {
					var users_path = ['users', index];
					return (
						<UserEditor key={user._id} path={users_path} />
					);
				})}
				<NewUser />
            </div>
		);
	}

});

module.exports = Users;