# React-Dockable

React library to create beautiful dockable tabbed interfaces for tools, dashboards, and more

# Getting Started

This package hasn't been published to NPM (yet). For now, download the latest release tgz and install in your project

```
npm install ./react-dockable-0.2.0.tgz
```

Then import the library and default css into your project

```js
import Dockable from "react-dockable";
import "react-dockable/style.css";
```

# Basic Usage

The quickest way to get started is simply to provide `Dockable` with `View` children components and let the user manage their desired layout from there. By default, `Views` are displayed in a horizontal layout.

> 💡 Note, each `View` must have a unique id to avoid undefined behavior

```js
function App() {
  return (
    <Dockable.Root orientation="row">
      <Dockable.View id="1" name="Tab 1">
        First View
      </Dockable.View>
      <Dockable.View id="2" name="Tab 2">
        Second View
      </Dockable.View>
      <Dockable.View id="3" name="Tab 3">
        Third View
      </Dockable.View>
    </Dockable.Root>
  );
}
```
![image](https://github.com/user-attachments/assets/9358bb45-573a-4fe1-b033-3bb864035a8d)

# Predefined Layouts

Child components are not intended to be dynamic or managed manually, instead they are the initial configuration of the layout and contain the definitions for each `View` managed internally.

You can compose the initial layout using `Panel` and `Window` components. Each nested Panel alternates between row and column layouts. Windows can contain multiple Views which are displayed as tabs. `Views` are automatically wrapped in a Window one isn't supplied

```js
function App() {
  return (
    <Dockable.Root>
      <Dockable.View id="view-1" name="View 1">
        view
      </Dockable.View>
      <Dockable.Panel size={3}>
        <Dockable.View id="view-2" name="View 2">
          view
        </Dockable.View>
        <Dockable.Window>
          <Dockable.View id="view-3" name="View 3">
            view
          </Dockable.View>
          <Dockable.View id="view-4" name="View 4">
            view
          </Dockable.View>
        </Dockable.Window>
      </Dockable.Panel>
    </Dockable.Root>
  );
}
```
![image](https://github.com/user-attachments/assets/2979b900-950d-4a2b-a6c3-a2206e2a7055)

> 💡 Note, Panels and Windows can have defined sizes provided as Fr units. See documentation for all props.

# Controlled Layouts

Dockable is uncontrolled by default, but you can control its state through the `panels` and `onChange` props to manage layouts or persist them between sessions.

```js
function App() {
  const [layout, setLayout] = useState();

  function handleChange(newLayout) {
    // custom logic here...
    setLayout(newLayout);
  }

  return (
    <Dockable.Root orientation="row" panels={layout} onChange={handleChange}>
      {/* Layout */}
    </Dockable.Root>
  );
}
```

The easiest way to persist a user's layout is with the provided `useDockableLocalStorage` hook which will automatically save and load layouts from local storage.

```js
import { useDockableLocalStorage } from "react-dockable";

function App() {
  const { layout, setLayout } = useDockableLocalStorage(1);

  return (
    <Dockable.Root orientation="row" panels={layout} onChange={setLayout}>
      {/* Layout */}
    </Dockable.Root>
  );
}
```

> 💡 Always remember to increase the version argument whenever you make changes to the View children as loading a layout with stale IDs will cause your app to crash
