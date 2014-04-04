var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;

exports.get = function(req, res, next){
	res.render('map');
}

exports.post = function(req, res, next){
	logger.info('POST on "' + req.path + '": ', req.body);
	res.json({ error : null });
};
