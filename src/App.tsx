import "./App.css";

import { Dockable, useDockableLocalStorage } from "../lib/dockable";

function App() {
  const { layout, setLayout } = useDockableLocalStorage(5);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Dockable.Root layout={layout} onChange={setLayout}>
        <Dockable.Tab
          id="test1"
          name="test 1"
          actions={[
            {
              label: "Section 1",
              items: [
                { label: "test 1", onClick: () => {}, shortcut: "⌘+S" },
                { label: "test 2", onClick: () => {}, shortcut: "⌘+S" },
                { label: "test 3", onClick: () => {}, shortcut: "⌘+S" },
              ],
            },
            {
              label: "Section 2",
              items: [
                { label: "test 1", onClick: () => {} },
                { label: "test 2", onClick: () => {} },
                {
                  label: "Submenu",
                  items: [
                    { label: "test 1", onClick: () => {}, shortcut: "⌘+S" },
                    { label: "test 2", onClick: () => {} },
                    { label: "test 3", onClick: () => {} },
                  ],
                },
              ],
            },
          ]}
        >
          content
        </Dockable.Tab>
        <Dockable.Tab id="test2" name="test 2">
          content 2
        </Dockable.Tab>
      </Dockable.Root>
    </div>
  );
}

export default App;
