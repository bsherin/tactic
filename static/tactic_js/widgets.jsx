import React, {useContext, useEffect, useRef, useMemo, useState, Fragment} from "react";

import {
    Slider, Text, Button, Switch, HTMLSelect, FormGroup, InputGroup, Collapse,
    ProgressBar, Divider, Card, Elevation
} from "@blueprintjs/core";

import {postPromise, postWithCallback} from "./communication_react";
import {ErrorDrawerContext} from "./error_drawer";
import {TableWidget} from "./table_widget";
import {useDebounce} from "./utilities_react";
import {PoolAddressSelector} from "./pool_tree";
import {MultiSelect} from "@blueprintjs/select";
import {renderSuggestion} from "./selector_advanced";

export {useWidget, widgetDict}

const widgetDict = {
    rawHtml: RawHtmlWidget,
    table: TableWidget,
    slider: SliderWidget,
    progressBar: ProgressBarWidget,
    text: TextWidget,
    javascript: JavascriptWidget,
    box: BoxWidget,
    button: ButtonWidget,
    switch: SwitchWidget,
    select: SelectWidget,
    multi_select: MultiSelectWidget,
    input: InputWidget,
    integer: IntegerWidget,
    float: FloatWidget,
    iframe: IframeWidget,
    matplotlib: MatplotlibWidget,
    divider: DividerWidget,
    collapse: CollapseWidget,
    pool_select: PoolSelectWidget,
};


function useWidget(widgetId, local_id, console_id, tile_id) {


    function widgetGet(data) {
        let ndata = {widgetId, ...data, local_id: local_id};
        if (tile_id) {
            return postPromise(tile_id, "widget_get", ndata, local_id)
        }
        return postPromise("main_service", "widget_get",
            ndata, local_id)
    }

    function widgetAction(value, callback = null) {
        let ndata = {widgetId, value, local_id: local_id};
        if (tile_id) {
            postWithCallback(tile_id, "widget_action", ndata, callback, null, local_id);
        } else {
            postWithCallback("main_service", "widget_action", ndata, callback, null, local_id);
        }
    }

    function widgetSet(widgetData, callback = null) {
        let ndata = {widgetId, widgetData: widgetData, local_id: local_id};
        if (tile_id) {
            return postWithCallback(tile_id, "widget_set", ndata, callback, null, local_id);
        } else {
            postWithCallback("main_service", "widget_set", ndata, callback, null, local_id);
        }

    }

    return [widgetGet, widgetSet, widgetAction];
}

function CollapseWidget(props) {
    props = {
        widgetId: props.widgetId,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: {widgets: [], startOpen: true, label:"collapse", direction: "vertical", intent: "primary", className: null},
        widgetDict: {},
        tileWidth: null,
        tileHeight: null,
        resizing: false,
        tsocket: null,
        ...props
    };
    const [,] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);
    const [isOpen, setIsOpen] = useState(props.widgetData.startOpen);

    function _handleClick() {
        setIsOpen(!isOpen);
    }

    let outputWidgets = props.widgetData.widgets.map((outputDict, idx) => {
        let widgetKind = outputDict["widgetKind"];
        let widgetId = outputDict["widgetId"];
        let widgetData = outputDict["widgetData"];
        let the_widget;
        if (widgetKind in props.widgetDict) {
            let WidgetComponent = props.widgetDict[widgetKind];
            the_widget = <WidgetComponent key={widgetId} widgetId={widgetId} local_id={props.local_id}
                                          console_id={null}
                                          tile_id={props.tile_id}
                                          row={idx}
                                          dispatch={null}
                                          tileWidth={props.tileWidth}
                                          tileHeight={props.tileHeight}
                                          resizing={props.resizing}
                                          widgetDict={props.widgetDict}
                                          widgetData={widgetData} tsocket={props.tsocket}/>;
        } else {
            let WidgetComponent = props.widgetDict["text"];
            the_widget = <WidgetComponent key={widgetId} widgetId={widgetId} local_id={props.local_id}
                                          row={idx}
                                          tile_id={props.tile_id}
                                          console_id={null}
                                          dispatch={null}
                                          resizing={props.resizing}
                                          widgetDict={props.widgetDict}
                                          widgetData={`Widget kind not found ${widgetId}, ${widgetKind} ${widgetData}`}/>;
        }
        return the_widget;
    });
    let but_bottom_margin = isOpen ? 10 : 20;
    let contentStyle = {
        boxShadow: "none",
        marginBottom: 10,
        borderRadius: 10,
        display: props.widgetData.direction === "horizontal" ? "inline-flex" : "flex",
        flexDirection: props.widgetData.direction === "horizontal" ? "row" : "column"
    };
    return (
        <Fragment>
            <Button onClick={_handleClick}
                        text={props.widgetData.label}
                        size="medium"
                        variant="outlined"
                        intent="primary"
                        style={{width: "fit-content", marginBottom: but_bottom_margin, marginTop: 10}}
                />
            <Collapse isOpen={isOpen} className={props.widgetData?.className} key={props.widgetId}>
                <Card interactive={false}
                      elevation={Elevation.TWO}
                      style={contentStyle}
                >
                   {outputWidgets}
                </Card>
            </Collapse>
        </Fragment>
    )
}

