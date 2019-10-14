var jwt = require('jsonwebtoken');
const settings = require('./settings.json');
var encryption = require('./encryption.js');
var crypto = require('crypto');

/************ Start testing jwt ************/
var jwt_secret = settings['jwt_secret'];
var token = jwt.sign({}, jwt_secret, {
    algorithm: "HS256",
    subject: "test",
    expiresIn: "1m"
});
//var sampleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1Njg1NzU2NzMsImV4cCI6MTU2ODU3NTczMywic3ViIjoidGVzdCJ9.LG-sEGIWKpipSVGlz4ePjInfbpPkYsdobKhvmQsZ08M";

jwt.verify(token, jwt_secret, function (err, decoded) {
    if (err) {
        console.log(err);
    } else {
        console.log(decoded);
    }
});
/************ End testing jwt ************/

/************ Start testing the salt functions ************/
var username = "test_username";
var plain_password = "test_password";
var test_salt = crypto.randomBytes(16).toString("hex");
var cipher_password = encryption.salt_hash_password(plain_password, test_salt);
if (encryption.compare_password("test_password", cipher_password, test_salt)) {
    console.log("password correct!");
} else {
    console.log("password wrong!");
}
/************End testing the salt functions************/