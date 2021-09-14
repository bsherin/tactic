

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { Button, Navbar, NavbarDivider, OverflowList, Alignment, Switch} from "@blueprintjs/core";

import {MenuComponent} from "./main_menus_react.js";
import {doBinding} from "./utilities_react.js";
import {postWithCallback} from "./communication_react";
import {TacticContext} from "./tactic_context.js";
import {TopRightButtons} from "./blueprint_react_widgets";

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

class TacticNavbar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.lg_ref = React.createRef();
        this.state = {
            usable_width: window.innerWidth - padding * 2,
            old_left_width: 0,
        };
        this.overflow_items = [];
        this.update_state_vars = ["usable_width", "old_left_width"];
        this.update_props = ["is_authenticated", "user_name", "menus", "selected", "show_api_links", "dark_theme"]
    }


    shouldComponentUpdate(nextProps, nextState) {
        for (let prop of this.update_props) {
            if (nextProps[prop] != this.props[prop]) {
                return true
            }
        }
        for (let state of this.update_state_vars) {
            if (nextState[state] != this.state[state]) {
                return true
            }
        }
        return false
    }

    componentDidMount() {
        window.addEventListener("resize", this._update_window_dimensions);
        this._update_window_dimensions();
        this.setState({old_left_width: this._getLeftWidth()});
        this.last_theme = this.context.dark_theme
    }

    // For some reason sizing things are a little flaky without old_left_width stuff
    componentDidUpdate() {
        let new_left_width = this._getLeftWidth();
        if (new_left_width != this.state.old_left_width) {
            this.setState({old_left_width: new_left_width})
        }
    }

    _update_window_dimensions() {
        this.setState({
            "usable_width": window.innerWidth - 2 * padding,
        });
    }

    _handle_signout () {
        window.open($SCRIPT_ROOT + "/logout/" + this.props.page_id, "_self");
        return false
    }

    _toggleTheme () {
        const result_dict = {
            "user_id": window.user_id,
            "theme": !this.context.dark_theme ? "dark" : "light",
        };
        postWithCallback("host", "set_user_theme", result_dict,
                    null, null);
        if (this.context.setTheme) {
            this.context.setTheme(!this.context.dark_theme)
        }

    }
    _setTheme (event) {
        if (window.user_id == undefined) {
            let theme = event.target.checked ? "dark" : "light";
            set_theme_cookie(theme);
        }
        else {
            const result_dict = {
                "user_id": window.user_id,
                "theme": event.target.checked ? "dark" : "light",
            };
            postWithCallback("host", "set_user_theme", result_dict,
                        null, null);
        }
        if (this.context.setTheme) {
            this.context.setTheme(event.target.checked)
        }
    }

    getIntent(butname) {
        return this.props.selected == butname ? "primary" : null
    }

    renderNav(item) {
        return (
           <Button icon={item.icon} key={item.text} minimal={true} text={item.text} intent={item.intent} onClick={item.onClick}/>
        )
    }

    _getLeftWidth() {
        if (this.lg_ref && this.lg_ref.current) {
            return this.lg_ref.current.getBoundingClientRect().width;
        }
        return null
    }

    _getRightWidth() {
        let lg_width = this._getLeftWidth();
        if (lg_width) {
            return this.state.usable_width - lg_width - 35
        }
        else {
            return .25 * this.state.usable_width - 35
        }
    }

    _authenticatedItems() {
        return [{
                    icon: "add",
                    text: "Context",
                    intent: this.getIntent("library"),
                    onClick: ()=>{window.open(context_url)}
                },
                 {
                    icon: "add",
                    text: "Tabbed",
                    intent: this.getIntent("library"),
                    onClick: ()=>{window.open(library_url)}
                },
                {
                    icon: "database",
                    text: "Repository",
                    intent: this.getIntent("repository"),
                    onClick: ()=>{window.open(repository_url)}
                }, {
                    icon: "person",
                    text: this.props.user_name,
                    intent: this.getIntent("account"),
                    onClick: ()=>{window.open(account_url)}
                }, {
                    icon: "log-out",
                    text: "Logout",
                    intent: this.getIntent("logout"),
                    onClick: this._handle_signout
            }
        ]
    }

    _notAuthenticatedItems() {
        return [{
                icon: "log-in", text: "Login", intent: this.getIntent("login"),
                    onClick: ()=>{window.open(login_url)}
                }
        ]
    }

    _onOverflow(items){
        this.overflow_items = items
    }

    _overflowRenderer() {
        let opt_dict = {};
        let icon_dict = {};
        for (let item of this.overflow_items) {
            opt_dict[item.text] = item.onClick;
            icon_dict[item.text] = item.icon;
        }
        return (
            <MenuComponent alt_button={()=>(<span className="bp3-breadcrumbs-collapsed" style={{marginTop: 5}}></span>)}
                           option_dict={opt_dict}
                           icon_dict={icon_dict}/>
        )
    }

    render () {
        let nav_class = this.props.menus == null ? "justify-content-end" : "justify-content-between";
        let right_nav_items = [];
        if (this.props.show_api_links) {
            right_nav_items = [{icon: "code-block", text: "Api", intent: null, onClick: ()=>{
                        window.open("https://tactic.readthedocs.io/en/latest/Tile-Commands.html")}},
                {icon: "code-block", text: "ObjApi", intent: null, onClick: ()=>{
                        window.open("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html")}}

            ]
        }
        right_nav_items.push({icon: "manual", text: "Docs", intent: null, onClick: ()=>{
                        window.open("http://tactic.readthedocs.io/en/latest/index.html")}}
        );

        if (this.props.is_authenticated) {
           right_nav_items = right_nav_items.concat(this._authenticatedItems())
        }
        else {
            right_nav_items = right_nav_items.concat(this._notAuthenticatedItems())
        }
        let right_width = this._getRightWidth();
        let right_style = {width: right_width};
        right_style.justifyContent = "flex-end";
        let theme_class = this.context.dark_theme ? "bp3-dark" : "light-theme";
        if (this.props.min_navbar) {
            return (
                <Navbar style={{paddingLeft: 10, height: 30}} className={theme_class}>
                    <div style={{height: 30}} className="bp3-navbar-group bp3-align-left" ref={this.lg_ref}>
                            {this.props.menus != null && (
                                <React.Fragment>
                                    {this.props.menus}
                                </React.Fragment>)}
                    </div>
                    {window.in_context &&
                        <TopRightButtons refreshTab={this.props.refreshTab} closeTab={this.props.closeTab}/>
                    }
                </Navbar>
            )
        }
        return (
            <Navbar style={{paddingLeft: 10}} className={theme_class}>
                <div className="bp3-navbar-group bp3-align-left" ref={this.lg_ref}>
                    <Navbar.Heading className="d-flex align-items-center">
                        <img className="mr-2" src={window.tactic_img_url} alt="" width="32 " height="32"/>
                         Tactic
                    </Navbar.Heading>
                        {this.props.menus != null && (
                            <React.Fragment>
                                {this.props.menus}
                            </React.Fragment>)}
                </div>


                <Navbar.Group align={Alignment.RIGHT} style={right_style}>
                <NavbarDivider />
                    <OverflowList items={right_nav_items}
                                     overflowRenderer={this._overflowRenderer}
                                     visibleItemRenderer={this.renderNav}
                                     onOverflow={this._onOverflow}
                                     />

                <NavbarDivider />
                <Switch
                       checked={this.context.dark_theme}
                       onChange={this._setTheme}
                       large={false}
                       style={{marginBottom: 0}}
                       innerLabel="Light"
                       innerLabelChecked="Dark"
                       alignIndicator="center"
                />
                </Navbar.Group>
            </Navbar>
        )
    }
}

TacticNavbar.propTypes = {
    min_navbar: PropTypes.bool,
    refreshTab: PropTypes.func,
    closeTab: PropTypes.func,
    is_authenticated: PropTypes.bool,
    user_name: PropTypes.string,
    menus: PropTypes.object,
    selected: PropTypes.string,
    page_id: PropTypes.string,
};

TacticNavbar.defaultProps = {
    min_navbar: false,
    refreshTab: null,
    closeTab: null,
    menus: null,
    selected: null,
    show_api_links: false,
};

TacticNavbar.contextType = TacticContext;

function render_navbar (selected=null, show_api_links=false, dark_theme=false) {
    let domContainer = document.querySelector('#navbar-root');
    ReactDOM.render(<TacticNavbar is_authenticated={window.is_authenticated}
                                  selected={selected}
                                  show_api_links={show_api_links}
                                  dark_theme={dark_theme}
                                  user_name={window.username}/>, domContainer)
}