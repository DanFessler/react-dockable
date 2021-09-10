function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import css from "./css/Window.module.css"; // import Color from "color";

var Window = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Window, _Component);

  function Window() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "widgetRef", React.createRef());

    _defineProperty(_assertThisInitialized(_this), "containerRef", React.createRef());

    _defineProperty(_assertThisInitialized(_this), "defaultActions", [{
      type: "actions",
      actions: {
        "Default Thing": function DefaultThing() {
          console.log("I did the default thing");
        },
        "Another Default Thing": function AnotherDefaultThing() {
          console.log("I did another default thing");
        }
      }
    }]);

    _defineProperty(_assertThisInitialized(_this), "getSize", function (tab) {
      var widget = React.Children.toArray(_this.props.children)[tab !== undefined ? tab : _this.props.selected];
      var size = widget.props.minHeight ? widget.props.minHeight : 0;
      return size + 34 // content size // tab bar
      ;
    });

    _defineProperty(_assertThisInitialized(_this), "handleContextClick", function (e) {
      var ref = _this.widgetRef.current;
      var actions = ref.props.actions ? ref.props.actions.call(ref, ref).concat(_this.defaultActions) : _this.defaultActions;
      var clientRect = e.target.getBoundingClientRect(); //this.refs.contextMenuButton.getBoundingClientRect();

      console.log(clientRect);

      _this.props.onContextClick(actions, clientRect.left, clientRect.top + clientRect.height);
    });

    _defineProperty(_assertThisInitialized(_this), "renderBorders", function () {
      return [_this.containerRef.current && _this.props.draggingTab ? /*#__PURE__*/React.createElement("div", {
        key: 0,
        className: css.dropBorder,
        onMouseOver: _this.props.onHoverBorder.bind(_assertThisInitialized(_this), _this.props.index),
        onMouseOut: _this.props.onHoverBorder.bind(_assertThisInitialized(_this), null),
        style: {
          width: _this.containerRef.current.getBoundingClientRect().width,
          top: _this.containerRef.current.getBoundingClientRect().top - 9,
          left: _this.containerRef.current.getBoundingClientRect().left
        }
      }) : null, _this.containerRef.current && _this.props.draggingTab && _this.props.isLast ? /*#__PURE__*/React.createElement("div", {
        key: 1,
        className: css.dropBorder,
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

  _proto.render = function render() {
    var _this2 = this;

    var selected = Math.min(Math.max(this.props.selected, 0), this.props.children.length - 1);
    return /*#__PURE__*/React.createElement("div", {
      className: css.container,
      ref: this.containerRef,
      onMouseDown: function onMouseDown() {
        return _this2.props.onActive(React.Children.toArray(_this2.props.children)[_this2.props.selected].props.id);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: css.window,
      style: this.props.style
    }, !this.props.hideTabs && /*#__PURE__*/React.createElement(TabBar, {
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
      hideMenu: this.props.hideMenu,
      tabHeight: this.props.tabHeight
    }), /*#__PURE__*/React.createElement("div", {
      className: css.content
    }, this.props.children ? React.cloneElement(React.Children.toArray(this.props.children)[this.props.selected], {
      ref: this.widgetRef
    }) : null)), this.renderBorders());
  };

  return Window;
}(Component);

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

    return /*#__PURE__*/React.createElement(Droppable, {
      droppableId: this.props.windowId,
      direction: "horizontal"
    }, function (provided, snapshot) {
      return /*#__PURE__*/React.createElement("div", {
        className: css.tabBar + " " + (snapshot.isDraggingOver && !snapshot.draggingFromThisWith && !_this3.props.hoverBorder ? css.tabBarHover : ""),
        style: _this3.props.tabHeight ? {
          height: _this3.props.tabHeight
        } : {}
      }, /*#__PURE__*/React.createElement("div", _extends({
        ref: provided.innerRef,
        className: css.tabSpacer
      }, provided.droppableProps), widgets.map(function (child, i) {
        return /*#__PURE__*/React.createElement(Draggable, {
          key: _this3.props.windowId + "," + i,
          draggableId: _this3.props.windowId + "," + i,
          index: i
        }, function (provided, snapshot) {
          return /*#__PURE__*/React.createElement("div", _extends({
            ref: provided.innerRef
          }, provided.draggableProps, provided.dragHandleProps, {
            key: i,
            className: css.tab + " " + (i === selected ? css.active : ""),
            onMouseDown: function onMouseDown(e) {
              onTabClick(i, child.props.id);
              e.stopPropagation();
            },
            style: getStyle(provided.draggableProps.style, snapshot)
          }), /*#__PURE__*/React.createElement("span", {
            className: css.title,
            style: {
              fontWeight: i === selected && child.props.id === active ? "bold" : "normal"
            }
          }, child.props.title || child.props.id), child.props.closeable ? /*#__PURE__*/React.createElement("div", {
            className: css.closeBox,
            onClick: function onClick(e) {
              if (child.props.onClose) child.props.onClose(child.props.id);

              _this3.props.onClose(i);
            }
          }) : null);
        });
      }), provided.placeholder), !_this3.props.hideMenu && /*#__PURE__*/React.createElement("div", {
        className: css.burgerMenuContainer,
        onClick: onContextClick
      }, /*#__PURE__*/React.createElement("div", {
        className: css.burgerMenu
      })));
    });
  };

  return TabBar;
}(Component);

export default Window;