var React = require('react');
var server = require('./server');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;

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

				<input ref="message" name="message" type="text" />
				<Button bsStyle='primary' onClick={this.onSubmit}>Отправить</Button>

				<table>
					<thead>
						<tr><td>Timestamp</td><td>message</td></tr>
					</thead>
					<tbody>
					{this.state.messages.map(function(message, index) {
						// FIXME: add key
						return (
							<tr><td>{message.timestamp}</td><td>{message.message}</td></tr>
						);
					})}
					</tbody>
				</table>


            </div>
		);
	},

	onSubmit: function() {
		var value = this.refs.message.value;
		server.postMessage(
			{ message: value},
			function() { console.error("Faied to push message", arguments); },
			function() { console.log("Ok"); }
		);
	}
});

module.exports = Message;
