'use strict';

import React from "react";
import { createRoot } from 'react-dom/client';
import {Fragment, useState, useEffect, useRef, memo, useContext, createContext, useCallback} from "react";

import {OverlayToaster, Position, Spinner} from "@blueprintjs/core";
import {GlyphButton} from "./blueprint_react_widgets";

import {useCallbackStack, useStateAndRef} from "./utilities_react";
import {ThemeContext} from "./theme"

const StatusContext = createContext(null);

export {doFlash, withStatus, StatusContext, messageOrError}

const DEFAULT_TIMEOUT = 20000;

let disconnect_toast_id = null;
let reconnect_toast_id = null;



const intent_dict = {
    "alert-success": "Success",
    "alert-warning": "Warning",
    "alert-info": null,
};

function doFlash(data) {
    const AppToasterPromise = OverlayToaster.createAsync({
        className: "recipe-toaster",
        position: Position.TOP,
        autoFocus: false,
    }, {domRenderer: (toaster, containerElement) => createRoot(containerElement).render(toaster),});
    AppToasterPromise.then((AppToaster) => {
        let intent;
        if (typeof (data) == "string") {
            AppToaster.show({
                message: data,
                timeout: DEFAULT_TIMEOUT,
                intent: null
            });
            return
        }
        if (!("alert_type" in data)) {
            intent = null;
        } else {
            intent = intent_dict[data.alert_type];
        }
        if (!("timeout" in data)) {
            data.timeout = DEFAULT_TIMEOUT
        }

        if ("is_disconnect_message" in data) {
            if (disconnect_toast_id) {
                AppToaster.dismiss(disconnect_toast_id)
            }
            if (reconnect_toast_id) {
                AppToaster.dismiss(reconnect_toast_id)
            }
            disconnect_toast_id = AppToaster.show({
                message: data.message,
                timeout: data.timeout,
                intent: intent
            });
        } else if ("is_reconnect_message" in data) {
            if (reconnect_toast_id) {
                AppToaster.dismiss(reconnect_toast_id)
            }
            if (disconnect_toast_id) {
                AppToaster.dismiss(disconnect_toast_id);
                disconnect_toast_id = null
            }
            reconnect_toast_id = AppToaster.show({
                message: data.message,
                timeout: data.timeout,
                intent: intent
            })
        } else {
            AppToaster.show({
                message: data.message,
                timeout: data.timeout,
                intent: intent
            });
        }
    })
}

function messageOrError(data, success_message, failure_tiltle, statusFuncs, errorDrawerFuncs) {
    if (!data.success) {
        errorDrawerFuncs.addErrorDrawerEntry({
            title: failur_title,
            content: "message" in data ? data.message : ""
        });
    }
    else {
        statusFuncs.statusMessage(success_message)
    }
    statusFuncs.stopSpinner();
    statusFuncs.clearStatusMessage();
}

function withStatus(WrappedComponent) {
    function newFunc(props) {
        const [show_spinner, set_show_spinner] = useState(false);
        const [status_message, set_status_message] = useState(null);
        const [spinner_size, set_spinner_size] = useState(props.spinner_size ? props.spinner_size : 25);
        const [leftEdge, setLeftEdge] = useState(0);

        const pushCallback = useCallbackStack();

        useEffect(() => {
            if (props.tsocket) {
                initSocket();
            }
        }, []);

        function initSocket() {
            props.tsocket.attachListener('stop-spinner', _stopSpinner);
            props.tsocket.attachListener('show-status-msg', _statusMessageFromData);
            props.tsocket.attachListener("clear-status-msg", _clearStatusMessage);
        }

        const getId = useCallback(() => {
            if ("main_id" in props) {
                return props.main_id
            }
            else {
                return props.library_id
            }
        }, [props.main_id, props.library_id]);

        const _stopSpinner = useCallback((data) => {
            if (data == null || (data.main_id == getId())) {
                set_show_spinner(false)
            }
        }, []);

        const _startSpinner = useCallback((data) =>  {
            if (data == null || (data.main_id == getId() )) {
                set_show_spinner(true);
            }
        }, []);

        const _clearStatusMessage = useCallback((data) =>  {
            if (data == null || (data.main_id == getId() )) {
                set_status_message(null)
            }
        }, []);

        const _clearStatus = useCallback((data) => {
            if (data == null || (data.main_id == getId())) {
                set_show_spinner(false);
                set_status_message(null)
            }
        }, []);

        const _statusMessage = useCallback((message, timeout = null) => {
            set_status_message(message);
            if (!timeout) {
                timeout = 7
            }
            pushCallback(() => {
                if (timeout) {
                    setTimeout(_clearStatusMessage, timeout * 1000);
                }
            });
        }, []);

        const _statusMessageFromData  = useCallback((data) => {
            set_status_message(data.message);
            pushCallback(() => {
                if (data.hasOwnProperty("timeout") && data.timeout != null) {
                    setTimeout(_clearStatusMessage, data.timeout * 1000);
                }
            });

        }, []);

        const _setStatus  = useCallback((sstate, callback = null) => {
            if ("show_spinner" in sstate) {
                set_show_spinner(sstate["show_spinner"])
            }
            if ("status_message" in sstate) {
                set_status_message(sstate["status_message"])
            }
            if (callback) {
                pushCallback(callback)
            }
        }, []);

        const statusFuncsRef = useRef({
            startSpinner: _startSpinner,
            stopSpinner: _stopSpinner,
            clearStatus: _clearStatus,
            clearStatusMessage: _clearStatusMessage,
            statusMessage: _statusMessage,
            setStatus: _setStatus,
            setLeftEdge: setLeftEdge
        }, []);

        return (
            <Fragment>
                <StatusContext.Provider value={statusFuncsRef.current}>
                    <WrappedComponent {...props}
                    />
                </StatusContext.Provider>
                <Status show_spinner={show_spinner}
                        status_message={status_message}
                        spinner_size={spinner_size}
                        leftEdge={leftEdge}
                        show_close={true}
                        handleClose={() => {
                            _clearStatus(null)
                        }}/>
            </Fragment>
        )
    }
    return memo(newFunc)
}

function Status(props) {
    props = {
        show_spinner: false,
        show_close: true,
        handleClose: null,
        status_message: null,
        spinner_size: 25,
        ...props
    };
    const elRef = useRef(null);
    const theme = useContext(ThemeContext);

    let cname = "d-flex flex-row";
    let outer_cname = theme.dark_theme ? "status-holder bp5-dark" : "status-holder light-theme";
    let left = elRef && elRef.current ? elRef.current.parentNode.offsetLeft : 25;

    return (
        <div ref={elRef}
             style={{height: 35, width: "100%", position: "absolute", "left": left, "bottom": 0}}
             className={outer_cname}>
            <div className={cname} style={{position: "absolute", bottom: 5, left: props.leftEdge, marginLeft: 15}}>
                {props.show_spinner &&
                    <Spinner size={20}/>}
                {props.show_close && (props.show_spiner || props.status_message) &&
                    <GlyphButton handleClick={props.handleClose}
                                 small={true}
                                 icon="cross"/>}
                {props.status_message &&
                    <div className="d-flex flex-column justify-content-around" style={{marginLeft: 8}}>
                        <div id="status-msg-area" className="bp5-ui-text" style={{fontSize: 12}}>{props.status_message}</div>
                    </div>
                }
            </div>
        </div>
    )
}

Status = memo(Status);
