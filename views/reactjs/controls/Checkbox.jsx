var React = require('react');
var Bootstrap = require('react-bootstrap');
var Input = Bootstrap.Input;

module.exports = React.createClass({

	displayName: 'Checkbox',

	propTypes: {
		label: React.PropTypes.string,
		//initValue: React.PropTypes.optional
	},

	getInitialState: function() {
		return {
			value: this.props.initValue
		};
	},

	render: function() {
		return (
			<Input {...this.props} ref="input" type="checkbox" checked={this.state.value} onChange={this.handleChange} />
		);
	},

	handleChange: function() {
		var newValue = this.refs.input.getChecked();
		this.setState({
			value: newValue
		});
	},

	getValue: function() {
		return this.state.value;
	},

	clear: function() {
		this.setState({
			value: false
		})
	}
});