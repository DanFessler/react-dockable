import React, { createRef } from "react";

class Panel extends React.Component {
  element = createRef();

  getPropertyName(type, inverse) {
    let isRow = this.props.direction === "row";
    if (inverse) isRow = !isRow;

    switch (type) {
      case "size":
        return isRow ? "width" : "height";
      case "minSize":
        return isRow ? "minWidth" : "minHeight";
      case "maxSize":
        return isRow ? "maxWidth" : "maxHeight";
      default:
        return;
    }
  }

  render() {
    return (
      <div
        className={`pg-panel ${this.props.className || ""}`}
        ref={this.element}
        style={{
          [this.getPropertyName("size")]: this.props.data.size,
          [this.getPropertyName("minSize")]: this.props.data.minSize,
          [this.getPropertyName("maxSize")]: this.props.data.maxSize || "auto",
          flexGrow:
            !this.props.data.maxSize && this.props.data.resize === "stretch"
              ? "1"
              : "0",
          backgroundColor: this.props.color,
          userSelect: "none",
          display: "flex",
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Panel;
