const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const Input = require('react-bootstrap/lib/Input');
const Button = require('react-bootstrap/lib/Button');
const Glyphicon = require('react-bootstrap/lib/Glyphicon');
const Multiselect = require('react-bootstrap-multiselect');
const server = require('./server');
const context = require('./context');

const TIMESTAMP_STEP = 60;
const MIN_TIMESTAMP = 1440872100;
const MAX_TIMESTAMP = 1440904500;

const hashCode = function(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

const getQueryVariable = function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

const ArchiveMap = React.createClass({

    map: null,
    markers: null,

    propTypes: {
        timestamp: React.PropTypes.number.isRequired
    },

    getInitialState: function() {
        return {
            coords: []
        };
    },

    reload: function(err, cb) {
        var me = this;
        server.fetchArchiveCoords(
            this.props.timestamp,
            () => {
                console.error('failed to load coords', arguments);
                if (typeof err === 'function') {
                    err();
                };
            },
            (result) => {
                if (this.isMounted()) {
                    this.setState({
                        coords: result
                    }, function() {
                        me.drawMarkers(me.markers);
                    });
                }
                if (typeof cb === 'function') {
                    cb(result);
                };
        });
    },

    startMap: function() {
        var DG = window.DG;
        var me = this;

        DG.then(() => {
            var DG = window.DG;
            me.map = DG.map('users-map', {
                center: [57.77, 40.90],
                zoom: 13,
                fullscreenControl: false,
                minZoom: 10,
                maxBounds: [
                    [57.700070, 40.676097],
                    [57.829414, 41.052981]
                ],
                zoomControl: false,
                watch:true,
                setView:true,
                enableHighAccuracy:true
            });

            DG.control.location({position:'bottomright'}).addTo(me.map);
            DG.control.zoom({position:'bottomleft'}).addTo(me.map);

            me.markers = DG.featureGroup(); //marker group
            me.drawMarkers(me.markers);
            me.markers.addTo(me.map); //adding marker group to map

            me.map.setView([57.743586, 40.909781], 13);

            server.fetchArchiveProblems(() => {
                console.error('Failed to load problems');
            }, (problems) => {
                problems.forEach((problem) => {
					DG.marker(
						[ problem.x, problem.y],
						{ icon: DG.icon({iconUrl: problem.icon, iconSize: [24,24]})}
					).addTo(me.map)
					.bindPopup(problem.topic);
					DG.circle([problem.x, problem.y], 50, {color: 'black', fillColor:'yellow', clickable:'false'}).addTo(me.map);
				}); // forEach
            });
        }, () => {
            console.error('Failed to load 2gis');
        }); // DG.then
    },

    drawMarkers: function (markers){
        var me = this;
        var coords = this.state.coords || [];

        markers.clearLayers();

        coords.forEach((coord) => {
            var nick = coord.username;
            // look for visible/hidden:
            var team = _.find(this.props.teams, {value: nick});
            if (!team.selected)
                return;

            var last = coord.points[coord.points.length-1];
            var timestamp = new Date(last.timestamp);
            timestamp = `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getMilliseconds()}`;

            // marker
            DG.marker(
                    [ last.x, last.y],
                    {
                        icon: DG.icon({iconUrl: 'images/'+ this.getIcon(nick), iconSize: [42,42]}),
                        title: nick
                    }
                ).addTo(markers)
                .bindPopup(nick + '<br/>' + (timestamp || ''))
            // trace
            var colors = ['red', 'coral', 'cyan', 'orange', 'salmon', 'pink', 'blue', 'gold', 'green'];
            var color = colors[ hashCode(nick) % colors.length ];
            DG.polyline(coord.points.map((point) => [point.x, point.y]), {color: color}).addTo(markers);
        });
    },

    getIcon(nick) {
        var icons = {
            pepsi: 'pepsi.png',
            madfoxes: 'madfox.gif',
            shtopor: 'shtopor.png',
            klony: 'klony.png'
        };
        if (icons[nick]) {
            return icons[nick];
        }
        return 'pony.png'
    },

    componentDidMount: function() {
        this.reload(this.props.timestamp);
        this.startMap();
    },

    componentWillReceiveProps: function(newProps) {
        this.reload(newProps.timestamp);
    },

    shouldComponentUpdate(nextProps, nextState) {
        // do not re-render original div
        return false;
    },

    render: function() {
        return (
            <div id="users-map" style={{
                'position': 'absolute',
                'left': '0px',
                'right': '0px',
                'top': '75px',
                'bottom': '0px'
            }}>
            </div>
        );
    },

});


var Archive = React.createClass({

    delayed: null,

    getInitialState: function() {
        return {
        	timestamp: getQueryVariable('ts') || 1440872100,
            isAutoPlay: false,
            teams: [
                { value : "jenpsaki" , selected: true , selected: true },
                { value : "snusmumrik" , selected: true },
                { value : "shtopor" , selected: true },
                { value : "zhelezo" , selected: true },
                { value : "highvoltage" , selected: true },
                { value : "zaitsy" , selected: true },
                { value : "alpaltus" , selected: true },
                { value : "yoshking" , selected: true },
                { value : "fullbug" , selected: true },
                { value : "iamengineer" , selected: true },
                { value : "partizany" , selected: true },
                { value : "hrundeli" , selected: true },
                { value : "begizamnoi" , selected: true },
                { value : "madfoxes" , selected: true },
                { value : "abam" , selected: true },
                { value : "ressora" , selected: true },
                { value : "valenki" , selected: true },
                { value : "klony" , selected: true },
                { value : "dedmazai" , selected: true },
                { value : "manumba" , selected: true },
                { value : "pepsi" , selected: true },
                { value : "banda" , selected: true },
                { value : "butylka" , selected: true }
            ]
        };
    },

    render: function () {
        var me = this;
        var state = this.state;
        var time = new Date(this.state.timestamp * 1000);
        return (
            <div>
            	<input
                    ref="slider"
                    type="range"
                    value={this.state.timestamp}
                    min={MIN_TIMESTAMP}
                    max={MAX_TIMESTAMP}
                    onChange={me.handleTimestampChange}
                    step={TIMESTAMP_STEP} />
                <div id="controls">
                    <Button bsStyle="primary" bsSize="xsmall" onClick={this.playPauseClick}>
                        <Glyphicon glyph={this.state.isAutoPlay ? 'pause' : 'play'}></Glyphicon>
                    </Button>
                    <span>{`${time.getHours()}:${time.getMinutes()}:${time.getMilliseconds()}`}</span>
                    <Button bsStyle="primary" bsSize="xsmall" onClick={this.copyLinkDialog}>Get link</Button>
                    <Multiselect
                        ref="teams"
                        multiple
                        onChange={this.showHideTeamsChange}
                        data={this.state.teams}
                        maxHeight={200}
                        buttonText={() => "Show/Hide teams"}>
                    </Multiselect>
                </div>

            	<ArchiveMap timestamp={this.state.timestamp} teams={this.state.teams}/>
            </div>
        );
    },

    showHideTeamsChange(change) {
        var change = change[0];
        var value = change.value;

        var teams = this.state.teams;
        var newTeams = teams.map((team) => {
            if (team.value == value) {
                return {
                    value: team.value,
                    selected: !team.selected
                }
            }
            return team;
        });
        this.setState({
            teams: newTeams
        });
    },

    playPauseClick() {
        if (this.state.isAutoPlay) {
            // pause clicked:
            this.setState({
                isAutoPlay: false
            });
        } else {
            this.setState({
                isAutoPlay: true,
            });
            var playID = setInterval(() => {
                if (this.state.isAutoPlay && this.state.timestamp < MAX_TIMESTAMP) {
                    this.setState({
                        timestamp: this.state.timestamp + TIMESTAMP_STEP
                    });
                } else {
                    clearInterval(playID);
                    this.setState({
                        isAutoPlay: false
                    });
                }
            }, 2500);
        }
    },

    copyLinkDialog() {
        var loc = window.location;
        var url = loc.protocol + '//' + loc.host + loc.pathname + '?ts=' + this.state.timestamp;
        window.prompt("Copy to clipboard: Ctrl+C, Enter", url);
    },

    handleTimestampChange: function() {
        var newValue = +this.refs.slider.value;
        if (this.delayed) {
            clearTimeout(this.delayed);
            this.delayed = null;
        }
        this.delayed = setTimeout(() => {
            this.setState({
                timestamp: newValue
            });
        }, 500);
    }
});

ReactDOM.render(
    <Archive/>,
    document.getElementById('react-content')
);
