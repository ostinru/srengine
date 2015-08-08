var mongoose = require('mongoose');
var log = require('lib/logger')(module);
var config = require('../config');

log.info('Mongoose version: ' + mongoose.version);
log.info('Connecting to MongoDB uri: ' + config.get('mongoose:uri'));

mongoose.set('debug', config.get('mongoose:debug'));

var options = config.get('mongoose:options');
if (options.server) {
    options.server.socketOptions = { keepAlive: 1 };
}
if (options.replset) {
    options.replset.socketOptions = { keepAlive: 1 };
}
mongoose.connect(config.get('mongoose:uri'), options);

mongoose.connection.on('connected', function() {
  log.info('Mongoose connected');
});

mongoose.connection.on('disconnected', function() {
  log.info('Mongoose disconnected');
});

mongoose.connection.on('error', function(err)  {
  console.error("Mongoose error", err);

  // Live Fast, Die Young
  process.exit(1);
});

module.exports = mongoose;
