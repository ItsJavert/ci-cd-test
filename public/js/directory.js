var directory_template = 
'<tr>'+
'<td class="align-middle">[USERNAME]</td>'+
'<td class="align-middle">[STATUS]</td>'+
'<td class="align-middle"><span class="online-status [ONLINE]">•</span>'+
'</td>'+
'</tr>';

function add_online_user(user, prepend){
    var current = directory_template;
    current = current.replace("[USERNAME]", user['username']);
    current = current.replace("[STATUS]", user['status']);
    current = current.replace("[ONLINE]", "text-success");
    $('#directoryBody').append(current);
}

function add_offline_user(user, prepend){
    var current = directory_template;
    current = current.replace("[USERNAME]", user['username']);
    current = current.replace("[STATUS]", user['status']);
    current = current.replace("[ONLINE]", "text-danger");
    $('#directoryBody').append(current);
}

var socket = io();

socket.on("notifiedOnline", function(user){
    add_online_user(user);
});

socket.on("notifiedOffline", function(user){
    var selector = `$('tr:has(td:contains(${user[username]}))')`;
    $(selector).empty();
    add_offline_user(username);
});


$(document).ready(function(){
    $.get('/users/online', function(data){
        console.log(data);
        data.forEach(add_online_user);
        $.get('/users/offline', function(data){
            console.log(data)
            data.forEach(add_offline_user);
        });
    });
    //socket.emit("notifyOnline", window.localStorage.getItem("username"));
});