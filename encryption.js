const settings = require('./settings.json');
var crypto = require('crypto');

// salt a password using sha512
var sha512 = function (password, salt) {
    var hmac = crypto.createHmac("sha512", salt);
    hmac.update(password);
    var value = hmac.digest("hex");
    return {
        salt: salt, // we don't need this currently
        cipher_password: value
    };
};

// hash a plain password into a cipher(or salt) password
function salt_hash_password(plain_password, salt) {
    var password_data = sha512(plain_password, salt);
    return password_data.cipher_password;
}

// compare whether a plain password and a cipher password is equal. If equal, return true.
function compare_password(plain_password, cipher_password, salt) {
    var salted_plain_password = salt_hash_password(plain_password, salt);
    console.log("plain password: " + plain_password + "\nsalted password:" + salted_plain_password + "\ntrue password: " + cipher_password + "\nsalt: " + salt);
    if (salted_plain_password == cipher_password) {
        return true;
    }
    return false;
}

module.exports = {
    salt_hash_password,
    compare_password
};