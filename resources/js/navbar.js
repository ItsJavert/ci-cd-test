var socket = io();

$(document).ready(function() {
    $("#esn-logout").click(function() {
        $.ajax("/users/logout", {
            data: window.localStorage.getItem("token"),
            method: "POST",
            contentType: "application/json",
        }).done(function(data) {
            if (data["error_text"]) {
                alert(data["error_text"]);
            } else {
                window.localStorage.clear("token");
                socket.emit("notifyOffline", window.localStorage.getItem("username"));
                window.localStorage.clear("username");
                var currentURL = window.location.origin;
                window.location.href = currentURL;
            }
        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR);
        });
    });
});