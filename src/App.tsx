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
      <Dockable.Root panels={layout} onChange={setLayout}>
        {views}
      </Dockable.Root>
    </div>
  );
}

function createView(id: string, name: string) {
  return (
    <Dockable.View id={id} name={name}>
      view
    </Dockable.View>
  );
}
export default App;
