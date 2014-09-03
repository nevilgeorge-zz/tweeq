// app.js

var express = require('express'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	spotify = require('spotify-web'),
	socketio = require('socket.io'),
	http = require('http'),
	twitter = require('twit');

// Instantiate the app. Sort of weird because we are instantiating an Express/Socket.io app
var app = express(),
	server = http.Server(app),
	io = socketio(server);

server.listen(8080, function() {
		console.log('App listening on port 8080...');
});	
