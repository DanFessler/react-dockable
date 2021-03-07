function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { createRef } from "react";
import Panel from "./Panel";
import Divider from "./Divider";
import css from "./css/PanelGroup.module.css";

class PanelGroup extends React.Component {
  isControlled(props) {
    return props.onUpdate || props.onResizeStart || props.onResizeEnd ? true : false;
  }

  constructor(props) {
    super(props); // if uncontrolled, setup default panels in props

    _defineProperty(this, "state", {
      panels: [],
      dragging: null,
      lastSize: null
    });

    _defineProperty(this, "containerRef", /*#__PURE__*/createRef());

    _defineProperty(this, "panelRefs", []);

    _defineProperty(this, "updatePanelSizesFromDOM", () => {
      const newPanels = this.panelRefs.map((ref, i) => {
        // TODO: Need to handle ref tracking better when adding/removing panels
        if (!ref) return null;
        const element = ref.element.current;
        let box = element.getBoundingClientRect();
        return { ...this.getPanels()[i],
          size: box[this.props.direction === "row" ? "width" : "height"]
        };
      });
      this.updatePanels(newPanels);
    });

    _defineProperty(this, "handleResizeDOM", entries => {
      let entry = entries[0];

      if (entry.borderBoxSize) {
        let [width, height] = entry.borderBoxSize; // only do this if the change is in the direction that matters

        if (!this.state.lastSize || this.props.direction === "row" && this.state.lastSize.width !== width || this.props.direction === "column" && this.state.lastSize.height !== height) {
          this.updatePanelSizesFromDOM();
          this.setState({
            lastSize: {
              width,
              height
            }
          });
          return;
        }
      }
    });

    _defineProperty(this, "handleDragStart", (panelIndex, e) => {
      window.addEventListener("pointermove", this.handleDrag);
      window.addEventListener("pointerup", this.handleDragEnd);
      this.setState({
        dragging: {
          index: panelIndex,
          extended: false
        }
      });
      this.updatePanelSizesFromDOM();
      this.props.onResizeStart && this.props.onResizeStart([...this.getPanels()]);
    });

    _defineProperty(this, "handleDrag", e => {
      const panels = [...this.getPanels()];
      this.resizePanels(this.state.dragging.index, this.getMousePos(e), panels);
      this.updatePanels(panels);
    });

    _defineProperty(this, "handleDragEnd", e => {
      window.removeEventListener("pointermove", this.handleDrag);
      window.removeEventListener("pointerup", this.handleDragEnd);
      this.setState({
        dragging: null
      });
      this.props.onResizeEnd && this.props.onResizeEnd([...this.getPanels()]);
    });

    if (!this.isControlled(props)) {
      this.state.panels = props.panelWidths ? this.applyDefaults(props.panelWidths) : React.Children.map(this.props.children, child => this.getDefaultPanel());
    }
  }

  getDefaultPanel() {
    return { ...PanelGroup.defaultPanel,
      ...this.props.defaultPanel
    };
  }

  componentDidMount() {
    // Listen to size changes on container
    this.resizeObserver = new ResizeObserver(this.handleResizeDOM);
    this.resizeObserver.observe(this.containerRef.current);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.panelWidths.length !== this.props.panelWidths.length) {
      this.updatePanelSizesFromDOM();
    }
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  updatePanels(panels) {
    if (this.isControlled(this.props)) this.props.onUpdate && this.props.onUpdate(panels);else this.setState({
      panels: panels
    });
  }

  getPanels() {
    return this.isControlled(this.props) ? this.applyDefaults(this.props.panelWidths) : this.state.panels;
  }

  applyDefaults(panels) {
    return panels.map(panel => ({ ...this.getDefaultPanel(),
      ...panel
    }));
  }

  resizePanels(dividerIndex, delta, panels) {
    // make the changes and deal with the consequences later
    panels[dividerIndex].size += delta;
    panels[dividerIndex + 1].size -= delta; // resolve invalid panel sizes

    this.resolvePanel(dividerIndex, -1, panels);
    this.resolvePanel(dividerIndex, 1, panels);
  }

  resolvePanel(dividerIndex, direction, panels) {
    let panel = panels[dividerIndex + (direction < 0 ? 0 : 1)]; // if we made the panel too small

    if (panel.size < panel.minSize) {
      delegate.call(this, panel.minSize - panel.size);
    } // if we made the panel too big


    if (panel.maxSize && panel.size > panel.maxSize) {
      delegate.call(this, panel.maxSize - panel.size);
    }

    function delegate(delta) {
      let nextIndex = dividerIndex + direction;

      if (nextIndex >= 0 && nextIndex <= panels.length - 2) {
        this.resizePanels(nextIndex, delta * direction, panels);
      } else {
        this.resizePanels(dividerIndex, -delta * direction, panels);
      }
    }
  }

  getCursor() {
    if (this.state.dragging) {
      return this.props.direction === "row" ? "ns-resize" : "ew-resize";
    } else {
      return "auto";
    }
  }

  getMousePos(e, panelIndex) {
    let index = this.state.dragging.index;
    let panels = this.getPanels();
    let size = index * this.props.spacing + this.props.spacing / 2;

    for (let i = 0; i <= index; i++) {
      size += panels[i].size;
    }

    const box = this.containerRef.current.getBoundingClientRect();

    if (this.props.direction === "row") {
      return e.clientX - size - box.left;
    } else {
      return e.clientY - size - box.top;
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: `${css.container} ${this.props.className || ""}`,
      ref: this.containerRef,
      style: {
        cursor: this.getCursor(),
        flexDirection: this.props.direction
      }
    }, React.Children.map(this.props.children, (child, i) => {
      return [
      /*#__PURE__*/
      // Render Panel
      React.createElement(Panel, {
        className: this.props.panelClassName,
        color: this.props.panelColor,
        data: this.getPanels()[i] || this.getDefaultPanel(),
        ref: component => {
          this.panelRefs[i] = component;
        },
        direction: this.props.direction
      }, child), // Render border handle
      i + 1 < React.Children.count(this.props.children) && /*#__PURE__*/React.createElement(Divider, {
        className: this.props.dividerClassName,
        onDragStart: e => this.handleDragStart(i, e),
        size: this.props.spacing,
        color: this.props.borderColor,
        direction: this.props.direction
      })];
    }));
  }

}

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

export default PanelGroup;