
export {
   widgetIcons, widgetInfo, widgetKinds, widgetDefaults
}


const widgetIcons = {
    text: "paragraph",
    table: "th",
    slider: "double-caret-horizontal",
    progressBar: "segmented-control",
    html: "code",
    iframe: "widget",
    button: "widget-button",
    switch: "switch",
    select: "menu-open",
    input: "text-highlight",
    box: "selection-box",
    matplotlib: "scatter-plot",
    javascript: "code-block",
};


function stringField(the_val="") {
    return  {type: "string", default: the_val};
}

function codeStringField(the_val="") {
    return  {type: "code_string", default: the_val};
}

function textBoxField(the_val="") {
    return  {type: "text_box", default: the_val};
}

function codeTextBoxField(the_val="") {
    return  {type: "code_box", default: the_val};
}


function boolField(the_val=false) {
    return  {type: "boolean", default: the_val};
}

function methodField(the_val=null) {
    return  {type: "method", default: the_val};
}

function numberField(the_val=0) {
    return  {type: "number", default: the_val};
}

function selectField(the_val="", the_list=[]) {
    return  {type: "select", default: the_val, options: the_list};
}

function listField(the_val="") {
    return  {type: "list", default: the_val};
}

function objectField(the_val=null) {
    return  {type: "object", default: the_val};
}

function styleField(the_val="") {
    return codeTextBoxField(the_val)
}


let widgetInfo = {
    text: {
        value: stringField(),
        ellipsize: boolField(),
        style: styleField()
    },
    table : {
        value: objectField(),
        style: styleField()
    },
    slider: {
        value: numberField(),
        on_change: methodField(),
        min: numberField(),
        max: numberField(10),
        stepSize: numberField(1),
        labelStepSize: numberField(1),
        style: styleField()
    },
    progressBar: {
        value: numberField(),
        stripes: boolField(),
        intent: selectField("primary", ["primary", "success", "warning", "danger"]),
        style: styleField()
    },
    html: {
        value: codeTextBoxField(),
        style: stringField(),
    },
    iframe: {
        value: codeTextBoxField(),
        style: styleField()
    },
    button: {
        value: objectField(),
        text: stringField("button"),
        icon: stringField(null),
        fill: boolField(),
        on_click: methodField(),
        style: styleField()
    },
    switch: {
        value: boolField(),
        label: stringField("switch"),
        on_change: methodField(),
        style: styleField()
    },
    input: {
        value: stringField(),
        label: stringField("input"),
        on_change: methodField(),
        fill: boolField(),
        inline: boolField(),
        style: styleField()
    },
    box: {
        widgets: listField(),
        direction: selectField("horizontal", ["horizontal", "vertical"]),
        style: styleField()
    },
    matplotlib: {
        use_svg: boolField(),
        dpi: numberField(96),
        style: styleField()
    },
    javascript: {
        value: codeTextBoxField(),
        code: codeTextBoxField()
    }

}

function baseWidgetFields(kind) {
    return {
        name: stringField("new_item"),
        kind: selectField(kind, Object.keys(widgetInfo)),
        to_render: boolField(true)
    }
}



// Some definitions for convenience

const widgetKinds = Object.keys(widgetInfo);

for (let kind of widgetKinds) {
    widgetInfo[kind] = {...baseWidgetFields(kind), ...widgetInfo[kind]}
}

const widgetDefaults = {}
for (let kind of widgetKinds) {
    let wd = {}
    for (let field in widgetInfo[kind]) {
        wd[field] = widgetInfo[kind][field].default
    }
    widgetDefaults[kind] = wd
}
