import React from "react";
import {memo, useCallback, useMemo} from "react";

import {
    Tooltip, Button, FormGroup, InputGroup, HTMLSelect, Switch, TextArea
} from "@blueprintjs/core";
import {EditableCell2, Cell, RowHeaderCell, Column, Table2, RegionCardinality} from "@blueprintjs/table";

export {
    LabeledSelectList, LabeledFormField, LabeledTextArea, SelectList,
    BpOrderableTable, GlyphButton, withTooltip
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
        minimal: true,
        intent: "none",
        small: true,
        ...props
    };

    const _handleClick = useCallback((e)=>{
        props.handleClick(e);
        e.stopPropagation()
    }, [props.handleClick]);

    const pDef = useCallback((e)=>{
        e.preventDefault()
    }, []);

    let style = useMemo(()=>{
        return props.style == null ? {paddingLeft: 2, paddingRight: 2} : props.style;
    }, [props.style]);

    return (
        <Button type="button"
                minimal={props.minimal}
                small={props.small}
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
    return (
        <FormGroup label={props.label} style={{marginRight: 5}} helperText={props.helperText}>
            <TextArea onChange={props.onChange} style={{resize: "none"}} growVertically={true}
                      value={props.the_value}/>
        </FormGroup>
    )
}

LabeledTextArea = memo(LabeledTextArea);

function LabeledFormField(props) {
    props = {
        show: true,
        helperText: null,
        isBool: false,
        ...props
    };
    let fvalue = props.the_value == null ? "" : props.the_value;
    return (
        <FormGroup label={props.label} style={{marginRight: 5}} helperText={props.helperText}>
            {props.isBool ?
                <Switch onChange={props.onChange} checked={props.the_value}
                        innerLabel="False" innerLabelChecked="True"/> :
                <InputGroup onChange={props.onChange} value={fvalue}/>
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

    let option_items = props.option_list.map((opt, index) =>
        <option key={index}>
            {opt}
        </option>
    );
    return (
        <HTMLSelect style={sstyle}
                    onChange={handleChange}
                    minimal={props.minimal}
                    value={props.value}
        >
            {option_items}
        </HTMLSelect>
    )
}

SelectList = memo(SelectList);

function BpOrderableTable(props, passedRef) {
    props = {
        content_editable: true,
        selectionModes: [RegionCardinality.FULL_COLUMNS, RegionCardinality.FULL_ROWS],
        handleDeSelect: null,
        ...props
    };

    function _onRowsReordered(oldIndex, newIndex) {
        let new_data_list = [...props.data_array];
        let the_item = new_data_list[oldIndex];
        new_data_list.splice(oldIndex, 1);
        new_data_list.splice(newIndex, 0, the_item);
        props.handleChange(new_data_list)
    }

    function _onConfirmCellEdit(value, rowIndex, columnIndex) {
        let new_data_list = [...props.data_array];
        new_data_list[rowIndex][props.columns[columnIndex]] = value;
        props.handleChange(new_data_list)
    }

    function _onSelection(regions) {
        if (regions.length == 0) {
            if (props.handleDeSelect) {
                props.handleDeSelect()
            }
            return
        }
        if (regions[0].hasOwnProperty("rows")) {
            props.handleActiveRowChange(regions[0]["rows"][0])
        }
    }

    function _cellRendererCreator(column_name) {
        return (rowIndex) => {
            let the_text;
            let className;
            if ("className" in props.data_array[rowIndex]) {
                className = props.data_array[rowIndex].className
            } else {
                className = null
            }
            if ((rowIndex < props.data_array.length) && (Object.keys(props.data_array[rowIndex]).includes(column_name))) {
                the_text = props.data_array[rowIndex][column_name];
                the_text = the_text == null ? "" : the_text
            } else {
                the_text = ""
            }
            if (props.content_editable) {
                return (<EditableCell2 key={column_name}
                                      className={className}
                                      truncated={true}
                                      rowIndex={rowIndex}
                                      columnIndex={props.columns.indexOf(column_name)}
                                      wrapText={true}
                                      onConfirm={_onConfirmCellEdit}
                                      value={the_text}/>
                )
            } else {
                return (
                    <Cell key={column_name}
                          className={className}
                          truncated={true}
                          rowIndex={rowIndex}
                          columnIndex={props.columns.indexOf(column_name)}
                          wrapText={true}>
                        {the_text}
                    </Cell>
                )
            }
        };
    }

    function _rowHeaderCellRenderer(rowIndex) {
        return (<RowHeaderCell key={rowIndex}
                               name={rowIndex}/>)
    }

    let columns = props.columns.map((column_name) => {
        const cellRenderer = _cellRendererCreator(column_name);
        return <Column cellRenderer={cellRenderer}
                       enableColumnReordering={false}
                       key={column_name}
                       name={column_name}/>
    });
    return (
        <Table2 enableFocusedCell={false}
                cellRendererDependencies={[props.data_array]}
                numRows={props.data_array.length}
                enableColumnReordering={false}
                selectionModes={props.selectionModes}
                enableRowReordering={true}
                onRowsReordered={_onRowsReordered}
                onSelection={_onSelection}
                enableMultipleSelection={false}
        >
            {columns}
        </Table2>
    )
}

BpOrderableTable = memo(BpOrderableTable);

