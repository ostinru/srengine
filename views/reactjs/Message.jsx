var React = require('react');
var server = require('./server');
var Button = require('react-bootstrap/lib/Button');
var Glyphicon = require('react-bootstrap/lib/Glyphicon');
var Panel = require('react-bootstrap/lib/Panel');
var Table = require('react-bootstrap/lib/Table');
var Input = require('./controls/Input.jsx');

var Message = React.createClass({

    getInitialState: function() {
        return [];
    },

    componentDidMount: function() {
        this.context.messages.on('update', () => {
            this.setState(this._getState());
        });
    },

    componentWillUnmount: function() {
        this.context.messages.off();
    },

    _getState: function() {
        return this.context.messages.get();
    },

    render: function() {
        var messages = this.state;
        return (
            <Panel header="Administarator's messages" >
                <form className='form-inline' action="javascript:void(0);">
                    <Input ref="message" name="message" type="text" />
                    <Button bsStyle='success' onClick={this.onSubmit}>Отправить</Button>
                </form>
                <br/>
                <Table bordered hover striped >
                    <thead>
                        <tr><th>Timestamp</th><th>message</th></tr>
                    </thead>
                    <tbody>
                    {messages.map(function(message, index) {
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

        console.log('Sending new admin message ', value);

        server.postMessage(
            { message: value },
            () => {
                console.error("Faied to push message", arguments);
            },
            (resp) => {
                console.log("Ok");
                this.context.messages.push(resp); // FIXME: check REST API
            }
        );
    }
});

module.exports = Message;
