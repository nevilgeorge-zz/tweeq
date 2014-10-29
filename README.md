tweeq
=====

Node.JS app used to crowdsource party playlists using Twitter and Spotify.
Uses Express, Socket.io, Twitter Streaming API and Spotify Web API.

The idea of this app originates from the classic scenario at parties where a random computer is playing songs and no one is really in charge of the playlist. With this app running on your computer, anyone can tweet at any given handle/username with his/her desired song title and artist, and the song is found and played from Spotify. If there is already a song being played, the song request is added to a queue. 

Eg.
Assume the app is listening to tweets at @nevil.
Anyone can send the tweet "stay with me - sam smith @nevil" and the app will play Stay With Me by Sam Smith.

To run:

Clone the repo to any directory. Make sure you have Node.JS installed on your computer.

Open Terminal, navigate to the directory you cloned to and execute `npm install`. Then, you should be able to run `node app.js` to start the app. Redirect your browser to localhost:3030 for a very bare-bones UI.
