var React = require('react');
var server = require('./server.js');
var Baobab = require('baobab');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var Glyphicon = Bootstrap.Glyphicon;
var Panel = Bootstrap.Panel;
var Input = require('./controls/Input.jsx');

// FIXME: normal context!!
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

var reload = function() {
    server.fetchProblems(
    	function() {
    		console.error('failed to load problems', arguments);
    	},
    	function(result) {
    		context.problems.root.set({problems : result});
	    });
}

var AnswerEditor = React.createClass({

	propTypes: {
		path: React.PropTypes.array.isRequired
    },

	render: function() {
		var path = this.props.path;
		var answer = context.problems.select(path).get();
		// FIXME: KEY!!
		return (
    		<form className='form-inline' action="javascript:void(0);" key={answer}>
    			<Input type="text" ref="answer" initValue={answer}/>
    			<Button bsSize='small' onClick={this.updateAnswer} ><Glyphicon glyph='ok' /></Button>
	            <Button bsSize='small' onClick={this.removeAnswer} ><Glyphicon glyph='remove' /></Button>
    		</form>
		);
	},

	updateAnswer: function() {
		var cursor = context.problems.select(this.props.path);
		cursor.set(
			this.refs.answer.getValue()
		);
	},

	removeAnswer: function() {
		var path = this.props.path;
		var index = path[path.length - 1];
		var cursor = context.problems.select(path);
		cursor.up().splice([index, 1]);
	}
});


var NewAnswer = React.createClass({

	propTypes: {
		path: React.PropTypes.array.isRequired
    },

	render: function() {
		return (
    		<form className='form-inline' action="javascript:void(0);">
    			<Input type="text" ref="answer" />
    			<Button bsSize='small' onClick={this.addAnswer} ><Glyphicon glyph='plus' /></Button>
    		</form>
		);
	},

	addAnswer: function() {
		var cursor = context.problems.select(this.props.path);
		cursor.push(
			this.refs.answer.getValue()
		);
		this.refs.answer.clear();
	}
});


var NextProblemEditor = React.createClass({

	propTypes: {
		path: React.PropTypes.array.isRequired
    },

	render: function() {
		var path = this.props.path;
		var nextProblemId = context.problems.select(path).get();
		var problems = context.problems.select('problems').get();
		// FIXME: KEY!!
		return (
    		<form className='form-inline' action="javascript:void(0);" key={nextProblemId}>
    			<Input type="select" ref="nextProblemId" initValue={nextProblemId} >
    				<option value={null}>Select problem</option>
    			{problems.map(function(problem) {
    				return (
    					<option value={problem._id}> {problem._id} - {problem.topic}</option>
    				);
    			})}
    			</Input>
    			<Button bsSize='small' onClick={this.updateNextProblemId} ><Glyphicon glyph='ok' /></Button>
	            <Button bsSize='small' onClick={this.removeNextProblemId} ><Glyphicon glyph='remove' /></Button>
    		</form>
		);
	},

	updateNextProblemId: function() {
		var cursor = context.problems.select(this.props.path);
		var newValue = this.refs.nextProblemId.getValue();
		if (newValue === null)
			return;
		cursor.set(
			newValue
		);
	},

	removeNextProblemId: function() {
		var path = this.props.path;
		var index = path[path.length - 1];
		var cursor = context.problems.select(path);
		cursor.up().splice([index, 1]);
	}
});


var NewNextProblem = React.createClass({

	propTypes: {
		path: React.PropTypes.array.isRequired
    },

	render: function() {
		var problems = context.problems.select('problems').get();
		return (
    		<form className='form-inline' action="javascript:void(0);">
    			<Input type="select" ref="nextProblemId" initValue={null} >
    				<option value={null}>Select problem</option>
    			{problems.map(function(problem) {
    				return (
    					<option value={problem._id}> {problem._id} - {problem.topic}</option>
    				);
    			})}
    			</Input>
    			<Button bsSize='small' onClick={this.addNextProblemId} ><Glyphicon glyph='plus' /></Button>
    		</form>
		);
	},

	addNextProblemId: function() {
		var cursor = context.problems.select(this.props.path);
		var newValue = this.refs.nextProblemId.getValue();
		if (newValue === null)
			return;
		cursor.push(
			newValue
		);
		this.refs.nextProblemId.clear();
	}
});

