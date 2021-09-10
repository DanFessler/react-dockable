"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _DividerModule = _interopRequireDefault(require("./css/Divider.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: _DividerModule["default"].container + " " + (className || ""),
    style: (_ref2 = {}, _ref2[getPropertyName("size")] = size, _ref2.backgroundColor = color, _ref2),
    onPointerDown: onDragStart
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _DividerModule["default"].handle,
    style: (_ref3 = {}, _ref3[getPropertyName("size")] = size + bleed * 2, _ref3[getPropertyName("position")] = -bleed, _ref3.cursor = getCursor(), _ref3)
  }));
}

var _default = Divider;
exports["default"] = _default;
module.exports = exports.default;