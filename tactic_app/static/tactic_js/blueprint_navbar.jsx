import React from "react";
import {Fragment, useState, useEffect, useRef, memo} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {
    Button,
    Navbar,
    NavbarGroup,
    NavbarHeading,
    NavbarDivider,
    OverflowList,
    Alignment,
    Switch
} from "@blueprintjs/core";

import {MenuComponent} from "./main_menus_react.js";
import {postWithCallback} from "./communication_react";

export {render_navbar, TacticNavbar, get_theme_cookie, set_theme_cookie}

const context_url = $SCRIPT_ROOT + '/context';
const library_url = $SCRIPT_ROOT + '/library';
const repository_url = $SCRIPT_ROOT + '/repository';
const account_url = $SCRIPT_ROOT + '/account_info';
const login_url = $SCRIPT_ROOT + "/login";

const padding = 10;

function get_theme_cookie() {
    let cookie_str = document.cookie.split('; ').find(row => row.startsWith('tactic_theme'));
    if (cookie_str == undefined) {
        set_theme_cookie("light");
        return "light"
    }
    return cookie_str.split('=')[1];
}

function set_theme_cookie(theme) {
    document.cookie = "tactic_theme=" + theme;
}

function TacticNavbar(props) {
    const [usable_width, set_usable_width] = useState(() => {
        return window.innerWidth - padding * 2
    });
    const [old_left_width, set_old_left_width] = useState(null);
    const lg_ref = useRef(null);
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
    });

    function getIntent(butname) {
        return props.selected == butname ? "primary" : null
    }

    function _onOverflow(items) {
        overflow_items = items
    }

    function _handle_signout() {
        window.open($SCRIPT_ROOT + "/logout/" + props.page_id, "_self");
        return false
    }

    function _setTheme(event) {
        if (window.user_id == undefined) {
            let theme = event.target.checked ? "dark" : "light";
            set_theme_cookie(theme);
        } else {
            const result_dict = {
                "user_id": window.user_id,
                "theme": event.target.checked ? "dark" : "light",
            };
            postWithCallback("host", "set_user_theme", result_dict,
                null, null);
        }
        if (props.setTheme) {
            props.setTheme(event.target.checked)
        }
    }

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

    let nav_class = props.menus == null ? "justify-content-end" : "justify-content-between";
    let right_nav_items = [];
    if (props.show_api_links) {
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
    let theme_class = props.dark_theme ? "bp5-dark" : "light-theme";
    let name_string = "Tactic";
    if (props.extra_text != null) {
        name_string += " " + props.extra_text
    }

    return (
        <Navbar style={{paddingLeft: 10}} className={theme_class}>
            <div className="bp5-navbar-group bp5-align-left" ref={lg_ref}>
                <NavbarHeading className="d-flex align-items-center">
                    <img className="mr-2" src={window.tactic_img_url} alt="" width="32 " height="32"/>
                    {name_string}
                </NavbarHeading>
                {props.menus != null && (
                    <Fragment>
                        {props.menus}
                    </Fragment>)}
            </div>


            <NavbarGroup align={Alignment.RIGHT} style={right_style}>
                <NavbarDivider/>
                <OverflowList items={right_nav_items}
                              overflowRenderer={_overflowRenderer}
                              visibleItemRenderer={renderNav}
                              onOverflow={_onOverflow}
                />

                <NavbarDivider/>
                <Switch
                    checked={props.dark_theme}
                    onChange={_setTheme}
                    large={false}
                    style={{marginBottom: 0}}
                    innerLabel="Light"
                    innerLabelChecked="Dark"
                    alignIndicator="center"
                />
            </NavbarGroup>
        </Navbar>
    )
}

TacticNavbar = memo(TacticNavbar);

TacticNavbar.propTypes = {
    is_authenticated: PropTypes.bool,
    user_name: PropTypes.string,
    menus: PropTypes.object,
    selected: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    page_id: PropTypes.string,
    extra_text: PropTypes.string,
    dark_theme: PropTypes.bool,
    setTheme: PropTypes.func,
    show_api_links: PropTypes.bool
};

TacticNavbar.defaultProps = {
    extra_text: null,
    refreshTab: null,
    closeTab: null,
    menus: null,
    selected: null,
    show_api_links: false,
    setTheme: null
};

function render_navbar(selected = null, show_api_links = false, dark_theme = false) {
    let domContainer = document.querySelector('#navbar-root');
    ReactDOM.render(<TacticNavbar is_authenticated={window.is_authenticated}
                                  selected={selected}
                                  show_api_links={show_api_links}
                                  dark_theme={dark_theme}
                                  user_name={window.username}/>, domContainer)
}