var BonusEditor = React.createClass({

	propTypes: {
		path: React.PropTypes.array.isRequired
    },

	render: function() {
		var path = this.props.path;
		var bonus = context.problems.select(path).get();

		return (
    		<form className='form-inline' action="javascript:void(0);">
                <Input type="text" ref="text" initValue={bonus.text} />
                <Input type="number" ref="cost" initValue={bonus.cost} />
                <Button bsSize='small' onClick={this.updateBonus} ><Glyphicon glyph='ok' /></Button>
                <Button bsSize='small' onClick={this.removeBonus}><Glyphicon glyph='remove'/></Button>
            </form>
         );
	},

	updateBonus: function() {
		var cursor = context.problems.select(this.props.path);
		cursor.set({
			text: this.refs.text.getValue(),
			cost: this.refs.cost.getValue(),
		});
	},
	removeBonus: function() {
		var path = this.props.path;
		var index = path[path.length - 1];
		var cursor = context.problems.select(path);
		cursor.up().splice([index, 1]);
	},
});

var NewBonus = React.createClass({

	propTypes: {
		path: React.PropTypes.array.isRequired
    },

	render: function() {
		return (
    		<form className='form-inline' action="javascript:void(0);">
                <Input type="text" ref="text" />
                <Input type="number" ref="cost" />
                <Button bsSize='small' onClick={this.addBonus}><Glyphicon glyph='plus'/></Button>
            </form>
    	);
	},

	addBonus: function() {
		var cursor = context.problems.select(this.props.path);
		cursor.push({
			text: this.refs.text.getValue(),
			cost: this.refs.cost.getValue(),
		});
		this.refs.text.clear();
		this.refs.cost.clear();
	}
});

var HintEditor = React.createClass({

	propTypes: {
		path: React.PropTypes.array.isRequired
    },

	render: function() {
		var path = this.props.path;
		var hint = context.problems.select(path).get();
		return (
	        <form className='form-inline' action="javascript:void(0);">
	            <Input type="text" ref="text" initValue={hint.text}/>
	            <Input type="number" ref="cost" initValue={hint.cost} />
	            <Button bsSize='small' onClick={this.updateHint} ><Glyphicon glyph='ok' /></Button>
	            <Button bsSize='small' onClick={this.removeHint} ><Glyphicon glyph='remove' /></Button>
	        </form>
		);
	},

	updateHint: function() {
		var cursor = context.problems.select(this.props.path);
		cursor.set({
			text: this.refs.text.getValue(),
			cost: this.refs.cost.getValue(),
		});
	},

	removeHint: function() {
		var path = this.props.path;
		var index = path[path.length - 1];
		var cursor = context.problems.select(path);
		cursor.up().splice([index, 1]);
	},

});


var NewHint = React.createClass({

	propTypes: {
		path: React.PropTypes.object.isRequired
    },

	render: function() {
		return (
            <form className='form-inline' action="javascript:void(0);">
                <Input type="text" ref="text"/>
                <Input type="number" ref="cost" />
                <Button type="button" onClick={this.addHint}><Glyphicon glyph='plus' /></Button>
            </form>

		);
	},

	addHint: function() {
		var cursor = context.problems.select(this.props.path);
		cursor.push({
			text: this.refs.text.getValue(),
			cost: this.refs.cost.getValue(),
		});
		this.refs.text.clear();
		this.refs.cost.clear();
	}
});


