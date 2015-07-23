var React = require('react');
var server = require('./server.js');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var Input = Bootstrap.Input;
var Glyphicon = Bootstrap.Glyphicon;
var Panel = Bootstrap.Panel;



var AnswersList = React.createClass({

	propTypes: {
		answers: React.PropTypes.array.isRequired
    },

	render: function() {
		return (
			<Panel header="Answers" >
                {this.props.answers.map(function(answer, index) {
                	return (
                		<form className='form-inline' key={"answer" + index} action="javascript:void(0);">
                			<Input type="text" value={answer}/>
                		</form>);
                })}
                <Button onClick={this.addAnswer}><Glyphicon glyph='plus' /></Button>
		    </Panel>
		);
	},

	addAnswer: function() {
		return;
	}
});

var BonusesList = React.createClass({

	propTypes: {
        bonuses: React.PropTypes.array.isRequired
    },

	render: function() {
		return (
			<Panel header="Bonuses" >
            	{this.props.bonuses.map(function(bonus, index) {
                	return (
                		<form className='form-inline' key={"bonus" + index} action="javascript:void(0);">
	                        <Input type="text" value={bonus.text} />
	                        <Input type="number" value={bonus.cost} />
	                        <Button bsSize='small'><Glyphicon glyph='remove'/></Button>
	                    </form>
                	);
           		})}
           		<Button onClick={this.addBonus}><Glyphicon glyph='plus' /></Button>
		    </Panel>);
	},

	addBonus: function() {
		return;
	}
});

var HintsList = React.createClass({

	propTypes: {
        hints: React.PropTypes.array.isRequired
    },

	render: function() {
		return (
		    <Panel header="Hints">
	        	{this.props.hints.map(function(hint, index) {
	            	return (
		                <form className='form-inline' key={"hint" + index} action="javascript:void(0);">
		                    <Input type="text" value={hint.text}/>
		                    <Input type="number" value={hint.cost} />
		                    <Button bsSize='small'><Glyphicon glyph='remove' /></Button>
		                </form>
	            	);
	            })}
		     	<Button type="button" onClick={this.addHint}><Glyphicon glyph='plus' /></Button>
		    </Panel>
		);
	},

	addHint: function() {
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
						<Panel bsStyle='primary' key={"problem" + problem.serial} header={problem.topic}>
							<Input type="text" ref="title" label="Title" value={problem.topic} onChange={me.updateProblem} />
						    <Input type="number" ref="sequence" label="Sequence number" value={problem.serial} onChange={me.updateProblem} />
							<Input type='textarea' ref="text" label="Text" value={problem.question} onChange={me.updateProblem}/>
							<Input type="number" ref="cost" label="Cost" value={problem.cost} onChange={me.updateProblem}/>
						    
						    <Button onClick={me.save(problem.serial)}><Glyphicon glyph='ok'/> Save</Button>
					    </Panel>
				    )
				})
			}
            </div>
		);
	},

	updateProblem: function(index) {
		var copy = this.state.problems.slice();
		var element = copy[index];

		element.title = this.refs.title.value;

		this.setState({
			problems: copy
		});
	},

	save: function(serial) {
		return;
	}
});

module.exports = Problems;