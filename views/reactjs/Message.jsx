var React = require('react');
var server = require('./server');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var Input = Bootstrap.Input;
var Glyphicon = Bootstrap.Glyphicon;
var Panel = Bootstrap.Panel;
var Table = Bootstrap.Table;


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
			<Panel header="Administarator's messages" >
				<form className='form-inline' action="javascript:void(0);">
					<Input ref="message" name="message" type="text" />
					<Button bsStyle='primary' onClick={this.onSubmit}>Отправить</Button>
				</form>

				<Table bordered hover striped >
					<thead>
						<tr><th>Timestamp</th><th>message</th></tr>
					</thead>
					<tbody>
					{this.state.messages.map(function(message, index) {
						// FIXME: add key
						return (
							<tr><td>{message.timestamp}</td><td>{message.message}</td></tr>
						);
					})}
					</tbody>
				</Table>
            </Panel>
		);
	},

	onSubmit: function() {
		var value = this.refs.message.getValue();
		server.postMessage(
			{ message: value},
			function() { console.error("Faied to push message", arguments); },
			function() { console.log("Ok"); }
		);
	}
});

module.exports = Message;
