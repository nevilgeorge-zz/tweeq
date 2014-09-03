// socket.js

module.exports = function(io, twitter) {
	var tweetParser = function(string) {

	}
	var stream = twitter.stream('statuses/filter', { track: '@__nevil' });
	io.on('connection', function(socket) {
		console.log('socket.io connection established!');
		stream.on('connect', function(request) {
			console.log('Twitter connection established');
		});
		stream.on('tweet', function(tweet) {
			tweetParser(tweet.text);
		});
	});
}