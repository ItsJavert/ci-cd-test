var express = require('express');
var router = express.Router();
var ESN_DB = require('../database.js');

var app = require('../app');
var jwt = require('jsonwebtoken');
const settings = require('../settings.json');
var jwt_secret = settings['jwt_secret'];
//var io = app.get("io");

/* io.on('connection', () => {
    console.log('a user is connected');
}); */



//get messages
router.get('/getMessages', (req, res, next) => {
    ESN_DB.find_all_messages().then(function(doc) {
        console.log(doc);
        res.send(doc);
    });
});

//send message
router.post('/messages', (req, res, next) => {
    var chatbody = req.body;
    var author = chatbody['author'];
    var message = chatbody['message'];
    var token = chatbody['token'];
    var status = chatbody['status'];
    var time = chatbody['time'];
    //user validation
    jwt.verify(token, jwt_secret, function(err, decoded) {
        if (err) {
            console.log("please log in")
            res.send({ error: "Please log in" });
        } else {
            res.sendStatus(200);
            /* io.on('connection',()=>{
                io.emit('message', message);

            }); */


            // ESN_DB.store_message(author, message, status);
            ESN_DB.store_message(author, message, status, time)
                //io.sockets.emit('message', chatbody);
        }
    })
});

module.exports = router;