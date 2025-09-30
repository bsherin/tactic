import React from "react";
import {Fragment, useRef, useContext, memo} from "react";
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

function TacticNavbar({extra_text = null, menus = null, selected = null, show_api_links = false, ...props}) {
    const lg_ref = useRef(null);
    const settingsContext = useContext(SettingsContext);

    let overflow_items = [];

    function getIntent(butname) {
        return selected == butname ? "primary" : null
    }

    function _onOverflow(items) {
        overflow_items = items
    }

    function _handle_signout() {
        window.open($SCRIPT_ROOT + "/logout/" + props.global_id, "_self");
        return false
    }

    function renderNav(item) {
        return (
            <Button icon={item.icon} key={item.text} variant="minimal" style={{minWidth: "fit-content"}}
                    text={item.text} intent={item.intent} onClick={item.onClick}/>
        )
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
                alt_button={() => (<span className="bp6-breadcrumbs-collapsed" style={{marginTop: 5}}></span>)}
                option_dict={opt_dict}
                binding_dict={{}}
                icon_dict={icon_dict}/>
        )
    }

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
    let theme_class = settingsContext.isDark() ? "bp6-dark" : "light-theme";
    let name_string = "Tactic";
    if (extra_text != null) {
        name_string += " " + extra_text
    }

    return (
        <Navbar style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            paddingLeft: 10}}
                className={theme_class}>

            <div className="bp6-navbar-group bp6-align-left" ref={lg_ref}>
                <NavbarHeading className="d-flex align-items-center">
                    <img className="mr-2" src={window.tactic_img_url} alt="" width="32 " height="32"/>
                    {name_string}
                </NavbarHeading>
                {menus != null && (
                    <Fragment>
                        {menus}
                    </Fragment>)}
            </div>


            <NavbarGroup align={Alignment.RIGHT}
                         style={{
                             justifyContent: "flex-end",
                             flex: "1 1 0",
                             overflow: "hidden"}}>
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

function render_navbar(selected = null, show_api_links = false) {
    const domContainer = document.querySelector('#navbar-root');
    const root = createRoot(domContainer);
    root.render(<TacticNavbar is_authenticated={window.is_authenticated}
                                  selected={selected}
                                  show_api_links={show_api_links}
                                  user_name={window.username}/>)
}