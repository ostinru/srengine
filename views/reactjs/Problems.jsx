var React = require('react');
var server = require('./server.js');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var Glyphicon = Bootstrap.Glyphicon;
var Panel = Bootstrap.Panel;
var Input = require('./controls/Input.jsx');


var AnswerEditor = React.createClass({
	propTypes: {
		problem: React.PropTypes.object.isRequired,
		answer: React.PropTypes.object.isRequired
    },

	render: function() {
		var answer = this.props.answer;
		return (
    		<form className='form-inline' action="javascript:void(0);">
    			<Input type="text" ref="answer" initValue={answer.answer}/>
    			<Button bsSize='small' onClick={this.updateAnswer} ><Glyphicon glyph='ok' /></Button>
	            <Button bsSize='small' onClick={this.removeAnswer} ><Glyphicon glyph='remove' /></Button>
    		</form>
		);
	},

	updateAnswer: function() {
		return;
	},

	removeAnswer: function() {
		return;
	}
});


var NewAnswer = React.createClass({
	propTypes: {
		problem: React.PropTypes.object.isRequired
    },

	render: function() {
		var answer = this.props.answer;
		return (
    		<form className='form-inline' action="javascript:void(0);">
    			<Input type="text" ref="answer" />
    			<Button bsSize='small' onClick={this.addAnswer} ><Glyphicon glyph='plus' /></Button>
    		</form>
		);
	},

	addAnswer: function() {
		return;
	}
});


var BonusEditor = React.createClass({

	propTypes: {
		problem: React.PropTypes.object.isRequired,
        bonus: React.PropTypes.object.isRequired
    },

	render: function() {
		var bonus = this.props.bonus;
		return (
    		<form className='form-inline' action="javascript:void(0);">
                <Input type="text" initValue={bonus.text} />
                <Input type="number" initValue={bonus.cost} />
                <Button bsSize='small' onClick={this.updateBonus} ><Glyphicon glyph='ok' /></Button>
                <Button bsSize='small' onClick={this.removeBonus}><Glyphicon glyph='remove'/></Button>
            </form>
         );
	},

	updateBonus: function() {
		return;
	},
	removeBonus: function() {
		return;
	},
});

var NewBonus = React.createClass({

	propTypes: {
        problem: React.PropTypes.object.isRequired
    },

	render: function() {
		return (
    		<form className='form-inline' action="javascript:void(0);">
                <Input type="text" ref="bonus" />
                <Input type="number" ref="cost" />
                <Button bsSize='small' onClick={this.addBonus}><Glyphicon glyph='plus'/></Button>
            </form>
    	);
	},

	addBonus: function() {
		return;
	}
});

var HintEditor = React.createClass({

	propTypes: {
		problem: React.PropTypes.object.isRequired,
        hint: React.PropTypes.object.isRequired
    },

	render: function() {
		var hint = this.props.hint;
		return (
	        <form className='form-inline' action="javascript:void(0);">
	            <Input type="text" initValue={hint.text}/>
	            <Input type="number" initValue={hint.cost} />
	            <Button bsSize='small' onClick={this.updateHint} ><Glyphicon glyph='ok' /></Button>
	            <Button bsSize='small' onClick={this.removeHint} ><Glyphicon glyph='remove' /></Button>
	        </form>
		);
	},

	removeHint: function() {
		return;
	},

	updateHint: function() {
		return;
	}
});


var NewHint = React.createClass({

	propTypes: {
		problem: React.PropTypes.object.isRequired
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
		return;
	}
});


var ProblemEditor = React.createClass({

	propTypes: {
    	problem: React.PropTypes.object.isRequired
    },

	render: function() {
		var me = this;
		var problem = this.props.problem;
		return (
			<Panel header={problem.topic}>
				<Input type="text" ref="title" label="Title" initValue={problem.topic} />
				<Input type='textarea' ref="text" label="Text" initValue={problem.question} />
				<Input type="number" ref="cost" label="Cost" initValue={problem.cost} />
			    
    			<Panel header="Answers" >
	                {this.props.answers && this.props.answers.map(function(answer, index) {
	                	return (
	                		<AnswerEditor key={answer._id} problem={problem} answer={answer} />
	                	);
	                })}
	                <NewAnswer problem={problem} />
			    </Panel>

				<Panel header="Hints">
					{this.props.hints && this.props.hints.map(function(hint, index) {
		            	return (
		            		<HintEditor key={hint._id} problem={problem} hint={hint} />
		            	);
	            	})}
	            	<NewHint problem={problem} />
				</Panel>

				<Panel header="Bonuses" >
		        	{this.props.bonuses && this.props.bonuses.map(function(bonus, index) {
		            	return (
		            		<BonusEditor key={bonus._id} problem={problem} bonus={bonus} />
		            	);
		       		})}
		       		<NewBonus problem={problem} />
			    </Panel>


			    <Button onClick={me.save} bsStyle='success'>Save</Button>
			    <Button onClick={me.remove} bsStyle='danger'>Remove</Button>
		    </Panel>
		);
	},

	save: function(serial) {
		return;
	},

	remove: function(serial) {
		return;
	}

});

var NewProblem = React.createClass({

	render: function() {
		var me = this;
		return (
			<Panel bsStyle='primary' header="New problem" >
				<Input type="text" ref="title" label="Title" />
				<Input type='textarea' ref="text" label="Text" />
				<Input type="number" ref="cost" label="Cost" />
			    
			    <Button onClick={me.addProblem}><Glyphicon glyph='plus'/> Add Problem</Button>
		    </Panel>
		);
	},

	addProblem: function() {
		return;
	}

});


var Problems = React.createClass({

	getInitialState: function() {
		return {
			problems: []
		};
	},

	// https://facebook.github.io/react/tips/initial-ajax.html
	componentDidMount: function() {
		var me = this;
	    server.fetchProblems(
	    	function() {
	    		console.error('failed to load problems', arguments);
	    	},
	    	function(result) {
		    	if (me.isMounted()) {
					me.setState({
						problems : result
					});
				}
		    });
	},

	render: function() {
		var me = this;
		return (
			<div className='problems'>
				{this.state.problems.map(function(problem, index) {
					return (
						<ProblemEditor key={problem._id} problem={problem} />
					);
				})}
				<NewProblem />
            </div>
		);
	},

});

module.exports = Problems;