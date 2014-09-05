// spotify.js

var Spotify = require('spotify-web'),
	lame = require('lame'),
	Speaker = require('speaker'),
	xml2js = require('xml2js'),
	async = require('async'),
	EventEmitter = require('events').EventEmitter,
	login = require('./loginCredentials.js');

var trackPlaying = false,
	i = 0,
	playQueue = [];

module.exports = function(query) {
	var trackID, uri, currentTrack, nextTrack,
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
			}, 1000);

			setTimeout(function() {
				spotify.get(uri, function(err, track) {
					if (err) {
						throw err;
					}

					console.log('Found!');
					if (!trackPlaying && typeof(track) !== undefined) {
						playTrack(track);
					} else {
						enqueue(playQueue, track);
						console.log(playQueue);
					}
				});
			}, 1500);

		});
};

var enqueue = function(playQueue, uri) {
	playQueue.push(uri);
},
dequeue = function(playQueue) {
	return playQueue.shift();

};

var playTrack = function(track) {
	console.log('Playing: %s - %s', track.artist[0].name, track.name);
	trackPlaying = true;
	track.play()
	.pipe(new lame.Decoder())
	.pipe(new Speaker())
	.on('finish', function() {
		trackPlaying = false;
		nextTrack = dequeue(playQueue);
		if (typeof(nextTrack) !== undefined) {
			console.log('Getting next track...');
			playTrack(nextTrack);
		} else {
			console.log('Done playing all songs on queue!');
		}
	});
};
