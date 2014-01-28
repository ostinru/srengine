var mongoose = require('mongoose');
var log = require('./logger')(module);
var config = require('../config');

// Установим соединение с базой
log.info('Connecting to MongoDB uri: ' + config.get('mongoose:uri'));

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

mongoose.connection.on('connected', function() {
  log.info('connected');
});

/* die on error
mongoose.connection.on('error', function(err)  {
  console.error("Mongoose error", err);
});
*/

log.info("DB initialized");

module.exports = mongoose;