function BoxWidget(props) {
    props = {
        widgetId: props.widgetId,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: {
            widgets: [],
            direction: "horizontal",
            title: "",
            border: false,
            style: {display: "flex", flexDirection: "column"}
        },
        widgetDict: {},
        tileWidth: null,
        tileHeight: null,
        resizing: false,
        tsocket: null,
        ...props
    };
    const [,] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    let base_style = {margin: 10, gap: 10};
    let full_style = props.widgetData.style ? {...base_style, ...props.widgetData.style} : base_style;

    if ("direction" in props.widgetData) {
        if (props.widgetData.direction == "vertical") {
            full_style["display"] = "flex";
            full_style["flexDirection"] = "column"

        }
        else {
            full_style["display"] = "inline-flex"
        }
    }

    let outputWidgets = props.widgetData.widgets.map((outputDict, idx) => {
        let widgetKind = outputDict["widgetKind"];
        let widgetId = outputDict["widgetId"];
        let widgetData = outputDict["widgetData"];
        let the_widget;
        if (widgetKind in props.widgetDict) {
            let WidgetComponent = props.widgetDict[widgetKind];
            the_widget = <WidgetComponent key={widgetId} widgetId={widgetId} local_id={props.local_id}
                                          console_id={null}
                                          tile_id={props.tile_id}
                                          row={idx}
                                          dispatch={null}
                                          tileWidth={props.tileWidth}
                                          tileHeight={props.tileHeight}
                                          resizing={props.resizing}
                                          widgetDict={props.widgetDict}
                                          widgetData={widgetData} tsocket={props.tsocket}/>;
        } else {
            let WidgetComponent = props.widgetDict["text"];
            the_widget = <WidgetComponent key={widgetId} widgetId={widgetId} local_id={props.local_id}
                                          row={idx}
                                          tile_id={props.tile_id}
                                          console_id={null}
                                          dispatch={null}
                                          resizing={props.resizing}
                                          widgetDict={props.widgetDict}
                                          widgetData={`Widget kind not found ${widgetId}, ${widgetKind} ${widgetData}`}/>;
        }
        return the_widget;
    });
    let title = props.widgetData.title;
    let border = props.widgetData.border;

    if (!title && !border) {
        return (<div className="box-widget" style={full_style} key={props.widgetId}>
            {outputWidgets}
        </div>)
    }

    let containerStyle = {
        display: "inline-block",
        margin: 10,
        ...(border ? {
            border: "1px solid rgba(128, 128, 128, 0.5)",
            borderRadius: 4,
            padding: 8
        } : {})
    };

    return (<div className="box-widget-container" style={containerStyle} key={props.widgetId}>
        {title && <div className="box-widget-title" style={{fontWeight: 600, marginBottom: 6}}>{title}</div>}
        <div className="box-widget" style={full_style}>
            {outputWidgets}
        </div>
    </div>)
}

