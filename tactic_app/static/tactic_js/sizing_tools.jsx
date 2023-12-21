
import React from "react";

export {getUsableDimensions, SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT, TOP_MARGIN, BOTTOM_MARGIN, SizeContext}


const SIDE_MARGIN = 15;
const BOTTOM_MARGIN = 35;
const TOP_MARGIN = 25;
const INITIAL_DECREMENT = 50;
const USUAL_TOOLBAR_HEIGHT = 50;

function getUsableDimensions() {
    return {
        "usable_width": window.innerWidth - 2 * SIDE_MARGIN,
        "usable_height": window.innerHeight - BOTTOM_MARGIN - USUAL_TOOLBAR_HEIGHT,
        usable_height_no_bottom: window.innerHeight - USUAL_TOOLBAR_HEIGHT,
        body_height: window.innerHeight - BOTTOM_MARGIN
    }
}

const SizeContext = React.createContext({available_height: 500, available_width: 500});

