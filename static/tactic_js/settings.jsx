import React, {useContext} from "react";
import {createContext, memo, Fragment, useEffect, useState, useCallback} from "react";

import {Helmet} from 'react-helmet';

import {Drawer, Classes, Card, CardList} from "@blueprintjs/core";

import {useStateAndRef, useCallbackStack} from "./utilities_react";
import {postPromise, postAjax, postAjaxPromise} from "./communication_react";
import {doFlash} from "./toaster";
import {AccountTextField, AccountSelectField, AccountAddressSelectField} from "./account_fields";
import {useSocketListener} from "./tactic_socket";

export {SettingsContext, withSettings}

const HIGHLIGHT_THEMES = {
    light: "github.css",
    dark: "github-dark.css",
};

const INITIAL_SETTINGS = {
    theme: "dark",
    preferred_dark_theme: "nord",
    preferred_light_theme: "github",
    library_columns: ["created", "updated", "size"],

};

const SettingsContext = createContext(null);

function withSettings(WrappedComponent, lposition = "right", settings_drawer_size = "30%") {
    function newFunc(props) {
        const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
        const [, setSettings, settingsRef] = useStateAndRef(INITIAL_SETTINGS);
        const [, setFields, fieldsRef] = useStateAndRef([])

        const pushCallback = useCallbackStack();

        useEffect(() => {
            postAjaxPromise('get_with_settings_settings', {})
                .then((data) => {
                    setSettings(data.settings);
                    setFields(data.fields);
                })
                .catch(() => {
                    console.log("error getting user settings");
                });
            return (() => {
                props.tsocket.disconnect();
            })
        }, []);

        useSocketListener(props.tsocket, 'user-settings-updated', (data) => {
            setSettings({...settingsRef.current, ...data.updates});
            let new_fields = fieldsRef.current.map((fdict)=>{
                let new_dict = {...fdict};
                if (fdict.name in data.updates) {
                    new_dict.val = data.updates[fdict.name];
                }
                return new_dict;
            });
            setFields(new_fields);
        });

        const _onClose = useCallback(() => {
            setShowSettingsDrawer(false);
        }, []);

        const isDark = useCallback(() => {
            return "theme" in settingsRef.current && settingsRef.current.theme === "dark"
        }, [settingsRef.current]);

        function _clearHelperText(fname) {
            _setHelperText(fname, null);
        }

         function _setHelperText(fname, helper_text, timeout = false) {
                // Need to use fields_ref here because of the setTimeout in which it appears.
                let new_fields = fieldsRef.current.map(fdict => {
                    if (fdict.name == fname) {
                        let ndict = {...fdict};
                        ndict.helper_text = helper_text;
                        return ndict
                    } else {
                        return fdict
                    }
                });
                setFields(new_fields);
                pushCallback(() => {
                    if (timeout) {
                        setTimeout(() => {
                            _clearHelperText(fname)
                        }, 5000)
                    }
                })
            }

        function toggleSettingsDrawer() {
            setShowSettingsDrawer(!showSettingsDrawer)
        }

        function updateSetting(fname, fvalue) {
            let data = {};
            data[fname] = fvalue;
            postAjax("update_settings", data, function (result) {
                if (!result.success) {
                    console.log("Error updating setting", fname, fvalue);
                }
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
                    fields: fieldsRef.current,
                    fieldsRef: fieldsRef,
                    setSettings: setSettings,
                    updateSetting: updateSetting,
                    setShowSettingsDrawer: setShowSettingsDrawer,
                    toggleSettingsDrawer: toggleSettingsDrawer,
                    isDark: isDark
                }}>
                    <WrappedComponent {...props}/>
                    <SettingsDrawer showDrawer={showSettingsDrawer}
                                fields={fieldsRef.current}
                                settings={settingsRef.current}
                                position={lposition}
                                size={settings_drawer_size}
                                onClose={_onClose}
                                setHelperText={_setHelperText}
                                title="Settings"
                />
                </SettingsContext.Provider>

            </Fragment>
        )
    }

    return memo(newFunc)
}

function SettingsDrawer(props) {

    const pushCallback = useCallbackStack();

    function _onFieldChange(fname, value, submit = false) {
        pushCallback(() => {
            if (submit) {
                _submitUpdatedField(fname, value)
            }
        })
    }

    function _submitUpdatedField(fname, fvalue) {
        let data = {};
        data[fname] = fvalue;
        postPromise("host", "update_settings", data)
            .then(() => {
                props.setHelperText(fname, "value updated", true)
            })
            .catch(() => {
                data.alert_type = "alert-warning";
                doFlash(data);
            })
    }

    function _getFieldItems() {
        let settings_items = {};
        for (let fdict of props.fields) {
            let new_item;
            if (fdict.name == "use_ai_code_suggestions" && !window.has_openapi_key) {
                continue;
            }
            if (!fdict.settings_drawer) {
                continue;
            }
            if (fdict.type == "text") {
                new_item = (
                    <AccountTextField name={fdict.name}
                                      key={fdict.name}
                                      value={fdict.val}
                                      display_text={fdict.display_text}
                                      helper_text={fdict.helper_text}
                                      onBlur={_submitUpdatedField}
                                      onFieldChange={_onFieldChange}/>)
            } else if (fdict.type == "pool_select") {
                new_item = (
                    <AccountAddressSelectField
                        name={fdict.name}
                        key={fdict.name}
                        value={fdict.val}
                        display_text={fdict.display_text}
                        helper_text={fdict.helper_text}
                        onFieldChange={_onFieldChange}/>)
            } else {
                new_item = (
                    <AccountSelectField name={fdict.name}
                                        key={fdict.name}
                                        inline={false}
                                        value={fdict.val}
                                        display_text={fdict.display_text}
                                        options={fdict.options}
                                        helper_text={fdict.helper_text}
                                        onFieldChange={_onFieldChange}/>)
            }
            if (fdict["settingsDrawerCategory"] in settings_items) {
                settings_items[fdict["settingsDrawerCategory"]].push(new_item)
            }
            else {
                settings_items[fdict["settingsDrawerCategory"]] = [new_item]
            }
        }
        return settings_items
    }

    const field_items = _getFieldItems();

    let field_cards = []

    for (let category in field_items) {
        let new_card = (
            <Card key={category} className="settings-drawer-card">
                <h5 className="bp6-heading">{category}</h5>
                {field_items[category]}
            </Card>
        )
        field_cards.push(new_card)
    }

    return (
        <Drawer
            icon="cog"
            className={props.settings.theme == "dark" ? "bp6-dark" : "light-theme"}
            title={props.title}
            isOpen={props.showDrawer}
            position={props.position}
            canOutsideClickClose={false}
            onClose={props.onClose}
            hasBackdrop={false}
            size={props.size}
        >
            <div className={Classes.DRAWER_BODY}>
                <div className={Classes.DIALOG_BODY}>
                    <CardList>
                        {field_cards}
                    </CardList>
                </div>
            </div>
        </Drawer>
    )

}