var ProblemEditor = React.createClass({

	propTypes: {
    	path: React.PropTypes.array.isRequired
    },

	render: function() {
		var me = this;
		var path = this.props.path;
		var problem = context.problems.select(path).get();

		return (
			<Panel header={problem.topic}>
				<Input type="text" label="_id" initValue={problem._id} readOnly />
				<Input type="text" ref="topic" label="Topic" initValue={problem.topic} />
				<Input type='textarea' ref="question" label="Question" initValue={problem.question} />
				<Input type="number" ref="cost" label="Cost" initValue={problem.cost} />
			    
    			<Panel header="Answers" >
	                {problem.answers && problem.answers.map(function(answer, index) {
	                	return (
	                		<AnswerEditor path={buildPath(path, 'answers', index)} />
	                	);
	                })}
	                <NewAnswer path={buildPath(path, 'answers')} />
			    </Panel>

				<Panel header="Hints">
					{problem.hints && problem.hints.map(function(hint, index) {
		            	return (
		            		<HintEditor key={hint._id} path={buildPath(path, 'hints', index)} />
		            	);
	            	})}
	            	<NewHint path={buildPath(path, 'hints')} />
				</Panel>

				<Panel header="Bonuses" >
		        	{problem.bonuses && problem.bonuses.map(function(bonus, index) {
		            	return (
		            		<BonusEditor key={bonus._id} path={buildPath(path, 'bonuses', index)} />
		            	);
		       		})}
		       		<NewBonus path={buildPath(path, 'bonuses')} />
			    </Panel>

			    <Panel header="Next Problems" >
			    	{problem.nextProblems && problem.nextProblems.map(function(nextProblemId, index) {
		            	return (
		            		<NextProblemEditor key={nextProblemId} path={buildPath(path, 'nextProblems', index)} />
		            	);
		       		})}
		       		<NewNextProblem path={buildPath(path, 'nextProblems')} />
			    </Panel>

			    <Input type="number" ref="x" label="X" initValue={problem.x} />
			    <Input type="number" ref="y" label="Y" initValue={problem.y} />

			    <Input type="text" ref="icon" label="icon" initValue={problem.icon} />
			    <Input type="text" ref="iconText" label="iconText" initValue={problem.iconText} />
			    <Input type="text" ref="iconTitle" label="iconTitle" initValue={problem.iconTitle} />

			    <Button onClick={me.save} bsStyle='success'>Save</Button>
			    <Button onClick={me.remove} bsStyle='danger'>Remove</Button>
		    </Panel>
		);
	},

	save: function(serial) {
		var path = this.props.path;
		var problem = context.problems.select(path).get();

		var request = {
			topic : this.refs.topic.getValue(),
			question : this.refs.question.getValue(),
			cost : this.refs.cost.getValue(),
			x : this.refs.x.getValue(),
			y : this.refs.y.getValue(),
			icon : this.refs.icon.getValue(),
			iconText : this.refs.iconText.getValue(),
			iconTitle : this.refs.iconTitle.getValue(),
			answers: problem.answers,
			hints : problem.hints,
			bonuses : problem.bonuses,
			nextProblems: problem.nextProblems,

		};

		server.updateProblem(problem._id, request, reload, reload);
	},

	remove: function(serial) {
		var path = this.props.path;
		// var index = path[path.length - 1];
		// var cursor = context.problems.select(path);
		// cursor.up().splice([index, 1]);

		var problem = context.problems.select(path).get();

		server.removeProblem(problem._id, reload, reload);
	}

});

var NewProblem = React.createClass({

	render: function() {
		var me = this;
		return (
			<Panel bsStyle='primary' header="New problem" >
				<Input type="text" ref="topic" label="Title" />
				<Input type='textarea' ref="question" label="Text" />
				<Input type="number" ref="cost" label="Cost" />
			    
			    <Button onClick={me.addProblem}><Glyphicon glyph='plus'/> Add Problem</Button>
		    </Panel>
		);
	},

	addProblem: function() {
		var request = {
			topic : this.refs.topic.getValue(),
			question : this.refs.question.getValue(),
			cost : this.refs.cost.getValue()
		}

		server.addProblem(request, reload, reload);
	}

});


var Problems = React.createClass({

	// https://facebook.github.io/react/tips/initial-ajax.html
	componentDidMount: function() {
		var me = this;

		context.problems.on('update', function() {
			me.forceUpdate();
		});

		reload();
	},

	render: function() {
		var me = this;
		var problems = context.problems.root.get().problems;
		return (
			<div className='problems'>
				{problems.map(function(problem, index) {
					var problem_path = ['problems', index];
					return (
						<ProblemEditor key={problem._id} path={problem_path} />
					);
				})}
				<NewProblem />
            </div>
		);
	},

});

module.exports = Problems;