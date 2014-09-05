// spotify.js

var Spotify = require('spotify-web'),
	lame = require('lame'),
	Speaker = require('speaker'),
	xml2js = require('xml2js'),
	async = require('async'),
	login = require('./loginCredentials.js');

var trackPlaying = false,
	playQueue = [];

module.exports = function(query) {
	var trackID, uri,
		username = login.spotify.username,
		password = login.spotify.password;

		console.log('Keywords searched for: ' + query);

		Spotify.login(username, password, function(err, spotify) {
			if (err) {
				throw err;
			}
			
			spotify.search(query, function(err, xml) {
				if (err) {
					throw err;
				}
				console.log('Searching...');
				var parser = new xml2js.Parser();
				parser.on('end', function(data) {
					trackID = data.result.tracks[0].track[0].id[0];
				});
				parser.parseString(xml);

			});

			setTimeout(function() {
				uri = Spotify.id2uri('track', trackID);
				enqueue(playQueue, uri);
				console.log(playQueue);
			}, 1000);

			setTimeout(function() {
				spotify.get(uri, function(err, track) {
					if (err) {
						throw err;
					}
					console.log('Found!');
					if (!trackPlaying) {
						console.log('Playing: %s - %s', track.artist[0].name, track.name);
						trackPlaying = true;
						track.play()
							.pipe(new lame.Decoder())
							.pipe(new Speaker())
							.on('finish', function() {
								trackPlaying = false;
								console.log('Track finished.');
							});
					}
				});
			}, 1500);

		});
};

var enqueue = function(playQueue, uri) {
	playQueue.push(uri);
},
dequeue = function(playQueue) {
	playQueue.pop();
};
