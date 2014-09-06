var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var mongoose = require('lib/mongoose.js');

exports.get = function(req, res, next){
    Problem.find({},null,{sort: {serial: 1}}, function (err, problems) {
        if (err) {
            return next(err);
        }

        if (res.req.headers['x-requested-with'] != 'XMLHttpRequest') {
            res.locals.problems = problems;
            return res.render('problems');
        }
        else {
            return res.json(problems);
        }
    });
};

exports.post = function(req,res,next) {
    var newProblem = new Problem({topic:'99',
        serial:999,
        question:'999',
        answers:[],
        cost:999,
        hints:[],
        bonuses:[]});
    newProblem.save();
    logger.info(newProblem._id);
    res.locals.problem = newProblem;
    res.location('/problem/'+newProblem._id);
    return res.render('problem');
}