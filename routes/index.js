var express = require('express');
var router = express.Router();

var server = require('../socket/server');

module.exports = function(passport) {

	/* GET Index */
	router.get('/', function(req, res) {
		if(req.user) {
			res.render('index', 
				{
					message: req.flash('message')
				});
		} else {
			res.render('login');
		}
	});

	/* GET Login */
	router.get('/login', function(req, res) {
		res.render('login');
	});

	/* POST Login */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true 
    }));

	return router;
}
