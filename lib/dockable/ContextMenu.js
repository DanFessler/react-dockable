"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _ContextMenuModule = _interopRequireDefault(require("./css/ContextMenu.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ContextMenu = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ContextMenu, _Component);

  function ContextMenu() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "state", {
      offset: {
        x: 0,
        y: 0
      }
    });

    _defineProperty(_assertThisInitialized(_this), "containerRef", _react["default"].createRef());

    _defineProperty(_assertThisInitialized(_this), "handleClickOut", function (e) {
      _this.props.onClickOut();
    });

    _defineProperty(_assertThisInitialized(_this), "handleAction", function (action) {
      action();

      _this.props.onClickOut();
    });

    _defineProperty(_assertThisInitialized(_this), "handleSelection", function (callback, i) {
      callback(i);

      _this.props.onClickOut();
    });

    _defineProperty(_assertThisInitialized(_this), "handleBool", function (toggleFunction) {
      toggleFunction();

      _this.props.onClickOut();
    });

    return _this;
  }

  var _proto = ContextMenu.prototype;

  _proto.componentDidMount = function componentDidMount() {
    if (this.containerRef.current) {
      var x = 0,
          y = 0;
      var menuBox = this.containerRef.current.getBoundingClientRect();
      var viewPort = {
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
  };

  _proto.render = function render() {
    var _this2 = this;

    return /*#__PURE__*/_react["default"].createElement("div", {
      className: _ContextMenuModule["default"].container,
      onClick: this.handleClickOut
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        left: this.props.left + this.state.offset.x,
        top: this.props.top + this.state.offset.y
      },
      className: _ContextMenuModule["default"].contextMenu,
      ref: this.containerRef
    }, this.props.actions.map(function (actionGroup, i, arr) {
      switch (actionGroup.type) {
        case "actions":
          return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, {
            key: i
          }, Object.keys(actionGroup.actions).map(function (action, a, arr) {
            return /*#__PURE__*/_react["default"].createElement("div", {
              key: a,
              className: _ContextMenuModule["default"].contextMenuItem,
              onClick: _this2.handleAction.bind(null, actionGroup.actions[action])
            }, /*#__PURE__*/_react["default"].createElement("div", null, action), /*#__PURE__*/_react["default"].createElement("div", {
              style: {
                marginLeft: 16,
                color: "#666"
              }
            }, "Ctrl+Z"));
          }), i !== arr.length - 1 ? /*#__PURE__*/_react["default"].createElement("div", {
            className: _ContextMenuModule["default"].contextMenuDivider
          }) : null);

        case "enum":
          return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, {
            key: i
          }, actionGroup.options.map(function (action, a, arr) {
            return /*#__PURE__*/_react["default"].createElement("div", {
              key: a,
              className: _ContextMenuModule["default"].contextMenuItem,
              onClick: _this2.handleSelection.bind(null, actionGroup.onChange, a)
            }, /*#__PURE__*/_react["default"].createElement("div", {
              className: _ContextMenuModule["default"].radio
            }, actionGroup.selected === a ? "⚫" : "⚪"), /*#__PURE__*/_react["default"].createElement("span", null, action));
          }), i !== arr.length - 1 ? /*#__PURE__*/_react["default"].createElement("div", {
            className: _ContextMenuModule["default"].contextMenuDivider
          }) : null);

        case "bools":
          return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, {
            key: i
          }, Object.keys(actionGroup.options).map(function (option, a, arr) {
            return /*#__PURE__*/_react["default"].createElement("div", {
              key: a,
              className: _ContextMenuModule["default"].contextMenuItem,
              onClick: _this2.handleAction.bind(null, actionGroup.options[option]["function"])
            }, /*#__PURE__*/_react["default"].createElement("div", {
              className: _ContextMenuModule["default"].checkbox
            }, actionGroup.options[option].value === true ? "✔" : " "), /*#__PURE__*/_react["default"].createElement("span", null, option));
          }), i !== arr.length - 1 ? /*#__PURE__*/_react["default"].createElement("div", {
            className: _ContextMenuModule["default"].contextMenuDivider
          }) : null);

        default:
          return null;
      }
    }, this)));
  };

  return ContextMenu;
}(_react.Component);

var _default = ContextMenu;
exports["default"] = _default;
module.exports = exports.default;