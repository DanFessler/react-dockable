"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactBeautifulDnd = require("react-beautiful-dnd");

var _arrayMove = require("array-move");

var _reactPanelgroup = _interopRequireDefault(require("../react-panelgroup"));

var _ContextMenu = _interopRequireDefault(require("./ContextMenu"));

var _WindowPanel = _interopRequireDefault(require("./WindowPanel"));

var _DockableModule = _interopRequireDefault(require("./css/Dockable.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Dockable = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Dockable, _Component);

  function Dockable() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "state", {
      contextMenu: {
        show: false,
        position: {
          x: 0,
          y: 0
        },
        actions: [{
          poop: function poop() {}
        }]
      },
      panels: [],
      draggingTab: false,
      hoverBorder: null
    });

    _defineProperty(_assertThisInitialized(_this), "handleContextClick", function (actions, x, y) {
      _this.setState({
        contextMenu: {
          show: true,
          position: {
            x: x,
            y: y
          },
          actions: actions
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "updatePanels", function (newPanels) {
      _this.setState(function (_ref) {
        var items = _ref.items;
        return {
          panels: newPanels
        };
      });

      _this.props.onUpdate && _this.props.onUpdate(newPanels);
    });

    _defineProperty(_assertThisInitialized(_this), "handlePanelResize", function (panels) {
      var newPanels = _this.getPanels().map(function (oldPanel, i) {
        return _extends({}, oldPanel, panels[i]);
      });

      _this.updatePanels(newPanels);
    });

    _defineProperty(_assertThisInitialized(_this), "handleWindowResize", function (panelId, windows) {
      var newWindows = _this.getPanels()[panelId].windows.map(function (oldWindow, i) {
        return _extends({}, oldWindow, windows[i]);
      });

      var newPanels = [].concat(_this.getPanels());
      newPanels[panelId].windows = newWindows;

      _this.updatePanels(newPanels);
    });

    _defineProperty(_assertThisInitialized(_this), "handleTabSort", function (panelIndex, windowIndex, tabStart, tabEnd) {
      var newPanels = [].concat(_this.getPanels());
      newPanels[panelIndex].windows[windowIndex].widgets = (0, _arrayMove.arrayMoveImmutable)(newPanels[panelIndex].windows[windowIndex].widgets, tabStart, tabEnd);

      _this.updatePanels(newPanels);
    });

    _defineProperty(_assertThisInitialized(_this), "handleTabSelect", function (panelId, windowId, tabId, componentId) {
      var newPanels = [].concat(_this.getPanels());
      newPanels[panelId].windows[windowId].selected = tabId;

      _this.updatePanels(newPanels); // this.props.onTabSwitch(this.getSize(panelId, windowId, tabId));


      _this.handleOnActive(componentId);
    });

    _defineProperty(_assertThisInitialized(_this), "handleOnActive", function (id) {
      if (_this.props.onActive) {
        _this.props.onActive(id);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleTabClosed", function (panelId, windowId, tabId) {
      console.log("CLOSING", panelId, windowId, tabId); // let callback = React.Children.toArray(this.props.children).find(widget => {
      //   return (
      //     widget.props.id ===
      //     this.getPanels()[panelId].windows[windowId].widgets[tabId]
      //   );
      // }).props.onClose;

      var newPanels = JSON.parse(JSON.stringify(_this.getPanels()));
      newPanels[panelId].windows[windowId].widgets.splice(tabId, 1);
      newPanels = _this.cleanup(newPanels);

      _this.updatePanels(newPanels); // if (callback) callback();

    });

    _defineProperty(_assertThisInitialized(_this), "handleDragStart", function (result) {
      _this.setState({
        draggingTab: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleDragEnd", function (result) {
      var newPanels = JSON.parse(JSON.stringify(_this.getPanels()));
      var source = result.source.droppableId.split(","); // If we dropped on a tab bar

      if (result.destination && _this.state.hoverBorder == null) {
        // remove from source
        var item = newPanels[source[0]].windows[source[1]].widgets.splice(result.source.index, 1); // Select first tab from source window

        newPanels[source[0]].windows[source[1]].selected = 0; // add to destination

        var destination = result.destination.droppableId.split(",");
        newPanels[destination[0]].windows[destination[1]].widgets.splice(result.destination.index, 0, item[0]); // Select new tab at destination window

        newPanels[destination[0]].windows[destination[1]].selected = result.destination.index;
      } // If we dropped between panels
      else if (_this.state.hoverBorder !== null) {
        // remove from source
        var _item = newPanels[source[0]].windows[source[1]].widgets.splice(result.source.index, 1); // Add to destination
        // If we dropped between windows


        if (_this.state.hoverBorder[1] !== null) {
          newPanels[_this.state.hoverBorder[0]].windows.splice(_this.state.hoverBorder[1], 0, {
            selected: 0,
            widgets: _item
          });
        } // If we dropped between panels
        else {
          newPanels.splice(_this.state.hoverBorder[0], 0, _extends({}, newPanels[source[0]], {
            windows: [{
              selected: 0,
              widgets: _item
            }]
          }));
        }
      }

      newPanels = _this.cleanup(newPanels);

      _this.updatePanels(newPanels);

      _this.setState({
        draggingTab: false,
        hoverBorder: null
      });
    });

    _defineProperty(_assertThisInitialized(_this), "cleanup", function (panels) {
      // Cleanup unused empty windows
      panels = panels.map(function (panel) {
        return _extends({}, panel, {
          windows: panel.windows.filter(function (win) {
            return win.widgets.length > 0;
          })
        });
      }); // Cleanup empty panels

      panels = panels.filter(function (panel) {
        return panel.windows.length > 0;
      });
      return panels;
    });

    return _this;
  }

  var _proto = Dockable.prototype;

  _proto.getPanels = function getPanels() {
    return this.props.initialState;
  };

  _proto.getFilteredPanels = function getFilteredPanels() {
    var _this2 = this;

    if (!this.props.hidden) return this.getPanels();
    return this.props.initialState.filter(function (panel) {
      return panel.windows.filter(function (windows) {
        return windows.widgets.filter(function (widget) {
          return !_this2.props.hidden[widget];
        }).length > 0;
      }).length > 0;
    });
  };

  _proto.componentDidMount = function componentDidMount() {
    if (this.props.initialState) {
      this.setState({
        panels: this.props.initialState
      });
    } else {
      var newPanels = [{
        size: 277,
        minSize: 277,
        resize: "stretch",
        windows: [{
          selected: 0,
          widgets: _react["default"].Children.map(this.props.children, function (widget) {
            return {
              component: widget.type.displayName
            };
          })
        }]
      }];
      this.updatePanels(newPanels);
    }
  };

  _proto.render = function render() {
    var _this3 = this;

    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "Dockable_root " + _DockableModule["default"].container + " " + (this.props.themeClass ? this.props.themeClass : _DockableModule["default"].theme),
      style: this.props.theme
    }, /*#__PURE__*/_react["default"].createElement(_reactBeautifulDnd.DragDropContext, {
      onDragEnd: this.handleDragEnd,
      onDragStart: this.handleDragStart
    }, /*#__PURE__*/_react["default"].createElement(_reactPanelgroup["default"], {
      spacing: this.props.spacing || 0,
      borderColor: "transparent",
      panelWidths: this.getFilteredPanels() // onResizeEnd={this.handlePanelResize}
      ,
      onUpdate: this.handlePanelResize
    }, this.getFilteredPanels().map(function (thisPanel, panelIndex) {
      return /*#__PURE__*/_react["default"].createElement(_WindowPanel["default"], {
        key: panelIndex,
        index: panelIndex,
        isLast: panelIndex === _this3.getPanels().length - 1,
        draggingTab: _this3.state.draggingTab,
        hoverBorder: _this3.state.hoverBorder,
        onHoverBorder: function onHoverBorder(i) {
          return _this3.setState({
            hoverBorder: i
          });
        },
        windows: thisPanel.windows,
        onTabSort: _this3.handleTabSort,
        onTabSelect: _this3.handleTabSelect,
        onContextClick: _this3.handleContextClick,
        widgets: _this3.props.children,
        onUpdate: _this3.handleWindowResize,
        onTabClosed: _this3.handleTabClosed,
        spacing: _this3.props.spacing || 0,
        hideMenus: _this3.props.hideMenus,
        hideTabs: _this3.props.hideTabs,
        active: _this3.props.active,
        onActive: _this3.handleOnActive,
        tabHeight: _this3.props.tabHeight,
        hidden: _this3.props.hidden || {}
      });
    }))), this.state.contextMenu.show && /*#__PURE__*/_react["default"].createElement(_ContextMenu["default"], {
      left: this.state.contextMenu.position.x,
      top: this.state.contextMenu.position.y,
      actions: this.state.contextMenu.actions,
      onClickOut: function onClickOut() {
        return _this3.setState({
          contextMenu: _extends({}, _this3.state.contextMenu, {
            show: false
          })
        });
      }
    }));
  };

  return Dockable;
}(_react.Component);

_defineProperty(Dockable, "defaultProps", {
  spacing: 1
});

var _default = Dockable;
exports["default"] = _default;
module.exports = exports.default;