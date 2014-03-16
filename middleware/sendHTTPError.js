/**
 * Created by Outsourc on 09.02.14.
 */
module.exports = function (req, res, next) {

    res.sendHttpError = function (error) {
		// TODO: notify admins (?)

        res.status(error.status);
        if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
            res.json(error);
        } else {
            res.render("error", {error: error});
        }
    };

    next();

};
