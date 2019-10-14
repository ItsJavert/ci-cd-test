$(function() {

    /*  var socket = io({ "timeout": 5000, "connect timeout": 5000 });
     //check for connectiona
     if (socket !== undefined) {
         console.log("connect to socket");
     }

     io.on('new-message', data => {
         //console.log(data);
         console.log("msg");
     });  */

    //var socket=io.connect();
    var socketID;
    var $userFormReg = $('#userFormReg');
    var $UsernameLogin = $('#UsernameLogin');
    var $Username = $('#Username');
    var $Password = $('#Password');
    var $userFormLogin = $('#userFormLogin');
    var $initialState = $('#initialState');

    console.log($userFormReg);
    /*  $userFormReg.submit(function (e) {
         e.preventDefault();
         $userFormLogin.hide();
         $userFormReg.hide();
         $initialState.hide();
         console.log($Username.val());
         console.log($Password.val());
         $.ajax("/users/register/1", {
             data: JSON.stringify({ username: $Username.val(), password: $Password.val() }),
             method: "POST",
             contentType: "application/json",
         }).done(function (data) {
             data["error"] = "Test Error Message"
             if (data["error"]) {
                 //if there is an error,pass error msg to errorModal 
                 $("#errorMsg").text(data["error"]);
                 $("#errorModal").modal('show');
             }
             else {
                 var temp_token = data;
                 window.localStorage.setItem("temp_token", JSON.stringify(temp_token));
                 //redirect to home page
                 var currentURL = window.location;
                 window.location.href = currentURL + "home";
 
             }
 
         }).fail(function (jqXHR, textStatus) {
             console.log(jqXHR); 
 var $userFormReg = $('#userFormReg');
 var $UsernameLogin = $('#UsernameLogin');
 var $Username = $('#Username');
 var $Password = $('#Password');
 var $userFormLogin = $('#userFormLogin');
 var $initialState = $('#initialState');

 console.log($userFormReg); */
    $userFormReg.submit(function(e) {
        window.localStorage.setItem("username", $Username.val()); // used to determine current user when chatting
        e.preventDefault();
        $.ajax("/users/register/1", {
            data: JSON.stringify({ username: $Username.val(), password: $Password.val() }),
            method: "POST",
            contentType: "application/json",
        }).done(function(data) {
            if (data["error_text"]) {
                // error or login go here
                $("#errorMsg").text(data["error_text"]);
                $("#errorModal").modal('show');
                // TODO if login, window.localStorage.setItem("token", JSON.stringify(token));
            } else {
                // register goes here
                var temp_token = data;
                if (data["msg"] == "Register") {
                    window.localStorage.setItem("temp_token", JSON.stringify(temp_token));
                    //redirect
                    var currentURL = window.location.origin;
                    window.location.href = currentURL + "/home";
                }
                if (data["msg"] == "Login") {
                    var real_token = data;
                    window.localStorage.setItem("token", JSON.stringify(real_token));
                    var currentURL = window.location.origin;
                    window.location.href = currentURL + "/directory";
                }
            }
        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR);
        });
        $Username.val('');
        $Password.val('');
    });
    // $userFormLogin.submit(function(e){
    //     e.preventDefault();
    //     $userFormLogin.hide();
    //     $userFormReg.hide();
    //     $initialState.hide();
    //     //socket.emit('new user login',$UsernameLogin.val());
    //     $UsernameLogin.val('');
    // });

    // $logoutbtn.submit(function(e){
    //         socket.emit('disconnect','');  
    //         $panelFooter.hide();
    //         $chatBody.hide();
    // });

    /*
    socket.on('connect',() =>{
        socketID=socket.id;
    });
    
    socket.on('disconnect user', function(data){
        if(data){
            $chatBody.append('<h6>' +data+ ' has left the chat </h6>');  
        }
    });
    
    socket.on('new message',function(data){
            $chatBody.append('<div class="well"><strong>'+ data.Username + '</strong> <small>'+ data.DateTime +'</small><p>'+ data.Message +'</p></div>');
    });
    
    socket.on('chat history',function(data){
        for(var i=0;i<data.length;i++){
            $chatBody.append('<div class="well"><strong>'+ data[i].Username + '</strong> <small>'+ data[i].DateTime +'</small><p>'+ data[i].Message +'</p></div>');
        } 
        $chatBody.append('<h6>You have joined the chat </h6>');
        $chatBody.show();
        $panelFooter.show();
    });
    
    socket.on('get users', function(data){
        $chatBody.append('<h6>' +data+ ' has joined the chat </h6>');
    });
    
    socket.on('invalid login user', function(data){
        $chatBody.show();
       $chatBody.append('<h6>User Does Not Exists, Please Refresh the page and Register</h6>'); 
    });
    
        socket.on('invalid register user', function(data){
        $chatBody.show();
       $chatBody.append('<h6>User Exists, Please Refresh the page and Login</h6>'); 
    });
    */
});

$(document).on('click', "#errorClose", function(e) {

    $("#errorModal").modal('hide');
});