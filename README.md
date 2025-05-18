# React-Dockable

React library to create beautiful dockable tabbed interfaces for tools, dashboards, and more.

> ⚠️ This project is currently in pre-release to get early feedback. API may change.

## Motivation

Writing tools is hard, and half the battle is constantly redesigning your UI to accommodate for new features. This is why many companies implement robust dockable UI systems in tools like Unity, Unreal, and Photoshop, which ensures every new feature has a home and puts user is in control of their workflow.

Unfortunately, there weren't many great existing solutions for this for web, and rolling your own is complicated and expensive. React-Dockable was created to handle that complexity for you, so you can focus on shipping.

## Key features

- **Beautifully polished**  
  React-dockable prioritizes the user experience and by staying intuitive and unobtrusive. It gets out of the way of the user and what they want to do.
- **Fully customizable layouts**  
  Layouts are fully dynamic and user customizable right out of the box. No work necessary.
- **Simple declarative configuration**  
  No complicated data structures to learn, define your Layouts the React Way™ with a simple declarative component API
- **Imparative API (Coming Soon)**  
  need more control? We also offer an imperative API to dynamically control the Dockable workspace

- **Custom themes (Coming Soon)**  
  Dockable provides beautiful themes including light and dark modes, and an API for customizing your own.

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

The quickest way to get started is simply to provide `Dockable` with `Tab` children components and let the user manage their desired layout from there. By default, `Tabs` are displayed in a horizontal layout.

> 💡 Note, each `Tab` must have a unique id to avoid undefined behavior

```jsx
<Dockable.Root>
  <Dockable.Tab id="1" name="Tab 1">
    First Tab
  </Dockable.Tab>
  <Dockable.Tab id="2" name="Tab 2">
    Second Tab
  </Dockable.Tab>
  <Dockable.Tab id="3" name="Tab 3">
    Third Tab
  </Dockable.Tab>
</Dockable.Root>
```

![image](https://github.com/user-attachments/assets/9358bb45-573a-4fe1-b033-3bb864035a8d)

## Predefined Layouts

Children are not intended to be managed manually, instead they are the initial configuration of the layout and contain the definitions for each `Tab` to be managed internally.

You can compose the initial layout using `Panel`, `Window`, and `Tab` components. Each nested Panel alternates between row and column flows. `Tabs` are automatically wrapped in a Window if one isn't supplied

```jsx
<Dockable.Root>
  <Dockable.Tab id="view-1" name="Left">
    {/* view */}
  </Dockable.Tab>
  <Dockable.Panel size={3}>
    <Dockable.Tab id="view-2" name="Top">
      {/* view */}
    </Dockable.Tab>
    <Dockable.Window>
      <Dockable.Tab id="view-3" name="Tab 1">
        {/* view */}
      </Dockable.Tab>
      <Dockable.Tab id="view-4" name="Tab 2">
        {/* view */}
      </Dockable.Tab>
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

> 💡 Always remember to increase the version argument whenever you make changes to the Tab children as loading a layout with stale IDs will cause your app to crash

## Component Props

### `Dockable.Root`

| Prop         | Type                             | Description                                                 |
| ------------ | -------------------------------- | ----------------------------------------------------------- |
| orientation? | `"row" \| "column"`              | The direction panels will be arranged. Defaults to `"row"`. |
| panels?      | `LayoutNode[]`                   | Optional controlled layout state.                           |
| onChange?    | `(panels: LayoutNode[]) => void` | Callback fired when layout changes in controlled mode.      |
| children     | `ReactNode`                      | The panels and windows to render.                           |
| gap?         | `number`                         | The pixel spacing between panels.                           |
| radius?      | `number`                         | The corner radius of the windows                            |

### `Dockable.Panel`

| Prop         | Type                | Description                                                                        |
| ------------ | ------------------- | ---------------------------------------------------------------------------------- |
| orientation? | `"row" \| "column"` | The direction child panels will be arranged. Defaults to the inverse of its parent |
| size?        | `number`            | Optional size in Fr units. defaults to 1                                           |
| children     | `ReactNode`         | The panels and windows to render.                                                  |

### `Dockable.Window`

| Prop      | Type        | Description                                          |
| --------- | ----------- | ---------------------------------------------------- |
| size?     | `number`    | Optional size in Fr units. Defaults to `1`           |
| selected? | `number`    | Index of the initially selected tab. Defaults to `0` |
| children  | `ReactNode` | The tabs to render.                                  |

### `Dockable.Tab`

| Prop      | Type        | Description                    |
| --------- | ----------- | ------------------------------ |
| id        | `string`    | Unique identifier for the tab. |
| name      | `string`    | Display name shown in the tab. |
| children? | `ReactNode` | The content to render.         |

## License

This project is free to use for non-commercial purposes. If a commercial license is needed, become a Github Sponsor at the minimum $10 tier. Enterprise licenses are also available. [LICENSE.md](./LICENSE.md) for more details
