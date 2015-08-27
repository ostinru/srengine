var React = require('react');
var Input = require('./controls/Input.jsx');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var Glyphicon = Bootstrap.Glyphicon;
var Panel = Bootstrap.Panel;
var server = require('./server.js');

var Times = React.createClass({
      
    getInitialState: function() {
        return {
            startTime: '',
            finishTime: '',
            loaded: false
        };
    },

	// https://facebook.github.io/react/tips/initial-ajax.html
	componentDidMount: function() {
		var me = this;
	    server.fetchTimes(
	    	function() {
	    		console.error('failed to load times', arguments);
	    	},
	    	function(result) {
		    	if (me.isMounted()) {
					me.setState({
						startTime : result.startTime,
						finishTime: result.finishTime,
						loaded : true
					});
				}
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
	        // FIXME: force reload
			function() { console.error("Faied to push times", arguments); },
			function() { console.log("Ok"); }
		);
    }
});

module.exports = Times;
