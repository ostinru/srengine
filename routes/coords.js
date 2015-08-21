var mongoose = require('lib/mongoose.js');
var User = require('models/user').User;
var Coords = require('models/coords').Coords;

exports.post = function(req,res,next) {

    var coords = new Coords({
        sessionID: req.sessionID,
        userId: req.user._id,
        x: req.body.lat,
        y: req.body.lon,
        timestamp: Date.now(),
        userAgent: ''});

    coords.save(function(err){
        if (err) {
            console.log(err);
            return res.sendHttpError(new HttpError(500, err));
        }
        res.json({});
    })
}