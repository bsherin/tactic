import React, {useContext, useEffect, useRef} from "react";

import {Slider, Text} from "@blueprintjs/core";

import {postPromise, postWithCallback} from "./communication_react";
import {ErrorDrawerContext} from "./error_drawer";

export {useWidget, SliderWidget, RawHtmlWidget, TextWidget, JavascriptWidget}

function useWidget(uid, main_id, console_id, tile_id) {
     useEffect(() => {
        return () => {
            postWithCallback(main_id, "remove_widget", {uid: uid});
        }
    }, []);

     function widgetGet(data) {
         let ndata = {uid, ...data};
         if (tile_id) {
             return postPromise(tile_id, "widget_get", ndata, main_id)
         }
         return postPromise(main_id, "widget_get",
            ndata, main_id)
     }

     function widgetSet(widgetData, callback = null) {
         let ndata = {uid, widgetData: widgetData};
         if (tile_id) {
             return postWithCallback(tile_id, "widget_set", ndata, callback, null, main_id);
         }
         postWithCallback(main_id, "widget_set", ndata, callback, null, main_id);
     }

     return [widgetGet, widgetSet];
}

function RawHtmlWidget(props) {
    props = {
        uid: props.uid,
        main_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: {value: ""},
        ...props
    }
    const [ , ] = useWidget(props.uid, props.main_id, props.console_id, props.tile_id);

     let output_dict = {__html: props.widgetData.value};
    return (<div style={props.widgetData?.style}
                 key={props.uid} dangerouslySetInnerHTML={output_dict}/>)
}
const sliderDataDefault =  {
    value: 0,
    min: 0,
    max: 10,
    stepSize: 1,
    labelStepSize: 1,
}

function SliderWidget(props) {
    props = {
        uid: null,
        main_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: sliderDataDefault,
        ...props
    }

    const [, widgetSet] = useWidget(props.uid, props.main_id, props.console_id, props.tile_id);

    function onChange(newValue) {
        const newWidgetData = {...props.widgetData, value: newValue};
        widgetSet(newWidgetData);
    }

    return (
        <div style={ props.widgetData?.style} key={props.uid}>
            <Slider {... props.widgetData}
                    onChange={onChange}/>
        </div>
    )
}

const textDataDefault =  {
    value: "",
    ellipsize: true,
}

function TextWidget(props) {
    props = {
        uid: null,
        main_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        widgetData: textDataDefault,
        ...props
    }

    const [, ] = useWidget(props.uid, props.main_id, props.console_id, props.tile_id);

    return (
        <div key={ props.uid }>
            <Text {...props.widgetData}>
                {props.widgetData.value}
            </Text>
        </div>
    )
}

function JavascriptWidget(props) {
    props = {
        uid: null,
        main_id: null,
        console_id: null,
        tile_id: null,
        dispatch: null,
        row: 0,
        tileWidth: null,
        tileHeight: null,
        widgetData: {value: {javascript_code: "", javascript_arg_dict: {}}},
        resizing: false,
        ...props
    }
    const javascript_error_ref = useRef(false);
    const [ , ] = useWidget(props.uid, props.main_id, props.console_id, props.tile_id);

    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    useEffect(()=>{
        javascript_error_ref.current = false
        _executeJavascript()
    }, [props.widgetData.value, props.tileWidth, props.tileHeight]);

     function _executeJavascript() {
        try {
            if (!javascript_error_ref.current) {
                let selector = `#${props.uid}`;
                window.eval(props.widgetData.value.javascript_code)(selector, props.tileWidth, props.tileHeight,
                    props.widgetData.value.javascript_arg_dict, props.resizing)
            }
        } catch (err) {
            javascript_error_ref.current = true;
            errorDrawerFuncs.addErrorDrawerEntry({
                title: "Error evaluating javascript",
                content: err.message
            });
        }
    }

    return (<div id={props.uid} className="jscript-target" style={props.widgetData?.style}
                 key={props.uid}/>)
}

