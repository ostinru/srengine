const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const Input = require('react-bootstrap/lib/Input');

const context = require('./context');

const server = {

};

const reload = function() {
    server.fetchUsers(
    	() => {
    		console.error('failed to load users', arguments);
    	},
    	(result) => {
    		context.store.select('users').set(result);
	    });
/*
    server.fetchCoords(
    	() => {
    		console.error('failed to load coords', arguments);
    	},
    	(result) => {
    		context.store.select('coords').set(result);
	    });
*/
};

const onError = function() {
	console.log("error", arguments);
};

var ArchiveMap = React.createClass({

    propTypes: {
        timestamp: React.PropTypes.number.isRequired
    },

    loadUsers: function() {
        var me = this;

        server.fetchUsers(
            () => {
                console.error('failed to load users', arguments);
            },
            (result) => {
                context.users.root.set({users : result});
            });
    },

    reload: function(err, cb) {
        var me = this;/*
        server.fetchArchiveCoords(
            this.props.timestamp,
            function() {
                console.error('failed to load coords', arguments);
                err();
            },
            function(result) {
                if (me.isMounted()) {
                    me.setState({
                        coords: result
                    });
                }
                cb();
        });*/
    },

    startMap: function() {
        var DG = window.DG;
        var me = this;

        DG.then(function () {
            map = DG.map('users-map', {
                center: [57.77, 40.90],
                zoom: 13,
                fullscreenControl: false,
                minZoom: 13,
                maxBounds: [
                    [57.700070, 40.676097],
                    [57.829414, 41.052981]
                ],
                zoomControl: false,
                //watch:true,
                //setView:true,
                //enableHighAccuracy:true
            });

            DG.control.location({position:'bottomright'}).addTo(map);
            DG.control.zoom({position:'bottomleft'}).addTo(map);

            markers = DG.featureGroup(); //marker group

            me.drawMarkers(markers);

            markers.addTo(map); //adding marker group to map

            map.setView([57.743586, 40.909781], 13);

            map.whenReady(function() {
                // poll
                setInterval(function() {
                    me.reload(Function.prototype, function(){
                        me.drawMarkers(markers);
                    })
                }, 5000);
            });
        }); // DG.then
    },

    _getUser: function(userId) {
        if (!context.users)
            return userId;

        var users = context.users.select('users').get();
        if (!users || users.length == 0)
            return userId;

        var user = _.find(users, function(user) {
            return user._id === userId;
        });

        if (!user) {
            console.log('user ' + userId + ' not found');
            return userId;
        }
        return user.username;
    },

    drawMarkers: function (markers){
        var me = this;
        var coords = this.state.coords;

        markers.clearLayers();
        _.each(coords, function(coord) {
            var nick = me._getUser(coord.userId);
            var hasNote = !!coord.note;
            DG.marker(
                    [ coord.x, coord.y],
                    {
                        icon: DG.icon({iconUrl: hasNote ? 'images/pony2.png' : 'images/pony.png', iconSize: [36,36]}),
                        title: nick
                    }
                ).addTo(markers)
                .bindPopup(nick + ' ' + (coord.note || ''))
                //.on('click', function (e) {})._popup.setHeaderContent(nick);
        });
    },


    componentDidMount: function() {
        this.reload(this.props.timestamp);
        this.startMap();
    },

    componentWillReceiveProps: function(newProps) {
        this.reload(newProps.timestamp);
    },

    render: function() {
        return (
            <div id="users-map" style={{
                'position': 'absolute',
                'left': '0px',
                'right': '0px',
                'top': '120px',
                'bottom': '0px'
            }}>
            </div>
        );
    },

});


var Archive = React.createClass({

    getInitialState: function() {
        return {
        	timestamp: 1440432480
        };
    },

    render: function () {
        var me = this;
        var state = this.state;
        return (
            <div>
            	<input
                    ref="slider"
                    type="range"
                    value={this.state.timestamp}
                    min={1440417600}
                    max={1440432480}
                    onInput={me.handleTimestampChange}
                    step={5} />

            	<ArchiveMap timestamp={this.state.timestamp} />
            </div>
        );
    },
    handleTimestampChange: function() {
        this.setState({
            timestamp: this.refs.slider.getValue()
        })
    }
});

ReactDOM.render(
    <Archive/>,
    document.getElementById('react-content')
);
