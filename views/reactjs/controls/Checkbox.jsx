const React = require('react');
const Input = require('react-bootstrap/lib/Input');

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
