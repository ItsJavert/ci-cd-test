var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const settings = require('../settings.json');
var jwt_secret = settings['jwt_secret'];
var io = require('socket.io');

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login.njk');
});


/* GET favicon . */
router.get('/favicon.ico', function(req, res, next) {
    res.status(204);
});

/* GET home page. */
router.get('/home', function(req, res, next) {
    res.render('main.njk');
});

/* GET chat public wall page. */
router.get('/public_wall', function(req, res, next) {
    res.render('chat_publicly.njk');
});

router.get('/directory', function (req, res, next) {
  res.render('directory.njk');
});


// router.get('/new_login', function (req, res, next) {
//   res.render('new_login.njk');
// });

module.exports = router;