'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

export { doFlash, doFlashAlways, withStatus, Status };

var Bp = blueprint;

const AppToaster = Bp.Toaster.create({
    className: "recipe-toaster",
    position: Bp.Position.TOP,
    autoFocus: true
});

const intent_dict = {
    "alert-success": "Success",
    "alert-warning": "Warning",
    "alert-info": null
};

function doFlash(data) {
    let intent;
    if (!data.hasOwnProperty("alert_type")) {
        intent = null;
    } else {
        intent = intent_dict[data.alert_type];
    }

    AppToaster.show({
        message: data.message,
        intent: intent });
}

function doFlashAlways(data) {
    doFlash(data);
}

function withStatus(WrappedComponent, tsocket = null) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            doBinding(this);
            this.tsocket = tsocket;
            this.state = {
                show_spinner: false,
                status_message: null,
                dark_spinner: false,
                spinner_size: this.props.spinner_size ? this.props.spinner_size : 25
            };
        }

        componentDidMount() {
            if (this.tsocket) {
                this.tsocket.socket.on('stop-spinner', this._stopSpinner);
                this.tsocket.socket.on('start-spinner', this._startSpinner);
                this.tsocket.socket.on('show-status-msg', this._statusMessageFromData);
                this.tsocket.socket.on("clear-status-msg", this._clearStatusMessage);
            }
        }

        _stopSpinner() {
            this.setState({ show_spinner: false });
        }

        _startSpinner(dark_spinner = false) {
            this.setState({ show_spinner: true, dark_spinner: dark_spinner });
        }

        _clearStatusMessage() {
            this.setState({ status_message: null });
        }

        _clearStatus() {
            this.setState({ show_spinner: false, status_message: null });
        }

        _statusMessage(message, timeout = null) {
            this.setState({ status_message: message }, () => {
                if (timeout) {
                    setTimeout(self._clearStatusMessage, data.timeout * 1000);
                }
            });
        }

        _statusMessageFromData(data) {
            let self = this;
            this.setState({ status_message: data.message }, () => {
                if (data.hasOwnProperty("timeout") && data.timeout != null) {
                    setTimeout(self._clearStatusMessage, data.timeout * 1000);
                }
            });
        }

        _setStatus(sstate) {
            this.setState(sstate);
        }

        _statusFuncs() {
            return {
                startSpinner: this._startSpinner,
                stopSpinner: this._stopSpinner,
                clearStatus: this._clearStatus,
                clearStatusMessage: this._clearStatusMessage,
                statusMessage: this._statusMessage,
                setStatus: this._setStatus
            };
        }

        render() {
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(WrappedComponent, _extends({}, this.props, {
                    statusFuncs: this._statusFuncs(),
                    startSpinner: this._startSpinner,
                    stopSpinner: this._stopSpinner,
                    clearStatus: this._clearStatus,
                    clearStatusMessage: this._clearStatus,
                    statusMessage: this._statusMessage,
                    setStatus: this._setStatus
                })),
                React.createElement(Status, this.state)
            );
        }
    };
}

class Status extends React.Component {

    render() {
        let cname = this.props.dark_spinner ? "bp3-dark" : "";
        return React.createElement(
            "div",
            { className: "d-flex flex-row", style: { position: "absolute", bottom: 10, marginLeft: 15 } },
            this.props.show_spinner && React.createElement(Bp.Spinner, { className: "bp3-dark", size: 20 }),
            this.props.status_message && React.createElement(
                "div",
                { className: "d-flex flex-column justify-content-around", style: { positoin: "absolute", marginLeft: 50 } },
                React.createElement(
                    "div",
                    { id: "status-msg-area", className: "bp3-ui-text" },
                    this.props.status_message
                )
            )
        );
    }
}
Status.propTypes = {
    show_spinner: PropTypes.bool,
    status_message: PropTypes.string,
    spinner_size: PropTypes.number
};

Status.defaultProps = {
    show_spinner: false,
    status_message: null,
    spinner_size: 25
};