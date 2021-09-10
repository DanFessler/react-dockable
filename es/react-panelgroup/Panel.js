function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { createRef } from "react";
import css from "./css/Panel.module.css";

var Panel = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Panel, _React$Component);

  function Panel() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "element", createRef());

    return _this;
  }

  var _proto = Panel.prototype;

  _proto.getPropertyName = function getPropertyName(type, inverse) {
    var isRow = this.props.direction === "row";
    if (inverse) isRow = !isRow;

    switch (type) {
      case "size":
        return isRow ? "width" : "height";

      case "minSize":
        return isRow ? "minWidth" : "minHeight";

      case "maxSize":
        return isRow ? "maxWidth" : "maxHeight";

      default:
        return;
    }
  };

  _proto.render = function render() {
    var _ref;

    return /*#__PURE__*/React.createElement("div", {
      className: css.container + " " + (this.props.className || ""),
      ref: this.element,
      style: (_ref = {}, _ref[this.getPropertyName("size")] = this.props.data.size, _ref[this.getPropertyName("minSize")] = this.props.data.minSize, _ref[this.getPropertyName("maxSize")] = this.props.data.maxSize || "auto", _ref.flexGrow = !this.props.data.maxSize && this.props.data.resize === "stretch" ? "1" : "0", _ref.backgroundColor = this.props.color, _ref)
    }, this.props.children);
  };

  return Panel;
}(React.Component);

export default Panel;