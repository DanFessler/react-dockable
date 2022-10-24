"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _ContextMenuModule = _interopRequireDefault(require("./css/ContextMenu.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// TODO:
// handle bool is unused or unfinished
function ContextMenu(_ref) {
  var left = _ref.left,
      top = _ref.top,
      actions = _ref.actions,
      onClickOut = _ref.onClickOut;

  var _useState = (0, _react.useState)({
    x: 0,
    y: 0
  }),
      offset = _useState[0],
      setOffset = _useState[1];

  var containerRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
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

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: _ContextMenuModule["default"].container,
    onClick: handleClickOut
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      left: left + offset.x,
      top: top + offset.y
    },
    className: _ContextMenuModule["default"].contextMenu,
    ref: containerRef
  }, actions.map(function (actionGroup, i, arr) {
    var types = {
      actions: function actions() {
        return Object.keys(actionGroup.actions).map(function (action, a, arr) {
          return /*#__PURE__*/_react["default"].createElement("div", {
            key: a,
            className: _ContextMenuModule["default"].contextMenuItem,
            onClick: handleAction.bind(null, actionGroup.actions[action])
          }, /*#__PURE__*/_react["default"].createElement("div", null, action), /*#__PURE__*/_react["default"].createElement("div", {
            style: {
              marginLeft: 16,
              color: "#666"
            }
          }, "Ctrl+Z"));
        });
      },
      "enum": function _enum() {
        return actionGroup.options.map(function (action, a, arr) {
          return /*#__PURE__*/_react["default"].createElement("div", {
            key: a,
            className: _ContextMenuModule["default"].contextMenuItem,
            onClick: handleSelection.bind(null, actionGroup.onChange, a)
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: _ContextMenuModule["default"].radio
          }, actionGroup.selected === a ? "⚫" : "⚪"), /*#__PURE__*/_react["default"].createElement("span", null, action));
        });
      },
      bools: function bools() {
        return Object.keys(actionGroup.options).map(function (option, a, arr) {
          return /*#__PURE__*/_react["default"].createElement("div", {
            key: a,
            className: _ContextMenuModule["default"].contextMenuItem,
            onClick: handleAction.bind(null, actionGroup.options[option]["function"])
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: _ContextMenuModule["default"].checkbox
          }, actionGroup.options[option].value === true ? "✔" : " "), /*#__PURE__*/_react["default"].createElement("span", null, option));
        });
      }
    };
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, {
      key: i
    }, types[actionGroup.type](), i !== arr.length - 1 ? /*#__PURE__*/_react["default"].createElement("div", {
      className: _ContextMenuModule["default"].contextMenuDivider
    }) : null);
  })));
}

var _default = ContextMenu;
exports["default"] = _default;
module.exports = exports.default;