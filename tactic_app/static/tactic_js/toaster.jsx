'use strict';

import React from "react";
import PropTypes from 'prop-types';

import { Toaster, Position, Spinner } from "@blueprintjs/core";
import {GlyphButton} from "./blueprint_react_widgets";

import {doBinding} from "./utilities_react.js";

export {doFlash, doFlashAlways, withStatus, Status}

const DEFAULT_TIMEOUT = 2000;

let disconnect_toast_id = null;
let reconnect_toast_id = null;

const AppToaster = Toaster.create({
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
    if (typeof(data) == "string") {
        AppToaster.show({
            message: data,
            timeout: DEFAULT_TIMEOUT,
            intent: null});
        return
    }
    if (!("alert_type" in data)) {
        intent = null;
    }
    else {
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
    }
    else if ("is_reconnect_message" in data) {
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
    }

    else {
        AppToaster.show({
            message: data.message,
            timeout: data.timeout,
            intent: intent});
    }
}

function doFlashAlways(data) {
    doFlash(data)
}

function withStatus(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            doBinding(this);
            this.state = {
                show_spinner: false,
                status_message: null,
                spinner_size: this.props.spinner_size ? this.props.spinner_size : 25
            };
            this.socket_counter = null;
        }

        componentDidMount() {
            if (this.props.tsocket) {
                this.initSocket();
            }
        }

        initSocket() {
            this.props.tsocket.attachListener('stop-spinner', this._stopSpinner);
            this.props.tsocket.attachListener('start-spinner', this._startSpinner);
            this.props.tsocket.attachListener('show-status-msg', this._statusMessageFromData);
            this.props.tsocket.attachListener("clear-status-msg", this._clearStatusMessage);
        }

         _stopSpinner(data) {
            if (data == null || (data.main_id == this.props.main_id)) {
                this.setState({show_spinner: false})
            }
        }

        _startSpinner(data) {
            if (data == null || (data.main_id == this.props.main_id)) {
                this.setState({show_spinner: true, dark_spinner: false})
            }
        }

        _clearStatusMessage(data) {
            if (data == null || (data.main_id == this.props.main_id)) {
                this.setState({status_message: null});
            }
        }

        _clearStatus(data, callback=null) {
            if (data == null || (data.main_id == this.props.main_id)) {
                this.setState({show_spinner: false, status_message: null}, callback);
            }
        }

        _statusMessage(message, timeout=null) {
            let self = this;
            this.setState({status_message: message}, () => {
                if (timeout) {
                    setTimeout(self._clearStatusMessage, timeout * 1000);
                }
            });
        }

        _statusMessageFromData(data) {
            if (data.main_id == this.props.main_id) {
                let self = this;
                this.setState({status_message: data.message}, () => {
                    if (data.hasOwnProperty("timeout") && data.timeout != null) {
                        setTimeout(self._clearStatusMessage, data.timeout * 1000);
                    }
                });
            }
        }

        _setStatus(sstate, callback=null) {
            this.setState(sstate, callback)
        }

        _statusFuncs() {
            return {
                startSpinner: this._startSpinner,
                stopSpinner: this._stopSpinner,
                clearStatus: this._clearStatus,
                clearStatusMessage: this._clearStatusMessage,
                statusMessage: this._statusMessage,
                setStatus: this._setStatus,
            }
        }

        render() {
            return (
                <React.Fragment>
                    <WrappedComponent {...this.props}
                                      statusSocket={this.props.tsocket}
                                      statusFuncs={this._statusFuncs()}
                                      startSpinner={this._startSpinner}
                                      stopSpinner={this._stopSpinner}
                                      clearStatus={this._clearStatus}
                                      clearStatusMessage={this._clearStatus}
                                      statusMessage={this._statusMessage}
                                      setStatus={this._setStatus}
                    />
                    <Status {...this.state}
                            show_close={true}
                            handleClose={()=>{this._clearStatus(null)}}
                            dark_theme={this.props.controlled ? this.props.dark_theme : window.theme == "dark"}/>
                </React.Fragment>
            )
        }
    }
}

class Status extends React.Component {

    constructor(props) {
        super(props);
        this.elRef = React.createRef();
    }

    render () {
        let cname = "d-flex flex-row";
        let outer_cname;
        if (this.props.dark_theme) {
            outer_cname = "status-holder bp4-dark";
        }
        else {
            outer_cname = "status-holder light-theme"
        }
        let left;
        if (this.elRef && this.elRef.current) {
            left = this.elRef.current.parentNode.offsetLeft;
        }
        else {
            left = 25;
        }


        return (
            <div ref={this.elRef}
                 style={{height: 35, width: "100%", position: "absolute", "left": left, "bottom": 0}}
                 className={outer_cname}>
                <div className={cname} style={{position: "absolute", bottom: 7, marginLeft: 15}}>
                    {this.props.show_spinner &&
                        <Spinner size={20} />}
                    {this.props.show_close && (this.props.show_spiner || this.props.status_message) &&
                        <GlyphButton handleClick={this.props.handleClose}
                                     icon="cross" />}
                    {this.props.status_message &&
                        <div className="d-flex flex-column justify-content-around" style={{marginLeft: 8}}>
                            <div id="status-msg-area" className="bp4-ui-text">{this.props.status_message}</div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}
Status.propTypes = {
    show_spinner: PropTypes.bool,
    show_close: PropTypes.bool,
    handleClose: PropTypes.func,
    status_message: PropTypes.string,
    spinner_size: PropTypes.number,
    dark_theme: PropTypes.bool
};

Status.defaultProps = {
    show_spinner: false,
    show_close: true,
    handleClose: null,
    status_message: null,
    spinner_size: 25,
    dark_theme: false
};