const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const Input = require('react-bootstrap/lib/Input');
const Button = require('react-bootstrap/lib/Button');
const Glyphicon = require('react-bootstrap/lib/Glyphicon');
const server = require('./server');
const context = require('./context');

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
            shtopor: 'shtopor.png'
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
                'top': '65px',
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
        	timestamp: getQueryVariable('ts') || 1440872100
        };
    },

    render: function () {
        var me = this;
        var state = this.state;
        var time = new Date(this.state.timestamp * 1000);
        const step = 60;
        return (
            <div>
            	<input
                    ref="slider"
                    type="range"
                    value={this.state.timestamp}
                    min={1440872100}
                    max={1440904500}
                    onChange={me.handleTimestampChange}
                    step={step} />
                <div id="controls">
                    <span>{`${time.getHours()}:${time.getMinutes()}:${time.getMilliseconds()}`}</span>
                    <Button bsStyle="primary" bsSize="xsmall" onClick={this.copyLinkDialog}>Get link</Button>
                </div>

            	<ArchiveMap timestamp={this.state.timestamp} />
            </div>
        );
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
            })
        }, 500);
    }
});

ReactDOM.render(
    <Archive/>,
    document.getElementById('react-content')
);
