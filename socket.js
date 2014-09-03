// socket.js

module.exports = function(io, twitter) {
	var stream = twitter.stream('statuses/filter', { track: '#neviliscool' });
	io.on('connection', function(socket) {
		console.log('socket.io connection established!');
		stream.on('connect', function(request) {
			console.log('Twitter connection established');
		});
		stream.on('tweet', function(tweet) {
			console.log(tweet);
		});
	});
}