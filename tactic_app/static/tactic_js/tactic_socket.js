
import {doFlash} from "./toaster.js"
import io from 'socket.io-client';
import { Manager } from 'socket.io-client';

export {TacticSocket}

class TacticSocket {

    constructor (name_space, retry_interval, main_id=null, on_initial_join=null) {

        this.name_space = name_space;
        this.recInterval = null;
        this.retry_interval = retry_interval;
        this.main_id = main_id;
        this.listeners = {};
        this.connectme();
        this.join_rooms(false, on_initial_join);
        this.watchForDisconnect();
        this.counter = null;
    }

    connectme() {
        var protocol = window.location.protocol;
        this.manager = new Manager(`${protocol}//${document.domain}:${location.port}`, {
            reconnectionDelayMax: 10000
        });
        this.socket = this.manager.socket(`/${this.name_space}`);

        // this.socket = io(`${protocol}//${document.domain}:${location.port}/${this.name_space}`, {
        //     reconnectionDelayMax: 10000
        // });
        this.counter = 0;
    }

    join_rooms(reconnect=false, on_join=null) {
        this.socket.emit('join', {"room": window.user_id});
        if (this.main_id) {
            if (on_join) {
                this.socket.emit('join', {
                    "room": this.main_id,
                    "user_id": window.user_id,
                    "return_tile_types": true
                    }, on_join);
            } else {
                this.socket.emit('join', {"room": this.main_id, "return_tile_types": false});
            }
        }
    }

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
        this.socket.on("reconnect", ()=>{
            doFlash({"message": "reconnected automatically", timeout: null, "is_reconnect_message": true})
        });
        this.attachListener("disconnect", (reason)=>{
            if (reason == "io client disconnect") return;
            console.log("disconnected for reason " + reason);
            doFlash({"message": "lost server connection " + reason, timeout: null, "is_disconnect_message": true})
            if (reason === "io server disconnect") {
                // the disconnection was initiated by the server, you need to reconnect manually
                self.socket.connect();
                self.recInterval = setInterval(function () {
                    self.attemptReconnect();
                }, self.retry_interval)
              }
        })
        // this.attachListener("disconnect", function () {
        //     doFlash({"message": "lost server connection", timeout: null, "is_disconnect_message": true});
        //     self.socket.close();
        //     self.recInterval = setInterval(function () {
        //         self.attemptReconnect();
        //     }, self.retry_interval)
        // });
    }
    attemptReconnect() {
        if (this.socket.connected) {
            clearInterval(this.recInterval);
            this.counter += 1;
            // this.join_rooms(true, null);
            // this.restoreListeners();
            // this.watchForDisconnect();
            doFlash({"message": "reconnected to server", timeout: null, "is_reconnect_message": true})
        }
        else {
            // this.connectme()
            this.socket.connect();
        }
    }
}