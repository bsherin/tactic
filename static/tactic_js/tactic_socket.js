
import io from 'socket.io-client';

export {TacticSocket}

class TacticSocket {

    constructor(name_space, retry_interval, identifier, local_id = null, on_initial_join = null) {

        this.name_space = name_space;
        this.ident = identifier;
        this.recInterval = null;
        this.retry_interval = retry_interval;
        this.local_id = local_id;
        this.listeners = {};
        this.connectme();
        this.join_rooms(false, on_initial_join);
        this.watchForDisconnect();
        this.counter = null;
        this.notifier = null;
    }

    connectme() {
        const protocol = window.location.protocol;
        this.socket = io.connect(`${protocol}//${document.domain}:${location.port}/${this.name_space}`);
        this.counter = 0;
    }

    join_rooms(reconnect = false, on_join = null) {
        this.socket.emit('join', {"room": window.user_id});
        if (this.local_id) {
            // If I pass a callback of null to socket.emit it gets treated as an extra argument,
            // which cases problems
            // So we have to split this isn't two cases, one with a callback and one without
            if (on_join) {
                this.socket.emit('join', {
                    "room": this.local_id,
                    "user_id": window.user_id
                }, on_join)
            }
            else {
                this.socket.emit('join', {
                    "room": this.local_id,
                    "user_id": window.user_id
                });
            }
        }
    }

    // We have to be careful to get the very same instance of the listener function
    // That requires storing it outside this component since the console can be unmounted
    attachListener(event, newListener) {
        if (event in this.listeners) {
            this.socket.off(event, this.listeners[event]);
        }
        this.socket.on(event, newListener);
        this.listeners[event] = newListener
    }

    detachListener(event) {
        if (event in this.listeners) {
            this.socket.off(event, this.listeners[event]);
            delete this.listeners[event]
        }
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

    notify(connected){
        if (this.notifier) {
            this.notifier(connected)
        }
    }

    watchForDisconnect() {
        let self = this;
        this.attachListener("connect", ()=>{
            console.log(`tactic:${this.ident} connected`);
            this.notify(true)
        });
        this.attachListener("disconnect", (reason) => {
            if (reason == "io client disconnect") return;
            console.log(`tactic:${this.ident} disconnected for reason ${reason}`);
            this.notify(false);
            // doFlash({"message": "lost server connection " + reason, timeout: null, "is_disconnect_message": true})
            self.socket.close();
            self.recInterval = setInterval(function () {
                self.attemptReconnect();
            }, self.retry_interval)
        })
    }

    attemptReconnect() {
        if (this.socket.connected) {
            this.notify(true);
            clearInterval(this.recInterval);
            this.counter += 1;
            this.join_rooms(true, null);
            this.restoreListeners();
            // this.watchForDisconnect();
            console.log(`tactic:${this.ident} looks to be reconnected`);
            // doFlash({"message": "reconnected to server", timeout: null, "is_reconnect_message": true})
        } else {
            this.notify(false);
            console.log(`tactic:${this.ident} trying to reconnect`);
            this.connectme()
        }

    }
}