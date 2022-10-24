"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactBeautifulDnd = require("react-beautiful-dnd");

var _WindowModule = _interopRequireDefault(require("./css/Window.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import Color from "color";
var Window = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Window, _Component);

  function Window() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "widgetRef", _react["default"].createRef());

    _defineProperty(_assertThisInitialized(_this), "containerRef", _react["default"].createRef());

    _defineProperty(_assertThisInitialized(_this), "defaultActions", [{
      type: "actions",
      actions: {
        "Close Tab": function CloseTab() {
          // console.log
          _this.props.onTabClosed(_this.props.windowId, _this.props.windowId);
        },
        "Close Tab Group": function CloseTabGroup() {
          _this.props.onWindowClosed(_this.props.windowId);
        }
      }
    }]);

    _defineProperty(_assertThisInitialized(_this), "getSize", function (tab) {
      var widget = _react["default"].Children.toArray(_this.props.children)[tab !== undefined ? tab : _this.props.selected];

      var size = widget.props.minHeight ? widget.props.minHeight : 0;
      return size + 34 // content size // tab bar
      ;
    });

    _defineProperty(_assertThisInitialized(_this), "handleContextClick", function (e) {
      var ref = _this.GetSelectedWidget();

      var clientRect = e.target.getBoundingClientRect(); //this.refs.contextMenuButton.getBoundingClientRect();

      _this.props.onContextClick(_this.getActions(ref), clientRect.left, clientRect.top + clientRect.height);
    });

    _defineProperty(_assertThisInitialized(_this), "renderBorders", function () {
      return [_this.containerRef.current && _this.props.draggingTab ? /*#__PURE__*/_react["default"].createElement("div", {
        key: 0,
        className: _WindowModule["default"].dropBorder,
        onMouseOver: _this.props.onHoverBorder.bind(_assertThisInitialized(_this), _this.props.index),
        onMouseOut: _this.props.onHoverBorder.bind(_assertThisInitialized(_this), null),
        style: {
          width: _this.containerRef.current.getBoundingClientRect().width,
          top: _this.containerRef.current.getBoundingClientRect().top - 9,
          left: _this.containerRef.current.getBoundingClientRect().left
        }
      }) : null, _this.containerRef.current && _this.props.draggingTab && _this.props.isLast ? /*#__PURE__*/_react["default"].createElement("div", {
        key: 1,
        className: _WindowModule["default"].dropBorder,
        onMouseOver: _this.props.onHoverBorder.bind(_assertThisInitialized(_this), _this.props.index + 1),
        onMouseOut: _this.props.onHoverBorder.bind(_assertThisInitialized(_this), null),
        style: {
          width: _this.containerRef.current.getBoundingClientRect().width,
          top: _this.containerRef.current.getBoundingClientRect().top + _this.containerRef.current.getBoundingClientRect().height - 9,
          left: _this.containerRef.current.getBoundingClientRect().left
        }
      }) : null];
    });

    return _this;
  }

  var _proto = Window.prototype;

  _proto.componentDidUpdate = function componentDidUpdate() {
    this.props.onTabSwitch(this.getSize(this.props.selected));
  };

  _proto.getActions = function getActions(ref, includeDefault) {
    if (includeDefault === void 0) {
      includeDefault = true;
    }

    var defaultActions = includeDefault ? this.defaultActions : [];
    return ref.props.actions ? ref.props.actions.call(ref, ref).concat(defaultActions) : defaultActions;
  };

  _proto.GetSelectedWidget = function GetSelectedWidget() {
    return _react["default"].Children.toArray(this.props.children)[this.props.selected];
  };

  _proto.render = function render() {
    var _this2 = this;

    var selected = Math.min(Math.max(this.props.selected, 0), this.props.children.length - 1);
    var selectedWidget = this.GetSelectedWidget();
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: _WindowModule["default"].container,
      ref: this.containerRef,
      onMouseDown: function onMouseDown() {
        return _this2.props.onActive(_react["default"].Children.toArray(_this2.props.children)[_this2.props.selected].props.id);
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: _WindowModule["default"].window,
      style: this.props.style
    }, !this.props.hideTabs && /*#__PURE__*/_react["default"].createElement(TabBar, {
      active: this.props.active,
      widgets: this.props.children,
      selected: this.props.selected,
      onTabClick: function onTabClick(tabId, componentId) {
        _this2.props.onTabSelect(tabId, componentId);
      },
      onContextClick: this.handleContextClick,
      onSort: this.props.onSort,
      windowId: this.props.windowId,
      hoverBorder: this.props.hoverBorder,
      onClose: this.props.onTabClosed.bind(this, this.props.windowId),
      hideMenu: // hide the context menu if there aren't any actions to show
      this.props.hideMenu || !this.getActions(selectedWidget).length,
      tabHeight: this.props.tabHeight
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: _WindowModule["default"].content
    }, selectedWidget)), this.renderBorders());
  };

  return Window;
}(_react.Component);

