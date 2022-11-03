import React, { createRef, useEffect, useState, useRef } from "react";
import Panel from "./Panel.js";
import Divider from "./Divider.js";

/*
  PanelGroup is the component responsible for
  managing drag-resizable columns and rows. It has
  special functionality for cascading the resize
  to neighboring panels when resized beyond min/max
*/

function PanelGroup({
  onUpdate,
  onResizeStart,
  onResizeEnd,
  panelWidths,
  children,
  defaultPanel = {},
  direction = "row",
  spacing = 2,
  className,
  panelClassName,
  dividerClassName,
  panelColor = "default",
  borderColor = "default",
}) {
  const [state, setState] = useState({
    panels: [],
    dragging: null,
    lastSize: null,
  });

  const containerRef = useRef();
  // const panelRefs = useRef([]);
  const [panelRefs, setPanelRefs] = useState([]);

  const DEFAULT_PANEL = {
    size: 256,
    minSize: 48,
    maxSize: 0,
    resize: "stretch",
  };

  function isControlled() {
    return onUpdate || onResizeStart || onResizeEnd ? true : false;
  }

  function getDefaultPanel() {
    return { ...DEFAULT_PANEL, ...defaultPanel };
  }

  // mount / unmount
  useEffect(() => {
    if (!containerRef.current) return;

    // Listen to size changes on container
    const resizeObserver = new ResizeObserver(handleResizeDOM);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, panelRefs]);

  // didUpdate
  useEffect(() => {
    updatePanelSizesFromDOM();
  }, [panelRefs]);

  function updatePanels(panels) {
    if (isControlled()) onUpdate && onUpdate(panels);
    else setState({ ...state, panels: panels });
  }

  function getPanels() {
    return isControlled() ? applyDefaults(panelWidths) : state.panels;
  }

  function applyDefaults(panels) {
    return panels.map((panel) => ({ ...getDefaultPanel(), ...panel }));
  }

  function updatePanelSizesFromDOM() {
    const newPanels = panelRefs.map((el, i) => {
      // TODO: Need to handle ref tracking better when adding/removing panels
      if (!el) return null;
      let box = el.getBoundingClientRect();
      return {
        ...getPanels()[i],
        size: box[direction === "row" ? "width" : "height"],
      };
    });

    updatePanels(newPanels);
  }

  function handleResizeDOM(entries) {
    let entry = entries[0];

    if (entry.borderBoxSize) {
      let [width, height] = entry.borderBoxSize;

      // only do this if the change is in the direction that matters
      if (
        !state.lastSize ||
        (direction === "row" && state.lastSize.width !== width) ||
        (direction === "column" && state.lastSize.height !== height)
      ) {
        setState((state) => ({ ...state, lastSize: { width, height } }));
        return;
      }
    }
  }

  function resizePanels(dividerIndex, delta, panels) {
    // make the changes and deal with the consequences later
    panels[dividerIndex].size += delta;
    panels[dividerIndex + 1].size -= delta;

    // resolve invalid panel sizes
    resolvePanel(dividerIndex, -1, panels);
    resolvePanel(dividerIndex, 1, panels);
  }

  function resolvePanel(dividerIndex, direction, panels) {
    let panel = panels[dividerIndex + (direction < 0 ? 0 : 1)];

    // if we made the panel too small
    if (panel.size < panel.minSize) {
      delegate(panel.minSize - panel.size);
    }

    // if we made the panel too big
    if (panel.maxSize && panel.size > panel.maxSize) {
      delegate(panel.maxSize - panel.size);
    }

    function delegate(delta) {
      let nextIndex = dividerIndex + direction;
      if (nextIndex >= 0 && nextIndex <= panels.length - 2) {
        resizePanels(nextIndex, delta * direction, panels);
      } else {
        resizePanels(dividerIndex, -delta * direction, panels);
      }
    }
  }

  function handleDragStart(panelIndex, e) {
    setState({
      ...state,
      dragging: {
        index: panelIndex,
        extended: false,
      },
    });
    updatePanelSizesFromDOM();

    onResizeStart && onResizeStart([...getPanels()]);
  }

  function handleDrag(e) {
    if (!state.dragging) return;
    const panels = [...getPanels()];
    resizePanels(state.dragging.index, getMousePos(e), panels);
    updatePanels(panels);
  }

  function handleDragEnd(e) {
    if (!state.dragging) return;
    setState({ ...state, dragging: null });
    onResizeEnd && onResizeEnd([...getPanels()]);
  }

  function getCursor() {
    if (state.dragging) {
      return direction === "row" ? "ns-resize" : "ew-resize";
    } else {
      return "auto";
    }
  }

  function getMousePos(e, panelIndex) {
    let index = state.dragging.index;

    let panels = getPanels();
    let size = index * spacing + spacing / 2;
    for (let i = 0; i <= index; i++) {
      size += panels[i].size;
    }

    const box = containerRef.current.getBoundingClientRect();
    if (direction === "row") {
      return e.clientX - size - box.left;
    } else {
      return e.clientY - size - box.top;
    }
  }

  return (
    <div
      className={`pg-panelGroup ${className || ""}`}
      ref={containerRef}
      style={{
        cursor: getCursor(),
        flexDirection: direction,
        display: "flex",
        height: "100%",
        flexGrow: 1,
      }}
      onPointerMove={handleDrag}
      onPointerUp={handleDragEnd}
    >
      {React.Children.map(children, (child, i) => {
        return [
          // Render Panel
          <Panel
            className={panelClassName}
            color={panelColor}
            data={getPanels()[i] || getDefaultPanel()}
            // ref={(element) => {
            //   panelRefs.current[i] = element;
            // }}
            direction={direction}
            onMount={(element) => {
              setPanelRefs((panelRefs) => {
                const newRefs = [...panelRefs];
                newRefs[i] = element;
                return newRefs;
              });
            }}
          >
            {child}
          </Panel>,

          // Render border handle
          i + 1 < React.Children.count(children) && (
            <Divider
              className={dividerClassName}
              onDragStart={(e) => handleDragStart(i, e)}
              size={spacing}
              color={borderColor}
              direction={direction}
            />
          ),
        ];
      })}
    </div>
  );
}

export default PanelGroup;
