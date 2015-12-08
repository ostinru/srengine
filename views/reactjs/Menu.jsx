var React = require('react');
var Navbar = require('react-bootstrap/lib/Navbar');
var Nav = require('react-bootstrap/lib/Nav');
var NavItem = require('react-bootstrap/lib/NavItem');

var Menu = React.createClass({
	render: function() {
		return (
			<Navbar brand="StreetRiding">
				<Nav>
					<NavItem href="times">Times</NavItem>
					<NavItem href="problems">Problems</NavItem>
					<NavItem href="users">Users</NavItem>
					<NavItem href="statistics">Statistics</NavItem>
					<NavItem href="message">Admin messages</NavItem>
					<NavItem href="map">Map</NavItem>
				</Nav>
			</Navbar>
			);
	}
});

module.exports = Menu;
