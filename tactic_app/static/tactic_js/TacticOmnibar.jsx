import React from "react";
import {memo} from "react";
import PropTypes from 'prop-types';

import {Omnibar} from "@blueprintjs/select"
import {MenuItem} from "@blueprintjs/core";

import {postWithCallback} from "./communication_react";

export {TacticOmnibar}

const context_url = $SCRIPT_ROOT + '/context';
const library_url = $SCRIPT_ROOT + '/library';
const repository_url = $SCRIPT_ROOT + '/repository';
const account_url = $SCRIPT_ROOT + '/account_info';
const login_url = $SCRIPT_ROOT + "/login";

function TacticOmnibarItem(props) {
    function _handleClick() {
        props.handleClick(props.item)
    }

    return (
        <MenuItem
            icon={props.item.icon_name}
            active={props.modifiers.active}
            text={props.item.display_text}
            label={props.item.category}
            key={props.item.search_text}
            onClick={_handleClick}
            shouldDismissPopover={true}
        />
    );
}

TacticOmnibarItem.propTypes = {
    item: PropTypes.object,
    modifiers: PropTypes.object,
    handleClick: PropTypes.func
};

TacticOmnibarItem = memo(TacticOmnibarItem);

function _itemRenderer(item, {modifiers, handleClick}) {
    return <TacticOmnibarItem modifiers={modifiers} item={item} handleClick={handleClick}/>
}

function _itemPredicate(query, item) {
    if (query.length == 0) {
        return false
    }
    let lquery = query.toLowerCase();
    let re = new RegExp(query);

    return re.test(item.search_text.toLowerCase()) || re.test(item.category.toLowerCase())
}

function TacticOmnibar(props) {

    function _onItemSelect(item) {
        item.the_function();
        props.closeOmnibar()
    }

    function _handle_signout() {
        window.open($SCRIPT_ROOT + "/logout/" + props.page_id, "_self");
        return false
    }

    function _globalOmniItems() {
        function wopenfunc(the_url) {
            return () => {
                window.open(the_url)
            }
        }

        let omni_funcs = [
            ["Toggle Theme", "account", _toggleTheme, "contrast"],
            ["Docs", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"),
                "log-out"],
            ["Tile Commands", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Tile-Commands.html"),
                "code-block"],
            ["Object Api", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"),
                "code-block"],
        ];
        if (props.is_authenticated) {
            let new_funcs = [
                ["New Context Tab", "window", wopenfunc(context_url), "add"],
                ["New Tabbed Window", "window", wopenfunc(library_url), "add"],
                ["Show Repository", "window", wopenfunc(repository_url), "database"],
                ["Show Account Info", "account", wopenfunc(account_url), "person"],
                ["Logout", "account", _handle_signout, "log-out"]];
            omni_funcs = omni_funcs.concat(new_funcs);

        }

        let omni_items = [];
        for (let item of omni_funcs) {
            omni_items.push(
                {
                    category: item[1],
                    display_text: item[0],
                    search_text: item[0],
                    icon_name: item[3],
                    the_function: item[2]
                }
            )

        }
        return omni_items
    }

    function _toggleTheme() {
        const result_dict = {
            "user_id": window.user_id,
            "theme": !props.dark_theme ? "dark" : "light",
        };
        postWithCallback("host", "set_user_theme", result_dict,
            null, null);
        if (props.setTheme) {
            props.setTheme(!props.dark_theme)
        }
    }

    let the_items = [];
    if (props.showOmnibar) {
        for (let ogetter of props.omniGetters) {
            the_items = the_items.concat(ogetter())
        }
        the_items = the_items.concat(_globalOmniItems())
    }
    return (
        <Omnibar items={the_items}
                 className={window.dark_theme ? "bp5-dark" : ""}
                 isOpen={props.showOmnibar}
                 onItemSelect={_onItemSelect}
                 itemRenderer={_itemRenderer}
                 itemPredicate={_itemPredicate}
                 resetOnSelect={true}
                 onClose={props.closeOmnibar}
        />
    )
}

TacticOmnibar.propTypes = {
    omniGetters: PropTypes.array,
    showOmniBar: PropTypes.bool,
    closeOmniBar: PropTypes.func,
    dark_theme: PropTypes.bool,
};

TacticOmnibar.defaultProps = {
    dark_theme: false,
    showOmnibar: false,
    omniGetters: null
};

TacticOmnibar = memo(TacticOmnibar);