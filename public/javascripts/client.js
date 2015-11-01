servers = new Array();
serversRunning = 0;
serversOffline = 0;


$(document).ready(function() {
	var socket = io('http://s1.prohost.gs:3449');

	socket.emit('servers');
	socket.emit('global-online');
	socket.emit('global-registered');
	socket.emit('global-servers-running');
	socket.emit('global-servers-offline');
	setInterval(function() {
		socket.emit('servers');
		socket.emit('global-online');
		socket.emit('global-registered');
		socket.emit('global-servers-running');
		socket.emit('global-servers-offline');
	}, 3000);

	socket.on('servers', function(packet) {
		servers = packet;
		updateServerList();
	});

	socket.on('global-online', function(value) {
		$("#global-players-online").text(value);
	});

	socket.on('global-registered', function(value) {
		$("#global-registered").text(value);
	});

	socket.on('global-servers-running', function(value) {
		serversRunning = value;
		$("#global-servers-running").text(serversRunning + '/' + (serversOffline + serversRunning));
	});

	socket.on('global-servers-offline', function(value) {
		serversOffline = value;
		$("#global-servers-running").text(serversRunning + '/' + (serversOffline + serversRunning));
	});
});

updateServerList = function() {
	$("#hub-list").find('tbody').empty();
	$("#game-list").find('tbody').empty();
	servers.forEach(function(server) {
		var playerCountPercentage = Math.round((server.players/server.max) * 100);
		if(server.id.indexOf('h') >= 0) {
			/* ==== HUB SERVER ==== */
			var extraClass = "";
			if(!server.online) {
				extraClass += " offline-server";
				server.players = 0;
				server.tps = 0;
				playerCountPercentage = 0;
			} else {
				extraClass += " online-server";
			}

			$("#hub-list").find('tbody')
				.append($('<tr class="server' + extraClass + '"">')
					.append($('<td class="server-id">')
						.text(server.id)
					)

					// .append($('<td class="server-map">')
					// 	.text('Map: ' + server.map)
					// )

					.append($('<td>')
						.append($('<div class="progress progress-info progress-striped">')
							.append($('<div style="width: ' + playerCountPercentage + '%" class="progress-bar">')
								.append($('<span class="inbar label label-inverse">')
									.text(server.players + ' / ' + server.max)
								)
							)
						)
					)

					.append($('<td class="server-tps">')
						.text((Math.round(server.tps * 100) / 100) + ' TPS')
					)
				);
		} else {
			/* ==== GAME SERVER ==== */
			var extraClass = "";
			if(!server.online) {
				extraClass += " offline-server";
				server.players = 0;
				server.tps = 0;
				playerCountPercentage = 0;
			} else {
				extraClass += " online-server";
			}

			$("#game-list").find('tbody')
				.append($('<tr class="server' + extraClass + '"">')
					.append($('<td class="server-id">')
						.text(server.id)
					)

					.append($('<td>')
						.append($('<div class="progress progress-info progress-striped">')
							.append($('<div style="width: ' + playerCountPercentage + '%" class="progress-bar">')
								.append($('<span class="inbar label label-inverse">')
									.text(server.players + ' / ' + server.max)
								)
							)
						)
					)

					.append($('<td class="server-tps">')
						.text((Math.round(server.tps * 100) / 100) + ' TPS')
					)
				);
		}
		
	})
}