'use strict';

import React from "react";
import PropTypes from 'prop-types';

import { Toaster, Position, Spinner } from "@blueprintjs/core";

import {doBinding} from "./utilities_react.js";

export {doFlash, doFlashAlways, withStatus, Status}

const AppToaster = Toaster.create({
    className: "recipe-toaster",
    position: Position.TOP,
    autoFocus: true
});

const intent_dict = {
    "alert-success": "Success",
    "alert-warning": "Warning",
    "alert-info": null,
};

function doFlash(data) {
    let intent;
    if (!data.hasOwnProperty("alert_type")) {
        intent = null;
    }
    else {
        intent = intent_dict[data.alert_type];
    }

    AppToaster.show({
        message: data.message,
        intent: intent});
}

function doFlashAlways(data) {
    doFlash(data)
}

function withStatus(WrappedComponent, tsocket=null, light_dark=false) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            doBinding(this);
            this.tsocket = tsocket;
            this.state = {
                show_spinner: false,
                status_message: null,
                dark_theme: false,
                light_dark: light_dark,
                spinner_size: this.props.spinner_size ? this.props.spinner_size : 25
            }
            this.socket_counter = null;
        }

        componentDidMount() {
            if (this.tsocket) {
                this.initSocket();
            }
        }

        componentDidUpdate () {
            if (this.tsocket && (this.tsocket.counter != this.socket_counter)) {
                this.initSocket();
            }
        }

        initSocket() {
            this.tsocket.socket.off('stop-spinner');
            this.tsocket.socket.off('start-spinner');
            this.tsocket.socket.off('show-status-msg');
            this.tsocket.socket.off("clear-status-msg");

            this.tsocket.socket.on('stop-spinner', this._stopSpinner);
            this.tsocket.socket.on('start-spinner', this._startSpinner);
            this.tsocket.socket.on('show-status-msg', this._statusMessageFromData);
            this.tsocket.socket.on("clear-status-msg", this._clearStatusMessage);
            this.socket_counter = this.tsocket.counter
        }

         _stopSpinner() {
            this.setState({show_spinner: false})
        }

        _startSpinner(dark_spinner=false) {
            this.setState({show_spinner: true, dark_spinner: dark_spinner})
        }

        _clearStatusMessage() {
            this.setState({status_message: null});
        }

        _clearStatus() {
            this.setState({show_spinner: false, status_message: null});
        }

        _statusMessage(message, timeout=null) {
            this.setState({status_message: message}, ()=>{
                if (timeout) {
                    setTimeout(self._clearStatusMessage, data.timeout * 1000);
                }
            });
        }

        _statusMessageFromData(data) {
            let self = this;
            this.setState({status_message: data.message}, ()=>{
                if (data.hasOwnProperty("timeout") && data.timeout != null) {
                    setTimeout(self._clearStatusMessage, data.timeout * 1000);
                }
            });
        }

        _setStatus(sstate) {
            this.setState(sstate)
        }

        _setStatusTheme(dark_theme) {
            this.setState({dark_theme: dark_theme})
        }

        _statusFuncs() {
            return {
                startSpinner: this._startSpinner,
                stopSpinner: this._stopSpinner,
                clearStatus: this._clearStatus,
                clearStatusMessage: this._clearStatusMessage,
                statusMessage: this._statusMessage,
                setStatus: this._setStatus,
                setStatusTheme: this._setStatusTheme
            }
        }

        render() {
            return (
                <React.Fragment>
                    <WrappedComponent {...this.props}
                                      statusFuncs={this._statusFuncs()}
                                      startSpinner={this._startSpinner}
                                      stopSpinner={this._stopSpinner}
                                      clearStatus={this._clearStatus}
                                      clearStatusMessage={this._clearStatus}
                                      statusMessage={this._statusMessage}
                                      setStatus={this._setStatus}
                                      setStatusTheme={this._setStatusTheme}
                    />
                    <Status {...this.state}/>
                </React.Fragment>
            )
        }
    }
}

class Status extends React.Component {

    render () {
        let cname = "d-flex flex-row"
        let outer_cname
        if (this.props.dark_theme) {
            outer_cname = "status-holder bp3-dark"
            if (this.props.light_dark) {
                outer_cname += " light-dark"
            }
        }
        else {
            outer_cname = "status-holder light-theme"
        }
        return (
            <div style={{height: "100%", width: "100%"}} className={outer_cname}>
                <div className={cname} style={{position: "absolute", bottom: 10, marginLeft: 15}}>
                    {this.props.show_spinner &&
                        <Spinner size={20} />}
                    {this.props.status_message &&
                        <div className="d-flex flex-column justify-content-around" style={{positoin: "absolute", marginLeft: 50}}>
                            <div id="status-msg-area" className="bp3-ui-text">{this.props.status_message}</div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}
Status.propTypes = {
    show_spinner: PropTypes.bool,
    status_message: PropTypes.string,
    spinner_size: PropTypes.number,
    dark_theme: PropTypes.bool
};

Status.defaultProps = {
    show_spinner: false,
    status_message: null,
    spinner_size: 25,
    dark_theme: false
};