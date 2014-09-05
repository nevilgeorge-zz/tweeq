// spotify.js

var Spotify = require('spotify-web'),
	lame = require('lame'),
	Speaker = require('speaker'),
	xml2js = require('xml2js'),
	async = require('async'),
	login = require('./loginCredentials.js');

var trackPlaying = false;

module.exports = function(query) {
	var trackID, uri,
		username = login.spotify.username,
		password = login.spotify.password;

		console.log('Keywords searched for:' + query);

		Spotify.login(username, password, function(err, spotify) {
			if (err) {
				throw err;
			}
			
			spotify.search(query, function(err, xml) {
				if (err) {
					throw err;
				}
				console.log('hi');
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
