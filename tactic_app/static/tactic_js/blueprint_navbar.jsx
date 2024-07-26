import React from "react";
import {Fragment, useState, useEffect, useRef, useContext, memo} from "react";
import { createRoot } from 'react-dom/client';

import {
    Button,
    Navbar,
    NavbarGroup,
    NavbarHeading,
    NavbarDivider,
    OverflowList,
    Alignment
} from "@blueprintjs/core";

import {MenuComponent} from "./main_menus_react.js";
import {SettingsContext} from "./settings"

export {render_navbar, TacticNavbar}

const context_url = $SCRIPT_ROOT + '/context';
const library_url = $SCRIPT_ROOT + '/library';
const repository_url = $SCRIPT_ROOT + '/repository';
const account_url = $SCRIPT_ROOT + '/account_info';
const login_url = $SCRIPT_ROOT + "/login";

const padding = 10;

function TacticNavbar({extra_text = null, menus = null, selected = null, show_api_links = false, ...props}) {
    const [usable_width, set_usable_width] = useState(() => {
        return window.innerWidth - padding * 2
    });
    const [old_left_width, set_old_left_width] = useState(null);
    const lg_ref = useRef(null);
    const settingsContext = useContext(SettingsContext);

    var overflow_items = [];

    function _update_window_dimensions() {
        set_usable_width(window.innerWidth - 2 * padding)
    }

    // For some reason sizing things are a little flaky without old_left_width stuff
    useEffect(() => {
        window.addEventListener("resize", _update_window_dimensions);
        _update_window_dimensions();
        if (!old_left_width) {
            set_old_left_width(_getLeftWidth());
        } else {
            let new_left_width = _getLeftWidth();
            if (new_left_width != old_left_width) {
                set_old_left_width(new_left_width)
            }
        }
        return (()=>{
            window.removeEventListener("resize", _update_window_dimensions)
        })
    });

    function getIntent(butname) {
        return selected == butname ? "primary" : null
    }

    function _onOverflow(items) {
        overflow_items = items
    }

    function _handle_signout() {
        window.open($SCRIPT_ROOT + "/logout/" + props.page_id, "_self");
        return false
    }

    // function _setTheme(event) {
    //     let dtheme = event.target.checked ? "dark" : "light";
    //     set_theme_cookie(dtheme);
    //     if (window.user_id != undefined) {
    //         const result_dict = {
    //             "user_id": window.user_id,
    //             "theme": dtheme,
    //         };
    //         postWithCallback("host", "set_user_theme", result_dict,
    //             null, null);
    //     }
    //     theme.setTheme(event.target.checked)
    // }

    function renderNav(item) {
        return (
            <Button icon={item.icon} key={item.text} minimal={true} style={{minWidth: "fit-content"}}
                    text={item.text} intent={item.intent} onClick={item.onClick}/>
        )
    }

    function _getLeftWidth() {
        if (lg_ref && lg_ref.current) {
            return lg_ref.current.getBoundingClientRect().width;
        }
        return null
    }

    function _getRightWidth() {
        let lg_width = _getLeftWidth();
        if (lg_width) {
            return usable_width - lg_width - 35
        } else {
            return .25 * usable_width - 35
        }
    }

    function _authenticatedItems() {
        return [{
            icon: "add",
            text: "Context",
            intent: getIntent("library"),
            onClick: () => {
                window.open(context_url)
            }
        },
            {
                icon: "add",
                text: "Tabbed",
                intent: getIntent("library"),
                onClick: () => {
                    window.open(library_url)
                }
            },
            {
                icon: "database",
                text: "Repository",
                intent: getIntent("repository"),
                onClick: () => {
                    window.open(repository_url)
                }
            }, {
                icon: "person",
                text: props.user_name,
                intent: getIntent("account"),
                onClick: () => {
                    window.open(account_url)
                }
            }, {
                icon: "log-out",
                text: "Logout",
                intent: getIntent("logout"),
                onClick: _handle_signout
            }
        ]
    }

    function _notAuthenticatedItems() {
        return [{
            icon: "log-in", text: "Login", intent: getIntent("login"),
            onClick: () => {
                window.open(login_url)
            }
        }]
    }

    function _overflowRenderer() {
        let opt_dict = {};
        let icon_dict = {};
        for (let item of overflow_items) {
            opt_dict[item.text] = item.onClick;
            icon_dict[item.text] = item.icon;
        }
        return (
            <MenuComponent
                alt_button={() => (<span className="bp5-breadcrumbs-collapsed" style={{marginTop: 5}}></span>)}
                option_dict={opt_dict}
                binding_dict={{}}
                icon_dict={icon_dict}/>
        )
    }

    let nav_class = menus == null ? "justify-content-end" : "justify-content-between";
    let right_nav_items = [];
    if (show_api_links) {
        right_nav_items = [{
            icon: "code-block", text: "Api", intent: null, onClick: () => {
                window.open("https://tactic.readthedocs.io/en/latest/Tile-Commands.html")
            }
        },
            {
                icon: "code-block", text: "ObjApi", intent: null, onClick: () => {
                    window.open("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html")
                }
            }

        ]
    }
    right_nav_items.push({
            icon: "manual", text: "Docs", intent: null, onClick: () => {
                window.open("http://tactic.readthedocs.io/en/latest/index.html")
            }
        }
    );

    if (props.is_authenticated) {
        right_nav_items = right_nav_items.concat(_authenticatedItems())
    } else {
        right_nav_items = right_nav_items.concat(_notAuthenticatedItems())
    }
    let right_width = _getRightWidth();
    let right_style = {width: right_width};
    right_style.justifyContent = "flex-end";
    let theme_class = settingsContext.isDark() ? "bp5-dark" : "light-theme";
    let name_string = "Tactic";
    if (extra_text != null) {
        name_string += " " + extra_text
    }

    return (
        <Navbar style={{paddingLeft: 10}} className={theme_class}>
            <div className="bp5-navbar-group bp5-align-left" ref={lg_ref}>
                <NavbarHeading className="d-flex align-items-center">
                    <img className="mr-2" src={window.tactic_img_url} alt="" width="32 " height="32"/>
                    {name_string}
                </NavbarHeading>
                {menus != null && (
                    <Fragment>
                        {menus}
                    </Fragment>)}
            </div>


            <NavbarGroup align={Alignment.RIGHT} style={right_style}>
                <NavbarDivider/>
                <OverflowList items={right_nav_items}
                              overflowRenderer={_overflowRenderer}
                              visibleItemRenderer={renderNav}
                              onOverflow={_onOverflow}
                />

            </NavbarGroup>
        </Navbar>
    )
}

TacticNavbar = memo(TacticNavbar);

function render_navbar(selected = null, show_api_links = false, dark_theme = false) {
    const domContainer = document.querySelector('#navbar-root');
    const root = createRoot(domContainer);
    root.render(<TacticNavbar is_authenticated={window.is_authenticated}
                                  selected={selected}
                                  show_api_links={show_api_links}
                                  user_name={window.username}/>)
}