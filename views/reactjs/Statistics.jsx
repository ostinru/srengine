var React = require('react');
var Bootstrap = require('react-bootstrap');
var Button = Bootstrap.Button;
var Glyphicon = Bootstrap.Glyphicon;
var Panel = Bootstrap.Panel;
var Table = Bootstrap.Table;
var server = require('./server.js');

var Team = React.createClass({
    render:function() {
        var team = this.props.team;
        var index = this.props.index;
        return (
            <tr>
                <td>{index + 1}</td>
                <td>{team.user}</td>
                <td>{team.total}</td>
                {
                    team.history.map(function(problem){
                        return (
                            <td>
                                <table style="">
                                    <tr><td>{problem.topic}</td></tr>
                                    <tr><td>балл: {problem.total}</td></tr>
                                    <tr><td>бон: {problem.numbBonuses}</td></tr>
                                    <tr><td>подск: {problem.numbHints}</td></tr>
                                </table>
                            </td>)
                    })
                }
            </tr>
        )
    }
})

var Statistic = React.createClass({
    propTypes: {
    },

    getInitialState: function() {
        return {
            problems: [],
            statistics:[]
        };
    },

    // https://facebook.github.io/react/tips/initial-ajax.html
    componentDidMount: function() {
        var me = this;
        server.fetchStatistics(
            function() {
                console.error('failed to load statistics', arguments);
            },
            function(result) {
                if (me.isMounted()) {
                    me.setState({
                        problems : result.problems,
                        statistics : result.allStatistics
                    });
                }
            });
    },

    render: function() {
        var problems = this.state.problems;
        var statistics = this.state.statistics;
        return (
            <Panel header="Statisctic">
                <Table>
                    <thead Статистика>
                    <tr>
                        <th>Место</th>
                        <th>Команда</th>
                        <th>Cчет</th>
                        {
                            problems.map(function (problem, index) {
                                return <th>Задание {index + 1}</th>
                            })
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        statistics.map(function (team, index) {
                            return (
                                <Team team={team} index={index}/>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </Panel>
        );
    }

});

module.exports = Statistic;