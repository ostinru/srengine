var config = require('./config');
var logger = require('./lib/logger');
var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.engine('ejs', require('ejs-locals'));
app.set('port', config.get('port'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon('public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser('secret'));
app.use(express.session({ secret: 'pew-pew'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./routes')(app);

http.createServer(app).listen(config.get('port'), function(){
    console.log('Express server listening on port ' + config.get('port'));
});
