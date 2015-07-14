var React = require('react');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var server = require('./server.js');

var Times = React.createClass({
      propTypes: {
      },
      
    getInitialState: function() {
        return {
            times: []
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
	    		debugger;
		    	if (me.isMounted()) {
					me.setState({
						times : result
					});
				}
		    });
	},

	render: function() {
		return (
                  <div className='times'>
                  	<label>Start time</label>
                  	<input type='text' label='Start Time' ref="startTime">{this.props.startTime}</input>
                  	<label>Finish time</label>
                  	<input type='text' label='Finish Time' ref="finishTime">{this.props.finishTime}</input>
                  	<Button onClick={this.handleSave}> Save </Button>
                  </div>
		);
	},

    handleSave: function() {
        server.postTime({
        	startTime : this.refs.startTime.value,
        	finishTime: this.refs.finishTime.value
        },
		function() { console.error("Faied to push times", arguments); },
		function() { console.log("Ok"); }
    }
});

module.exports = Times;
