# React-Dockable

React library to create beautiful dockable tabbed interfaces for tools, dashboards, and more.

> ⚠️ This project is currently in pre-release to get early feedback. API may change.

## Motivation

Writing tools is hard, and half the battle is constantly redesigning your UI to accommodate for new features. This is why many companies use robust dockable UI systems to develop tools like Unity, Unreal, and Photoshop, which ensures every new feature has a home.

Unfortunately, there weren't many great existing solutions for this for web, and rolling your own is complicated and expensive. React-Dockable was created to handle that complexity for you, so you can focus on building.

## Key features

- **Beautiful and polished**  
  React-dockable puts a priority on the user experience and get out of the way of the user
- **Fully customizable layouts**  
  Layouts are fully dynamic and user customizable right out of the box. No work necessary.
- **Simple declarative configuration**  
  No complicated data structures to learn, define your Layouts the React way with a simple declarative component API
- **Imparative API (Coming Soon)**  
  need more control? We also offer an imperative API to dynamically control the Dockable workspace

- **Custom themes (Coming Soon)**  
  Dockable provides beautiful themes out-of-the-box and an API for customizing your own.

## Getting Started

This package hasn't been published to NPM (yet). For now, download the latest release tgz and install in your project

```
npm install ./react-dockable-0.2.0.tgz
```

Then import the library and default css into your project

```js
import Dockable from "react-dockable";
import "react-dockable/style.css";
```

## Basic Usage

The quickest way to get started is simply to provide `Dockable` with `View` children components and let the user manage their desired layout from there. By default, `Views` are displayed in a horizontal layout.

> 💡 Note, each `View` must have a unique id to avoid undefined behavior

```jsx
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
```

![image](https://github.com/user-attachments/assets/9358bb45-573a-4fe1-b033-3bb864035a8d)

## Predefined Layouts

Child components are not intended to be dynamic or managed manually, instead they are the initial configuration of the layout and contain the definitions for each `View` managed internally.

You can compose the initial layout using `Panel` and `Window` components. Each nested Panel alternates between row and column layouts. Windows can contain multiple Views which are displayed as tabs. `Views` are automatically wrapped in a Window if one isn't supplied

```jsx
<Dockable.Root>
  <Dockable.View id="view-1" name="Left">
    {/* view */}
  </Dockable.View>
  <Dockable.Panel size={3}>
    <Dockable.View id="view-2" name="Top">
      {/* view */}
    </Dockable.View>
    <Dockable.Window>
      <Dockable.View id="view-3" name="Tab 1">
        {/* view */}
      </Dockable.View>
      <Dockable.View id="view-4" name="Tab 2">
        {/* view */}
      </Dockable.View>
    </Dockable.Window>
  </Dockable.Panel>
</Dockable.Root>
```

![image](https://github.com/user-attachments/assets/2979b900-950d-4a2b-a6c3-a2206e2a7055)

> 💡 Note, Panels and Windows can have defined sizes provided as Fr units. See documentation for all props.

## Controlled Layouts

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

## License

This project is free to use for non-commercial purposes. If a commercial license is needed, become a Github Sponsor at the minimum $10 tier. Enterprise licenses are also available. [LICENSE.md](./LICENSE.md) for more details
