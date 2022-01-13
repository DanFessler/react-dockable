"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _Panel = _interopRequireDefault(require("./Panel.js"));

var _Divider = _interopRequireDefault(require("./Divider.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PanelGroup = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(PanelGroup, _React$Component);

  var _proto = PanelGroup.prototype;

  _proto.isControlled = function isControlled(props) {
    return props.onUpdate || props.onResizeStart || props.onResizeEnd ? true : false;
  };

  function PanelGroup(props) {
    var _this;

    _this = _React$Component.call(this, props) || this; // if uncontrolled, setup default panels in props

    _defineProperty(_assertThisInitialized(_this), "state", {
      panels: [],
      dragging: null,
      lastSize: null
    });

    _defineProperty(_assertThisInitialized(_this), "containerRef", (0, _react.createRef)());

    _defineProperty(_assertThisInitialized(_this), "panelRefs", []);

    _defineProperty(_assertThisInitialized(_this), "updatePanelSizesFromDOM", function () {
      var newPanels = _this.panelRefs.map(function (ref, i) {
        // TODO: Need to handle ref tracking better when adding/removing panels
        if (!ref) return null;
        var element = ref.element.current;
        var box = element.getBoundingClientRect();
        return _extends({}, _this.getPanels()[i], {
          size: box[_this.props.direction === "row" ? "width" : "height"]
        });
      });

      _this.updatePanels(newPanels);
    });

    _defineProperty(_assertThisInitialized(_this), "handleResizeDOM", function (entries) {
      var entry = entries[0];

      if (entry.borderBoxSize) {
        var _entry$borderBoxSize = entry.borderBoxSize,
            width = _entry$borderBoxSize[0],
            height = _entry$borderBoxSize[1]; // only do this if the change is in the direction that matters

        if (!_this.state.lastSize || _this.props.direction === "row" && _this.state.lastSize.width !== width || _this.props.direction === "column" && _this.state.lastSize.height !== height) {
          _this.updatePanelSizesFromDOM();

          _this.setState({
            lastSize: {
              width: width,
              height: height
            }
          });

          return;
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleDragStart", function (panelIndex, e) {
      window.addEventListener("pointermove", _this.handleDrag);
      window.addEventListener("pointerup", _this.handleDragEnd);

      _this.setState({
        dragging: {
          index: panelIndex,
          extended: false
        }
      });

      _this.updatePanelSizesFromDOM();

      _this.props.onResizeStart && _this.props.onResizeStart([].concat(_this.getPanels()));
    });

    _defineProperty(_assertThisInitialized(_this), "handleDrag", function (e) {
      var panels = [].concat(_this.getPanels());

      _this.resizePanels(_this.state.dragging.index, _this.getMousePos(e), panels);

      _this.updatePanels(panels);
    });

    _defineProperty(_assertThisInitialized(_this), "handleDragEnd", function (e) {
      window.removeEventListener("pointermove", _this.handleDrag);
      window.removeEventListener("pointerup", _this.handleDragEnd);

      _this.setState({
        dragging: null
      });

      _this.props.onResizeEnd && _this.props.onResizeEnd([].concat(_this.getPanels()));
    });

    if (!_this.isControlled(props)) {
      _this.state.panels = props.panelWidths ? _this.applyDefaults(props.panelWidths) : _react["default"].Children.map(_this.props.children, function (child) {
        return _this.getDefaultPanel();
      });
    }

    return _this;
  }

  _proto.getDefaultPanel = function getDefaultPanel() {
    return _extends({}, PanelGroup.defaultPanel, this.props.defaultPanel);
  };

  _proto.componentDidMount = function componentDidMount() {
    // Listen to size changes on container
    this.resizeObserver = new ResizeObserver(this.handleResizeDOM);
    this.resizeObserver.observe(this.containerRef.current);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (prevProps.panelWidths.length !== this.props.panelWidths.length) {
      this.updatePanelSizesFromDOM();
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.resizeObserver.disconnect();
  };

  _proto.updatePanels = function updatePanels(panels) {
    if (this.isControlled(this.props)) this.props.onUpdate && this.props.onUpdate(panels);else this.setState({
      panels: panels
    });
  };

  _proto.getPanels = function getPanels() {
    return this.isControlled(this.props) ? this.applyDefaults(this.props.panelWidths) : this.state.panels;
  };

  _proto.applyDefaults = function applyDefaults(panels) {
    var _this2 = this;

    return panels.map(function (panel) {
      return _extends({}, _this2.getDefaultPanel(), panel);
    });
  };

  _proto.resizePanels = function resizePanels(dividerIndex, delta, panels) {
    // make the changes and deal with the consequences later
    panels[dividerIndex].size += delta;
    panels[dividerIndex + 1].size -= delta; // resolve invalid panel sizes

    this.resolvePanel(dividerIndex, -1, panels);
    this.resolvePanel(dividerIndex, 1, panels);
  };

  _proto.resolvePanel = function resolvePanel(dividerIndex, direction, panels) {
    var panel = panels[dividerIndex + (direction < 0 ? 0 : 1)]; // if we made the panel too small

    if (panel.size < panel.minSize) {
      delegate.call(this, panel.minSize - panel.size);
    } // if we made the panel too big


    if (panel.maxSize && panel.size > panel.maxSize) {
      delegate.call(this, panel.maxSize - panel.size);
    }

    function delegate(delta) {
      var nextIndex = dividerIndex + direction;

      if (nextIndex >= 0 && nextIndex <= panels.length - 2) {
        this.resizePanels(nextIndex, delta * direction, panels);
      } else {
        this.resizePanels(dividerIndex, -delta * direction, panels);
      }
    }
  };

  _proto.getCursor = function getCursor() {
    if (this.state.dragging) {
      return this.props.direction === "row" ? "ns-resize" : "ew-resize";
    } else {
      return "auto";
    }
  };

  _proto.getMousePos = function getMousePos(e, panelIndex) {
    var index = this.state.dragging.index;
    var panels = this.getPanels();
    var size = index * this.props.spacing + this.props.spacing / 2;

    for (var i = 0; i <= index; i++) {
      size += panels[i].size;
    }

    var box = this.containerRef.current.getBoundingClientRect();

    if (this.props.direction === "row") {
      return e.clientX - size - box.left;
    } else {
      return e.clientY - size - box.top;
    }
  };

  _proto.render = function render() {
    var _this3 = this;

    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "pg-panelGroup " + (this.props.className || ""),
      ref: this.containerRef,
      style: {
        cursor: this.getCursor(),
        flexDirection: this.props.direction,
        display: "flex",
        height: "100%",
        flexGrow: 1
      }
    }, _react["default"].Children.map(this.props.children, function (child, i) {
      return [
      /*#__PURE__*/
      // Render Panel
      _react["default"].createElement(_Panel["default"], {
        className: _this3.props.panelClassName,
        color: _this3.props.panelColor,
        data: _this3.getPanels()[i] || _this3.getDefaultPanel(),
        ref: function ref(component) {
          _this3.panelRefs[i] = component;
        },
        direction: _this3.props.direction
      }, child), // Render border handle
      i + 1 < _react["default"].Children.count(_this3.props.children) && /*#__PURE__*/_react["default"].createElement(_Divider["default"], {
        className: _this3.props.dividerClassName,
        onDragStart: function onDragStart(e) {
          return _this3.handleDragStart(i, e);
        },
        size: _this3.props.spacing,
        color: _this3.props.borderColor,
        direction: _this3.props.direction
      })];
    }));
  };

  return PanelGroup;
}(_react["default"].Component);

_defineProperty(PanelGroup, "defaultProps", {
  spacing: 2,
  direction: "row",
  borderColor: "default",
  panelColor: "default",
  defaultPanel: {}
});

_defineProperty(PanelGroup, "defaultPanel", {
  size: 256,
  minSize: 48,
  maxSize: 0,
  resize: "stretch"
});

var _default = PanelGroup;
exports["default"] = _default;
module.exports = exports.default;