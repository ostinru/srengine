var config = require('./config');
var logger = require('./lib/logger');
var express = require('express');
var http = require('http');
var path = require('path');
var HttpError = require('error').HttpError;

var fs = require('fs');
var url = require('url');
var chat = require('./chat');

var app = express();

// all environments
app.engine('ejs', require('ejs-locals'));
app.set('port', config.get('port'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('middleware/sendHTTPError'));
app.use(express.favicon('public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser('secret'));
app.use(express.session({ secret: 'pew-pew'}));
app.use(require('middleware/loadUser'));
app.use(require('middleware/resLocals'));
app.use(require('middleware/logRequest'));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}

require('./routes')(app);
//обработчик ошибок
app.use(function (err, req, res, next) {
    if (typeof err == 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            express.errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});

//сообщения от админов
app.use(function(req,res,next){
    var urlParsed = url.parse(req.url);

    switch (urlParsed.pathname) {
        case '/subscribe':
            chat.subscribe(req, res);
            break;

        case '/publish':
            var body = '';

            req
                .on('readable', function() {
                    body += req.read();

                    if (body.length > 1e4) {
                        res.statusCode = 413;
                        res.end("So big message!");
                    }
                })
                .on('end', function() {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        res.statusCode = 400;
                        res.end("Bad Request");
                        return;
                    }

                    chat.publish(body.message);
                    res.end("ok");
                });

            break;

        default:
            res.statusCode = 404;
            res.end("Not found");
    }
});

http.createServer(app).listen(config.get('port'), function(){
    console.log('Express server listening on port ' + config.get('port'));
});


