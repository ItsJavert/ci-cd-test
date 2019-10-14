$(document).ready(function() {
    // JavaScript here executes after the DOM has fully loaded
    var data= window.localStorage.getItem("temp_token");
    var parsed=JSON.parse(data);
    if(parsed["msg"]=="Register"){
        $("#acknowledgementModal").modal({ backdrop: "static", keyboard: false });
      $("#acknowledgementModal").modal('show');  
    }else{
        $("#acknowledgementModal").modal('hide');
    }
    $("#yes").attr("disabled", true);
});

/* click "Proceed" and pass token to server */
$(document).on('click', "#yes", function(e) {
    $.ajax("/users/register/2", {
        data: window.localStorage.getItem("temp_token"),
        method: "POST",
        contentType: "application/json",
    }).done(function(data) {
        if (data["error_text"]) {
            alert(data["error_text"]);
        } else {
            // storage the long-term token. 
            // TODO should also add this at login
            var token = data;
            window.localStorage.setItem("token", JSON.stringify(token));
            $("#errorMsg").text(data["error_text"]);
            $("#errorModal").modal('show');

        }
    }).fail(function(jqXHR, textStatus) {
        console.log(jqXHR);
    });
    $("#acknowledgementModal").modal('hide');
});

/* click "cancel" and go back to the register page */
$(document).on('click', "#no", function(e) {
    $("#acknowledgementModal").modal('hide');
    window.history.back(-1);
});


/* click the checkbox and able "Proceed" button */
$("#check").change(function() {
    var $btnAbled = $("#check").prop('checked');
    if ($btnAbled) {
        $("#yes").attr("disabled", false);
    }
    if ($btnAbled == false) {
        $("#yes").attr("disabled", true);
    }
});