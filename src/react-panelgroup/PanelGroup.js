import React, { useEffect, useState, useRef } from "react";
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
  const [panels, setPanels] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  const panelRefs = useRef([]);
  const containerRef = useRef(null);

  // Update panel sizes on mount
  useEffect(() => {
    updatePanelSizesFromDOM();
  }, [panelRefs]);

  function isControlled() {
    return onUpdate || onResizeStart || onResizeEnd ? true : false;
  }

  function getDefaultPanel() {
    return {
      size: 256,
      minSize: 48,
      maxSize: 0,
      resize: "stretch",
      ...defaultPanel,
    };
  }

  function updatePanels(panels) {
    if (isControlled()) onUpdate && onUpdate(panels);
    else setPanels(panels);
  }

  function getPanels() {
    return isControlled() ? applyDefaults(panelWidths) : applyDefaults(panels);
  }

  function applyDefaults(panels) {
    return panels.map((panel) => ({ ...getDefaultPanel(), ...panel }));
  }

  function updatePanelSizesFromDOM() {
    const newPanels = panelRefs.current.map((el, i) => {
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
    setDragIndex(panelIndex);
    updatePanelSizesFromDOM();
    onResizeStart && onResizeStart([...getPanels()]);
  }

  function handleDrag(e) {
    if (dragIndex === null) return;
    const panels = [...getPanels()];
    resizePanels(dragIndex, getMousePos(e), panels);
    updatePanels(panels);
  }

  function handleDragEnd(e) {
    if (dragIndex === null) return;
    setDragIndex(null);
    onResizeEnd && onResizeEnd([...getPanels()]);
  }

  function getCursor() {
    if (dragIndex !== null) {
      return direction === "row" ? "ns-resize" : "ew-resize";
    } else {
      return "auto";
    }
  }

  function getMousePos(e) {
    let panels = getPanels();
    let size = dragIndex * spacing + spacing / 2;
    for (let i = 0; i <= dragIndex; i++) {
      size += panels[i].size;
    }

    const box = containerRef.current.getBoundingClientRect();
    return direction === "row"
      ? e.clientX - size - box.left
      : e.clientY - size - box.top;
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
            ref={(element) => {
              panelRefs.current[i] = element;
            }}
            direction={direction}
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
