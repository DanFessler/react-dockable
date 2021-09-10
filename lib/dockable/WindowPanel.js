"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactPanelgroup = _interopRequireDefault(require("../react-panelgroup"));

var _Window = _interopRequireDefault(require("./Window"));

var _Widget = _interopRequireDefault(require("./Widget"));

var _WindowPanelModule = _interopRequireDefault(require("./css/WindowPanel.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MissingWidget = (0, _Widget["default"])( /*#__PURE__*/function (_Component) {
  _inheritsLoose(_class, _Component);

  function _class() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = _class.prototype;

  _proto.render = function render() {
    return null;
  };

  return _class;
}(_react.Component), {
  title: "Missing Widget"
});

var WindowPanel = /*#__PURE__*/function (_Component2) {
  _inheritsLoose(WindowPanel, _Component2);

  function WindowPanel() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component2.call.apply(_Component2, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "containerRef", _react["default"].createRef());

    _defineProperty(_assertThisInitialized(_this), "state", {
      panelWidths: [_react["default"].Children.map(_this.props.children, function (panelWindow, i) {
        return {
          size: 10,
          minSize: 10,
          resize: "dynamic"
        };
      })]
    });

    _defineProperty(_assertThisInitialized(_this), "windowRefs", []);

    _defineProperty(_assertThisInitialized(_this), "handleTabSwitch", function (i, size) {
      // exit early if size didn't change
      if (_this.props.windows[i].minSize === size) return;

      var newPanels = _this.props.windows.slice();

      newPanels[i].minSize = size;
      if (newPanels[i].size < newPanels[i].minSize) newPanels[i].size = newPanels[i].minSize;

      _this.handleResize(newPanels);
    });

    _defineProperty(_assertThisInitialized(_this), "handleResize", function (windows) {
      _this.props.onUpdate(_this.props.index, windows);
    });

    _defineProperty(_assertThisInitialized(_this), "renderBorders", function () {
      return [_this.containerRef.current && _this.props.draggingTab ? /*#__PURE__*/_react["default"].createElement("div", {
        key: 0,
        className: _WindowPanelModule["default"].dropBorder,
        onMouseOver: _this.props.onHoverBorder.bind(_assertThisInitialized(_this), [_this.props.index, null]),
        onMouseOut: _this.props.onHoverBorder.bind(_assertThisInitialized(_this), null),
        style: {
          height: _this.containerRef.current.getBoundingClientRect().height,
          top: _this.containerRef.current.getBoundingClientRect().top,
          left: _this.containerRef.current.getBoundingClientRect().left - 9
        }
      }) : null, _this.containerRef.current && _this.props.draggingTab && _this.props.isLast ? /*#__PURE__*/_react["default"].createElement("div", {
        key: 1,
        className: _WindowPanelModule["default"].dropBorder,
        onMouseOver: _this.props.onHoverBorder.bind(_assertThisInitialized(_this), [_this.props.index + 1, null]),
        onMouseOut: _this.props.onHoverBorder.bind(_assertThisInitialized(_this), null),
        style: {
          height: _this.containerRef.current.getBoundingClientRect().height,
          top: _this.containerRef.current.getBoundingClientRect().top,
          left: _this.containerRef.current.getBoundingClientRect().left + _this.containerRef.current.getBoundingClientRect().width - 6
        }
      }) : null];
    });

    return _this;
  }

  var _proto2 = WindowPanel.prototype;

  _proto2.filterVisibleWidgets = function filterVisibleWidgets(thisWindow) {
    var _this2 = this;

    return thisWindow.widgets.filter(function (widget) {
      return !(_this2.getWidgetComponent(widget).props.hidden || _this2.props.hidden[widget]);
    });
  };

  _proto2.getFilteredWindows = function getFilteredWindows() {
    var _this3 = this;

    if (!this.props.hidden) return this.props.windows;
    return this.props.windows.filter(function (windows) {
      return windows.widgets.filter(function (widget) {
        return !_this3.props.hidden[widget];
      }).length > 0;
    });
  };

  _proto2.getWidgetComponent = function getWidgetComponent(id) {
    return _react["default"].Children.toArray(this.props.widgets).find(function (child) {
      return child.props.id === id;
    });
  };

  _proto2.render = function render() {
    var _this4 = this;

    return /*#__PURE__*/_react["default"].createElement("div", {
      className: _WindowPanelModule["default"].container,
      ref: this.containerRef
    }, /*#__PURE__*/_react["default"].createElement(_reactPanelgroup["default"], {
      direction: "column",
      spacing: this.props.spacing || 0,
      borderColor: "transparent",
      panelWidths: this.getFilteredWindows() // onUpdate={panels => this.setState({ panelWidths: panels.slice() })}
      ,
      onUpdate: this.handleResize
    }, this.getFilteredWindows().map(function (thisWindow, windowIndex) {
      var filteredWidgets = _this4.filterVisibleWidgets(thisWindow);

      return filteredWidgets.length ? /*#__PURE__*/_react["default"].createElement(_Window["default"], {
        key: windowIndex,
        index: windowIndex,
        active: _this4.props.active,
        onActive: _this4.props.onActive,
        windowId: _this4.props.index + "," + windowIndex,
        onContextClick: _this4.props.onContextClick,
        isLast: windowIndex === _this4.props.windows.length - 1,
        draggingTab: _this4.props.draggingTab,
        hoverBorder: _this4.props.hoverBorder,
        onHoverBorder: function onHoverBorder(i) {
          _this4.props.onHoverBorder(i === null ? null : [_this4.props.index, i]);
        },
        onSort: _this4.props.onTabSort.bind(_this4, _this4.props.index, windowIndex),
        selected: Math.min(thisWindow.selected, filteredWidgets.length - 1),
        onTabSelect: function onTabSelect(i, componentId) {
          _this4.props.onTabSelect(_this4.props.index, windowIndex, i, componentId);
        },
        ref: function ref(input) {
          _this4.windowRefs[windowIndex] = input;
        },
        onTabSwitch: _this4.handleTabSwitch.bind(null, windowIndex),
        onTabClosed: function onTabClosed(winId, tabId) {
          var _winId$split = winId.split(","),
              panelId = _winId$split[0],
              windowId = _winId$split[1];

          _this4.props.onTabClosed(parseInt(panelId, 10), parseInt(windowId, 10), tabId);
        },
        hideTabs: thisWindow.hideTabs || _this4.props.hideTabs,
        hideMenu: _this4.props.hideMenus,
        style: thisWindow.style,
        tabHeight: _this4.props.tabHeight
      }, filteredWidgets.map(function (widget, i) {
        // Find component with the desired name
        var Component = _this4.getWidgetComponent(widget);

        if (!Component) Component = /*#__PURE__*/_react["default"].createElement(MissingWidget, null);
        return Component;
      })) : null;
    })), this.renderBorders());
  };

  return WindowPanel;
}(_react.Component);

var _default = WindowPanel;
exports["default"] = _default;
module.exports = exports.default;