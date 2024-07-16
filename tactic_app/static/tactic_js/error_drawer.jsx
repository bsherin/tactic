import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useContext, createContext, useCallback} from "react";

import {Card, Elevation, Drawer, Classes, Button, Icon} from "@blueprintjs/core";

import {postWithCallback} from "./communication_react";
import {GlyphButton} from "./blueprint_react_widgets";

import {useStateAndRef} from "./utilities_react";
import {ThemeContext} from "./theme";

const ErrorDrawerContext = createContext(null);
export {withErrorDrawer, ErrorItem, ErrorDrawerContext}


function withErrorDrawer(WrappedComponent, lposition = "right", error_drawer_size = "30%") {
    function WithErrorComponent(props) {
        const [show_drawer, set_show_drawer] = useState(false);
        const [contents, set_contents, contents_ref] = useStateAndRef({}); // the ref is necessary.



        const goToLineNumber = useRef(null);
        const ucounter = useRef(0);
        const local_id = useRef(props.main_id ? props.main_id : props.library_id);

        const goToModule = useRef(null);

        useEffect(() => {
            initSocket();
            return (() => {
                goToLineNumber.current = null;
                ucounter.current = null;
                local_id.current = null;
            })
        }, []);


        function initSocket() {
            props.tsocket.attachListener('add-error-drawer-entry', _addEntry);
        }

        const _registerGoToModule = useCallback((the_func) =>{
            goToModule.current = the_func
        }, []);

        const _close = useCallback((data) =>  {
            if (data == null || !("main_id" in data) || (data.main_id == local_id.current)) {
                set_show_drawer(false)
            }
        }, [local_id.current]);

        const _open = useCallback((data) => {
            if (data == null || !("main_id" in data) || (data.main_id == local_id.current)) {
                set_show_drawer(true)
            }
        }, [local_id.current]);

        const _toggle = useCallback((data) => {
            if (data == null || !("main_id" in data) || (data.main_id == local_id.current)) {
                set_show_drawer(!show_drawer)
            }
        }, [local_id.current]);

        const _addEntry = useCallback((data, open = true) => {
            ucounter.current = ucounter.current + 1;
            const newcontents = {...contents_ref.current};
            newcontents[String(ucounter.current)] = data;
            set_contents(newcontents);
            set_show_drawer(open);
        }, [contents_ref.current, ucounter.current]);

        const _addFromError = useCallback((title, data, open = true) =>{
            let content = "";
            if ("message" in data){
                content = data.message
            }
            else if (typeof data == "string") {
                content = data
            }
            _addEntry({
                title: title,
                content: content
            }, open);
        }, []);

        const _closeEntry = useCallback((ukey)=>{
            const newcontents = {...contents_ref.current};
            delete newcontents[ukey];
            set_contents(newcontents);
            set_show_drawer(false)
        }, [contents_ref.current]);

        const _postAjaxFailure = useCallback((qXHR, textStatus, errorThrown) => {
            _addEntry({
                title: "Post Ajax Failure: {}".format(textStatus),
                content: errorThrown
            })
        }, []);

        const _clearAll = useCallback((data) =>{
            if (data == null || !("main_id" in data) || (data.main_id == props.main_id)) {
                set_contents([]);
                set_show_drawer(false)
            }
        }, [props.main_id]);

        const _onClose = useCallback(()=>{
            set_show_drawer(false);
        }, []);

        const _setGoToLineNumber = useCallback((gtfunc) =>{
            goToLineNumber.current = gtfunc
        }, []);

        const [errorDrawerFuncs, setErrorDrawerFuncs, errorDrawerFuncsRef] = useStateAndRef({
            openErrorDrawer: _open,
            closeErrorDrawer: _close,
            clearErrorDrawer: _clearAll,
            addErrorDrawerEntry: _addEntry,
            addFromError: _addFromError,
            postAjaxFailure: _postAjaxFailure,
            toggleErrorDrawer: _toggle,
            setGoToLineNumber: _setGoToLineNumber,
            registerGoToModule: _registerGoToModule
        });

        useEffect(() => {
            setErrorDrawerFuncs({
                openErrorDrawer: _open,
                closeErrorDrawer: _close,
                clearErrorDrawer: _clearAll,
                addErrorDrawerEntry: _addEntry,
                addFromError: _addFromError,
                postAjaxFailure: _postAjaxFailure,
                toggleErrorDrawer: _toggle,
                setGoToLineNumber: _setGoToLineNumber,
                registerGoToModule: _registerGoToModule
            })
        }, [local_id.current, contents_ref.current, ucounter.current]);

        return (
            <Fragment>
                <ErrorDrawerContext.Provider value={errorDrawerFuncs}>
                    <WrappedComponent {...props}
                                      errorDrawerFuncs={errorDrawerFuncsRef.current}
                    />
                </ErrorDrawerContext.Provider>
                <ErrorDrawer show_drawer={show_drawer}
                             contents={contents_ref}
                             position={lposition}
                             error_drawer_size={error_drawer_size}
                             local_id={local_id.current}
                             handleCloseItem={_closeEntry}
                             goToLineNumberFunc={goToLineNumber.current}
                             goToModule={goToModule}
                             closeErrorDrawer={_close}
                             title="Error Drawer"
                             size={error_drawer_size}
                             onClose={_onClose}
                             clearAll={_clearAll}/>
            </Fragment>
        )
    }
    return memo(WithErrorComponent)
}

