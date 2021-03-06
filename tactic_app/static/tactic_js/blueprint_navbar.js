

import React from "react";
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Button, Navbar, NavbarDivider, OverflowList, Alignment, Switch } from "@blueprintjs/core";

import { MenuComponent } from "./main_menus_react.js";
import { doBinding, doSignOut } from "./utilities_react.js";
import { postWithCallback } from "./communication_react";

export { render_navbar, TacticNavbar, get_theme_cookie, set_theme_cookie };

let library_url = $SCRIPT_ROOT + '/library';
let repository_url = $SCRIPT_ROOT + '/repository';
let account_url = $SCRIPT_ROOT + '/account_info';
let login_url = $SCRIPT_ROOT + "/login";

const padding = 10;

function get_theme_cookie() {
    let cookie_str = document.cookie.split('; ').find(row => row.startsWith('tactic_theme'));
    if (cookie_str == undefined) {
        set_theme_cookie("light");
        return "light";
    }
    return cookie_str.split('=')[1];
}

function set_theme_cookie(theme) {
    document.cookie = "tactic_theme=" + theme;
}

class TacticNavbar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.lg_ref = React.createRef();
        this.state = {
            usable_width: window.innerWidth - padding * 2,
            old_left_width: 0
        };
        this.overflow_items = [];
        this.update_state_vars = ["usable_width", "old_left_width"];
        this.update_props = ["is_authenticated", "user_name", "menus", "selected", "show_api_links", "dark_theme"];
    }

    shouldComponentUpdate(nextProps, nextState) {
        for (let prop of this.update_props) {
            if (nextProps[prop] != this.props[prop]) {
                return true;
            }
        }
        for (let state of this.update_state_vars) {
            if (nextState[state] != this.state[state]) {
                return true;
            }
        }
        return false;
    }

    componentDidMount() {
        window.addEventListener("resize", this._update_window_dimensions);
        this._update_window_dimensions();
        this.setState({ old_left_width: this._getLeftWidth() });
        this.last_theme = this.props.dark_theme;
    }

    // For some reason sizing things are a little flaky without old_left_width stuff
    componentDidUpdate() {
        let new_left_width = this._getLeftWidth();
        if (new_left_width != this.state.old_left_width) {
            this.setState({ old_left_width: new_left_width });
        }
    }

    _update_window_dimensions() {
        this.setState({
            "usable_width": window.innerWidth - 2 * padding
        });
    }

    handle_signout() {
        doSignOut(window.page_id);
    }

    _toggleTheme() {
        const result_dict = {
            "user_id": window.user_id,
            "theme": !this.props.dark_theme ? "dark" : "light"
        };
        postWithCallback("host", "set_user_theme", result_dict, null, null);
        if (this.props.set_parent_theme) {
            this.props.set_parent_theme(!this.props.dark_theme);
        }
    }
    _setTheme(event) {
        if (window.user_id == undefined) {
            let theme = event.target.checked ? "dark" : "light";
            set_theme_cookie(theme);
        } else {
            const result_dict = {
                "user_id": window.user_id,
                "theme": event.target.checked ? "dark" : "light"
            };
            postWithCallback("host", "set_user_theme", result_dict, null, null);
        }
        if (this.props.set_parent_theme) {
            this.props.set_parent_theme(event.target.checked);
        }
    }

    getIntent(butname) {
        return this.props.selected == butname ? "primary" : null;
    }

    renderNav(item) {
        return React.createElement(Button, { icon: item.icon, key: item.text, minimal: true, text: item.text, intent: item.intent, onClick: item.onClick });
    }

    _getLeftWidth() {
        if (this.lg_ref && this.lg_ref.current) {
            return this.lg_ref.current.getBoundingClientRect().width;
        }
        return null;
    }

    _getRightWidth() {
        let lg_width = this._getLeftWidth();
        if (lg_width) {
            return this.state.usable_width - lg_width - 35;
        } else {
            return .25 * this.state.usable_width - 35;
        }
    }

    _authenticatedItems() {
        return [{
            icon: "home", text: "Library", intent: this.getIntent("library"),
            onClick: () => {
                window.open(library_url);
            }
        }, {
            icon: "database", text: "Repository", intent: this.getIntent("repository"),
            onClick: () => {
                window.open(repository_url);
            }
        }, {
            icon: "person", text: this.props.user_name, intent: this.getIntent("account"),
            onClick: () => {
                window.open(account_url);
            }
        }, {
            icon: "log-out", text: "Logout", intent: this.getIntent("logout"),
            onClick: this.handle_signout
        }];
    }

    _notAuthenticatedItems() {
        return [{
            icon: "log-in", text: "Login", intent: this.getIntent("login"),
            onClick: () => {
                window.open(login_url);
            }
        }];
    }

    _onOverflow(items) {
        this.overflow_items = items;
    }

    _overflowRenderer() {
        let opt_dict = {};
        let icon_dict = {};
        for (let item of this.overflow_items) {
            opt_dict[item.text] = item.onClick;
            icon_dict[item.text] = item.icon;
        }
        return React.createElement(MenuComponent, { alt_button: () => React.createElement('span', { className: 'bp3-breadcrumbs-collapsed', style: { marginTop: 5 } }),
            option_dict: opt_dict,
            icon_dict: icon_dict });
    }

    render() {
        let nav_class = this.props.menus == null ? "justify-content-end" : "justify-content-between";
        let right_nav_items = [];
        if (this.props.show_api_links) {
            right_nav_items = [{ icon: "code-block", text: "Api", intent: null, onClick: () => {
                    window.open("https://tactic.readthedocs.io/en/latest/Tile-Commands.html");
                } }, { icon: "code-block", text: "ObjApi", intent: null, onClick: () => {
                    window.open("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html");
                } }];
        }
        right_nav_items.push({ icon: "manual", text: "Docs", intent: null, onClick: () => {
                window.open("http://tactic.readthedocs.io/en/latest/index.html");
            } });

        if (this.props.is_authenticated) {
            right_nav_items = right_nav_items.concat(this._authenticatedItems());
        } else {
            right_nav_items = right_nav_items.concat(this._notAuthenticatedItems());
        }
        let right_width = this._getRightWidth();
        let right_style = { width: right_width };
        right_style.justifyContent = "flex-end";
        let theme_class = this.props.dark_theme ? "bp3-dark" : "light-theme";
        return React.createElement(
            Navbar,
            { style: { paddingLeft: 10 }, className: theme_class },
            React.createElement(
                'div',
                { className: 'bp3-navbar-group bp3-align-left', ref: this.lg_ref },
                React.createElement(
                    Navbar.Heading,
                    { className: 'd-flex align-items-center' },
                    React.createElement('img', { className: 'mr-2', src: window.tactic_img_url, alt: '', width: '32 ', height: '32' }),
                    'Tactic'
                ),
                this.props.menus != null && React.createElement(
                    React.Fragment,
                    null,
                    this.props.menus
                )
            ),
            React.createElement(
                Navbar.Group,
                { align: Alignment.RIGHT, style: right_style },
                React.createElement(NavbarDivider, null),
                React.createElement(OverflowList, { items: right_nav_items,
                    overflowRenderer: this._overflowRenderer,
                    visibleItemRenderer: this.renderNav,
                    onOverflow: this._onOverflow
                }),
                React.createElement(NavbarDivider, null),
                React.createElement(Switch, {
                    checked: this.props.dark_theme,
                    onChange: this._setTheme,
                    large: false,
                    style: { marginBottom: 0 },
                    innerLabel: 'Light',
                    innerLabelChecked: 'Dark',
                    alignIndicator: 'center'
                })
            )
        );
    }
}

TacticNavbar.propTypes = {
    is_authenticated: PropTypes.bool,
    user_name: PropTypes.string,
    menus: PropTypes.object,
    selected: PropTypes.string,
    dark_theme: PropTypes.bool,
    set_parent_theme: PropTypes.func
};

TacticNavbar.defaultProps = {
    menus: null,
    selected: null,
    show_api_links: false,
    dark_theme: false,
    set_parent_theme: null
};

function render_navbar(selected = null, show_api_links = false, dark_theme = false) {
    let domContainer = document.querySelector('#navbar-root');
    ReactDOM.render(React.createElement(TacticNavbar, { is_authenticated: window.is_authenticated,
        selected: selected,
        show_api_links: show_api_links,
        dark_theme: dark_theme,
        user_name: window.username }), domContainer);
}