function RawHtmlWidget(props) {
    props = {
        widgetId: props.widgetId,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: {value: ""},
        ...props
    };
    const [,] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    let output_dict = {__html: props.widgetData.value};
    return (<div className="raw-html-widget" style={props.widgetData?.style}
                 key={props.widgetId} dangerouslySetInnerHTML={output_dict}/>)
}

function DividerWidget(props) {
    props = {
        widgetId: props.widgetId,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: {compact: false, className: null},
        ...props
    };
    const [,] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    return (
        <div style={props.widgetData?.style}>
            <Divider compact={props.widgetData.compact} key={props.widgetId}/>
        </div>
    )
}

function MatplotlibWidget(props) {
    props = {
        widgetId: props.widgetId,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: {value: ""},
        ...props
    };
    const [,] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    let output_dict = {__html: props.widgetData.value};
    return (<div className="matplotlib-widget" style={props.widgetData?.style}
                 key={props.widgetId} dangerouslySetInnerHTML={output_dict}/>)
}

function IframeWidget(props) {
    props = {
        widgetId: props.widgetId,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: {value: ""},
        ...props
    };
    const [,] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    return (
        <iframe srcDoc={props.widgetData.value} style={props.widgetData?.style} key={props.widgetId}/>
    )
}

const buttonDataDefault = {
    fill: false,
    icon: null,
    text: "Button",
    variant: "solid",
    helperText: null,
};

function ButtonWidget(props) {
    props = {
        widgetId: null,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: buttonDataDefault,
        ...props
    };

    const [, , widgetAction] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    function onClick() {
        widgetAction(props.widgetData.value);
    }

    return (
        <FormGroup helperText={props.widgetData.helperText}>
            <Button
                text={props.widgetData.text}
                fill={props.widgetData.fill}
                icon={props.widgetData.icon}
                variant={props.widgetData.variant}
                style={props.widgetData.style}
                onClick={onClick}/>
        </FormGroup>
    )
}

const progressBarDefault = {
    intent: null,
    stripes: false,
    helperText: null
};

function ProgressBarWidget(props) {
    props = {
        widgetId: null,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: progressBarDefault,
        ...props
    };

    const {style, to_render, ...rest} = props.widgetData;

    return (
        <FormGroup style={props.widgetData?.style}
                   helperText={props.widgetData.helperText}
                   key={props.widgetId}>
            <ProgressBar {...rest} key={props.widgetId}/>
        </FormGroup>
    )
}

const sliderDataDefault = {
    value: 0,
    min: 0,
    max: 10,
    stepSize: 1,
    labelStepSize: 1,
};

function SliderWidget(props) {
    props = {
        widgetId: null,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: sliderDataDefault,
        ...props
    };

    const [, widgetSet] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    const {style, to_render, ...rest} = props.widgetData;

    function onChange(newValue) {
        const newWidgetData = {...props.widgetData, value: newValue};
        widgetSet(newWidgetData);
    }

    return (
        <div style={props.widgetData?.style} key={props.widgetId}>
            <Slider {...rest} key={props.widgetId}
                    onChange={onChange}/>
        </div>
    )
}

const selectDataDefault = {
    value: "",
    options: [],
    label: ""
};

function SelectWidget(props) {
    props = {
        widgetId: null,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: selectDataDefault,
        ...props
    };

    const [, widgetSet,] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    const {style, label, options, to_render, ...rest} = props.widgetData;

    function onChange(e) {
        const newWidgetData = {...props.widgetData, value: e.currentTarget.value};
        widgetSet(newWidgetData);
    }

    let realOptions = options;
    if (!Array.isArray(options)) {
        realOptions = []
    }

    return (
        <FormGroup key={props.widgetId}
                   inline={false}
                   style={props.widgetData?.style}
                   label={props.widgetData.label}>
            <HTMLSelect {...rest}
                        options={realOptions}
                        onChange={onChange}/>
        </FormGroup>
    )
}


