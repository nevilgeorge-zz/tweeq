// spotify.js - takes care of Spotify Web API commands

var Spotify = require('spotify-web'),
	lame = require('lame'),
	Speaker = require('speaker'),
	xml2js = require('xml2js'),
	login = require('./loginCredentials.js');

var trackPlaying = false,
	// Queue to store songs that are requested while another song is still playing
	playQueue = [];


// Implementing an enqueue function for the queue of songs
var enqueue = function(playQueue, uri) {
	playQueue.push(uri);
},

// Implementing a dequeue function for the queue of songs
dequeue = function(playQueue) {
	return playQueue.shift();
},

// Plays a track that is passed into the function
playTrack = function(track, socket) {
	var speaker = new Speaker();
	console.log('Playing: %s - %s', track.artist[0].name, track.name);
	socket.emit('track playing', 'Playing: ' + track.artist[0].name + ' - ' + track.name);
	trackPlaying = true;
	track.play()
	.pipe(new lame.Decoder())
	.pipe(speaker)
	.on('finish', function() {
		trackPlaying = false;
		nextTrack = dequeue(playQueue);
		// check if there is another track to be played, if so, then play it.
		/*
		Similar to a tail recursion but not exactly because playTrack completes execution
		before being called again.
		*/
		if (typeof nextTrack !== 'undefined') {
			console.log('Getting next track...');
			socket.emit('next track', 'Getting next track...');
			playTrack(nextTrack, socket);
		} else {
			console.log('Done playing all songs on queue!');
			socket.emit('queue done', 'Done playing all songs on queue!');
		}
	});

	socket.on('disconnect', function() {
		speaker.end();
	});
};


module.exports = function(query, socket) {
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
				socket.emit('searching', 'Searching for keywords: ' + query);
				var parser = new xml2js.Parser();
				parser.on('end', function(data) {
					trackID = data.result.tracks[0].track[0].id[0];
				});
				parser.parseString(xml);

			});

			// Wait for search to return. Then convert the song ID to a Spotify URI
			setTimeout(function() {
				uri = Spotify.id2uri('track', trackID);
			}, 1000);

			// Once a URI is obtained, get the associated track and then pass it to the playTrack function
			setTimeout(function() {
				spotify.get(uri, function(err, track) {
					if (err) {
						throw err;
					}

					console.log('Found!');
					socket.emit('found', 'Track found!');
					// Check if there is currently a track playing and check if there is another track to be played
					if (!trackPlaying && typeof track !== 'undefined') {
						// Only plays the first song in the queue
						playTrack(track, socket);
					} else {
						enqueue(playQueue, track);
						console.log(playQueue);
						socket.emit('added to queue', track.name + ' added to queue!');
					}
				});
			}, 1500);

		});
};