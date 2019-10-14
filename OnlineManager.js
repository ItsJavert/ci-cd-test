var online_users = [];



function add_user(username, status){
    online_users.push({
        username, 
        status
    });
}

function get_users(){
    return online_users;
}

module.exports = {
    add_user,
    get_users
}