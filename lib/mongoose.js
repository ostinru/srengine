var mongoose = require('mongoose');
var log = require('lib/logger')(module);
var config = require('../config');

log.info('Connecting to MongoDB uri: ' + config.get('mongoose:uri'));

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

mongoose.connection.on('connected', function() {
  log.info('Mongoose connected');
});

mongoose.connection.on('disconnected', function() {
  log.info('Mongoose disconnected');
});

// TODO: die on error
mongoose.connection.on('error', function(err)  {
  console.error("Mongoose error", err);
});

module.exports = mongoose;
