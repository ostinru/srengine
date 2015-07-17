var logger = require('lib/logger')(module);
var HttpError = require('error').HttpError;
var config = require('../config');

exports.get = function(req, res, next){
    res.render('administration');
}
