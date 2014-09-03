// socket.js

module.exports = function(io, twitter) {
	var tweetParser = function(string) {
		var wordArray = string.split(' ');
		// Iterate through wordArray and remove username and dash
		for (var i = 0; i < wordArray.length; i++) {
			if (wordArray[i][0] === '@' || wordArray[i] === '-') {
				wordArray.splice(i, 1);
			}
		}
	};
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