var async = require('async');
var logger = require('lib/logger')(module);
var Problem = require('models/problem').Problem;
var HttpError = require('error').HttpError;
var User = require('models/user').User;

var root = require('routes/root');

exports.get = function (req, res, next) {
    var user = req.user;
    logger.info("GET /map");
    getNextProblem(user, res);
}

exports.post = function (req, res, next) {
    logger.info("post at map");
    if (res.req.headers['x-requested-with'] != 'XMLHttpRequest') {
        return res.sendHttpError(new HttpError(412, "Only XMLHttpRequest requests accepted on this URL"));
    }

    var user = req.user;
    var problemId = user.problemId;
    if (!problemId) {
        return res.sendHttpError(new HttpError(500),"ну ебана");
    }

    var problemHistory = user.getProblemHistory(problemId);
    var makeVisible = false;
    if (!problemHistory.visible) {
        problemHistory.visible = true;
        makeVisible = true;
        logger.info("makeVisible: " + makeVisible);
    };
    user.markModified("problemHistory");
    user.save(function(err){
        if(err) {
            throw(err)
        } else{
            var myPrevProblemId = user.problemHistory[user.problemHistory.length-2].problemId;
            var myCurProblemId = problemId;
            Problem.findById(myCurProblemId,function(err,myCurProblem){
                Problem.findById(myPrevProblemId,function(err,myPrevProblem){
                    var structRotate = {myPrev:myPrevProblem.serial,myCur:myCurProblem.serial,visible:makeVisible};
                    return res.json(structRotate);
                })
            });
        };
    });
}

function getNextProblem(user,res){
    if (!user.problems) {
        // FIXME: add all problems without dependencies
        return res.sendHttpError(new HttpError(500, "Automatic user initialization not implemented"));
    }

    user.problems

    user.problemId = problem._id;
    var visible = user.problemHistory.length ===1;
    user.problemHistory.push({
        problemId: problem._id,
        takenBonuses:[],
        takenHints:[],
        timeStart: Date.now(),
        visible: visible
    });
    user.markModified('problemHistory');
    user.save(function (err) {
        if (err) {
            logger.error("[%s] задание не добавлено в историю", user.username, err);
                return res.sendHttpError(new HttpError(500,"Problem not saved to history"))
            }
            logger.info("[%s] Задание добавлено в историю.", user.username, problem.topic);
            res.render('map2');
        });
    res.render('map');
}