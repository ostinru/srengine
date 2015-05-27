var React = require('react');
var React = require('react');
var Bootstrap = require('react-bootstrap');
var Navbar = Bootstrap.Navbar;
var Nav = Bootstrap.Nav;
var NavItem = Bootstrap.NavItem;

var Menu = React.createClass({
	render: function() {
		return (
			<Navbar brand="StreetRiding">
				<Nav>
					<NavItem href="times">Times</NavItem>
					<NavItem href="problems">Problems</NavItem>
					<NavItem href="users">Users</NavItem>
					<NavItem href="statistics">Statistics</NavItem>
					<NavItem href="globalbonus">Gobal bonuses</NavItem>
					<NavItem href="message">Admin messages</NavItem>
				</Nav>
			</Navbar>
			);
	}
});

module.exports = Menu;