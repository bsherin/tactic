/**
 * Created by bls910 on 7/18/15.ss
 */

const library_id = guid();
const page_id = library_id;


function start_post_load() {
    var protocol = window.location.protocol;
    let socket = io.connect(`${protocol}//${document.domain}:${location.port}/library`);

    socket.emit('join', {"user_id":  user_id, "library_id":  library_id});

    socket.on("window-load", function(data) {
        x = window.open();
        x.document.write(data.the_html);
    });
    socket.on('stop-spinner', stopSpinner);
    socket.on('start-spinner', startSpinner);
    socket.on('show-status-msg', statusMessage);
    socket.on("clear-status-msg", clearStatusMessage);
    socket.on('close-user-windows', (data) => {
        if (!(data["originator"] == library_id)) {
            window.close()
        }
    });
    socket.on('doflash', doFlash);

    ddata["library_id"] = library_id;
    postWithCallbackNoMain("host", task, ddata)
}
