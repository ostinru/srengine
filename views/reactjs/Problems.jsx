var React = require('react');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;

var AnswersList = React.createClass({
	
    contextTypes: {
        store: React.PropTypes.object.isRequired,
    },

	propTypes: {
        answers: React.PropTypes.array.isRequired
    },

	render: function() {
		return (
			<div id="wrapper">
			    <div class="title">Ответы  <button type="button" onclick="{addAnswer}">добавить</button></div>
		        <div class="input">
		            <ul id="answers_list">
		                {this.props.answers.map(function(answer, index) {
		                	return (
		                		<li>
		                        	<input type="text" name="answer{index}" value="{answer}"/>
		                    	</li>);
		                })}
		            </ul>
		        </div>
		    </div>
		);
	}
});

var BonusesList = React.createClass({

	propTypes: {
        bonuses: React.PropTypes.array.isRequired
    },

	render: function() {
		return (
		    <div id="wrapper">
		            <div class="title">Бонусы  <button type="button" onclick="{this.addBonus}">добавить</button></div>
		            <div class="input">
		                <ul id="bonuses_list">
		                {this.props.bonuses.map(function(bonus, index) {
		                	return (
			                    <li>
			                        T:<input type="text" name="bonus{index}" value="{bonus.text}"/>
			                        C:<input type="number" name="bonus_cost{index}" class = "number" value="{bonus.cost}"/>
			                    </li>
		                	);
		                })}
		                </ul>
		            </div>
		    </div>);
	}
});

var HintsList = React.createClass({

	propTypes: {
        hints: React.PropTypes.array.isRequired
    },

	render: function() {
		return (
		    <div id="wrapper">
		        <div class="title">Подсказки  <button type="button" onclick="{this.addHint}">добавить</button></div>
		        <div class="input">
		            <ul id="hints_list">
		            {this.props.hints.map(function(hint, index) {
		            	return (
			                <li>
			                    T:<input type="text" name="hint{index}" value="{hint.text}"/>
			                    C:<input type="number" name="hint_cost{index}" class = "number" value="{hint.cost}"/>
			                </li>
		            	);
		            })}
		            </ul>
		        </div>
		    </div>
		);
	}
});

var Problems = React.createClass({

	propTypes: {
        problems: React.PropTypes.array.isRequired
    },

	render: function() {
		return (
			<div className='problems'>
				{this.props.problems.map(function(problem, index) {
					return (
						<div className='problem'>
							<div id="wrapper">
							    <div class="title">Заголовок:</div>
						        <div class="input"><input type="text" name="topic" value="{problem.topic}" /></div>
						    </div>
						    <div id="wrapper">
						        <div class="title">Порядковый номер:</div>
						        <div class="input"><input type="text" name="serial" value="{problem.serial}" /></div>
						    </div>
						    <div id="wrapper">
						        <div class="title">Текст задания:</div>
						        <div class="input"><textarea rows='10' name="question" style="width:600px"> {problem.question}</textarea></div>
						    </div>
						    <div id="wrapper">
						        <div class="title">Стоимость:</div>
						        <div class="input"><input type="number" name="cost" value="{problem.cost}"/></div>
						    </div>
						    <AnswersList answers={problem.answers} />
						    <BonusesList bonuses={problem.bonuses} />
						    <HintsList hints={problem.hints} />
						    
						    <Button>Save</Button>
					    </div>
				    )
				})
			}
            </div>
		);
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