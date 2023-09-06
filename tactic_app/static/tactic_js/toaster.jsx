'use strict';

import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useContext, createContext} from "react";
import PropTypes from 'prop-types';

import {OverlayToaster, Position, Spinner} from "@blueprintjs/core";
import {GlyphButton} from "./blueprint_react_widgets";

import {useCallbackStack} from "./utilities_react";
import {ThemeContext} from "./theme"

const StatusContext = createContext(null);

export {doFlash, doFlashAlways, withStatus, StatusContext}

const DEFAULT_TIMEOUT = 20000;

let disconnect_toast_id = null;
let reconnect_toast_id = null;

const AppToaster = OverlayToaster.create({
    className: "recipe-toaster",
    position: Position.TOP,
    autoFocus: false,
});

const intent_dict = {
    "alert-success": "Success",
    "alert-warning": "Warning",
    "alert-info": null,
};

function doFlash(data) {
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
}

function doFlashAlways(data) {
    doFlash(data)
}

function withStatus(WrappedComponent) {
    function newFunc(props) {
        const [show_spinner, set_show_spinner] = useState(false);
        const [status_message, set_status_message] = useState(null);
        const [spinner_size, set_spinner_size] = useState(props.spinner_size ? props.spinner_size : 25);

        const pushCallback = useCallbackStack();

        useEffect(() => {
            if (props.tsocket) {
                initSocket()
            }
        }, []);

        function initSocket() {
            props.tsocket.attachListener('stop-spinner', _stopSpinner);
            props.tsocket.attachListener('start-spinner', _startSpinner);
            props.tsocket.attachListener('show-status-msg', _statusMessageFromData);
            props.tsocket.attachListener("clear-status-msg", _clearStatusMessage);
        }

        function getId() {
            if ("main_id" in props) {
                return props.main_id
            }
            else {
                return props.library_id
            }
        }

        function _stopSpinner(data) {
            if (data == null || (data.main_id == getId())) {
                set_show_spinner(false)
            }
        }

        function _startSpinner(data) {
            if (data == null || (data.main_id == getId() )) {
                set_show_spinner(true);
            }
        }

        function _clearStatusMessage(data) {
            if (data == null || (data.main_id == getId() )) {
                set_status_message(null)
            }
        }

        function _clearStatus(data) {
            if (data == null || (data.main_id == getId())) {
                set_show_spinner(false);
                set_status_message(null)
            }
        }

        function _statusMessage(message, timeout = null) {
            let self = this;
            set_status_message(message);
            pushCallback(() => {
                if (timeout) {
                    setTimeout(_clearStatusMessage, timeout * 1000);
                }
            });
        }

        function _statusMessageFromData(data) {
            if (data.main_id == props.main_id) {
                set_status_message(data.message);
                pushCallback(() => {
                    if (data.hasOwnProperty("timeout") && data.timeout != null) {
                        setTimeout(_clearStatusMessage, data.timeout * 1000);
                    }
                });
            }
        }

        function _setStatus(sstate, callback = null) {
            if ("show_spinner" in sstate) {
                set_show_spinner(sstate["show_spinner"])
            }
            if ("status_message" in sstate) {
                set_status_message(sstate["status_message"])
            }
            if (callback) {
                pushCallback(callback)
            }
        }

        const _statusFuncs = {
            startSpinner: _startSpinner,
            stopSpinner: _stopSpinner,
            clearStatus: _clearStatus,
            clearStatusMessage: _clearStatusMessage,
            statusMessage: _statusMessage,
            setStatus: _setStatus,
        };

        return (
            <Fragment>
                <StatusContext.Provider value={_statusFuncs}>
                    <WrappedComponent {...props}
                    />
                </StatusContext.Provider>
                <Status show_spinner={show_spinner}
                        status_message={status_message}
                        spinner_size={spinner_size}
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
    const elRef = useRef(null);
    const theme = useContext(ThemeContext);

    let cname = "d-flex flex-row";
    let outer_cname = theme.dark_theme ? "status-holder bp5-dark" : "status-holder light-theme";
    let left = elRef && elRef.current ? elRef.current.parentNode.offsetLeft : 25;

    return (
        <div ref={elRef}
             style={{height: 35, width: "100%", position: "absolute", "left": left, "bottom": 0}}
             className={outer_cname}>
            <div className={cname} style={{position: "absolute", bottom: 7, marginLeft: 15}}>
                {props.show_spinner &&
                    <Spinner size={20}/>}
                {props.show_close && (props.show_spiner || props.status_message) &&
                    <GlyphButton handleClick={props.handleClose}
                                 icon="cross"/>}
                {props.status_message &&
                    <div className="d-flex flex-column justify-content-around" style={{marginLeft: 8}}>
                        <div id="status-msg-area" className="bp5-ui-text">{props.status_message}</div>
                    </div>
                }
            </div>
        </div>
    )
}

Status = memo(Status);

Status.propTypes = {
    show_spinner: PropTypes.bool,
    show_close: PropTypes.bool,
    handleClose: PropTypes.func,
    status_message: PropTypes.string,
    spinner_size: PropTypes.number,
};

Status.defaultProps = {
    show_spinner: false,
    show_close: true,
    handleClose: null,
    status_message: null,
    spinner_size: 25,
};