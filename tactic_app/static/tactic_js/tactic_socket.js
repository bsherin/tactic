
import {doFlash} from "./toaster.js"

export {TacticSocket}

class TacticSocket {

    constructor (name_space, retry_interval) {

        this.name_space = name_space;
        this.recInterval = null;
        this.retry_interval = retry_interval;
        this.connectme();
        this.initialize_socket_stuff();
        this.watchForDisconnect();
    }

    connectme() {
        var protocol = window.location.protocol;
        // this.socket = io.connect(`${protocol}//${document.domain}:${location.port}/${this.name_space}`);
        this.socket = io(`/${this.name_space}`)
    }

    initialize_socket_stuff() {}

    watchForDisconnect() {
        let self = this;
        this.socket.on("disconnect", function () {
            doFlash({"message": "lost server connection"});
            self.socket.close();
            self.recInterval = setInterval(function () {
                self.attemptReconnect();
            }, self.retry_interval)
        });
    }
    attemptReconnect() {
        if (this.socket.connected) {
            clearInterval(this.recInterval);
            this.initialize_socket_stuff();
            this.watchForDisconnect();
            doFlash({"message": "reconnected to server"})
        }
        else {
            this.connectme()
        }
    }
}