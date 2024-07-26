import React from "react";
import {createContext, memo, Fragment, useEffect, useState, useCallback} from "react";

import {Helmet} from 'react-helmet';

import {Drawer, Classes} from "@blueprintjs/core";

import {useStateAndRef, useCallbackStack} from "./utilities_react";
import {postAjax, postAjaxPromise} from "./communication_react";
import {doFlash} from "./toaster";
import {AccountTextField, AccountSelectField} from "./account_fields";

export {SettingsContext, withSettings}

const HIGHLIGHT_THEMES = {
    light: "github.css",
    dark: "github-dark.css",
};

const INITIAL_SETTINGS = {
    theme: "dark",
    preferred_dark_theme: "nord",
    preferred_light_theme: "github",
};

const SettingsContext = createContext(null);

function withSettings(WrappedComponent, lposition = "right", settings_drawer_size = "30%") {
    function newFunc(props) {
        const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
        const [settings, setSettings, settingsRef] = useStateAndRef(INITIAL_SETTINGS);

        const ChildElement = props.wrapped_element;

        useEffect(() => {
            initSocket(props.tsocket);
            postAjaxPromise('get_user_settings', {})
                .then((data) => {
                    setSettings(data.settings);
                })
                .catch((e) => {
                    console.log("error getting user settings");
                });
            return (() => {
                props.tsocket.disconnect();
            })
        }, []);

        const _onClose = useCallback(()=>{
            setShowSettingsDrawer(false);
        }, []);

        const isDark = useCallback(() => {
            return "theme" in settingsRef.current && settingsRef.current.theme === "dark"
        }, [settingsRef.current]);

        function initSocket() {
            props.tsocket.attachListener('user-settings-updated', (data) => {
                setSettings({...settingsRef.current, ...data.updates});
            });
        }

        const highlightTheme = "theme" in settingsRef.current ?
            HIGHLIGHT_THEMES[settingsRef.current.theme] : HIGHLIGHT_THEMES["dark"];

        return (
            <Fragment>
                <Helmet>
                    <link rel="stylesheet" href={`/static/tactic_css/${highlightTheme}`} type="text/css"/>
                </Helmet>
                <SettingsContext.Provider value={{
                    settings: settingsRef.current,
                    settingsRef: settingsRef,
                    setSettings: setSettings,
                    setShowSettingsDrawer: setShowSettingsDrawer,
                    isDark: isDark}}>
                    <WrappedComponent {...props}/>
                </SettingsContext.Provider>
                <SettingsDrawer showDrawer={showSettingsDrawer}
                                settings={settingsRef.current}
                                position={lposition}
                                size={settings_drawer_size}
                                onClose={_onClose}
                                title="Settings"
                />
            </Fragment>
        )
    }

    return memo(newFunc)
}

function SettingsDrawer(props) {
    const [fields, set_fields, fields_ref] = useStateAndRef([]);

    const pushCallback = useCallbackStack();

    useEffect(()=>{
        postAjax("get_user_settings", {}, (data)=> {
            set_fields(data.fields);
        })
    }, []);

    function _onFieldChange(fname, value, submit=false) {
        let new_fields = fields.map(fdict => {
            if (fdict.name == fname) {
                let ndict = {...fdict};
                ndict.val = value;
                return ndict
            }
            else {
                return fdict
            }
        });
        set_fields(new_fields);
        pushCallback(()=>{
            if (submit) {
                _submitUpdatedField(fname, value)
            }
        })
    }

    function _clearHelperText(fname) {
        _setHelperText(fname, null);
    }

    function _setHelperText(fname, helper_text, timeout=false) {
        // Need to use fields_ref here because of the setTimeout in which it appears.
        let new_fields = fields_ref.current.map(fdict => {
            if (fdict.name == fname) {
                let ndict = {...fdict};
                ndict.helper_text = helper_text;
                return ndict
            }
            else {
                return fdict
            }
        });
        set_fields(new_fields);
        pushCallback(()=>{
            if (timeout) {
                setTimeout(()=>{_clearHelperText(fname)}, 5000)
            }
        })
    }

    function _submitUpdatedField(fname, fvalue) {
        let data = {};
        data[fname] = fvalue;
        postAjax("update_settings", data, function (result) {
            if (result.success) {
                _setHelperText(fname, "value updated", true)
            }
            else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        })
    }

    function _getFieldItems() {
        let settings_items = [];
        for (let fdict of fields) {
            let new_item;
            if (fdict.type == "text") {
                new_item = (
                    <AccountTextField name={fdict.name}
                                      key={fdict.name}
                                      value={fdict.val}
                                      display_text={fdict.display_text}
                                      helper_text={fdict.helper_text}
                                      onBlur={_submitUpdatedField}
                                      onFieldChange={_onFieldChange}/>)
            }
            else {
                new_item = (
                    <AccountSelectField name={fdict.name}
                                        key={fdict.name}
                                        value={fdict.val}
                                        display_text={fdict.display_text}
                                        options={fdict.options}
                                        helper_text={fdict.helper_text}
                                        onFieldChange={_onFieldChange}/>)
            }
            settings_items.push(new_item)
        }
        return settings_items
    }
    const field_items = _getFieldItems();

    return (
        <Drawer
            icon="cog"
            className={props.settings.theme == "dark" ? "bp5-dark" : "light-theme"}
            title={props.title}
            isOpen={props.showDrawer}
            position={props.position}
            canOutsideClickClose={true}
            onClose={props.onClose}
            size={props.size}
        >
            <div className={Classes.DRAWER_BODY}>
                <div className={Classes.DIALOG_BODY}>
                    {field_items}
                </div>
            </div>
        </Drawer>
    )

}
