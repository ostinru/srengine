var React = require('react');
var server = require('./server.js');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var Input = Bootstrap.Input;

var AnswersList = React.createClass({

	propTypes: {
		answers: React.PropTypes.array.isRequired
    },

	render: function() {
		return (
			<div id="wrapper">
			    <div className="title">Ответы  <Button onClick={this.addAnswer}>добавить</Button></div>
		        <div className="input">
		            <ul id="answers_list">
		                {this.props.answers.map(function(answer, index) {
		                	return (
		                		<li>
		                        	<input type="text" key="answer{index}" value={answer}/>
		                    	</li>);
		                })}
		            </ul>
		        </div>
		    </div>
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
		    <div id="wrapper">
		            <div className="title">Бонусы  <Button onClick={this.addBonus}>добавить</Button></div>
		            <div className="input">
		                <ul id="bonuses_list">
		                {this.props.bonuses.map(function(bonus, index) {
		                	return (
			                    <li>
			                        T:<input type="text" name="bonus{index}" value={bonus.text} />
			                        C:<input type="number" name="bonus_cost{index}" className = "number" value={bonus.cost} />
			                    </li>
		                	);
		                })}
		                </ul>
		            </div>
		    </div>);
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
		    <div id="wrapper">
		        <div className="title">Подсказки  <Button type="button" onClick={this.addHint}>добавить</Button></div>
		        <div className="input">
		            <ul id="hints_list">
		            {this.props.hints.map(function(hint, index) {
		            	return (
			                <li>
			                    T:<input type="text" name="hint{index}" value={hint.text}/>
			                    C:<input type="number" name="hint_cost{index}" className="number" value={hint.cost} />
			                </li>
		            	);
		            })}
		            </ul>
		        </div>
		    </div>
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
						<div className='problem' key={problem.serial} >
							<div id="wrapper">
							    <div className="title">Заголовок:</div>
						        <div className="input"><input type="text" name="topic" value={problem.topic} /></div>
						    </div>
						    <div id="wrapper">
						        <div className="title">Порядковый номер:</div>
						        <div className="input"><input type="text" name="serial" value={problem.serial} /></div>
						    </div>
						    <div id="wrapper">
						        <div className="title">Текст задания:</div>
						        <div className="input"><Input type='textarea' label="question">{problem.question}</Input></div>
						    </div>
						    <div id="wrapper">
						        <div className="title">Стоимость:</div>
						        <div className="input"><input type="number" name="cost" value="{problem.cost}"/></div>
						    </div>
						    <AnswersList answers={problem.answers} />
						    <BonusesList bonuses={problem.bonuses} />
						    <HintsList hints={problem.hints} />
						    
						    <Button onClick={me.save(problem.serial)}>Save</Button>
					    </div>
				    )
				})
			}
            </div>
		);
	},

	save: function(serial) {
		return;
	}
});

module.exports = Problems;

/*

<style type="text/css">
    input[type="textarea"] {
        width : 500px;
    }
    input[type="number"] {
        width : 50px;
    }

    .title{
        width : 100%;
    }
    .input{
         width : 100%;
    }
    #wrapper{
        margin-top: 20px;
    }
</style>


*/