_defineProperty(Window, "defaultProps", {
  padding: 8
});

var TabBar = /*#__PURE__*/function (_Component2) {
  _inheritsLoose(TabBar, _Component2);

  function TabBar() {
    return _Component2.apply(this, arguments) || this;
  }

  var _proto2 = TabBar.prototype;

  _proto2.render = function render() {
    var _this3 = this;

    var _this$props = this.props,
        widgets = _this$props.widgets,
        selected = _this$props.selected,
        onTabClick = _this$props.onTabClick,
        onContextClick = _this$props.onContextClick,
        active = _this$props.active;

    function getStyle(style, snapshot) {
      if (!snapshot.isDropAnimating) {
        return style;
      }

      var _snapshot$dropAnimati = snapshot.dropAnimation,
          curve = _snapshot$dropAnimati.curve,
          duration = _snapshot$dropAnimati.duration;
      return _extends({}, style, {
        // cannot be 0, but make it super tiny
        transition: "all " + curve + " " + (snapshot.isDropAnimating ? 0.001 : duration) + "s",
        // boxShadow: snapshot.isDragging
        //   ? "0 1px 10px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.25)"
        //   : `1px -1px 0 #353535, -1px -1px 0 #353535`,
        borderRadius: snapshot.isDragging ? 1 : 0
      });
    }

    return /*#__PURE__*/_react["default"].createElement(_reactBeautifulDnd.Droppable, {
      droppableId: this.props.windowId,
      direction: "horizontal"
    }, function (provided, snapshot) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: _WindowModule["default"].tabBar + " " + (snapshot.isDraggingOver && !snapshot.draggingFromThisWith && !_this3.props.hoverBorder ? _WindowModule["default"].tabBarHover : ""),
        style: _this3.props.tabHeight ? {
          height: _this3.props.tabHeight
        } : {}
      }, /*#__PURE__*/_react["default"].createElement("div", _extends({
        ref: provided.innerRef,
        className: _WindowModule["default"].tabSpacer
      }, provided.droppableProps), widgets.map(function (child, i) {
        return /*#__PURE__*/_react["default"].createElement(_reactBeautifulDnd.Draggable, {
          key: _this3.props.windowId + "," + i,
          draggableId: _this3.props.windowId + "," + i,
          index: i
        }, function (provided, snapshot) {
          return /*#__PURE__*/_react["default"].createElement("div", _extends({
            ref: provided.innerRef
          }, provided.draggableProps, provided.dragHandleProps, {
            key: i,
            className: _WindowModule["default"].tab + " " + (i === selected ? _WindowModule["default"].active : ""),
            onMouseDown: function onMouseDown(e) {
              onTabClick(i, child.props.id);
              e.stopPropagation();
            },
            style: getStyle(provided.draggableProps.style, snapshot)
          }), /*#__PURE__*/_react["default"].createElement("span", {
            className: _WindowModule["default"].title,
            style: {
              fontWeight: i === selected && child.props.id === active ? "bold" : "normal"
            }
          }, child.props.title || child.props.id), child.props.closeable ? /*#__PURE__*/_react["default"].createElement("div", {
            className: _WindowModule["default"].closeBox,
            onClick: function onClick(e) {
              if (child.props.onClose) child.props.onClose(child.props.id);

              _this3.props.onClose(i);
            }
          }) : null);
        });
      }), provided.placeholder), !_this3.props.hideMenu && /*#__PURE__*/_react["default"].createElement("div", {
        className: _WindowModule["default"].burgerMenuContainer,
        onClick: onContextClick
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _WindowModule["default"].burgerMenu
      })));
    });
  };

  return TabBar;
}(_react.Component);

var _default = Window;
exports["default"] = _default;
module.exports = exports.default;