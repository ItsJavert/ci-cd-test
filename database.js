const mongoose = require('mongoose');
const settings = require('./settings.json');
const Schema = mongoose.Schema;

var connected = false;

//connect to database
mongoose.connect(settings["database_url"], { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) {
        console.log("There was an error connecting to the database: " + err);
    } else {
        console.log("Successfully connected to the remote database");
        connected = true;
    }
});

//message schema
const MessageSchema = new Schema({
    author: String,
    message: String,
    status: String,
    time: String,
}, {
    timestamps: true
});
const MessageModel = mongoose.model('messages', MessageSchema, 'messages');

function store_message(author, message, status, time) {
    var potential_message = new MessageModel({
        author: author,
        message: message,
        status: status,
        time: time
    });

    potential_message.save(function(err) {
        if (err) {
            console.log("There was an error saving this message");
        } else {
            console.log("The message was successfully saved to the DB.");
        }
    });
}

// order by time from new to old
function find_all_messages() {
    return MessageModel.find({}).sort({ 'time': -1 }).limit(20).exec();
}

function find_online_users() {
    return UserModel.find({
            online: true
        })
        .collation({ locale: "en" })
        .sort({ username: 'asc' })
        .exec();
}

function find_offline_users() {
    return UserModel.find({
            online: false
        })
        .collation({ locale: "en" })
        .sort({ username: 'asc' })
        .exec();
}


//user schema
const UserSchema = new Schema({
    username: String,
    password: String,
    status: String,
    online: Boolean,
    salt: String // used to salt hash password. generate randomly
});

const UserModel = mongoose.model('users', UserSchema, 'users');

function print_settings() {
    console.log(settings["database_name"]);
}

// Save a user to database
function store_user(username, password, salt) {
    var potential_user = new UserModel({
        username: username,
        password: password,
        status: "OK",
        online: true,
        salt: salt
    });

    potential_user.save(function(err) {
        if (err) {
            console.log("There was an error saving this user");
        } else {
            console.log("The user was successfully saved to the DB.");
        }
    })
}

function find_user_by_name(username) {
    return UserModel.findOne({
        username: username
    }).exec();
}

function mark_online(username) {
    var user = UserModel.updateOne({ username: username }, { online: true }).exec();
    if (user) {
        return true;
    }
    return false;
}

function mark_offline(username) {
    var user = UserModel.updateOne({ username: username }, { online: false }).exec();
    if (user) {
        return true;
    }
    return false;
}

module.exports = {
    connected,
    print_settings,
    store_user,
    find_user_by_name,
    store_message,
    find_all_messages,
    find_online_users,
    find_offline_users,
    mark_online,
    mark_offline
};