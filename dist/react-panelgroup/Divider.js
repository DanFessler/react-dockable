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

  return /*#__PURE__*/React.createElement("div", {
    className: `${css.container} ${className || ""}`,
    style: {
      [getPropertyName("size")]: size,
      backgroundColor: color
    },
    onPointerDown: onDragStart
  }, /*#__PURE__*/React.createElement("div", {
    className: css.handle,
    style: {
      [getPropertyName("size")]: size + bleed * 2,
      [getPropertyName("position")]: -bleed,
      cursor: getCursor()
    }
  }));
}

export default Divider;