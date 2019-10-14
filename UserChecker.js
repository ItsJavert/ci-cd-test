const banned = require('./banned_names.json');

class UserChecker {
    // minimum length of username and password
    constructor(minimum_name, minimum_pass) {
        this.minimum_name = minimum_name;
        this.minimum_pass = minimum_pass;
    }

    meets_minimum(username, password) {
        if (username.length >= this.minimum_name) {
            if (password.length >= this.minimum_pass) {
                return true;
            }
        }
        return false;
    }

    not_banned_name(word) {
        word = word.toLowerCase();
        if (banned['banned_names'].indexOf(word) == -1) {
            return true;
        }
        return false;
    }

}

module.exports = UserChecker;