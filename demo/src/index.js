import React, { Component } from "react";
import { render } from "react-dom";
import "./index.css";
// import css from "./theme.module.css";

import Dockable from "../../src/dockable";

export default class Demo extends Component {
  state = {
    panels: [
      {
        windows: [
          {
            selected: 0,
            widgets: ["MyComponentA", "MyComponentB", "MyComponentC"],
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
          <AnotherComponent
            id="MyComponentC"
            title="Component C"
            actions={() => [
              {
                type: "actions",
                actions: {
                  "Default Thing 2": () => {
                    console.log("I did the default thing 2");
                  },
                  "Another Default Thing 2": () => {
                    console.log("I did another default thing 2");
                  },
                },
              },
            ]}
          />
        </Dockable>
      </div>
    );
  }
}

function AnotherComponent() {
  return <div>test</div>;
}

class MyComponent extends React.Component {
  render() {
    return <div style={{ padding: 8 }}>{this.props.title}</div>;
  }
}

render(<Demo />, document.querySelector("#demo"));
