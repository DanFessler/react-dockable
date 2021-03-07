function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from "react";
import PanelGroup from "../react-panelgroup";
import Window from "./Window";
import widget from "./Widget";
import css from "./css/WindowPanel.module.css";
const MissingWidget = widget(class extends Component {
  render() {
    return null;
  }

}, {
  title: "Missing Widget"
});

class WindowPanel extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "containerRef", /*#__PURE__*/React.createRef());

    _defineProperty(this, "state", {
      panelWidths: [React.Children.map(this.props.children, (panelWindow, i) => {
        return {
          size: 10,
          minSize: 10,
          resize: "dynamic"
        };
      })]
    });

    _defineProperty(this, "windowRefs", []);

    _defineProperty(this, "handleTabSwitch", (i, size) => {
      // exit early if size didn't change
      if (this.props.windows[i].minSize === size) return;
      let newPanels = this.props.windows.slice();
      newPanels[i].minSize = size;
      if (newPanels[i].size < newPanels[i].minSize) newPanels[i].size = newPanels[i].minSize;
      this.handleResize(newPanels);
    });

    _defineProperty(this, "handleResize", windows => {
      this.props.onUpdate(this.props.index, windows);
    });

    _defineProperty(this, "renderBorders", () => [this.containerRef.current && this.props.draggingTab ? /*#__PURE__*/React.createElement("div", {
      key: 0,
      className: css.dropBorder,
      onMouseOver: this.props.onHoverBorder.bind(this, [this.props.index, null]),
      onMouseOut: this.props.onHoverBorder.bind(this, null),
      style: {
        height: this.containerRef.current.getBoundingClientRect().height,
        top: this.containerRef.current.getBoundingClientRect().top,
        left: this.containerRef.current.getBoundingClientRect().left - 9
      }
    }) : null, this.containerRef.current && this.props.draggingTab && this.props.isLast ? /*#__PURE__*/React.createElement("div", {
      key: 1,
      className: css.dropBorder,
      onMouseOver: this.props.onHoverBorder.bind(this, [this.props.index + 1, null]),
      onMouseOut: this.props.onHoverBorder.bind(this, null),
      style: {
        height: this.containerRef.current.getBoundingClientRect().height,
        top: this.containerRef.current.getBoundingClientRect().top,
        left: this.containerRef.current.getBoundingClientRect().left + this.containerRef.current.getBoundingClientRect().width - 6
      }
    }) : null]);
  }

  filterVisibleWidgets(thisWindow) {
    return thisWindow.widgets.filter(widget => !(this.getWidgetComponent(widget).props.hidden || this.props.hidden[widget]));
  }

  getFilteredWindows() {
    if (!this.props.hidden) return this.props.windows;
    return this.props.windows.filter(windows => {
      return windows.widgets.filter(widget => {
        return !this.props.hidden[widget];
      }).length > 0;
    });
  }

  getWidgetComponent(id) {
    return React.Children.toArray(this.props.widgets).find(child => child.props.id === id);
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: css.container,
      ref: this.containerRef
    }, /*#__PURE__*/React.createElement(PanelGroup, {
      direction: "column",
      spacing: this.props.spacing || 0,
      borderColor: "transparent",
      panelWidths: this.getFilteredWindows() // onUpdate={panels => this.setState({ panelWidths: panels.slice() })}
      ,
      onUpdate: this.handleResize
    }, this.getFilteredWindows().map((thisWindow, windowIndex) => {
      const filteredWidgets = this.filterVisibleWidgets(thisWindow);
      return filteredWidgets.length ? /*#__PURE__*/React.createElement(Window, {
        key: windowIndex,
        index: windowIndex,
        active: this.props.active,
        onActive: this.props.onActive,
        windowId: `${this.props.index},${windowIndex}`,
        onContextClick: this.props.onContextClick,
        isLast: windowIndex === this.props.windows.length - 1,
        draggingTab: this.props.draggingTab,
        hoverBorder: this.props.hoverBorder,
        onHoverBorder: i => {
          this.props.onHoverBorder(i === null ? null : [this.props.index, i]);
        },
        onSort: this.props.onTabSort.bind(this, this.props.index, windowIndex),
        selected: Math.min(thisWindow.selected, filteredWidgets.length - 1),
        onTabSelect: (i, componentId) => {
          this.props.onTabSelect(this.props.index, windowIndex, i, componentId);
        },
        ref: input => {
          this.windowRefs[windowIndex] = input;
        },
        onTabSwitch: this.handleTabSwitch.bind(null, windowIndex),
        onTabClosed: (winId, tabId) => {
          var [panelId, windowId] = winId.split(",");
          this.props.onTabClosed(parseInt(panelId, 10), parseInt(windowId, 10), tabId);
        },
        hideTabs: thisWindow.hideTabs || this.props.hideTabs,
        hideMenu: this.props.hideMenus,
        style: thisWindow.style,
        tabHeight: this.props.tabHeight
      }, filteredWidgets.map((widget, i) => {
        // Find component with the desired name
        let Component = this.getWidgetComponent(widget);
        if (!Component) Component = /*#__PURE__*/React.createElement(MissingWidget, null);
        return Component;
      })) : null;
    })), this.renderBorders());
  }

}

export default WindowPanel;