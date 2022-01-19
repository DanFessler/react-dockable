import React, { Component } from "react";
import { render } from "react-dom";
import "./index.css";
// import css from "./theme.module.css";

import Dockable, { Widget } from "../../src/dockable";
import TestWidget from "./TestWidget";

export default class Demo extends Component {
  state = {
    panels: [
      {
        windows: [
          {
            selected: 0,
            widgets: ["MyComponentA", "MyComponentB"],
          },
          {
            selected: 0,
            widgets: ["MyComponentC"],
          },
        ],
      },
    ],
  };

  render() {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <Dockable
          initialState={this.state.panels}
          onUpdate={(workspace) => this.setState({ panels: workspace })}
          spacing={3}
          // themeClass={css.theme}
        >
          <Widget id="MyComponentA" title="Component A">
            <MyFuncComponent text="test content" />
          </Widget>

          <Widget id="MyComponentB" title="Component B">
            <MyFuncComponent text="test content" />
          </Widget>

          <TestWidget />
        </Dockable>
      </div>
    );
  }
}

function MyFuncComponent({ text }) {
  return <div style={{ padding: 8 }}>{text}</div>;
}

render(<Demo />, document.querySelector("#demo"));
