var socket = io();
socket.on('message', function(data) {
    //console.log("socket on msg: ", data)
    addMessages(data)
});

$(document).ready(function() {
    // JavaScript here executes after the DOM has fully loaded
    getMessages();
});

/* click send message and pass token and message to server */
$(document).on('click', "#send_message", function(e) {
    // TODO currently just send random status to backend
    var status = "";
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            status = "OK";
            break;
        case 1:
            status = "Help";
            break;
        case 2:
            status = "Emergency";
            break;
    }
    // get current time
    var now = Date.now()
    var msgDate = new Date(now);
    dateString = msgDate.toDateString();
    var twelveHour = 'AM';
    var hour = msgDate.getHours();
    if (hour >= 12) {
        twelveHour = 'PM'
        if (hour > 12) {
            hour -= 12
        }
    }
    let minutes = `${msgDate.getMinutes()}`;
    minutes = minutes.padStart(2, '0');
    dateString += ' | ' + `${hour}:${minutes} ${twelveHour}`;
    //send a message
    $.ajax("/chat/messages", {
        data: JSON.stringify({ token: JSON.parse(window.localStorage.getItem("token"))["token"], author: window.localStorage.getItem("username"), message: $('#message').val(), status: status, time: dateString }),
        method: "POST",
        contentType: "application/json",
    }).done(function(data) {
        if (data["error_text"]) {
            alert(data["error_text"]);
        }
    }).fail(function(jqXHR, textStatus) {
        console.log(jqXHR);
    });

    //send message to socket
    var msg = { "token": JSON.parse(window.localStorage.getItem("token"))["token"], "author": window.localStorage.getItem("username"), "message": $('#message').val(), "status": status, "time": dateString };
    socket.emit('sendMsg', msg);

    $('#message').val('')

});

//get all messages when page loaded
function getMessages() {
    $.get('/chat/getMessages', (data) => {
        var obj = JSON.parse(JSON.stringify(data));
        obj.reverse();
        obj.forEach(addMessages);
    });
}

// append a new message to html
function addMessages(message) {
    //console.log("add a message: ", message)

    var username = window.localStorage.getItem("username"); // this username is stored at join community page
    if (message["author"] != username) {
        $(".msg_history").append(`<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg"><span class="time_date">${message["author"]} | ${message["time"]} | <img src=${getImgByStatus(message["status"])} alt="Avatar" class="status_chat"></span><p>${message["message"]}</p></div></div></div>`)
    } else {
        $(".msg_history").append(`<div class="outgoing_msg"><div class="sent_msg"><span class="time_date">${message["author"]} | ${message["time"]} | <img src=${getImgByStatus(message["status"])} alt="Avatar" class="status_chat"></span><p>${message["message"]}</p></div></div>`)
    }
    $('#msg_history').scrollTop(1000000);
}

function getImgByStatus(status) {
    switch (status) {
        case "OK":
            return "./images/OK.png";
        case "Help":
            return "./images/Help.png";
        case "Emergency":
            return "./images/Emergency.png";
        case "Undefined":
            return "./images/Undefined.png";
        default:
            return "";
    }
}