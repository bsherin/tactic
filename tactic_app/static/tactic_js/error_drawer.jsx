
import React from "react";
import PropTypes from 'prop-types';

import { Card, Elevation, Drawer, Classes, Button} from "@blueprintjs/core";

import {Status} from "./toaster.js";
import {doBinding} from "./utilities_react.js";
import {postWithCallback} from "./communication_react.js";

export {withErrorDrawer, ErrorItem}

function withErrorDrawer(WrappedComponent, title=null, position="right", size="30%") {
    return class extends React.Component {
        constructor(props) {
            super(props);
            doBinding(this);
            this.state = {
                show_drawer: false,
                contents: [],
                error_drawer_size: size,
                position: position,
                goToLineNumber: null
            };
            this.socket_counter = null
        }

        componentDidMount() {
            if (this.props.tsocket) {
                this.initSocket()
            }
        }

        componentDidUpdate () {
            if (this.props.tsocket && (this.props.tsocket.counter != this.socket_counter)) {
                this.initSocket();
            }
        }

        initSocket() {
            this.props.tsocket.reAttachListener('close-error-drawer', this._close);
            this.props.tsocket.reAttachListener('open-error-drawer', this._open);
            this.props.tsocket.reAttachListener('add-error-drawer-entry', this._addEntry);
            this.props.tsocket.reAttachListener("clear-error-drawer", this._clearAll);
            this.socket_counter = this.props.tsocket.counter
        }

        _close(data) {
            if (data == null || !("main_id" in data) || (data.main_id == this.props.main_id)) {
                this.setState({show_drawer: false})
            }
        }

        _open(data) {
            if (data == null || !("main_id" in data) || (data.main_id == this.props.main_id)) {
                this.setState({show_drawer: true})
            }
        }

        _toggle(data) {
            if (data == null || !("main_id" in data) || (data.main_id == this.props.main_id)) {
                this.setState({show_drawer: !this.state.show_drawer})
            }
        }

        _addEntry(data, open=true) {
            if (data == null || !("main_id" in data) || (data.main_id == this.props.main_id)) {
                this.setState({contents: [data, ...this.state.contents], show_drawer: open})
            }
        }

        _postAjaxFailure(qXHR, textStatus, errorThrown) {
            this._addEntry({ title: "Post Ajax Failure: {}".format(textStatus),
                content: errorThrown})
        }


        _clearAll(data) {
            if (data == null || !("main_id" in data) || (data.main_id == this.props.main_id)) {
                this.setState({contents: [], show_drawer: false})
            }
        }

       _onClose() {
            this.setState({"show_drawer": false})
        }
        
        _setGoToLineNumber(gtfunc) {
            this.setState({goToLineNumber: gtfunc})
        }

        render() {
            let errorDrawerFuncs = {
                openErrorDrawer: this._open,
                closeErrorDrawer: this._close,
                clearErrorDrawer: this._clearAll,
                addErrorDrawerEntry: this._addEntry,
                postAjaxFailure: this._postAjaxFailure,
                toggleErrorDrawer: this._toggle,
                setGoToLineNumber: this._setGoToLineNumber
            };
            return (
                <React.Fragment>
                    <WrappedComponent {...this.props}
                                      {...errorDrawerFuncs}
                                      errorDrawerFuncs={errorDrawerFuncs}
                    />
                    <ErrorDrawer {...this.state}
                                 goToLineNumberFunc={this.state.goToLineNumber}
                                 title="Error Drawer"
                                 dark_theme={this.props.controlled ? this.props.dark_theme : window.dark_theme}
                                 size={this.state.error_drawer_size}
                                 onClose={this._onClose}
                                 clearAll={this._clearAll}/>
                </React.Fragment>
            )
        }
    }
}

class ErrorItem extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _openError() {
        if (this.props.goToLineNumberFunc) {
            this.props.goToLineNumberFunc(this.props.line_number)
        }
        else {
            window.blur();
            postWithCallback("host", "go_to_module_viewer_if_exists",
                {user_id: window.user_id,
                    tile_type: this.props.tile_type,
                    line_number: this.props.line_number}, (data)=>{
                    if (!data.success) {
                        window.open($SCRIPT_ROOT + "/view_location_in_creator/" + this.props.tile_type + "/" + this.props.line_number);
                    }
                    else {
                        window.open("", data.window_name)
                    }
                })
        }
    }

    render () {
        let content_dict = {__html: this.props.content};
        return(
            <Card interactive={true} elevation={Elevation.TWO} style={{marginBottom: 5}}>
                {this.props.title &&
                    <h6 style={{overflow: "auto"}}><a href="#">{this.props.title}</a></h6>
                }
                <div style={{fontSize: 13, overflow: "auto"}} dangerouslySetInnerHTML={content_dict}/>
                {this.props.has_link && <Button text="show" icon="eye-open" small={true} onClick={this._openError}/>
                }

            </Card>
        )
    }
}

ErrorItem.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    has_link: PropTypes.bool,
    line_number: PropTypes.number,
    goToLineNumberFunc: PropTypes.func,
    tile_type: PropTypes.string
};

ErrorItem.defaultProps = {
    title: null,
    has_link: false,
    line_number: null,
    goToLineNumberfunc: null,
    tile_type: null
};

class ErrorDrawer extends React.Component {
    render () {

        let items = this.props.contents.map((entry, index)=>{
            let content_dict = {__html: entry.content};
            let has_link = false;
            if (entry.hasOwnProperty("line_number")) {
                has_link = true;
            }
            return(
                <ErrorItem key={index} title={entry.title} content={entry.content} has_link={has_link}
                           goToLineNumberFunc={this.props.goToLineNumberFunc}
                           line_number={entry.line_number} tile_type={entry.tile_type}/>
            )
        });
        return (
            <Drawer
                    icon="console"
                    className={this.props.dark_theme ? "bp3-dark" : "light-theme"}
                    title={this.props.title}
                    isOpen={this.props.show_drawer}
                    position={this.props.position}
                    canOutsideClickClose={true}
                    onClose={this.props.onClose}
                    size={this.props.size}
                >
                <div className={Classes.DRAWER_BODY}>
                    <div className="d-flex flex-row justify-content-around mt-2">
                        <Button text="Clear All" onClick={this.props.clearAll}/>
                    </div>
                    <div className={Classes.DIALOG_BODY}>
                        {items}
                    </div>
                </div>
            </Drawer>
        )
    }
}

Status.propTypes = {
    show_drawer: PropTypes.bool,
    dark_theme: PropTypes.bool,
    contents: PropTypes.array,
    title: PropTypes.string,
    onClose: PropTypes.func,
    position: PropTypes.string,
    clearAll: PropTypes.func,
    goToLineNumberFunc: PropTypes.func,
    size: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number])
};

Status.defaultProps = {
    show_drawer: false,
    contents: [],
    position: "right",
    title: null,
    size: "30%",
    goToLineNumberfunc: null,
};