function ErrorItem(props) {
    props = {
        title: null,
        has_link: false,
        line_number: null,
        goToLineNumberfunc: null,
        tile_type: null,
        ...props
    };

    function _openError() {
        if (!window.in_context) {
            window.blur();
            postWithCallback("host", "go_to_module_viewer_if_exists",
                {
                    user_id: window.user_id,
                    tile_type: props.tile_type,
                    line_number: props.line_number
                }, (data) => {
                    if (!data.success) {
                        window.open($SCRIPT_ROOT + "/view_location_in_creator/" + props.tile_type + "/" + props.line_number);
                    } else {
                        window.open("", data.window_name)
                    }
                }, null, props.local_id)
        } else {
            props.closeErrorDrawer();
            props.goToModule.current(props.tile_type, props.line_number)
        }
    }

    let content_dict = {__html: props.content};
    return (
        <Card interactive={true} elevation={Elevation.TWO} style={{marginBottom: 5, position: "relative"}}>
            {props.title &&
                <h6 style={{overflow: "auto"}}>
                    <span>
                        <Icon icon="issue" size={16}/>
                        <a href="#" style={{marginLeft: 10}}>{props.title}</a>
                    </span>
                </h6>
            }
            <GlyphButton handleClick={() => {
                            props.handleCloseItem(props.ukey)
                        }}
                         style={{position: "absolute", right: 5, top: 5}}
                         icon="cross"/>
            <div style={{fontSize: 13, overflow: "auto"}} dangerouslySetInnerHTML={content_dict}/>
            {props.has_link && <Button text="show" icon="eye-open" small={true} onClick={_openError}/>
            }

        </Card>
    )
}

ErrorItem = memo(ErrorItem);

function ErrorDrawer(props) {
    props = {
        show_drawer: false,
        contents: [],
        position: "right",
        title: null,
        size: "30%",
        goToLineNumberfunc: null,
        ...props
    };

    const theme = useContext(ThemeContext);

    let sorted_keys = [...Object.keys(props.contents.current)];
    sorted_keys.sort(function (a, b) {
        return parseInt(b) - parseInt(a);
    });
    let items = sorted_keys.map((ukey, index) => {
        let entry = props.contents.current[ukey];
        let content_dict = {__html: entry.content};
        let has_link = false;
        if (entry.hasOwnProperty("line_number")) {
            has_link = true;
        }
        return (
            <ErrorItem ukey={ukey} title={entry.title} content={entry.content} has_link={has_link}
                       key={ukey}
                       local_id={props.local_id}
                       handleCloseItem={props.handleCloseItem}
                       openErrorDrawer={props.openErrorDrawer}
                       closeErrorDrawer={props.closeErrorDrawer}
                       goToLineNumberFunc={props.goToLineNumberFunc}
                       goToModule={props.goToModule}
                       line_number={entry.line_number} tile_type={entry.tile_type}/>
        )
    });

    return (
        <Drawer
            icon="console"
            className={theme.dark_theme ? "bp5-dark" : "light-theme"}
            title={props.title}
            isOpen={props.show_drawer}
            position={props.position}
            canOutsideClickClose={true}
            onClose={props.onClose}
            size={props.size}
        >
            <div className={Classes.DRAWER_BODY}>
                <div className="d-flex flex-row justify-content-around mt-2">
                    <Button text="Clear All" onClick={props.clearAll}/>
                </div>
                <div className={Classes.DIALOG_BODY}>
                    {items}
                </div>
            </div>
        </Drawer>
    )
}

ErrorDrawer = memo(ErrorDrawer);
