// app.js

var express = require('express'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	socketio = require('socket.io'),
	http = require('http'),
	Twit = require('twit');

// Instantiate the app. Sort of weird because we are instantiating an Express/Socket.io app
var app = express(),
	server = http.Server(app),
	io = socketio(server);

// Initialize modules
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// app.use(morgan('dev'));
// app.use(cookieParser);

// route the index file
app.get('/', function(req, res) {
	res.sendfile('index.html');
});

//Iniitialize twitter client. Hardcoded to always use username __nevil
var twitter = new Twit({
		consumer_key: 'Bgrn71RmP4qNjSXqOpCgdqTN7',
		consumer_secret: 'YIt8tFn2bC6UvxFC0DuBJyFepPVCe6XMFWiprougq0OD5TDsnm',
		access_token: '2787350504-LEaKQvlst18hjFkOMavwqmg85BoRgU0aP6aUFzR',
		access_token_secret: 'RRUO9wIsOLReZTlngsF2WEwVAYsDlB6EGTwRdKt6tGFpq'
});

// pass the io instance into the file that handles all socket.io operations
require('./socket.js')(io, twitter);

// listen on port 3030
server.listen(3030, function() {
		console.log('App listening on port 3030...');
});	
