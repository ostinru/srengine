var React = require('react');
var Input = require('./controls/Input.jsx');
var Button = require('react-bootstrap/lib/Button');
var Glyphicon = require('react-bootstrap/lib/Glyphicon');
var Panel = require('react-bootstrap/lib/Panel');
var server = require('./server.js');

const context = require('./context');

var Times = React.createClass({

    getInitialState: function() {
        return {
            startTime: '',
            finishTime: '',
            loaded: false
        };
    },

    componentDidMount: function() {
        context.game.on('update', () => {
            this.setState(this._getState());
        } )
    },

    _getState: function() {
        var gameOpts = context.store.get('game');
        this.setState({
            startTime : gameOpts.startTime,
            finishTime: gameOpts.finishTime,
            loaded : gameOpts !== undefined
        });
    },

    render: function() {
        if (!this.state.loaded) {
            // don't create Inputs with empty initValue
            return (
                <Panel header="Start/Finish time">
                    <p>Loading...</p>
                </Panel>
               );
        }

        return (
                <Panel header="Start/Finish time">
                    <Input type="text" ref="startTime" label="Start time" initValue={this.state.startTime} />
                    <Input type='text' ref="finishTime" label='Finish time' initValue={this.state.finishTime} />
                    <Button onClick={this.handleSave} bsStyle='success'><Glyphicon glyph='ok'/> Save</Button>
                </Panel>
        );
    },

    handleSave: function() {
        server.postTime({
                startTime : this.refs.startTime.getValue(),
                finishTime: this.refs.finishTime.getValue()
            },
            function() { console.error("Faied to push times", arguments); },
            function() {
                var cursor = context.game;
                // FIXME: from response!
                cursor.set('startTime', this.refs.startTime.getValue());
                cursor.set('finishTime', this.refs.finishTime.getValue());
                console.log("Ok");
            }
        );
    }
});

module.exports = Times;
