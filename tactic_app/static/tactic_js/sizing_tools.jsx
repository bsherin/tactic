
import React from "react";
import {useState, useEffect, memo, useContext, useMemo} from "react";
import {SelectedPaneContext} from "./utilities_react";

export {getUsableDimensions, SIDE_MARGIN, USUAL_NAVBAR_HEIGHT, TOP_MARGIN, useSize,
    BOTTOM_MARGIN, INIT_CONTEXT_PANEL_WIDTH, SizeContext, withSizeContext, SizeProvider}


const SIDE_MARGIN = 15;
const BOTTOM_MARGIN = 35;
const TOP_MARGIN = 25;
const INITIAL_DECREMENT = 50;
const USUAL_NAVBAR_HEIGHT = 50;
const INIT_CONTEXT_PANEL_WIDTH = 150;

function getUsableDimensions() {
    return {
        usable_width: window.innerWidth - 2 * SIDE_MARGIN,
        usable_height: window.innerHeight - BOTTOM_MARGIN - USUAL_NAVBAR_HEIGHT,
        usable_height_no_bottom: window.innerHeight - USUAL_NAVBAR_HEIGHT,
        body_height: window.innerHeight - BOTTOM_MARGIN
    }
}

const SizeContext = React.createContext({topX:0, topY: 0, availableWidth: 500, availableHeight: 500});

function useSize(top_ref=null, iCounter=0, name="noname") {
    const [usable_width, set_usable_width] = useState(window.innerWidth);
    const [usable_height, set_usable_height] = useState(window.innerHeight);
    const [topX, setTopX] = useState(0);
    const [topY, setTopY] = useState(0);

    const sizeInfo = useContext(SizeContext);
    const selectedPane = useContext(SelectedPaneContext);

    useEffect(() => {
        let awidth = sizeInfo.availableWidth;
        let aheight = sizeInfo.availableHeight;

        if (top_ref && top_ref.current) {
            let rect = top_ref.current.getBoundingClientRect();
            awidth = awidth - rect.left + sizeInfo.topX;
            aheight = aheight - rect.top + sizeInfo.topY;
            setTopX(top_ref.current ? rect.left : sizeInfo.topX);
            setTopY(top_ref.current ? rect.top : sizeInfo.topY);
        } else {
            setTopX(sizeInfo.topX);
            setTopY(sizeInfo.topY);
        }
        set_usable_width(awidth);
        set_usable_height(aheight);

    }, [sizeInfo.availableWidth, sizeInfo.availableHeight, top_ref.current, selectedPane.selectedTabIdRef.current, iCounter]);

    return [usable_width, usable_height, topX, topY]
}

function withSizeContext(WrappedComponent) {
    function newFunc(props) {
        const [usable_height, set_usable_height] = useState(window.innerHeight);
        const [usable_width, set_usable_width] = useState(window.innerWidth);

        useEffect(() => {
            window.addEventListener("resize", _handleResize);
            _handleResize();
            return (() => {
                window.removeEventListener('resize', _handleResize);
            })
        }, []);

        function _handleResize() {
            set_usable_width(window.innerWidth);
            set_usable_height(window.innerHeight);
        }
        return (
            <SizeContext.Provider value={{
                availableWidth: usable_width,
                availableHeight: usable_height,
                topX: 0,
                topY: 0
            }}>
                <WrappedComponent {...props}/>
            </SizeContext.Provider>
        )
    }
    return memo(newFunc)
}

function SizeProvider({value, children}) {
    const newValue = useMemo(() => {return {
            ...value
    }}, [value.availableWidth, value.availableHeight, value.topX, value.topY]);
    return (
        <SizeContext.Provider value={newValue}>
            {children}
        </SizeContext.Provider>
    )
}

SizeProvider = memo(SizeProvider);