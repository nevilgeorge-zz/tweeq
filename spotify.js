// spotify.js

var Spotify = require('spotify-web'),
	lame = require('lame'),
	Speaker = require('speaker'),
	xml2js = require('xml2js'),
	login = require('./loginCredentials.js');

var searchForTrack = function(spotify, query) {
	spotify.search(query, function(err, xml) {
		if (err) {
			throw err;
		}

		var parser = new xml2js.Parser();
		parser.parseString(xml);
		parser.on('end', function(data) {
			var returnObj, trackID;
			returnObj = JSON.stringify(data, null, 2);
			console.log(returnObj);
			var trackID = returnObj.result.tracks[0].track.id;
			return trackID;
		});

	});
},
	convertToURI = function(trackID) {
		return Spotify.id2uri('track', trackID);
	},

	playTrack = function(spotify, uri) {
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
	}



module.exports = function(query) {
	var username = login.spotify.username,
		password = login.spotify.password,
		//uri = 'spotify:track:6tdp8sdXrXlPV6AZZN2PE8',
		query = 'work out j cole';

		Spotify.login(username, password, function(err, spotify) {
			if (err) {
				throw err;
			}

			var trackID = searchForTrack(spotify, query);
			
			uri = convertToURI(trackID);

			playTrack(spotify, trackID);
			
		});
}