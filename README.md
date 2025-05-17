# React-Dockable

React library to create beautiful dockable tabbed interfaces for tools, dashboards and more

# Getting Started

Download the latest release tgz and install in your project

```
npm install ./react-dockable-0.2.0.tgz
```

Then import the library and default css into your project

```js
import Dockable from "react-dockable";
import "react-dockable/style.css";
```

# Basic Usage

The quickest way to get started is simply to provide `Dockable` with `View` children components and let the user manage their desired layout from there

```js
function App() {
  return (
    <Dockable.Root orientation="row">
      <Dockable.View id="1" name="Tab 1">
        First panel
      </Dockable.View>
      <Dockable.View id="2" name="Tab 2">
        Second Panel
      </Dockable.View>
      <Dockable.View id="3" name="Tab 3">
        Third Panel
      </Dockable.View>
    </Dockable.Root>
  );
}
```

# Persisted Layouts

The easiest way to persist a user's layout is with the provided `useDockableLocalStorage` hook which will automatically save and load layouts from local storage.

> 💡 Always remember to increase the version argument whenever you make changes to the View children as loading a layout with stale IDs will cause your app to crash

```js
import Dockable, { useDockableLocalStorage } from "react-dockable";
import "react-dockable/style.css";

function App() {
  const { layout, setLayout } = useDockableLocalStorage(1);

  return (
    <Dockable.Root orientation="row" panels={layout} onChange={setLayout}>
      {/* views */}
    </Dockable.Root>
  );
}
```

or you can manage it yourself with the provided onChange callback and panels prop:

```js
import Dockable from "react-dockable";
import "react-dockable/style.css";

function App() {
  const [layout, setLayout] = useState();

  function handleChange(panels) {
    console.log("SAVED LAYOUT");
    setLayout(panels);
  }

  return (
    <Dockable.Root orientation="row" panels={layout} onChange={setLayout}>
      {/* views */}
    </Dockable.Root>
  );
}
```

# Predefined Layouts

WIP
