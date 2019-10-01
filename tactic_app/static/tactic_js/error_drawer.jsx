import {Status} from "./toaster.js";

export {withErrorDrawer}

var Bp = blueprint;

function withErrorDrawer(WrappedComponent, tsocket=null, title=null, position="right", size="30%") {
    return class extends React.Component {
        constructor(props) {
            super(props);
            doBinding(this);
            this.tsocket = tsocket;
            this.state = {
                show_drawer: false,
                contents: [],
                error_drawer_size: size,
                position: position,
            }
        }

        componentDidMount() {
            if (this.tsocket) {
                this.tsocket.socket.on('close-error-drawer', this._close);
                this.tsocket.socket.on('open-error-drawer', this._open);
                this.tsocket.socket.on('add-error-drawer-entry', this._addEntry);
                this.tsocket.socket.on("clear-error-drawer", this._clearAll);
            }
        }

        _close() {
            this.setState({show_drawer: false})
        }

        _open() {
            this.setState({show_drawer: true})
        }

        _toggle() {
            this.setState({show_drawer: !this.state.show_drawer})
        }

        _addEntry(entry, open=true) {
            this.setState({contents: [...this.state.contents, entry], show_drawer: open})
        }

        _clearAll() {
            this.setState({contents: []})
        }

       _onClose() {
            this.setState({"show_drawer": false})
        }

        render() {
            let errorDrawerFuncs = {
                openErrorDrawer: this._open,
                closeErrorDrawer: this._close,
                clearErrorDrawer: this._clearAll,
                addErrorDrawerEntry: this._addEntry,
                toggleErrorDrawer: this._toggle
            };
            return (
                <React.Fragment>
                    <WrappedComponent {...this.props}
                                      {...errorDrawerFuncs}
                                      errorDrawerFuncs={errorDrawerFuncs}
                    />
                    <ErrorDrawer {...this.state}
                                 title="Error Drawer"
                                 size={this.state.error_drawer_size}
                                 onClose={this._onClose}
                                 clearAll={this._clearAll}/>
                </React.Fragment>
            )
        }
    }
}

class ErrorDrawer extends React.Component {
    render () {
        let items = this.props.contents.map((entry, index)=>{
            let content_dict = {__html: entry.content};
            return(
                <Bp.Card key={index} interactive={true} elevation={Bp.Elevation.TWO} style={{marginBottom: 5}}>
                    {entry.title &&
                        <h6><a href="#">{entry.title}</a></h6>
                    }
                    <div style={{fontSize: 12}} dangerouslySetInnerHTML={content_dict}/>
                </Bp.Card>
            )
        });
        return (
            <Bp.Drawer
                    icon="console"
                    title={this.props.title}
                    isOpen={this.props.show_drawer}
                    position={this.props.position}
                    canOutsideClickClose={true}
                    onClose={this.props.onClose}
                    size={this.props.size}
                >
                <div className={Bp.Classes.DRAWER_BODY}>
                    <div className="d-flex flex-row justify-content-around mt-2">
                        <Bp.Button text="Clear All" onClick={this.props.clearAll}/>
                    </div>
                    <div className={Bp.Classes.DIALOG_BODY}>
                        {items}
                    </div>
                </div>
            </Bp.Drawer>
        )
    }
}

Status.propTypes = {
    show_drawer: PropTypes.bool,
    contents: PropTypes.array,
    title: PropTypes.string,
    onClose: PropTypes.func,
    position: PropTypes.string,
    clearAll: PropTypes.func,
    size: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number])
};

Status.defaultProps = {
    show_drawer: false,
    contents: [],
    position: "right",
    title: null,
    size: "30%"
};