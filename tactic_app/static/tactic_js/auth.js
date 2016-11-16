/**
 * Created by bls910 on 9/4/15.
 */


$('.submitter-field').keypress(function(e) {
    if (e.which == 13) {
        submit_login_info();
        e.preventDefault();
    }
});

function submit_login_info() {
    var data = {};
    data.username = $("#username").val();
    data.password = $("#password").val();
    data.remember_me = $("#remember_me")[0].checked;

    $.ajax({
        url: $SCRIPT_ROOT + "/attempt_login",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(data),
        dataType: 'json',
        success: return_from_submit_login
    });
}

function attempt_open_register() {
    $.getJSON($SCRIPT_ROOT + '/check_if_admin', function(data){
        if (data.is_admin) {
            window.open($SCRIPT_ROOT + "/register")
        }
        else {
        doFlash({"message": "You aren't authorized. Email bsherin@northwestern.edu to request a new account.", "alert_type": "alert-info"})
        }
    });
}

function return_from_submit_login(data) {
    if (data.logged_in) {
         window.open($SCRIPT_ROOT + "/user_manage", "_self")
    }
    else {
        doFlash({"message": "Login Failed", "alert_type": "alert-warning"})
    }
}

function submit_account_info() {
    var pwd = $("#password").val();
    var pwd2 = $("#password2").val();
    var data = {};
    if (pwd != "") {
        if (pwd != pwd2) {
            doFlash({"message": "Passwords don't match", "alert_type": "alert-warning"});
            $("#password").val("");
            $("#password2").val("");
            return
        }
        data.password = pwd
    }
    $(".info-field").each(function () {
        data[$(this).attr("id")] = $(this).val()
    });

    $.ajax({
        url: $SCRIPT_ROOT + "/update_account_info",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (result) {
            if (result.success) {
                doFlash({"message": "Account successfully updated", "alert_type": "alert-success"});
            }
            else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        }
    })
}

function submit_register_info() {
    var data = {};
    data.username = $("#username").val();
    var pwd = $("#password").val();
    var pwd2 = $("#password2").val();
    if (pwd != pwd2) {
        $("#message-area").html("passwords don't match");
        $("#password").val("");
        $("#password2").val("");
        return
    }
    data.password = $("#password").val();

    $.ajax({
        url: $SCRIPT_ROOT + "/attempt_register",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(data),
        dataType: 'json',
        success: return_from_submit_register
    });
}

function return_from_submit_register(data) {
    if (data.success) {
         window.open($SCRIPT_ROOT + "/login_after_register", "_self")
    }
    else {
        data.alert_type = "alert-warning";
        doFlash(data);
    }
}

function doSignOut(page_id) {
    window.open($SCRIPT_ROOT + "/logout/" + page_id, "_self");
    return (false)
}