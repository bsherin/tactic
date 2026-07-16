import React from "react";
import {memo, useCallback, useMemo, useEffect, useRef, useState} from "react";

import {
    Tooltip, Button, FormGroup, InputGroup, HTMLSelect, Switch, TextArea
} from "@blueprintjs/core";
import {BpSelect} from "./selector_advanced";
import {PoolAddressSelector} from "./pool_tree";

export {
    LabeledSelectList, LabeledSelectAdvancedList, LabeledFormField, LabeledTextArea, SelectList, GlyphButton, withTooltip
}

function withTooltip(WrappedComponent) {
    function newFunction(props) {
        if (props.tooltip) {
            let delay = props.tooltipDelay ? props.tooltipDelay : 1000;
            return (
                <Tooltip content={props.tooltip} hoverOpenDelay={delay}>
                    <WrappedComponent {...props}/>
                </Tooltip>
            )
        } else {
            return <WrappedComponent {...props}/>
        }
    }

    return memo(newFunction)
}

function GlyphButton(props) {
    props = {
        style: null,
        className: "",
        extra_glyph_text: null,
        variant: "minimal",
        intent: "none",
        size: "small",
        ...props
    };

    const _handleClick = useCallback((e) => {
        props.handleClick(e);
        e.stopPropagation()
    }, [props.handleClick]);

    const pDef = useCallback((e) => {
        e.preventDefault()
    }, []);

    let style = useMemo(() => {
        return props.style == null ? {paddingLeft: 2, paddingRight: 2} : props.style;
    }, [props.style]);

    return (
        <Button type="button"
                variant={props.variant}
                size={props.size}
                style={style}
                className={props.className}
                onMouseDown={pDef}
                onClick={_handleClick}
                intent={props.intent}
                icon={props.icon}>
            {props.extra_glyph_text &&
                <span className="extra-glyph-text">{props.extra_glyph_text}</span>
            }
        </Button>
    );
}

GlyphButton = memo(GlyphButton);

function LabeledTextArea(props) {
    props = {
        className: "",
        ...props
    }
    return (
        <FormGroup label={props.label} style={{marginRight: 5}} helperText={props.helperText}>
            <TextArea onChange={props.onChange} autoResize={true}
                      className={props.className} value={props.the_value}/>
        </FormGroup>
    )
}

LabeledTextArea = memo(LabeledTextArea);

const MIN_AUTO_FIELD_WIDTH = 150

function AutoResizeInput(props) {
    props = {
        value: "",
        inputClassName: "",
        onChange: null,
        ...props
    }
    const spanRef = useRef(null);
    const [width, setWidth] = useState(MIN_AUTO_FIELD_WIDTH);

    useEffect(() => {
        if (spanRef.current) {
            setWidth(Math.max(MIN_AUTO_FIELD_WIDTH, spanRef.current.offsetWidth + 30));
        }
    }, [props.value]);

    return (
        <div style={{display: "inline-block"}}>
              <span
                  ref={spanRef}
                  style={{
                      position: "absolute",
                      visibility: "hidden",
                      whiteSpace: "pre",
                      font: "inherit",
                  }}
                  className={props.inputClassName}
              >
                {props.value || " "}
              </span>

            <InputGroup
                value={props.value}
                inputClassName={props.inputClassName}
                onChange={props.onChange}
                style={{width: `${width}px`}}
            />
        </div>
    );
}


function LabeledFormField(props) {
    props = {
        show: true,
        helperText: null,
        isBool: false,
        className: "",
        show_dot: false,
        ...props
    };

    let fvalue = props.the_value == null ? "" : props.the_value;
    if (props.show_dot) {
        fvalue = fvalue.toString() + "."
    }
    return (
        <FormGroup label={props.label} style={{marginRight: 5}} helperText={props.helperText}>
            {props.isBool ?
                <Switch onChange={props.onChange} checked={props.the_value}
                        innerLabel="False" innerLabelChecked="True"/> :
                <AutoResizeInput onChange={props.onChange} inputClassName={props.className} value={fvalue}/>
            }
        </FormGroup>
    )
}

LabeledFormField = memo(LabeledFormField);

function LabeledSelectList(props) {
    return (
        <FormGroup label={props.label} style={{marginRight: 5}}>
            <HTMLSelect options={props.option_list} onChange={props.onChange} value={props.the_value}/>
        </FormGroup>
    )
}

LabeledSelectList = memo(LabeledSelectList);

function LabeledSelectAdvancedList(props) {
    return (
        <FormGroup label={props.label} style={{marginRight: 5}}>
            <BpSelect options={props.option_list} onChange={props.onChange} value={props.the_value}/>
        </FormGroup>
    )
}

LabeledSelectAdvancedList = memo(LabeledSelectAdvancedList);

function SelectList(props) {
    props = {
        height: null,
        maxWidth: null,
        fontSize: null,
        minimal: false,
        ...props
    };

    function handleChange(event) {
        props.onChange(event.target.value)
    }

    let sstyle = {"marginBottom": 5, "width": "auto"};
    if (props.height != null) {
        sstyle["height"] = props.height
    }
    if (props.maxWidth != null) {
        sstyle["maxWidth"] = props.maxWidth
    }
    if (props.fontSize != null) {
        sstyle["fontSize"] = props.fontSize
    }

    // let option_items = props.option_list.map((opt, index) =>
    //     <option key={index}>
    //         {opt}
    //     </option>
    // );
    return (
        <HTMLSelect style={sstyle}
                    onChange={handleChange}
                    minimal={props.minimal}
                    value={props.value}
                    options={props.option_list}
        />
    )
}

SelectList = memo(SelectList);


