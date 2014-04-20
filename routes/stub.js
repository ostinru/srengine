var config = require('../config');
var logger = require('lib/logger')(module);


exports.get = function(req,res,next){
    res.render('stub', {titleStub: "let's go!"});
}