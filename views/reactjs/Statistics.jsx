var React = require('react');
var Input = require('./controls/Input.jsx');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var Glyphicon = Bootstrap.Glyphicon;
var Panel = Bootstrap.Panel;
var server = require('./server.js');

var Statistic = React.createClass({
    propTypes: {
    },

    render: function() {
        return (
            <Panel header="Statisctic">
                <table style = "2px">
                    <tr>
                        <td>Place</td>
                        <td>Team</td>
                        <td>Total score</td>
                    </tr>

                </table>
            </Panel>
        );
    },

});

module.exports = Statistic;