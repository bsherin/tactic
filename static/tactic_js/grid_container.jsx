import React, {memo, useMemo, useCallback, useState, useRef} from "react";
import ReactGridLayout, {WidthProvider} from "react-grid-layout/legacy";

const GridLayout = WidthProvider(ReactGridLayout);
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const GRID_COLS = 40;
const ROW_HEIGHT = 20;
const MARGIN = [2, 2];
const marginX = MARGIN[0]
const marginY = MARGIN[1]

export {GRID_COLS, tileHeightToGridH, tileWidthToGridW, ensureGridLayout}

function tileWidthToGridW(tileWidth, containerWidth) {
    if (!containerWidth || Number.isNaN(containerWidth)) return 4;

    const totalMargin = marginX * (GRID_COLS - 1);
    const colWidth = (containerWidth - totalMargin) / GRID_COLS;

    return Math.max(
        1,
        Math.min(
            GRID_COLS,
            Math.ceil((tileWidth + marginX) / (colWidth + marginX))
        )
    );
}

function tileHeightToGridH(tileHeight) {
    return Math.ceil((tileHeight + marginY) / (ROW_HEIGHT + marginY));
}

function ensureGridLayout(tile, i) {
  return {
    ...tile,
    grid_x: tile.grid_x ?? ((i * 8) % GRID_COLS),
    grid_y: tile.grid_y ?? Math.floor((i * 8) / GRID_COLS) * 8,
    grid_w: tile.grid_w ?? 8,
    grid_h: Math.max(
      tile.grid_h ?? 0,
      tileHeightToGridH(tile.tile_height)
    ),
  };
}

export const GridTileContainer = memo(function GridTileContainer(props) {
    const [containerWidth, setContainerWidth] = useState(1200);
    const WrappedComponent = props.ElementComponent;
    const [resizingTileId, setResizingTileId] = useState(null);
    const [liveGridHById, setLiveGridHById] = useState({});

    const isGridDraggingRef = useRef(false);

    const layout = useMemo(() => {
        return props.item_list.map((tile, i) => ({
            i: tile.tile_id,
            x: tile.grid_x ?? ((i * 4) % GRID_COLS),
            y: tile.grid_y ?? Math.floor((i * 4) / GRID_COLS) * 4,
            w: tile.grid_w ?? 8,
            h: liveGridHById[tile.tile_id]
               ?? Math.max(
                  tile.grid_h ?? 0,
                  tileHeightToGridH(tile.tile_height)
                )
        }));
    }, [props.item_list, resizingTileId]);


    const bringToFront = useCallback((tile_id) => {
        props.tileDispatch({
          type: "bring_tile_to_front",
          tile_id
        });
    }, []);

    const handleTileResizeStop = useCallback((tile_id, size) => {
      const grid_w = tileWidthToGridW(size.width, containerWidth);
      const grid_h = tileHeightToGridH(size.height);

      setLiveGridHById(prev => {
        const next = {...prev};
        delete next[tile_id];
        return next;
      });

      props.setTileState(tile_id, {
        tile_width: size.width,
        tile_height: size.height,
        grid_w,
        grid_h,
      });
    }, [containerWidth, props.setTileState]);

    const handleTileResizeLive = useCallback((tile_id, size) => {
          const grid_h = tileHeightToGridH(size.height);

          setLiveGridHById(prev => {
            if (prev[tile_id] === grid_h) return prev;
            return {...prev, [tile_id]: grid_h};
          });
        }, []);

    const handleDragStart = useCallback((layout, oldItem, newItem) => {
        isGridDraggingRef.current = true;
    }, []);

    const handleDragStop = useCallback((layout) => {
        isGridDraggingRef.current = false;
        props.setGridLayout(layout);
    }, [props.setGridLayout]);

    const handleWidthChange = useCallback((width) => {
        setContainerWidth(prev => {
            const rounded = Math.round(width);
            return prev === rounded ? prev : rounded;
        });
    }, []);

    return (
        <GridLayout
            className={`${props.className} ${resizingTileId ? "manual-resizing-container" : ""}`}
            layout={layout}
            cols={GRID_COLS}
            rowHeight={ROW_HEIGHT}
            margin={MARGIN}
            draggableHandle=".tile-name-div"
            isResizable={false}
            compactType={null}
            allowOverlap={true}
            preventCollision={false}
            onWidthChange={handleWidthChange}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
        >
            {props.item_list.map((entry, index) => (
                <div key={entry.tile_id}
                     className={resizingTileId === entry.tile_id ? "manual-resizing" : ""}
                     style={{
                         zIndex: entry.tile_z ?? 1,
                         pointerEvents: "none",
                         transition: resizingTileId === entry.tile_id ? "none" : undefined,
                     }}>
                    <div style={{pointerEvents: "auto", display: "inline-block"}}>
                        <WrappedComponent
                            index={index}
                            onBringToFront={() => bringToFront(entry.tile_id)}
                            onTileResizeStart={() => setResizingTileId(entry.tile_id)}
                            onTileResizeLive={handleTileResizeLive}
                            onTileResizeStop={(tile_id, size) => {
                                setResizingTileId(null);
                                handleTileResizeStop(tile_id, size);
                            }}
                            {...entry}
                            {...props.extraProps}
                        />
                    </div>
                </div>
            ))}
        </GridLayout>
    );
});