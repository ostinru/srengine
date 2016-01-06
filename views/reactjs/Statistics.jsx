var React = require('react');
var Button = require('react-bootstrap/lib/Button');
var Glyphicon = require('react-bootstrap/lib/Glyphicon');
var Panel = require('react-bootstrap/lib/Panel');
var Table = require('react-bootstrap/lib/Table');
var server = require('./server.js');

const context = require('./context');

var Team = React.createClass({
    render:function() {
        var team = this.props.team;
        var index = this.props.index;
        return (
            <tr>
                <td>{index + 1}</td>
                <td>{team.user}</td>
                <td>
                    <table>
                        <tr><td>{team.total}</td></tr>
                        <tr><td>---</td></tr>
                        <tr><td>{team.publicTimeFinish}</td></tr>
                        <tr><td>---</td></tr>
                        <tr><td>{team.availableHints}</td></tr>
                    </table>
                </td>
                {
                    team.history.map(function(problem){

                        var color = {
                            'notavailable': 'grey',
                            'available':'#a5abf2',
                            'activate':'#fff785',
                            'agreed':'#119f37'
                        }[problem.status];
                        return (
                            <td style = {
                                    {
                                        'background-color': color
                                    }
                                }>
                                <table>
                                    <tr><td>{problem.topic}</td></tr>
                                    <tr><td>балл: {problem.total}</td></tr>
                                    <tr><td>бон: {problem.numbBonuses}</td></tr>
                                    <tr><td>подск: {problem.numbHints}</td></tr>
                                    <tr><td>{problem.timeFinish}</td></tr>
                                </table>
                            </td>)
                    })
                }
            </tr>
        )
    }
});

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
                    me.setState({ statistics : result.allStatistics });
                }
            });
        context.problems.on('update', () => {
            this.setState({ problems: context.problems.get() });
        })
    },

    render: function() {
        var problems = this.state.problems;
        var statistics = this.state.statistics;
        return (
            <Panel header="Статистика">
                <Table responsive>
                    <thead>
                    <tr>
                        <th>Место</th>
                        <th>Команда</th>
                        <th>Cчет</th>
                        {
                            problems.map(function (problem, index) {
                                return <th>Задание {index + 1}</th>
                            })
                        }
                        <th>¯\_(ツ)_/¯</th>
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
