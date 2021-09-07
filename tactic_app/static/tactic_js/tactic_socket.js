
import {doFlash} from "./toaster.js"
import io from 'socket.io-client';

export {TacticSocket}

class TacticSocket {

    constructor (name_space, retry_interval, extra_args=null) {

        this.name_space = name_space;
        this.recInterval = null;
        this.retry_interval = retry_interval;
        this.extra_args = extra_args;
        this.listeners = {};
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

    // We have to careful to get the very same instance of the listerner function
     // That requires storing it outside of this component since the console can be unmounted
    attachListener(event, newListener) {
        if  (event in this.listeners) {
             this.socket.off(event, this.listeners[event]);
         }
        this.socket.on(event, newListener);
        this.listeners[event] = newListener
    }

    disconnect() {
        this.stopListening();
        this.socket.disconnect();
    }

    stopListening() {
        for (let event in this.listeners) {
            this.socket.off(event, this.listeners[event])
        }
    }

    restoreListeners() {
        for (let event in this.listeners) {
            this.attachListener(event, this.listeners[event])
        }
    }

    watchForDisconnect() {
        let self = this;
        this.attachListener("disconnect", function () {
            doFlash({"message": "lost server connection", timeout: null, "is_disconnect_message": true});
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
            this.restoreListeners();
            // this.watchForDisconnect();
            doFlash({"message": "reconnected to server", timeout: null, "is_reconnect_message": true})
        }
        else {
            this.connectme()
        }
    }
}