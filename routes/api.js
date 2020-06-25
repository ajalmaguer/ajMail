var express = require('express');
var router = express.Router();
var request = require('request')

var api_key = process.env.MAILGUN_KEY;
var domain = 'terminalem.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});


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
			var msg = {
			  from: 'Terminal Website <noreply@terminalem.com>',
			  to: [process.env.TO_EMAIL],
			  bcc: [process.env.BCC_EMAIL],
			  subject: 'From terminalem.com: ' + data.subject,
			  text: 'Name: ' +  data.name
			  		+ '\n\nEmail: ' + data.email 
			  		+ '\n\nMessage: \n\n' + data.message
			};
			mailgun.messages().send(msg, function (error, body) {
			  console.log(body);
			});
			
	})

	

})

module.exports = router;
