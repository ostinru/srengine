var config = require('../config');
var logger = require('lib/logger')(module);
var startTime = Date.parse(config.get('startTime'));
var finishTime = Date.parse(config.get('finishTime'));

module.exports = function (req, res, next) {
    if (!isTimeOfGame()){
    res.redirect('/stub');
        return;
    }
    next();
};

function isTimeOfGame() {
     return(Date.now() > startTime && Date.now() < finishTime);
};
