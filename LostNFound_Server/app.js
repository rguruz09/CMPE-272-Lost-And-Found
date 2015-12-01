
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var expressSession = require("express-session");
var app = express();
app.use(express.cookieParser());
app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', routes.index);
app.post('/lost', user.lost);
app.get('/login', user.login);
app.get('/users', user.list);
app.get('/ondelete', user.ondelete);
app.get('/showdetails', user.showdetails);
app.get('/homepage', user.homepage);
app.get('/NewlostItem',user.newlostitem);
app.get('/getLocation', user.getLocation);
app.get('/signup',user.signup);
app.post('/getFoundItems', user.getFoundItems);
app.post('/addNewFoundItem', user.addNewFoundItem);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
