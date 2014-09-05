// spotify.js

var Spotify = require('spotify-web'),
	lame = require('lame'),
	Speaker = require('speaker'),
	xml2js = require('xml2js'),
	async = require('async'),
	login = require('./loginCredentials.js');

module.exports = function(query) {
	var trackID, uri,
		username = login.spotify.username,
		password = login.spotify.password,
		//uri = 'spotify:track:6tdp8sdXrXlPV6AZZN2PE8',
		query = 'work out j cole';

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
			}, 1500);

			setTimeout(function() {
				spotify.get(uri, function(err, track) {
					if (err) {
						throw err;
					}
					console.log('Playing: %s - %s', track.artist[0].name, track.name);

					track.play()
					.pipe(new lame.Decoder())
					.pipe(new Speaker())
					.on('finish', function() {
						console.log('Track finished.');
					});
				});
			}, 2000);

		});
};
