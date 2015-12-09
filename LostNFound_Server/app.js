
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
app.post('/login', user.login);
app.get('/users', user.list);
app.get('/ondelete', user.ondelete);
app.post('/showdetails', user.showdetails);
app.post('/showfounddetails', user.showfounddetails);
app.get('/homepage', user.homepage);
app.post('/NewlostItem',user.newlostitem);
app.post('/signup',user.signup);
app.post('/deleteLost',user.deleteLost);
app.post('/deleteFound',user.deleteFound);
app.post('/getFoundItems', user.getFoundItems);
app.post('/addNewFoundItem', user.addNewFoundItem);
app.get('/registerDevice', user.registerDevice);
//app.get('/push', user.push);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
