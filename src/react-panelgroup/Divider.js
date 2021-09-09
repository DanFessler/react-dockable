import React from "react";
import css from "./css/Divider.module.css";

function Divider({
  size = 1,
  bleed = 4,
  color = "transparent",
  onDragStart,
  direction,
  className
}) {
  function getCursor() {
    return direction === "row" ? "ew-resize" : "ns-resize";
  }

  function getPropertyName(type, inverse) {
    let isRow = direction === "row";
    if (inverse) isRow = !isRow;

    switch (type) {
      case "size":
        return isRow ? "width" : "height";
      case "position":
        return isRow ? "left" : "top";
      default:
        return;
    }
  }

  return (
    <div
      className={`${css.container} ${className || ""}`}
      style={{ [getPropertyName("size")]: size, backgroundColor: color }}
      onPointerDown={onDragStart}
    >
      <div
        className={css.handle}
        style={{
          [getPropertyName("size")]: size + bleed * 2,
          [getPropertyName("position")]: -bleed,
          cursor: getCursor()
        }}
      ></div>
    </div>
  );
}

export default Divider;
