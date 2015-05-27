var React = require('react');
var Bootstrap = require('react-bootstrap');
var server = require('./server.js');

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
		// FIXME: WTF?
		return (
			<div className='globalbonus'>
				{this.state.bonuses.map(function(bonus) {
					return <div>{bonus.name} - {bonus.answer}</div>
				})}

				<p class="lead">Добавление глобальных бонусов</p>

				<form id="globalbonus" class="form-inline" action="/globalbonus" method="POST" name="globalbonus-form">
				    <input name="user" type="text" class="form-control" id="input-user" placeholder="Имя"/>
				    <input name="answer" type="text" class="form-control" id="input-answer" placeholder="Ответ"/>
				    <input type="submit" class="btn btn-primary" value="зачислить"/>
				</form>
            </div>
		);
	}
});

module.exports = GlobalBonus;

