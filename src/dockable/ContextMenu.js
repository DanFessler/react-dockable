import React, { Component } from "react";
import css from "./css/ContextMenu.module.css";

class ContextMenu extends Component {
  state = {
    offset: {
      x: 0,
      y: 0
    }
  };

  containerRef = React.createRef();
  componentDidMount() {
    if (this.containerRef.current) {
      let x = 0,
        y = 0;
      let menuBox = this.containerRef.current.getBoundingClientRect();
      let viewPort = { width: window.innerWidth, height: window.innerHeight };

      if (this.props.left + menuBox.width > viewPort.width)
        x -= this.props.left + menuBox.width - viewPort.width;
      if (this.props.top + menuBox.height > viewPort.height)
        y -= this.props.top + menuBox.height - viewPort.height;

      this.setState({ offset: { x: x, y: y } });
    }
  }
  handleClickOut = e => {
    this.props.onClickOut();
  };
  handleAction = action => {
    action();
    this.props.onClickOut();
  };
  handleSelection = (callback, i) => {
    callback(i);
    this.props.onClickOut();
  };
  handleBool = toggleFunction => {
    toggleFunction();
    this.props.onClickOut();
  };

  render() {
    return (
      <div className={css.container} onClick={this.handleClickOut}>
        <div
          style={{
            left: this.props.left + this.state.offset.x,
            top: this.props.top + this.state.offset.y
          }}
          className={css.contextMenu}
          ref={this.containerRef}
        >
          {this.props.actions.map((actionGroup, i, arr) => {
            switch (actionGroup.type) {
              case "actions":
                return (
                  <React.Fragment key={i}>
                    {Object.keys(actionGroup.actions).map((action, a, arr) => (
                      <div
                        key={a}
                        className={css.contextMenuItem}
                        onClick={this.handleAction.bind(
                          null,
                          actionGroup.actions[action]
                        )}
                      >
                        <div>{action}</div>
                        <div style={{ marginLeft: 16, color: "#666" }}>
                          Ctrl+Z
                        </div>
                      </div>
                    ))}
                    {i !== arr.length - 1 ? (
                      <div className={css.contextMenuDivider} />
                    ) : null}
                  </React.Fragment>
                );
              case "enum":
                return (
                  <React.Fragment key={i}>
                    {actionGroup.options.map((action, a, arr) => (
                      <div
                        key={a}
                        className={css.contextMenuItem}
                        onClick={this.handleSelection.bind(
                          null,
                          actionGroup.onChange,
                          a
                        )}
                      >
                        <div className={css.radio}>
                          {actionGroup.selected === a ? "⚫" : "⚪"}
                        </div>
                        <span>{action}</span>
                      </div>
                    ))}
                    {i !== arr.length - 1 ? (
                      <div className={css.contextMenuDivider} />
                    ) : null}
                  </React.Fragment>
                );
              case "bools":
                return (
                  <React.Fragment key={i}>
                    {Object.keys(actionGroup.options).map((option, a, arr) => (
                      <div
                        key={a}
                        className={css.contextMenuItem}
                        onClick={this.handleAction.bind(
                          null,
                          actionGroup.options[option].function
                        )}
                      >
                        <div className={css.checkbox}>
                          {actionGroup.options[option].value === true
                            ? "✔"
                            : " "}
                        </div>
                        <span>{option}</span>
                      </div>
                    ))}
                    {i !== arr.length - 1 ? (
                      <div className={css.contextMenuDivider} />
                    ) : null}
                  </React.Fragment>
                );
              default:
                return null;
            }
          }, this)}
        </div>
      </div>
    );
  }
}

export default ContextMenu;
