var logger = require('lib/logger')(module);
var Message = require('models/message').Message;
var HttpError = require('error').HttpError;

exports.get = function(req, res, next) {
    Message.find({}, 'message timestamp -_id', function(err, messages) {
        if (err) {
            return res.sendHttpError(new HttpError(500, err.message));
        }
        
        if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
            return res.json(messages);
        }
        else {
            res.locals.messages = messages;
            return res.render("message");
        }
    });
};

exports.post = function(req, res, next) {
    logger.debug(req.body);
    if (!req.body.message) {
        return res.sendHttpError(new HttpError(403, "No message"));
    }
    var message = new Message();
    message.message = req.body.message;
    message.timestamp = Date.now();
    message.save(function(err) {
        if (err) {
            return res.json(new HttpError(500, err.message));
        }
        res.json({ status : "Success"});
    });
};
