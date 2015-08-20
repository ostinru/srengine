var mongoose = require('lib/mongoose.js');
var User = require('models/user').User;
var Coords = require('models/coords').Coords;

exports.post = function(req,res,next){
    var coords = new Coords({sessionID:req.sessionID,
        userId:req.user._id,
        x:req.x,
        y:req.y,
        timestamp:Date.now(),
        userAgent:''});
    coords.save(function(err){
        if (err) {
            return res.sendHttpError(new HttpError(500, err));
        }
        res.render('/');
    })
}