function MultiSelectWidget(props) {
    props = {
        widgetId: null,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: selectDataDefault,
        ...props
    };

    const [, widgetSet,] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    const {style, label, options, to_render, ...rest} = props.widgetData;

    function onChange(new_tag_list) {
        const newWidgetData = {...props.widgetData, value: new_tag_list};
        widgetSet(newWidgetData);
    }

    function renderItemWithIcon(item, {modifiers, handleClick}) {
        if (props.widgetData.value && Array.isArray(props.widgetData.value) && props.widgetData.value.includes(item)) {
            return renderSuggestion({text: item, icon: "tick"}, {modifiers, handleClick})
        }
        return renderSuggestion({text: item, icon: "blank"}, {modifiers, handleClick})
    }

    function filterItem(query, item) {
        if (!query || query.trim() === "") {
            return true;
        }
        let re = new RegExp(`^${query}`);
        return re.test(item)
    }

    function renderTag(item) {
        return item
    }

    function _handleAddition(tag) {
        const current = props.widgetData.value ?? [];

        if (current.includes(tag)) {
            onChange(current.filter(x => x !== tag));
            return;
        }

        onChange([...current, tag]);
    }

    function _handleDelete(tag) {
      const current = props.widgetData.value ?? [];
      onChange(current.filter(x => x !== tag));
    }

    let realOptions = options;
    if (!Array.isArray(options)) {
        realOptions = []
    }

    let realValue = props.widgetData.value;
    if (!Array.isArray(props.widgetData.value)) {
        realValue = []
    }

    return (
        <FormGroup key={props.widgetId}
                   inline={false}
                   style={props.widgetData?.style}
                   label={props.widgetData.label}>
            <MultiSelect
                activeItem={null}
                resetOnSelect={true}
                clear={true}
                itemRenderer={renderItemWithIcon}
                selectedItems={realValue}
                items={realOptions}
                itemPredicate={filterItem}
                tagRenderer={renderTag}
                tagInputProps={{onRemove: _handleDelete}}
                onItemSelect={_handleAddition}/>
        </FormGroup>
    )
}


function PoolSelectWidget(props) {
    props = {
        widgetId: null,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: selectDataDefault,
        ...props
    }

    const [, widgetSet,] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    const {style, label, options, to_render, ...rest} = props.widgetData;

    function onChange(new_value) {
        const newWidgetData = {...props.widgetData, value: new_value};
        widgetSet(newWidgetData);
    }

    return (
        <FormGroup key={props.widgetId}
               inline={false}
               style={props.widgetData?.style}
               label={props.widgetData.label}>
            <PoolAddressSelector value={props.widgetData.value}
                                 tsocket={null}
                                 select_type={props.widgetData.select_type}
                                 setValue={onChange}
            />
        </FormGroup>
    )
}

const switchDataDefault = {
    value: false,
    label: "switch",
};

function SwitchWidget(props) {
    props = {
        widgetId: null,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: switchDataDefault,
        ...props
    };

    const [, widgetSet] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    function onChange(e) {
        const newWidgetData = {...props.widgetData, value: e.target.checked};
        widgetSet(newWidgetData);
    }

    return (
        <Switch key={props.widgetId}
                label={props.widgetData.label}
                style={props.widgetData.style}
                checked={props.widgetData.value}
                onChange={onChange}/>
    )
}

const textDataDefault = {
    value: "",
    ellipsize: true,
    style: {}
};

function TextWidget(props) {
    props = {
        widgetId: null,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: textDataDefault,
        ...props
    };

    const [,] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    return (
        <Text ellipsize={props.widgetData.ellipsize} style={props.widgetData.style} key={props.widgetId}>
            {props.widgetData.value}
        </Text>
    )
}

const inputDataDefault = {
    value: "",
    fill: false,
    label: "",
    inline: false,
    style: {},
    helperText: null,
};

