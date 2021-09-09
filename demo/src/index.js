import React, { Component } from "react";
import { render } from "react-dom";
import "./index.css";
import css from "./theme.module.css";

import Dockable from "../../src/dockable";

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
          <MyComponent id="MyComponentA" title="Component A" />
          <MyComponent id="MyComponentB" title="Component B" />
          <MyComponent id="MyComponentC" title="Component C" />
        </Dockable>
      </div>
    );
  }
}

class MyComponent extends React.Component {
  render() {
    return <div style={{ padding: 8 }}>{this.props.title}</div>;
  }
}

render(<Demo />, document.querySelector("#demo"));
