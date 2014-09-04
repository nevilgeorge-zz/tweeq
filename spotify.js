// spotify.js

var Spotify = require('spotify-web'),
	lame = require('lame'),
	Speaker = require('speaker'),
	login = require('./loginCredentials.js');

module.exports = function(query) {
	var username = login.spotify.username,
		password = login.spotify.password,
		uri = 'spotify:track:6tdp8sdXrXlPV6AZZN2PE8';

		Spotify.login(username, password, function(err, spotify) {
			if (err) {
				throw err;
			}
			
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
		});
}