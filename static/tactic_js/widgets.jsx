import React, {useContext, useEffect, useRef, useMemo} from "react";

import {Slider, Text, Button, Switch, HTMLSelect, FormGroup, InputGroup, ProgressBar} from "@blueprintjs/core";

import {postPromise, postWithCallback} from "./communication_react";
import {ErrorDrawerContext} from "./error_drawer";
import {TableWidget} from "./table_widget";

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
    input: InputWidget,
    iframe: IframeWidget,
    matplotlib: MatplotlibWidget
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

function BoxWidget(props) {
    props = {
        widgetId: props.widgetId,
        local_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: {widgets: [], style: {display: "flex", flexDirection: "column"}},
        widgetDict: {},
        tileWidth: null,
        tileHeight: null,
        resizing: false,
        tsocket: null,
        ...props
    };
    const [,] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);

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
                                          widgetData={widgetData} tsocket={props.tsocket}/>;
        } else {
            let WidgetComponent = props.widgetDict["text"];
            the_widget = <WidgetComponent key={widgetId} widgetId={widgetId} local_id={props.local_id}
                                          row={idx}
                                          tile_id={props.tile_id}
                                          console_id={null}
                                          dispatch={null}
                                          resizing={props.resizing}
                                          widgetData={`Widget kind not found ${widgetId}, ${widgetKind} ${widgetData}`}/>;
        }
        return the_widget;
    });
    return (<div style={props.widgetData?.style} key={props.widgetId}>
        {outputWidgets}
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
    variant: "solid"
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
        <div>
            <Button {...props.widgetData}
                    onClick={onClick}/>
        </div>
    )
}

const progressBarDefault = {
    intent: null,
    stripes: false
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

    const {style, ...rest} = props.widgetData;

    return (
        <div style={props.widgetData?.style} key={props.widgetId}>
            <ProgressBar {...rest} key={props.widgetId}/>
        </div>
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

    const {style, ...rest} = props.widgetData;

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

    const {style, label, ...rest} = props.widgetData;

    function onChange(e) {
        const newWidgetData = {...props.widgetData, value: e.currentTarget.value};
        widgetSet(newWidgetData);
    }

    return (
        <FormGroup key={props.widgetId}
                   inline={false}
                   style={props.widgetData?.style}
                   label={props.widgetData.label}>
            <HTMLSelect {...rest}
                        onChange={onChange}/>
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
                {...props.widgetData}
                checked={props.widgetData.value}
                onChange={onChange}/>
    )
}

const textDataDefault = {
    value: "",
    ellipsize: true,
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
        <Text {...props.widgetData} key={props.widgetId}>
            {props.widgetData.value}
        </Text>
    )
}

const inputDataDefault = {
    value: "",
    fill: false,
    label: "",
    inline: false,
    style: {}
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
        ...props
    };

    const [, widgetSet] = useWidget(props.widgetId, props.local_id, props.console_id, props.tile_id);
    const {style, label, inline, ...rest} = props.widgetData;

    function onChange(e) {
        const newWidgetData = {...props.widgetData, value: e.target.value};
        widgetSet(newWidgetData);
    }


    return (
        <FormGroup key={props.widgetId}
                   inline={false}
                   style={props.widgetData.style}
                   label={props.widgetData.label}>
            <InputGroup type="text"
                        {...rest}
                        onChange={onChange}
            />
        </FormGroup>
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

