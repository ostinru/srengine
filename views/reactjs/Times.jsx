var React = require('react');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;

var Times = React.createClass({
      propTypes: {
            startTime: React.PropTypes.string.isRequired,
            endTime: React.PropTypes.string.isRequired
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