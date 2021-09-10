import React from "react";
import css from "./css/Divider.module.css";

function Divider(_ref) {
  var _ref2, _ref3;

  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? 1 : _ref$size,
      _ref$bleed = _ref.bleed,
      bleed = _ref$bleed === void 0 ? 4 : _ref$bleed,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? "transparent" : _ref$color,
      onDragStart = _ref.onDragStart,
      direction = _ref.direction,
      className = _ref.className;

  function getCursor() {
    return direction === "row" ? "ew-resize" : "ns-resize";
  }

  function getPropertyName(type, inverse) {
    var isRow = direction === "row";
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
    className: css.container + " " + (className || ""),
    style: (_ref2 = {}, _ref2[getPropertyName("size")] = size, _ref2.backgroundColor = color, _ref2),
    onPointerDown: onDragStart
  }, /*#__PURE__*/React.createElement("div", {
    className: css.handle,
    style: (_ref3 = {}, _ref3[getPropertyName("size")] = size + bleed * 2, _ref3[getPropertyName("position")] = -bleed, _ref3.cursor = getCursor(), _ref3)
  }));
}

export default Divider;