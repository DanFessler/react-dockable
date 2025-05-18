import "./App.css";

import Dockable, { useDockableLocalStorage } from "../lib/dockable";

function App() {
  const { layout, setLayout } = useDockableLocalStorage(3);

  const viewCount = 6;
  const views = Array.from({ length: viewCount }, (_, i) =>
    createView(`view-${i + 1}`, `View ${i + 1}`)
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Dockable.Root
        onChange={(layout) => console.log(JSON.stringify(layout, null, 2))}
      >
        <Dockable.Tab id="view-1" name="Left">
          Left Component
        </Dockable.Tab>
        <Dockable.Panel size={3}>
          <Dockable.Tab id="view-2" name="Top">
            Top Component
          </Dockable.Tab>
          <Dockable.Window>
            <Dockable.Tab id="view-3" name="Tab 1">
              Bottom Component 1
            </Dockable.Tab>
            <Dockable.Tab id="view-4" name="Tab 2">
              Bottom Component 2
            </Dockable.Tab>
          </Dockable.Window>
        </Dockable.Panel>
      </Dockable.Root>
    </div>
  );
}

function createView(id: string, name: string) {
  return (
    <Dockable.Tab id={id} name={name}>
      view
    </Dockable.Tab>
  );
}
export default App;

const layout = [
  {
    type: "Window",
    id: "window-0",
    children: ["view-1"],
    size: 1,
    selected: "view-1",
  },
  {
    type: "Panel",
    id: "panel-3",
    children: [
      {
        type: "Window",
        id: "window-1",
        children: ["view-2"],
        size: 1,
        selected: "view-2",
      },
      {
        type: "Window",
        id: "window-2",
        children: ["view-3", "view-4"],
        size: 1,
        selected: "view-3",
      },
    ],
    size: 3,
  },
];
