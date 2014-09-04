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
					//console.log(JSON.stringify(data, null, 2).result.tracks[0].track);
					console.log(data.result.tracks[0].track[0].id[0]);
					trackID = data.result.tracks[0].track[0].id[0];
				});
				parser.parseString(xml);

			});

			setTimeout(function() {
				uri = Spotify.id2uri('track', trackID);
				console.log(uri);
			}, 1000);

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
			}, 1500);

		});
};

// var searchForTrack = function(spotify, query) {
// 	spotify.search(query, function(err, xml) {
// 		if (err) {
// 			throw err;
// 		}
// 		console.log('hi');
// 		var parser = new xml2js.Parser();
// 		parser.parseString(xml);
// 		parser.on('end', function(data) {
// 			var returnObj, trackID;
// 			returnObj = JSON.stringify(data, null, 2);
// 			trackID = returnObj.result.tracks[0].track.id;
// 			console.log(trackID);
// 			return trackID;
// 		});

// 	});
// };
// var convertToURI = function(trackID) {
// 		return Spotify.id2uri('track', trackID);
// 	};

// var playTrack = function(spotify, uri) {
// 		spotify.get(uri, function(err, track) {
// 			if (err) {
// 				throw err;
// 			}
// 			console.log('Playing: %s - %s', track.artist[0].name, track.name);

// 			track.play()
// 				.pipe(new lame.Decoder())
// 				.pipe(new Speaker())
// 				.on('finish', function() {
// 					console.log('Track finished.');
// 				});
// 		});
// 	};