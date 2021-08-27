
import {doFlash} from "./toaster.js"
import io from 'socket.io-client';

export {TacticSocket}

class TacticSocket {

    constructor (name_space, retry_interval, extra_args=null) {

        this.name_space = name_space;
        this.recInterval = null;
        this.retry_interval = retry_interval;
        this.extra_args = extra_args;
        this.connectme();
        this.initialize_socket_stuff();
        this.watchForDisconnect();
        this.counter = null;
    }

    connectme() {
        var protocol = window.location.protocol;
        this.socket = io.connect(`${protocol}//${document.domain}:${location.port}/${this.name_space}`);
        this.counter = 0;
    }

    initialize_socket_stuff(reconnect=false) {}

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
            this.counter += 1;
            this.initialize_socket_stuff(true);
            this.watchForDisconnect();
            doFlash({"message": "reconnected to server"})
        }
        else {
            this.connectme()
        }
    }
}