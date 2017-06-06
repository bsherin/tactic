/**
 * Created by bls910 on 7/18/15.ss
 */

const mousetrap = new Mousetrap();
const user_manage_id = guid();
const page_id = user_manage_id;


function start_post_load() {
    let socket;
    if (use_ssl) {
        socket = io.connect(`https://${document.domain}:${location.port}/user_manage`);
    }
    else {
        socket = io.connect(`http://${document.domain}:${location.port}/user_manage`);
    }

    socket.emit('join', {"user_id":  user_id, "user_manage_id":  user_manage_id});

    socket.on("window-load", function(data) {
        x = window.open();
        x.document.write(data.the_html);
    });
    socket.on('stop-spinner', stopSpinner);
    socket.on('start-spinner', startSpinner);
    socket.on('show-status-msg', statusMessage);
    socket.on("clear-status-msg", clearStatusMessage);
    socket.on('close-user-windows', (data) => {
        if (!(data["originator"] == user_manage_id)) {
            window.close()
        }
    });
    socket.on('doflash', doFlash);

    ddata["user_manage_id"] = user_manage_id;
    postWithCallbackNoMain("host", task, ddata)
}
