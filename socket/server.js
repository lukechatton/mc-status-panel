var http = require('http');
var http_server = http.createServer();
var io = require('socket.io')(http_server);

var async = require('async');

var Server = require('../models/server');
var Player = require('../models/player');

http_server.timeout = 0;
var port = 3449;
http_server.listen(port, function() {
    console.log('started socket server.');
});

/* =========================== */
var servers = new Array();
var globalOnline;
var globalServersRunning;
var globalServersOffline;
var globalRegistered;
/* =========================== */

queryDatabase = function() {
	var globalOnlineTemp = 0;
	var globalServersRunningTemp = 0;
	var globalServersOfflineTemp = 0;

	async.parallel([
		function(cb) {
			Server.find({}, cb);
		},
		function(cb) {
			Player.count({}, cb);
		}
	], function(err, results) {
		var now = new Date();
		results[0].forEach(function(server) {
			var lastUpdate = new Date(server.updated);
			var diff = now.getTime() - lastUpdate.getTime();
			if(diff <= 5000) {
				server.online = true;
				globalOnlineTemp += server.players;
				globalServersRunningTemp += 1;
			} else {
				server.online = false;
				globalServersOfflineTemp += 1;
			}

			if(server.tps > 20) {
				server.tps = 20;
			}

		});

		/* ============ */
		servers = results[0];
		globalOnline = globalOnlineTemp;
		globalServersRunning = globalServersRunningTemp;
		globalServersOffline = globalServersOfflineTemp;
		globalRegistered = results[1];
	});
}

queryDatabase();
setInterval(function() {
	queryDatabase();
}, 3000);


io.on('connection', function(socket) {
	var self = this;

	console.log('received connection');

	socket.on('servers', function(msg) {
		sendUpdate(socket, "servers", servers);
	});

	socket.on('global-online', function() {
		sendUpdate(socket, "global-online", globalOnline);
	});

	socket.on('global-registered', function() {
		sendUpdate(socket, "global-registered", globalRegistered);
	});

	socket.on('global-servers-running', function() {
		sendUpdate(socket, "global-servers-running", globalServersRunning);
	});

	socket.on('global-servers-offline', function() {
		sendUpdate(socket, "global-servers-offline", globalServersOffline);
	});
})

sendUpdate = function(socket, channel, msg) {
	io.to(socket.id).emit(channel, msg);
}

