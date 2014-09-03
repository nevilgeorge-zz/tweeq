// socket.js

module.exports = function(io) {
	io.on('connection', function(socket) {
		console.log('socket.io connection established!');
	});
}