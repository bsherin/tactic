/**
 * Created by bls910 on 7/18/15.
 */


var mousetrap = new Mousetrap();
var user_manage_id = guid();

mousetrap.bind("esc", function() {
    clearStatusArea();
    clearStatusMessage();
});

var res_types = ["list", "collection", "project", "tile"];
var resource_managers = {};

function start_post_load() {
    if (use_ssl) {
        socket = io.connect('https://'+ document.domain + ':' + location.port  + '/user_manage');
    }
    else {
        socket = io.connect('http://'+document.domain + ':' + location.port  + '/user_manage');
    }

    socket.emit('join', {"user_id":  user_id, "user_manage_id":  user_manage_id});

    socket.on('stop-spinner', function () {
        stopSpinner()
    });

    socket.on('start-spinner', function () {
        startSpinner()
    });

    socket.on('show-status-msg', function (data){
        statusMessage(data)
    });

    socket.on("clear-status-msg", function (data){
       clearStatusMessage()
    });

    
    socket.on('doflash', doFlash);
    $("#clear-user-containers-button").bind("click", clearUserContainers);

}

function clearUserContainers() {
    $.getJSON($SCRIPT_ROOT + '/clear_user_containers', doFlash)
}


function startSpinner() {
    $("#spinner").css("display", "inline-block")
}

function stopSpinner() {
    $("#spinner").css("display", "none")
}
