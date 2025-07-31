import {MenuItem, MenuDivider, Button, PopoverPosition} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import React, {memo} from "react";

export {BpSelect, BpSelectAdvanced, renderSuggestion}

function SuggestionItemAdvanced({item, handleClick, modifiers}) {
    let display_text = "display_text" in item ? item.display_text : item.text;
    let the_icon = "icon" in item ? item.icon : null;
    if (item.isgroup) {
        return (
            <MenuDivider className="tile-form-menu-item" title={display_text}/>
        )
    } else {
        return (
            <MenuItem
                className="tile-form-menu-item"
                text={display_text}
                key={display_text}
                icon={the_icon}
                onClick={handleClick}
                active={modifiers.active}
                shouldDismissPopover={true}
            />
        );
    }
}

SuggestionItemAdvanced = memo(SuggestionItemAdvanced);

function renderSuggestionAdvanced(item, {modifiers, handleClick, index}) {
    return <SuggestionItemAdvanced item={item} key={index} modifiers={modifiers} handleClick={handleClick}/>
}

function BpSelectAdvanced({options, value, onChange, buttonIcon = null, readOnly}) {
    function _filterSuggestion(query, item) {
        if (query.length === 0) {
            return true
        }
        let re = new RegExp(query.toLowerCase());

        let the_text;
        if (typeof item == "object") {
            the_text = item["text"]
        } else {
            the_text = item
        }
        return re.test(the_text.toLowerCase())
    }

    function _getActiveItem(val) {
        for (let option of options) {
            if (_.isEqual(option, val)) {
                return option
            }
        }
        return null
    }

    let display_text = "display_text" in value ? value.display_text : value.text;

    return (
        <Select
            activeItem={_getActiveItem(value)}
            itemRenderer={renderSuggestionAdvanced}
            itemPredicate={_filterSuggestion}
            items={options}
            disabled={readOnly}
            onItemSelect={onChange}
            popoverProps={{
                minimal: true,
                boundary: "window",
                modifiers: {flip: false, preventOverflow: true},
                position: PopoverPosition.BOTTOM_LEFT
            }}>
            <Button text={display_text} className="button-in-select" icon={buttonIcon}/>
        </Select>
    )
}

BpSelectAdvanced = memo(BpSelectAdvanced);

function BpSelect(props) {
    props = {
        buttonIcon: null,
        buttonStyle: {},
        popoverPosition: PopoverPosition.BOTTOM_LEFT,
        buttonTextObject: null,
        filterable: true,
        size: "medium",
        ...props
    };

    function _filterSuggestion(query, item) {
        if ((query.length === 0) || (item["isgroup"])) {
            return true
        }
        let re = new RegExp(query.toLowerCase());

        let the_text;
        if (typeof item == "object") {
            the_text = item["text"]
        } else {
            the_text = item
        }
        return re.test(the_text.toLowerCase())
    }

    function _getActiveItem(val) {
        for (let option of props.options) {
            if (_.isEqual(option, val)) {
                return option
            }
        }
        return null
    }

    return (
        <Select
            activeItem={_getActiveItem(props.value)}
            className="tile-form-menu-item"
            filterable={props.filterable}
            itemRenderer={renderSuggestion}
            itemPredicate={_filterSuggestion}
            items={_.cloneDeep(props.options)}
            onItemSelect={props.onChange}
            popoverProps={{
                minimal: true,
                boundary: "window",
                modifiers: {flip: false, preventOverflow: true},
                position: props.popoverPosition
            }}>
            <Button className="button-in-select"
                    style={props.buttonStyle}
                    size={props.size}
                    text={props.buttonTextObject ? props.buttonTextObject : props.value}
                    icon={props.buttonIcon}/>
        </Select>
    )
}


function SuggestionItem({item, modifiers, handleClick}) {
    let the_text;
    let the_icon;
    if (typeof item == "object") {
        the_text = item["text"];
        the_icon = item["icon"]
    } else {
        the_text = item;
        the_icon = null
    }
    return (
        <MenuItem
            className="tile-form-menu-item"
            text={the_text}
            icon={the_icon}
            active={modifiers.active}
            onClick={() => handleClick(the_text)}
            shouldDismissPopover={true}
        />
    );
}

SuggestionItem = memo(SuggestionItem);

function renderSuggestion(item, {modifiers, handleClick, index}) {
    return <SuggestionItem item={item} key={index} modifiers={modifiers} handleClick={handleClick}/>
}
