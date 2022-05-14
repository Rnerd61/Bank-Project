const path              = require('path');
const fs                = require('fs');
const express           = require('express');
const router            = express.Router();
const WeatherHelper     = require('../helpers/WeatherHelper');

let db;

const response = data => ({ message: data });

router.get('/', (req, res) => {
	return res.sendFile(path.resolve('views/index.html'));
});

router.get('/register', (req, res) => {
	return res.sendFile(path.resolve('views/register.html'));
});

router.post('/register', (req, res) => {

	let { username, password } = req.body;

	if (username && password) {
		return db.register(username, password)
			.then(()  => res.send(response('Successfully registered')))
			.catch(() => res.send(response('Something went wrong')));
	}

	return res.send(response('Missing parameters'));
});

router.get('/login', (req, res) => {
	return res.sendFile(path.resolve('views/login.html'));
});

router.post('/login', (req, res) => {
	let { username, password } = req.body;

	if (username && password) {
		console.log(username);
		return db.login(username, password)
			.then(() => res.redirect('/user'))
			.catch(() => res.send(response('Something went wrong')));
	}
	
	return res.send(response('Missing parameters'));
});


router.get('/user', (req, res) =>{
	res.sendFile(path.resolve('views/user.html'));
})


module.exports = database => { 
	db = database;
	return router;
};