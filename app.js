var config = require('./config');
var logger = require('./lib/logger');
var http = require('http');
var path = require('path');
var HttpError = require('error').HttpError;
// ExpressJS & modules
var express = require('express');
var expressSessions = require('express-session');
var MongoStore = require('connect-mongo')(expressSessions);
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var morgan = require('morgan'); // logger
var cookieParser = require('cookie-parser');
//var errorHandler = require('errorhandler');

var app = express();

if (! config.get('cookie_secret')) {
    throw new Error('You should specify "cookie_secret" in config');
}
if (config.get('cookie_secret') == "pew-pew") {
    throw new Error('You should change "cookie_secret" in config');
}


// all environments
app.engine('ejs', require('ejs-locals'));
app.set('port', config.get('port'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('middleware/sendHTTPError'));
app.use(favicon(__dirname + '/public/favicon.ico'));
morgan.token('sr-user', function(req, res) { return req.user && req.user.username; });
app.use(morgan(':remote-addr - :sr-user [:date[clf]] ":method :url :status :response-time ms'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.get('cookie_secret')));
app.use(expressSessions({
    secret: config.get('cookie_secret'),
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified 
    store: new MongoStore({
        url : config.get('mongoose:uri'),
        touchAfter: 3600 // time period in seconds 
    })
}));
app.use(require('middleware/loadUser'));
app.use(require('middleware/resLocals'));

app.use(express.static(path.join(__dirname, 'public')));

// development only
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}

require('./routes')(app);

// Error handler
app.use(function (err, req, res, next) {
    console.log(err);
    if (typeof err == 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        err = new HttpError(500);
        res.sendHttpError(err);
    }
});

http.createServer(app).listen(config.get('port'), function(){
    console.log('Express server listening on port ' + config.get('port'));
});