function InputWidget(props) {
    props = {
        widgetId: null,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: inputDataDefault,
        validator: null,
        converter: null,
        ...props
    };

    const [helperText, setHelperText] = useState("")

    const [localValue, setLocalValue] = useState(props.widgetData.value);
    const [, widgetSet] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);
    const [, doUpdate] = useDebounce((data)=>{
        if (props.validator) {
            let valid = props.validator(data.value);
            if (!valid) {
                if (!props.widgetData.helperText) {
                    setHelperText("Invalid input");
                    return;
                }
            }
            else {
                setHelperText("");
            }
        }
        if (props.converter) {
            data.value = props.converter(data.value);
        }
        widgetSet(data)
    });
    const {style, label, inline, value, to_render, ...rest} = props.widgetData;

    function onChange(val) {
        setLocalValue(val);
        const newWidgetData = {...props.widgetData, value: val};
        doUpdate(newWidgetData);
    }

    return (
        <FormGroup key={props.widgetId}
                   inline={props.widgetData.inline}
                   style={props.widgetData.style}
                   label={props.widgetData.label}
                   helperText={props.widgetData.helperText ? props.widgetData.helperText : helperText}>
            <InputGroup type="text"
                        {...rest}
                        value={localValue}
                        onValueChange={onChange}
            />
        </FormGroup>
    )
}

function IntegerWidget(props) {
    props = {
        widgetId: null,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: inputDataDefault,
        validator: null,
        ...props
    };

    function validator(val) {
        // Check if the value is a string that can be converted to an integer
        if (typeof val === "string" && val.trim() !== "") {
            const intValue = parseInt(val, 10);
            return !isNaN(intValue) && intValue.toString() === val.trim();
        }
        return false;
    }

    function converter(val) {
        if (validator(val)) {
            return parseInt(val, 10);
        }
        else {
            return null;
        }
    }

    return (
        <InputWidget {...props} validator={validator} converter={converter}/>
    )

}

function FloatWidget(props) {
    props = {
        widgetId: null,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: inputDataDefault,
        validator: null,
        ...props
    };

    function validator(val) {
        // Check if the value is a string that can be converted to a float
        if (typeof val === "string" && val.trim() !== "") {
            const floatValue = parseFloat(val);
            return !isNaN(floatValue);
        }
        return false;
    }

    function converter(val) {
        if (validator(val)) {
            return parseFloat(val);
        }
        else {
            return null;
        }
    }

    return (
        <InputWidget {...props} validator={validator} converter={converter}/>
    )

}


function JavascriptWidget(props) {
    props = {
        widgetId: null,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        tileWidth: null,
        tileHeight: null,
        widgetData: {value: "null", style: {}, "code": ""},
        resizing: false,
        ...props
    };
    // const javascript_error_ref = useRef(false);
    const [, widgetSet, ] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const codeStr = props.widgetData?.code ?? "";
    const value = props.widgetData?.value ?? null;

    const errorOnceRef = useRef(null);
    const blockRunRef = useRef(false);

    const compiledFn = useMemo(() => {
        if (!codeStr.trim()) return null;
        try {
            // Safer than eval; creates a function with the desired params.
            return new Function("selector", "w", "h", "value", "setValue", "resizing", codeStr);
        } catch (e) {
            // Syntax error at compile time
            errorOnceRef.current = `Compile error: ${e.message}`;
            return null;
        }
    }, [codeStr]);

    useEffect(() => {
        blockRunRef.current = false;
        errorOnceRef.current = null;
    }, [codeStr, props.tileWidth, props.tileHeight, JSON.stringify(value)]);

    function setValue(newValue) {
        const newWidgetData = {value: newValue};
        widgetSet(newWidgetData);
    }


    useEffect(() => {
        if (!compiledFn || blockRunRef.current) return;

        try {
            const selector = `#${props.widgetId}`;
            compiledFn(selector, props.tileWidth, props.tileHeight, value, setValue, props.resizing);
        } catch (err) {
            // Block further runs until inputs change to avoid loops
            blockRunRef.current = true;

            // Only log once per input set
            const msg = err?.message || String(err);
            if (errorOnceRef.current !== msg) {
                errorOnceRef.current = msg;
                errorDrawerFuncs.addErrorDrawerEntry({
                    title: "Error evaluating javascript",
                    content: msg,
                });
            }
        }
    }, [compiledFn, props.tileWidth, props.tileHeight, props.resizing, value, props.widgetId]);


    return (<div id={props.widgetId} className="jscript-target" style={props.widgetData?.style}
                 key={props.widgetId}/>)
}
