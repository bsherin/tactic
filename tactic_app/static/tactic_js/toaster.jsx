'use strict';

export {doFlash, doFlashStopSpinner, doFlashAlways, withStatus, Status}

var Bp = blueprint;

const AppToaster = Bp.Toaster.create({
    className: "recipe-toaster",
    position: Bp.Position.TOP,
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


function doFlashStopSpinner(data) {
    stopSpinner();
    clearStatusMessage();
    doFlash(data)
}

function withStatus(WrappedComponent, tsocket=null) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            doBinding(this);
            this.tsocket = tsocket;
            this.state = {
                show_spinner: false,
                status_message: null,
                spinner_size: this.props.spinner_size ? this.props.spinner_size : 25
            }
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
            this.setState({show_spinner: false})
        }

        _startSpinner() {
            this.setState({show_spinner: true})
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

        render() {
            return (
                <React.Fragment>
                    <WrappedComponent {...this.props}
                                      startSpinner={this._startSpinner}
                                      stopSpinner={this._stopSpinner}
                                      clearStatus={this._clearStatus}
                                      clearStatusMessage={this._clearStatus}
                                      statusMessage={this._statusMessage}
                                      setStatus={this._setStatus}
                    />
                    <Status {...this.state}/>
                </React.Fragment>
            )
        }
    }
}

class Status extends React.Component {

    render () {
        return (
            <div className="d-flex flex-row" style={{position: "absolute", bottom: 10, marginLeft: 10}}>
                {this.props.show_spinner &&
                    <Bp.Spinner size={25} />}
                {this.props.status_message &&
                    <div className="d-flex flex-column justify-content-around" style={{marginLeft: 10}}>
                        <div id="status-msg-area" className="bp3-text-large">{this.props.status_message}</div>
                    </div>
                }
            </div>
        )
    }
}
Status.propTypes = {
    show_spinner: PropTypes.bool,
    status_message: PropTypes.string,
    spinner_size: PropTypes.number,
};

Status.defaultProps = {
    show_spinner: false,
    status_message: null,
    spinner_size: 25,
};