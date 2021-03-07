import React from "react";
import Dockable from "./lib/dockable";

class App extends React.Component {
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
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        <Dockable
          initialState={this.state.panels}
          onUpdate={(workspace) => this.setState({ panels: workspace })}
          spacing={3}
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

export default App;
