var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api/email', function(req, res, next) {
  res.json({ title: 'Express' });
});

router.post('/api/email', function (req, res, next) {
	console.log('req.body =', req.body)
	var data = req.body
	if ((data.recaptcha == null) || !data.recaptcha) {
		return res.status(401).json({error: 'not authorized'})
	}
	res.json({email: 'test'})
})

module.exports = router;
