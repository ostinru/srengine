
var clients = [];

exports.subscribe = function(req, res) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    clients.push(res);

    res.on('close', function() {
        clients.splice(clients.indexOf(res), 1);
    });
};

exports.publish = function(message) {

    clients.forEach(function(res) {
        res.end(message);
    });

    clients = [];
};