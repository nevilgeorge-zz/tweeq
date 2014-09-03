// spotify.js

var Spotify = require('spotify-web'),
	lame = require('lame'),
	Speaker = require('speaker');

module.exports = function(keywordArray) {
	var username = 'nevilgeorge',
		password = '__nevil__',
		uri = 'spotify:track:6tdp8sdXrXlPV6AZZN2PE8';
		console.log(Spotify);

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