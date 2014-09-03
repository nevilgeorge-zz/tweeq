// app.js

var express = require('express'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	spotify = require('spotify-web'),
	socketio = require('socket.io'),
	http = require('http'),
	Twit = require('twit');

// Instantiate the app. Sort of weird because we are instantiating an Express/Socket.io app
var app = express(),
	server = http.Server(app),
	io = socketio(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(morgan('dev'));
app.use(cookieParser);

var twitter = new Twit({
		consumer_key: 'Bgrn71RmP4qNjSXqOpCgdqTN7',
		consumer_secret: 'YIt8tFn2bC6UvxFC0DuBJyFepPVCe6XMFWiprougq0OD5TDsnm',
		access_token: '2787350504-LEaKQvlst18hjFkOMavwqmg85BoRgU0aP6aUFzR',
		access_token_secret: 'RRUO9wIsOLReZTlngsF2WEwVAYsDlB6EGTwRdKt6tGFpq'
});


// listen on port 8888
server.listen(8888, function() {
		console.log('App listening on port 8080...');
});	
