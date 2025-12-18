import React from "react";

export { MemoryIndicator };

function isValidNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function MemoryIndicator(props) {
    props = {
        usage: 0,
        limit: "None",
        ...props
    }
    let ind_string;
    if (isValidNumber(props.limit) && isValidNumber(props.usage)) {
        ind_string = `${props.usage.toFixed(0)} MB / ${props.limit.toFixed(0)} MB`
    }
    else if (isValidNumber(props.usage)) {
        if (props.usage === 0) {
            ind_string = `– MB`
        }
        else {
            ind_string = `${props.usage.toFixed(1)} MB`
        }
    }
    return (
        <span className="memory-indicator d-flex flex-row align-items-center" style={{
            marginRight: 10,
            marginLeft: 5,
        }}>
            {ind_string}
        </span>
    )
}
