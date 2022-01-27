import React from "react";
// import { createWidget } from "../../src/dockable";

const actions = [
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
];

function TestWidget() {
  return <div style={{ padding: 8 }}>poop</div>;
}

function createWidget() {}

// export default createWidget(TestWidget, {
//   id: "cheese",
//   title: "Cheese",
//   actions,
// });
