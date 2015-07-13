var React = require('react');
var server = require('./server.js');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;

var GlobalBonus = React.createClass({

	getInitialState: function() {
		return {
			bonuses: []
		};
	},

	// https://facebook.github.io/react/tips/initial-ajax.html
	componentDidMount: function() {
		var me = this;
	    server.fetchGlobalBonuses(
	    	function() {
                console.error('failed to load global bonuses', arguments);
	    	},
	    	function(result) {
		    	if (me.isMounted()) {
					me.setState({
						bonuses : result
					});
				}
		    });
	},

	render: function() {
		return (
			<div className='globalbonus'>
				{this.state.bonuses.map(function(bonus) {
					return <div>{bonus.name} - {bonus.answer}</div>
				})}

				<p class="lead">Добавление глобальных бонусов</p>

				<input ref="user" name="user" type="text" />
				<input ref="answer" name="answer" type="text" />
				<Button bsStyle='primary' onClick={this.onSubmit}>Зачислить</Button>

            </div>
		);
	},

	onSubmit: function() {
		var user = this.refs.user.value;
		var answer = this.refs.answer.value;

		server.postGlobalBonus(
			{ user: user, answer: answer},
			function() { console.error("Faied to push message", arguments); },
			function() { console.log("Ok"); }
		);
	}
});

module.exports = GlobalBonus;

