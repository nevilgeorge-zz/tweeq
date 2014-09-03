// socket.js

module.exports = function(io, twitter) {
	var tweetParser = function(string) {
		string = string.trim(' ');
		var wordArray = string.split(' ');
		// Iterate through wordArray and remove username and dash
		// Also removes "empty" words caused by users spacing incorrectly
		for (var i = 0; i < wordArray.length; i++) {
			if (wordArray[i][0] === '@' || wordArray[i] === '-' || wordArray[i].length === 0) {
				wordArray.splice(i, 1);
			}
		}
		return wordArray;
	};
	var stream = twitter.stream('statuses/filter', { track: '@__nevil' });
	io.on('connection', function(socket) {
		console.log('socket.io connection established!');
		stream.on('connect', function(request) {
			console.log('Twitter connection established');
		});
		stream.on('tweet', function(tweet) {
			console.log(tweetParser(tweet.text));
		});
	});
}