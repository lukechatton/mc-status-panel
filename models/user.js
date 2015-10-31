var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = mongoose.model('PanelUser', {
	username: String,
	password: String
}, "panelusers");