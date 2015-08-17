var React = require('react');
var Bootstrap = require('react-bootstrap');
var Input = Bootstrap.Input;

module.exports = React.createClass({

	displayName: 'Input',

	propTypes: {
		label: React.PropTypes.string,
		type: React.PropTypes.string.isRequired,
		//initValue: React.PropTypes.optional
	},

	getInitialState: function() {
		return {
			value: this.props.initValue
		};
	},

	render: function() {
		return (
			<Input {...this.props} ref="input" value={this.state.value} onChange={this.handleChange} />
		);
	},

	handleChange: function() {
		var newValue = this.refs.input.getValue();
		this.setState({
			value: newValue
		});
	},

	getValue: function() {
		return this.state.value;
	},

	clear: function() {
		this.setState({
			value: null
		})
	}
});