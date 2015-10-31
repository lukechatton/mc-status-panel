var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = mongoose.model('server', {
	id: String,
	address: String,
	port: Number,
	game: String,
	map: String,
	players: Number,
	max: Number,
	tps: Number,
	updated: Number,
	online: Boolean
}, "gservers");