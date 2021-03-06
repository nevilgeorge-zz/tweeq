// socket.js

module.exports = function(io, twitter, searchItem) {
	var tweetParser = function(string) {
		// remove white spaces for both sides of the text
		string = string.trim(' ');
		var wordArray = string.split(' ');
		// Iterate through wordArray and remove username and dash
		// Doesn't remove empty words ("") but that shouldn't be a problem
		for (var i = 0; i < wordArray.length; i++) {
			if (wordArray[i][0] === '@' || wordArray[i] === '-' || wordArray[i].length === 0) {
				wordArray.splice(i, 1);
			}
		}
		// returns a concatenated string to be used as a query
		return wordArray.join(' ');
	};
	var stream = twitter.stream('statuses/filter', { track: searchItem });
	io.on('connection', function(socket) {
		console.log('Listening for tweets...');
		socket.emit('listen for tweet', 'Listening for tweets to ' + searchItem + '...');
		stream.on('connect', function(request) {
			console.log('Twitter connection established');
		});
		stream.on('tweet', function(tweet) {
			var query = tweetParser(tweet.text);
			// pass in the query string to the file that deals with the spotify web API
			require('./spotify.js')(query, socket);
		});
	});
}