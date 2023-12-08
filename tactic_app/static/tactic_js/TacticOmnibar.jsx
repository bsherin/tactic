import React from "react";
import {memo, useContext, useState, useCallback, useRef, useEffect, createContext} from "react";
import PropTypes from 'prop-types';

import {Omnibar, QueryList, Classes} from "@blueprintjs/select"
import {MenuItem, Overlay, InputGroup} from "@blueprintjs/core";

import {postAjax, postWithCallback} from "./communication_react";
import {ThemeContext} from "./theme"
import {useDebounce} from "./utilities_react";

export {TacticOmnibar, OpenOmnibar, OmniContext}

const context_url = $SCRIPT_ROOT + '/context';
const library_url = $SCRIPT_ROOT + '/library';
const repository_url = $SCRIPT_ROOT + '/repository';
const account_url = $SCRIPT_ROOT + '/account_info';
const login_url = $SCRIPT_ROOT + "/login";

let icon_dict = {
    collection: "database",
    project: "projects",
    tile: "application",
    list: "list",
    code: "code",
};

const OmniContext = createContext(null);

function OpenOmnibarItem(props) {
    function _handleClick() {
        props.handleClick(props.item);
        return null
    }

    return (
        <MenuItem
            icon={icon_dict[props.item.res_type]}
            active={props.modifiers.active}
            text={props.item.name}
            label={props.item.res_type}
            key={props.item.name}
            onClick={_handleClick}
            shouldDismissPopover={true}
        />
    );
}

function OpenOmnibar(props) {
    // const [commandItems, setCommandItems] = useState([]);
    const [item_list, set_item_list] = useState([]);

    const theme = useContext(ThemeContext);

    // useEffect(()=>{
    //     if (props.showOmnibar) {
    //         let the_items = [];
    //         for (let ogetter of props.omniGetters) {
    //             the_items = the_items.concat(ogetter())
    //         }
    //         the_items = the_items.concat(_globalOmniItems());
    //         for (let the_item of the_items) {
    //             the_item.item_type = "command"
    //         }
    //         setCommandItems(the_items)
    //     }
    // }, [props.showOmnibar]);

    const old_search_string = useRef("");

    const grabChunk = useCallback((search_string)=> {
            let search_spec = {
                active_tag: null,
                search_string: search_string,
                search_inside: false,
                search_metadata: false,
                show_hidden: false,
                sort_field: "updated_for_sort",
                sort_direction: "descending"
            };

            let data = {
                pane_type: "all",
                search_spec: search_spec,
                row_number: 0,
                is_repository: false
            };
            postAjax("grab_all_list_chunk", data, function (data) {
                    let fItems = props.commandItems.filter((item)=>{return commandItemPredicate(search_string, item)});
                    let rItems = Object.values(data.chunk_dict);
                    for (let the_item of rItems) {
                        the_item.item_type = "resource"
                    }
                    fItems = fItems.concat(rItems);
                    set_item_list(fItems)
                }
            )
        }
    );

    const [waiting, doUpdate] = useDebounce(grabChunk);


    function commandItemPredicate(query, item) {
        if (query.length == 0) {
            return false
        }
        let lquery = query.toLowerCase();
        let re = new RegExp(lquery);

        return re.test(item.search_text.toLowerCase()) || re.test(item.category.toLowerCase())
    }

    function openItemListPredicate(search_string, items) {
        if (!props.showOmnibar) return [];
        if (search_string == "" && !waiting.current) {
            old_search_string.current = "";
            return []
        }
        if (search_string == old_search_string.current) {
            return items
        }

        old_search_string.current = search_string;

        doUpdate(search_string);
        return item_list
    }

    function openItemRenderer(item, {modifiers, handleClick}) {
        if (item.item_type == "command") {
            return <TacticOmnibarItem modifiers={modifiers} item={item} handleClick={handleClick}/>
        }
        return <OpenOmnibarItem modifiers={modifiers} item={item} handleClick={handleClick}/>
    }

    function _onItemSelect(item) {
        if (item.item_type == "command") {
            item.the_function();
        }
        else {
            props.openFunc(item);
        }
        props.closeOmnibar()
    }

    function renderQueryList (listProps)  {
        const { handleKeyDown, handleKeyUp } = listProps;
        const handlers = props.showOmnibar ? { onKeyDown: handleKeyDown, onKeyUp: handleKeyUp } : {};

        return (
            <Overlay
                hasBackdrop={true}
                isOpen={props.showOmnibar}
                className={Classes.OMNIBAR_OVERLAY}
                onClose={props.closeOmnibar}>
                <div className={`${Classes.OMNIBAR} ${listProps.className}`} {...handlers}>
                    <InputGroup
                        autoFocus={true}
                        large={true}
                        leftIcon="cube"
                        placeholder="Search resources..."
                        onChange={listProps.handleQueryChange}
                        value={listProps.query}
                    />
                    {listProps.itemList}
                </div>
            </Overlay>
        );
    }

   function _onGetterItemSelect(item) {
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
            "theme": !theme.dark_theme ? "dark" : "light",
        };
        postWithCallback("host", "set_user_theme", result_dict,
            null, null);
        theme.setTheme(!theme.dark_theme)
    }

    return (
        <QueryList items={item_list}
                   className={theme.dark_theme ? "bp5-dark" : ""}
                   isOpen={props.showOmnibar}
                   onItemSelect={_onItemSelect}
                   itemRenderer={openItemRenderer}
                   itemListPredicate={openItemListPredicate}
                   resetOnSelect={true}
                   resetOnQuery={false}
                   renderer={renderQueryList}
                   onClose={props.closeOmnibar}/>
    )
}

OpenOmnibar = memo(OpenOmnibar);

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
    let re = new RegExp(lquery);

    return re.test(item.search_text.toLowerCase()) || re.test(item.category.toLowerCase())
}


function TacticOmnibar(props) {

    const theme = useContext(ThemeContext);

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
            "theme": !theme.dark_theme ? "dark" : "light",
        };
        postWithCallback("host", "set_user_theme", result_dict,
            null, null);
        theme.setTheme(!theme.dark_theme)
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
                 className={theme.dark_theme ? "bp5-dark" : ""}
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
};

TacticOmnibar.defaultProps = {
    showOmnibar: false,
    omniGetters: null
};

TacticOmnibar = memo(TacticOmnibar);