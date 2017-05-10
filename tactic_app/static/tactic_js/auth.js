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
    const data = {};
    data.username = $("#username").val();
    data.password = $("#password").val();
    data.remember_me = $("#remember_me")[0].checked;
    postAjax("attempt_login", data, return_from_submit_login)
}

function attempt_open_register() {
    /**
     * @param {{is_admin:boolean}} data
     */
    $.getJSON($SCRIPT_ROOT + '/check_if_admin', function(data){
        if (data.is_admin) {
            window.open($SCRIPT_ROOT + "/register")
        }
        else {
        doFlash({"message": "You aren't authorized. Email bsherin@northwestern.edu to request a new account.", "alert_type": "alert-info"})
        }
    });
}

/**
 * @param {{logged_in:boolean}} data
 */
function return_from_submit_login(data) {
    if (data.logged_in) {
         window.open($SCRIPT_ROOT + "/user_manage", "_self")
    }
    else {
        doFlash({"message": "Login Failed", "alert_type": "alert-warning"})
    }
}

function submit_account_info() {
    const pwd = $("#password").val();
    const pwd2 = $("#password2").val();
    const data = {};
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
    postAjax("update_account_info", data, function (result) {
            if (result.success) {
                doFlash({"message": "Account successfully updated", "alert_type": "alert-success"});
            }
            else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
    })
}

function submit_register_info() {
    const data = {};
    data.username = $("#username").val();
    const pwd = $("#password").val();
    const pwd2 = $("#password2").val();
    if (pwd != pwd2) {
        $("#message-area").html("passwords don't match");
        $("#password").val("");
        $("#password2").val("");
        return
    }
    data.password = $("#password").val();

    postAjax("attempt_register", data, return_from_submit_register);
}

function submit_duplicate_info() {
    const data = {};
    data.username = $("#username").val();
    data.old_username = $("#old_username").val();
    const pwd = $("#password").val();
    const pwd2 = $("#password2").val();
    if (pwd != pwd2) {
        $("#message-area").html("passwords don't match");
        $("#password").val("");
        $("#password2").val("");
        return
    }
    data.password = $("#password").val();

    postAjax("attempt_duplicate", data, doFlash);
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
