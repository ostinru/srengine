var React = require('react');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var server = require('./server.js');

var Times = React.createClass({
      propTypes: {
            startTime: React.PropTypes.string.isRequired,
            endTime: React.PropTypes.string.isRequired
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
                  	<input type='text' label='Start Time'>{this.props.startTime}</input>
                  	<label>End time</label>
                  	<input type='text' label='End Time'>{this.props.endTime}</input>
                  	<Button onClick={this.handleSave}> Save </Button>
                  </div>
		);
	},

    handleSave: function() {
        // FIXME
    }
});

module.exports = Times;
