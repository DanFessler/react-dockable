function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from "react";
import css from "./css/ContextMenu.module.css";

class ContextMenu extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      offset: {
        x: 0,
        y: 0
      }
    });

    _defineProperty(this, "containerRef", /*#__PURE__*/React.createRef());

    _defineProperty(this, "handleClickOut", e => {
      this.props.onClickOut();
    });

    _defineProperty(this, "handleAction", action => {
      action();
      this.props.onClickOut();
    });

    _defineProperty(this, "handleSelection", (callback, i) => {
      callback(i);
      this.props.onClickOut();
    });

    _defineProperty(this, "handleBool", toggleFunction => {
      toggleFunction();
      this.props.onClickOut();
    });
  }

  componentDidMount() {
    if (this.containerRef.current) {
      let x = 0,
          y = 0;
      let menuBox = this.containerRef.current.getBoundingClientRect();
      let viewPort = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      if (this.props.left + menuBox.width > viewPort.width) x -= this.props.left + menuBox.width - viewPort.width;
      if (this.props.top + menuBox.height > viewPort.height) y -= this.props.top + menuBox.height - viewPort.height;
      this.setState({
        offset: {
          x: x,
          y: y
        }
      });
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: css.container,
      onClick: this.handleClickOut
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        left: this.props.left + this.state.offset.x,
        top: this.props.top + this.state.offset.y
      },
      className: css.contextMenu,
      ref: this.containerRef
    }, this.props.actions.map((actionGroup, i, arr) => {
      switch (actionGroup.type) {
        case "actions":
          return /*#__PURE__*/React.createElement(React.Fragment, {
            key: i
          }, Object.keys(actionGroup.actions).map((action, a, arr) => /*#__PURE__*/React.createElement("div", {
            key: a,
            className: css.contextMenuItem,
            onClick: this.handleAction.bind(null, actionGroup.actions[action])
          }, /*#__PURE__*/React.createElement("div", null, action), /*#__PURE__*/React.createElement("div", {
            style: {
              marginLeft: 16,
              color: "#666"
            }
          }, "Ctrl+Z"))), i !== arr.length - 1 ? /*#__PURE__*/React.createElement("div", {
            className: css.contextMenuDivider
          }) : null);

        case "enum":
          return /*#__PURE__*/React.createElement(React.Fragment, {
            key: i
          }, actionGroup.options.map((action, a, arr) => /*#__PURE__*/React.createElement("div", {
            key: a,
            className: css.contextMenuItem,
            onClick: this.handleSelection.bind(null, actionGroup.onChange, a)
          }, /*#__PURE__*/React.createElement("div", {
            className: css.radio
          }, actionGroup.selected === a ? "⚫" : "⚪"), /*#__PURE__*/React.createElement("span", null, action))), i !== arr.length - 1 ? /*#__PURE__*/React.createElement("div", {
            className: css.contextMenuDivider
          }) : null);

        case "bools":
          return /*#__PURE__*/React.createElement(React.Fragment, {
            key: i
          }, Object.keys(actionGroup.options).map((option, a, arr) => /*#__PURE__*/React.createElement("div", {
            key: a,
            className: css.contextMenuItem,
            onClick: this.handleAction.bind(null, actionGroup.options[option].function)
          }, /*#__PURE__*/React.createElement("div", {
            className: css.checkbox
          }, actionGroup.options[option].value === true ? "✔" : " "), /*#__PURE__*/React.createElement("span", null, option))), i !== arr.length - 1 ? /*#__PURE__*/React.createElement("div", {
            className: css.contextMenuDivider
          }) : null);

        default:
          return null;
      }
    }, this)));
  }

}

export default ContextMenu;