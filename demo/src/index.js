import React, { Component, useState } from "react";
import { render } from "react-dom";
import "./index.css";
// import css from "./theme.module.css";

import Dockable, { Widget } from "../../src/dockable";

function Demo() {
  const [state, setState] = useState({
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
  });

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Dockable
        initialState={state.panels}
        onUpdate={(workspace) => setState({ panels: workspace })}
        spacing={3}
        // themeClass={css.theme}
      >
        <Widget id="MyComponentA" title="Component A">
          <div>test content</div>
        </Widget>

        <Widget id="MyComponentB" title="Component B">
          <div>test content</div>
        </Widget>

        <Widget id="MyComponentC" title="Component C">
          <div>test content</div>
        </Widget>
      </Dockable>
    </div>
  );
}

render(<Demo />, document.querySelector("#demo"));
