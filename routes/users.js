var express = require('express');
var router = express.Router();
var ESN_DB = require('../database.js');
var UserChecker = require('../UserChecker.js');
var jwt = require('jsonwebtoken');
var encryption = require('../encryption.js');
const settings = require('../settings.json');
var error_codes = require('../error_codes.json');
var crypto = require('crypto');
var jwt_secret = settings['jwt_secret'];
var OnlineManager = require('../OnlineManager');

/* GET online users. */
router.get('/online', function (req, res, next) {
  var retval = [];
  ESN_DB.find_online_users().then(function (doc) {
    console.log(doc);
    doc.forEach(function(user){
      retval.push({"username": user["username"], "status":user["status"]});
    });
    
    res.send(retval);
  });
});

/* GET offline users. */
router.get('/offline', function (req, res, next) {
  var retval = [];
  ESN_DB.find_offline_users().then(function (doc) {
    doc.forEach(function(user){
      retval.push({"username": user["username"], "status":user["status"]});
    });
    res.send(retval);
  });
});

router.post('/register', (req, res, next) => {
  var payload = req.body;
  console.log(payload);
  res.send("Received");
});

// validate username and password
router.post('/register/1', (req, res, next) => {
  var payload = req.body;
  var username = payload['username'];
  var password = payload['password'];
  console.log(payload);
  var checker = new UserChecker(3, 4);
  if (!checker.meets_minimum(username, password)) {
    res.send({
      error_code: "LENGTH_ERROR",
      error_text: error_codes["LENGTH_ERROR"]
    });
    return;
  }
  else if (!checker.not_banned_name(username)) {
    res.send({
      error_code: "NAME_ERROR",
      error_text: error_codes["NAME_ERROR"]
    });
    return;
  }
  else {
    ESN_DB.find_user_by_name(username).then(function (doc) {
      console.log(doc);
      // if username doesn't exist, send web token to front end
      var retval;
      if (doc == null) {
        var token = jwt.sign({
          username: username,
          password: password
        }, jwt_secret, {
          algorithm: "HS256",
          subject: username,
          expiresIn: "10m"
        });
        retval = {
          "token": token,
          "msg": "Register"
        };
        console.log(retval);
        res.send(retval);
      } else {
        // if username does exist, and password matches, no error.
        // if username does exist, and password doesn't match, send password error.
        if (encryption.compare_password(password, doc['password'], doc['salt'])) {
          var userToken = jwt.sign({
            username: username,
            password: password
          }, jwt_secret, {
            algorithm: "HS256",
            subject: username,
            expiresIn: "2hr"
          });
          var retval = {
            "token": userToken,
            "msg": "Login"
          }
          console.log(retval);
          ESN_DB.mark_online(username);
          //OnlineManager.add_user(username, "OK");
          res.send(retval);
        } else {
          res.send({
            error_code: "PASSWORD_ERROR",
            error_text: error_codes["PASSWORD_ERROR"]
          });
          return;
        }
        //res.send({error: "A user with this name already exists."})
        //res.send({error_text: "Successful Login"});
      }
    })
  }
});

// create user
router.post('/register/2', (req, res, next) => {
  var payload = req.body;
  var token = payload["token"];
  jwt.verify(token, jwt_secret, function (err, decoded) {
    if (err) {
      res.send({
        error_code: "AGREEMENT_ERROR",
        error_text: error_codes["AGREEMENT_ERROR"]
      })
    } else {
      var salt = crypto.randomBytes(16).toString('hex');// has to use toString. otherwise it's not url save
      var salted_password = encryption.salt_hash_password(decoded['password'], salt);
      ESN_DB.store_user(decoded['username'], salted_password, salt);
      console.log("username:" + decoded['username'] + "\nplain password:" + decoded['password'] + "\nsalted password:" + salted_password + "\nsalt:" + salt);
      var userToken = jwt.sign({
      }, jwt_secret, {
        algorithm: "HS256",
        subject: decoded['username'],
        expiresIn: "2hr"
      });
      res.send({ token: userToken });
    }
  })
});


router.get('/logout', (req, res, next)=>{
  res.redirect("/");
});

router.post('/logout', (req, res, next)=>{
  var payload = req.body;
  var token = payload["token"];
  jwt.verify(token, jwt_secret, function (err, decoded) {
    if(err){
      res.send({
        error_code: "TOKEN_ERROR",
        error_text: error_codes["TOKEN_ERROR"]
      });
    }else{
      ESN_DB.mark_offline(decoded["username"]);
      res.send({});
    }
  });
});

/*
router.post('/logout', (req, res, next) => {
  var payload = req.body;
  var token = payload["token"];
  jwt.verify(token, jwt_secret, function (err, decoded) {
    if (err) {
      res.send({
        error_code: "TOKEN_ERROR",
        error_text: error_codes["TOKEN_ERROR"]
      })
    } else {
      jwtr.destroy(token);
      res.send("Successful Logout");
    }
  })
});
*/
module.exports = router;