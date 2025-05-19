import "./App.css";

import { Dockable, useDockableLocalStorage } from "../lib/dockable";

function App() {
  const { layout, setLayout } = useDockableLocalStorage(3);

  const viewCount = 6;
  const views = Array.from({ length: viewCount }, (_, i) =>
    createView(`view-${i + 1}`, `View ${i + 1}`)
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Dockable.Root layout={layout} onChange={setLayout}>
        {views}
      </Dockable.Root>
    </div>
  );
}

function createView(id: string, name: string) {
  return (
    <Dockable.Tab id={id} name={name}>
      {"testing content"}
    </Dockable.Tab>
  );
}
export default App;
