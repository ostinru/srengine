var React = require('react');
var Bootstrap = require('react-bootstrap');
var server = require('./server');

var Message = React.createClass({

	getInitialState: function() {
		return {
			messages: []
		};
	},

	// https://facebook.github.io/react/tips/initial-ajax.html
	componentDidMount: function() {
		var me = this;
	    server.fetchMessages(
	    	function() {
	    		console.error('failed to load admin messages', arguments);
	    	},
	    	function(result) {
	    		debugger;
		    	if (me.isMounted()) {
					me.setState({
						messages : result
					});
				}
		    });
	},


	render: function() {
		return (
			<div className='message'>
				<p class="lead">Сообщения от администраторов</p>

				<form id="publish" class="form-inline" method="post">
				    <input type="text" name="message"/>
				    <input type="submit" class="btn btn-primary" value="Отправить"/>
				</form>

				<table>
					<tr><td>Timestamp</td><td>message</td></tr>
					{this.state.messages.map(function(message, index) {
						return (
							<tr><td>{messag.timestamp}</td><td>{messag.message}</td></tr>
						);
					})}
				</table>


            </div>
		);
	}
});

module.exports = Message;
