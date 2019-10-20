var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Status } from "./toaster.js";

export { withErrorDrawer };

var Bp = blueprint;

function withErrorDrawer(WrappedComponent, tsocket = null, title = null, position = "right", size = "30%") {
    return class extends React.Component {
        constructor(props) {
            super(props);
            doBinding(this);
            this.tsocket = tsocket;
            this.state = {
                show_drawer: false,
                contents: [],
                error_drawer_size: size,
                position: position
            };
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
            this.setState({ show_drawer: false });
        }

        _open() {
            this.setState({ show_drawer: true });
        }

        _toggle() {
            this.setState({ show_drawer: !this.state.show_drawer });
        }

        _addEntry(entry, open = true) {
            this.setState({ contents: [...this.state.contents, entry], show_drawer: open });
        }

        _clearAll() {
            this.setState({ contents: [] });
        }

        _onClose() {
            this.setState({ "show_drawer": false });
        }

        render() {
            let errorDrawerFuncs = {
                openErrorDrawer: this._open,
                closeErrorDrawer: this._close,
                clearErrorDrawer: this._clearAll,
                addErrorDrawerEntry: this._addEntry,
                toggleErrorDrawer: this._toggle
            };
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(WrappedComponent, _extends({}, this.props, errorDrawerFuncs, {
                    errorDrawerFuncs: errorDrawerFuncs
                })),
                React.createElement(ErrorDrawer, _extends({}, this.state, {
                    title: "Error Drawer",
                    size: this.state.error_drawer_size,
                    onClose: this._onClose,
                    clearAll: this._clearAll }))
            );
        }
    };
}

class ErrorDrawer extends React.Component {
    render() {
        let items = this.props.contents.map((entry, index) => {
            let content_dict = { __html: entry.content };
            return React.createElement(
                Bp.Card,
                { key: index, interactive: true, elevation: Bp.Elevation.TWO, style: { marginBottom: 5 } },
                entry.title && React.createElement(
                    "h6",
                    null,
                    React.createElement(
                        "a",
                        { href: "#" },
                        entry.title
                    )
                ),
                React.createElement("div", { style: { fontSize: 12 }, dangerouslySetInnerHTML: content_dict })
            );
        });
        return React.createElement(
            Bp.Drawer,
            {
                icon: "console",
                title: this.props.title,
                isOpen: this.props.show_drawer,
                position: this.props.position,
                canOutsideClickClose: true,
                onClose: this.props.onClose,
                size: this.props.size
            },
            React.createElement(
                "div",
                { className: Bp.Classes.DRAWER_BODY },
                React.createElement(
                    "div",
                    { className: "d-flex flex-row justify-content-around mt-2" },
                    React.createElement(Bp.Button, { text: "Clear All", onClick: this.props.clearAll })
                ),
                React.createElement(
                    "div",
                    { className: Bp.Classes.DIALOG_BODY },
                    items
                )
            )
        );
    }
}

Status.propTypes = {
    show_drawer: PropTypes.bool,
    contents: PropTypes.array,
    title: PropTypes.string,
    onClose: PropTypes.func,
    position: PropTypes.string,
    clearAll: PropTypes.func,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Status.defaultProps = {
    show_drawer: false,
    contents: [],
    position: "right",
    title: null,
    size: "30%"
};