import React, { useEffect, useRef, useState } from "react";
import css from "./css/ContextMenu.module.css"; // TODO:
// handle bool is unused or unfinished

function ContextMenu(_ref) {
  var left = _ref.left,
      top = _ref.top,
      actions = _ref.actions,
      onClickOut = _ref.onClickOut;

  var _useState = useState({
    x: 0,
    y: 0
  }),
      offset = _useState[0],
      setOffset = _useState[1];

  var containerRef = useRef(null);
  useEffect(function () {
    if (!containerRef.current) return;
    var x = 0,
        y = 0;
    var menuBox = containerRef.current.getBoundingClientRect();
    var viewPort = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    if (left + menuBox.width > viewPort.width) {
      x -= left + menuBox.width - viewPort.width;
    }

    if (top + menuBox.height > viewPort.height) {
      y -= top + menuBox.height - viewPort.height;
    }

    setOffset({
      x: x,
      y: y
    });
  }, [containerRef, left, top]);

  function handleClickOut(e) {
    onClickOut();
  }

  function handleAction(action) {
    action();
    onClickOut();
  }

  function handleSelection(callback, i) {
    callback(i);
    onClickOut();
  }

  function handleBool(toggleFunction) {
    toggleFunction();
    onClickOut();
  }

  return /*#__PURE__*/React.createElement("div", {
    className: css.container,
    onClick: handleClickOut
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      left: left + offset.x,
      top: top + offset.y
    },
    className: css.contextMenu,
    ref: containerRef
  }, actions.map(function (actionGroup, i, arr) {
    var types = {
      actions: function actions() {
        return Object.keys(actionGroup.actions).map(function (action, a, arr) {
          return /*#__PURE__*/React.createElement("div", {
            key: a,
            className: css.contextMenuItem,
            onClick: handleAction.bind(null, actionGroup.actions[action])
          }, /*#__PURE__*/React.createElement("div", null, action), /*#__PURE__*/React.createElement("div", {
            style: {
              marginLeft: 16,
              color: "#666"
            }
          }, "Ctrl+Z"));
        });
      },
      "enum": function _enum() {
        return actionGroup.options.map(function (action, a, arr) {
          return /*#__PURE__*/React.createElement("div", {
            key: a,
            className: css.contextMenuItem,
            onClick: handleSelection.bind(null, actionGroup.onChange, a)
          }, /*#__PURE__*/React.createElement("div", {
            className: css.radio
          }, actionGroup.selected === a ? "⚫" : "⚪"), /*#__PURE__*/React.createElement("span", null, action));
        });
      },
      bools: function bools() {
        return Object.keys(actionGroup.options).map(function (option, a, arr) {
          return /*#__PURE__*/React.createElement("div", {
            key: a,
            className: css.contextMenuItem,
            onClick: handleAction.bind(null, actionGroup.options[option]["function"])
          }, /*#__PURE__*/React.createElement("div", {
            className: css.checkbox
          }, actionGroup.options[option].value === true ? "✔" : " "), /*#__PURE__*/React.createElement("span", null, option));
        });
      }
    };
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, types[actionGroup.type](), i !== arr.length - 1 ? /*#__PURE__*/React.createElement("div", {
      className: css.contextMenuDivider
    }) : null);
  })));
}

export default ContextMenu;