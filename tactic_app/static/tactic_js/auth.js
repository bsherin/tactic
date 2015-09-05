/**
 * Created by bls910 on 9/4/15.
 */



function submit_login_info() {
    var data = {}
    data.username = $("#username").val()
    data.password = $("#password").val()

    $.ajax({
        url: $SCRIPT_ROOT + "/attempt_login",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(data),
        dataType: 'json',
        success: return_from_submit
    });
}

function return_from_submit(data, extStatus, jqXHR) {
    if (data.logged_in == "yes") {
         window.open($SCRIPT_ROOT + "/user_manage", "_self")
    }
    else {
        $("#message-area").html("Login Failed")
    }
}

function doSignOut() {
    window.open($SCRIPT_ROOT + "/logout", "_self")
    return (false)
}