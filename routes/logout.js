exports.get = function (req, res, next) {
    // TODO: is it ok?
    req.session.destroy();
    res.redirect('/');
};
exports.post = function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
};