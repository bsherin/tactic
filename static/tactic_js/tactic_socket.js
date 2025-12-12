import io from 'socket.io-client';
import {useEffect, useState, useCallback, useRef} from "react";

export {TacticSocket, useSocketListener, useConnection, useListeners};

function useSocketListener(tsocket, event, handler, condition = true) {
    const handlerRef = useRef(handler);
    handlerRef.current = handler;

    const stableHandler = useCallback((data) => {
        handlerRef.current?.(data);
    }, []);

    useEffect(() => {
        if (!tsocket || !condition) return;
        tsocket.attachListener(event, stableHandler);

        return () => {
            tsocket.detachListener(event, stableHandler);
        };
    }, [tsocket, event, condition, stableHandler]);
}

function useConnection(tsocket, initSocket) {
    const [connection_status, set_connection_status] = useState(null);

    const socketNotifier = useCallback((connected) => {
        set_connection_status(connected ? "up" : "down");
    }, []);
    const initRef = useRef(initSocket);

    useEffect(() => {
        if (!tsocket) return;

        initRef.current?.(tsocket);
        tsocket.notifier = socketNotifier;
        socketNotifier(tsocket.socket.connected);

        return () => {
            tsocket.disconnect();
            tsocket.notifier = null;
        };
    }, [tsocket, socketNotifier]);

    return tsocket ? connection_status : null;
}

function useListeners(tsocket, initSocket) {
    const initRef = useRef(initSocket);
    useEffect(() => {
        if (!tsocket) return;

        initRef.current?.(tsocket);
        return () => {
            tsocket.disconnect();
        };
    }, [tsocket]);
}


class TacticSocket {

    constructor(name_space, retry_interval, identifier, local_id = null, on_initial_join = null) {

        this.name_space = name_space;
        this.ident = identifier;
        this.recInterval = null;
        this.retry_interval = retry_interval;
        this.local_id = local_id;
        this.listeners = {};
        this.socketHandlers = {};
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
        // The lines below are useful for debugging.
        // this.socket.onAny((event, ...args) => {
        //     console.log(
        //         `[TSOCKET ${this.ident}] onAny: event=`, event,
        //         "args=", args
        //     );
        // });
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
            } else {
                this.socket.emit('join', {
                    "room": this.local_id,
                    "user_id": window.user_id
                });
            }
        }
    }


    attachListenerOLd(event, newListener) {
        if (!(event in this.listeners)) {
            this.listeners[event] = new Set();
            this.socket.on(event, (data) => {
                // Fan-out to all registered listeners
                for (const fn of this.listeners[event]) {
                    try {
                        fn(data);
                    } catch (e) {
                        console.error(`Error in listener for ${event}`, e);
                    }
                }
            });
        }
        this.listeners[event].add(newListener);
    }


    attachListener(event, newListener) {
        if (!(event in this.listeners)) {
            this.listeners[event] = new Set();

            const handler = (data) => {
                for (const fn of this.listeners[event]) {
                    try {
                        fn(data);
                    } catch (e) {
                        console.error(`Error in listener for ${event}`, e);
                    }
                }
            };

            this.socketHandlers[event] = handler;
            this.socket.on(event, handler);
        }
        this.listeners[event].add(newListener);
    }


    detachListener(event, listener) {
        if (!(event in this.listeners)) return;
        if (listener) {
            this.listeners[event].delete(listener);
        } else {
            // optional: clear all listeners for this event if no listener passed
            this.listeners[event].clear();
        }
    }


    disconnect() {
        this.stopListening();
        this.socket.disconnect();
    }

    stopListening() {
        for (let event in this.listeners) {
            this.listeners[event].clear();
        }
        for (const event in this.socketHandlers) {
            this.socket.off(event, this.socketHandlers[event]);
        }
    }

    restoreListeners() {
        // re-attach the socket handlers to the *current* socket
        for (const event in this.socketHandlers) {
            this.socket.on(event, this.socketHandlers[event]);
        }
    }

    notify(connected) {
        if (this.notifier) {
            this.notifier(connected)
        }
    }

    watchForDisconnect() {
        let self = this;
        this.attachListener("connect", () => {
            this.notify(true)
        });
        this.attachListener("disconnect", (reason) => {
            if (reason == "io client disconnect") return;
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