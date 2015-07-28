var React = require('react');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var Glyphicon = Bootstrap.Glyphicon;
var Input = Bootstrap.Input;
var Panel = Bootstrap.Panel;
var server = require('./server.js');

var Times = React.createClass({
      propTypes: {
      },
      
    getInitialState: function() {
        return {
            startTime: '',
            finishTime: ''
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
						finishTime: result.finishTime
					});
				}
		    });
	},

	render: function() {
		return (
                  <Panel header="Start/Finish time">
                  	<Input type="text" ref="startTime" label="Start time" value={this.state.startTime} onChange={this.updateStartTime} />
                  	<Input type='text' ref="finishTime" label='Finish time' value={this.state.finishTime} onChange={this.updateFinishTime} />
                  	<Button onClick={this.handleSave}><Glyphicon glyph='ok'/> Save</Button>
                  </Panel>
		);
	},

	updateStartTime: function() {
		this.setState({
			startTime: this.refs.startTime.getValue()
		});
	},
	updateFinishTime: function() {
		this.setState({
			finishTime: this.refs.finishTime.getValue()
		});
	},


    handleSave: function() {
        server.postTime({
	        	startTime : this.state.startTime,
	        	finishTime: this.state.finishTime
	        },
	        // FIXME: force reload
			function() { console.error("Faied to push times", arguments); },
			function() { console.log("Ok"); }
		);
    }
});

module.exports = Times;
