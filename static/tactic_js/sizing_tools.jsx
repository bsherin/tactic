import React from "react";
import {useState, useEffect, memo, useContext, useMemo} from "react";
import {SelectedPaneContext} from "./utilities_react";

export {
    getUsableDimensions, SIDE_MARGIN, USUAL_NAVBAR_HEIGHT, TOP_MARGIN, ICON_BAR_WIDTH, STATUS_BAR_HEIGHT,
    MENU_BAR_HEIGHT,
    useSize,
    BOTTOM_MARGIN, INIT_CONTEXT_PANEL_WIDTH, SizeContext, withSizeContext, SizeProvider, useElementSize
}


const SIDE_MARGIN = 15;
const BOTTOM_MARGIN = 35;
const STATUS_BAR_HEIGHT = 35;
const TOP_MARGIN = 25;
const INITIAL_DECREMENT = 50;
const USUAL_NAVBAR_HEIGHT = 50;
const INIT_CONTEXT_PANEL_WIDTH = 250;
const ICON_BAR_WIDTH = 40;
const MENU_BAR_HEIGHT = 50;

function getUsableDimensions() {
    return {
        usable_width: window.innerWidth - 2 * SIDE_MARGIN,
        usable_height: window.innerHeight - BOTTOM_MARGIN - USUAL_NAVBAR_HEIGHT,
        usable_height_no_bottom: window.innerHeight - USUAL_NAVBAR_HEIGHT,
        body_height: window.innerHeight - BOTTOM_MARGIN
    }
}

const SizeContext = React.createContext({topX: 0, topY: 0, availableWidth: 500, availableHeight: 500});

const MIN_HEIGHT = 30;

function useSize(top_ref = null, iCounter = 0, name = null) {
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
            const relativeTop = rect.top - sizeInfo.topY;
            aheight = sizeInfo.availableHeight - relativeTop;
            setTopX(top_ref.current ? rect.left : sizeInfo.topX);
            setTopY(top_ref.current ? rect.top : sizeInfo.topY);
            if (name) {
                console.log(`[${name}] rect.top: ${rect.top}, sizeInfo.topY: ${sizeInfo.topY}, usableHeight = ${aheight}`);
                console.log(`[${name}] rect.left: ${rect.left}, sizeInfo.topX = ${sizeInfo.topX} usableWidth = ${awidth}`);
            }
        } else {
            setTopX(sizeInfo.topX);
            setTopY(sizeInfo.topY);
        }
        set_usable_width(awidth);
        if (aheight > MIN_HEIGHT) {
            set_usable_height(aheight);
        }

        return () => {
            set_usable_width(0);
            set_usable_height(0);
            setTopX(0);
            setTopY(0);
        };
    }, [sizeInfo.availableWidth, sizeInfo.availableHeight, sizeInfo.topX, sizeInfo.topY, selectedPane.selectedTabIdRef.current, iCounter]);

    return [usable_width, usable_height, topX, topY]
}

function withSizeContext(WrappedComponent) {
    function newFunc(props) {
        const [usable_height, set_usable_height] = useState(window.innerHeight);
        const [usable_width, set_usable_width] = useState(window.innerWidth - ICON_BAR_WIDTH);

        useEffect(() => {
            window.addEventListener("resize", _handleResize);
            _handleResize();
            return (() => {
                window.removeEventListener('resize', _handleResize);
            })
        }, []);

        function _handleResize() {
            set_usable_width(window.innerWidth - ICON_BAR_WIDTH);
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
    const newValue = useMemo(() => {
        return {
            ...value
        }
    }, [value.availableWidth, value.availableHeight, value.topX, value.topY]);
    return (
        <SizeContext.Provider value={newValue}>
            {children}
        </SizeContext.Provider>
    )
}

SizeProvider = memo(SizeProvider);

function useElementSize(ref) {
    const [size, setSize] = useState({
        width: 0,
        height: 0,
        top: 0,
        left: 0
    });

    useEffect(() => {
        if (!ref.current) return;

        const update = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                console.log("ResizeObserver fired:", rect.width);
                setSize({
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left
                });
            }
        };

        const observer = new ResizeObserver(update);
        observer.observe(ref.current);

        // Run once after ref is set
        update();

        return () => {
            if (ref.current) observer.unobserve(ref.current);
            observer.disconnect();
        };
    }, [ref.current])

    return [size.width, size.height, size.top, size.left]
}