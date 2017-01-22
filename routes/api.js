var express = require('express');
var router = express.Router();
var request = require('request')
// load the env vars
require('dotenv').load();


router.post('/api/email', function (req, res, next) {
	var data = req.body
	if ((data.recaptcha == null) || !data.recaptcha) {
		return res.status(401).json({error: 'not authorized'})
	}
	
	var verifyCaptcha = {
		secret: process.env.RECAPTCHA_KEY,
		response: data.recaptcha,
	}

	request.post(
		{
			url:'https://www.google.com/recaptcha/api/siteverify', 
			form: verifyCaptcha
		}, 
		function (err, captchaResponse, captchaBody) {
			try	{
				captchaBody = JSON.parse(captchaBody)
			} catch(catchErr) {
				res.status(500).json({error: 'internal server error'})
			}
			if (err || !captchaBody.success) {
				return res.status(401).json({error: 'not authorized'})
			}
			res.json({email: 'test'})
	})

	

})

module.exports = router;
