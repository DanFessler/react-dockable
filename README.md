![react-dockable-splash](https://github.com/user-attachments/assets/3465dd6d-5ea8-4249-ae9d-09e498d26797)

> ⚠️ This project is currently in pre-release to get early feedback. API may change.

# React-Dockable

React-Dockable is a React library to create beautiful dockable tabbed interfaces for tools, dashboards, and more.

### Live Demo: [dockable.netlify.app](https://dockable.netlify.app/)

## Motivation

Writing tools is hard, and half the battle is constantly redesigning your UI to accommodate for new features. This is why many companies implement robust dockable UI systems in tools like Unity, Unreal, and Photoshop, which ensures every new feature has a home and puts the user in control of their workflow.

Unfortunately, there weren't many great existing solutions for this for web, and rolling your own is complicated and expensive. React-Dockable was created to handle that complexity for you, so you can focus on shipping.

## Key features

- **Beautifully polished**  
  React-dockable prioritizes the user experience by staying intuitive and unobtrusive. It gets out of the way of the user and what they want to do.

- **Fully customizable layouts**  
  Layouts are fully dynamic and user customizable right out of the box. No work necessary.

- **Simple declarative configuration**  
  No complicated data structures to learn, define your Layouts the React Way™ with a simple declarative component API

- **Color Theme Presets**  
  Dockable provides 4 beautiful color themes: Light, Medium, Dark, and Darker.

## Getting Started

This package hasn't been published to NPM (yet). For now, download the latest release tgz and install in your project

```
npm install ./react-dockable-0.2.0.tgz
```

Then import the library and default css into your project

```js
import { Dockable } from "react-dockable";
import "react-dockable/style.css";
```

## Basic Usage

The quickest way to get started is simply to provide `Dockable` with `Tab` children components and let the user manage their desired layout from there.

The `Tab` component is the core primitive of Dockable which renders your App's custom components. Each tab can be thought of as a logic collection of like-features for your app.

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

By default, `Tabs` are displayed in a horizontal layout.

![image](https://github.com/user-attachments/assets/9358bb45-573a-4fe1-b033-3bb864035a8d)

> ⚠️ Each `Tab` must have a unique id to avoid undefined behavior

## Predefined Layouts

Children are not intended to be managed manually. Instead, they are the initial configuration of the layout and contain the definitions for each `Tab` which is managed internally by React-Dockable.

You can compose the initial layout using `Panel`, `Window`, and `Tab` components. Each nested Panel alternates between row and column flows. Windows can contain multiple Tabs. Tabs are automatically wrapped in a Window if one isn't supplied

```jsx
<Dockable.Root>
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
```

![image](https://github.com/user-attachments/assets/2979b900-950d-4a2b-a6c3-a2206e2a7055)

> 💡 Panels and Windows can have defined sizes provided as Fr units. See documentation for all props.

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
    <Dockable.Root orientation="row" layout={layout} onChange={handleChange}>
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
    <Dockable.Root layout={layout} onChange={setLayout}>
      {/* Layout */}
    </Dockable.Root>
  );
}
```

> ⚠️ Always increase the version argument whenever you make changes to the layout as any missing Tab id will throw an exception

## Component Props

### `Dockable.Root`

| Prop         | Value                                       | description                                                              |
| ------------ | ------------------------------------------- | ------------------------------------------------------------------------ |
| orientation? | `"row" \| "column"`                         | The direction panels will be arranged. Defaults to `"row"`.              |
| layout?      | `LayoutNode[]`                              | Optional controlled layout state.                                        |
| onChange?    | `(panels: LayoutNode[]) => void`            | Callback fired when layout changes in controlled mode.                   |
| children     | `Panel \| Window \| Tab`                    | The panels and windows to render.                                        |
| gap?         | `number`                                    | The pixel spacing between panels.                                        |
| radius?      | `number`                                    | The corner radius of the windows                                         |
| theme?       | `"light" \| "medium" \| "dark" \| "darker"` | Color presets. Defaults to light or dark based on user's device settings |

### `Dockable.Panel`

| Prop         | Value                    | description                                                                        |
| ------------ | ------------------------ | ---------------------------------------------------------------------------------- |
| orientation? | `"row" \| "column"`      | The direction child panels will be arranged. Defaults to the inverse of its parent |
| size?        | `number`                 | Optional size in Fr units. defaults to 1                                           |
| children     | `Panel \| Window \| Tab` | The layout to render.                                                              |

### `Dockable.Window`

| Prop      | Value    | description                                          |
| --------- | -------- | ---------------------------------------------------- |
| size?     | `number` | Optional size in Fr units. Defaults to `1`           |
| selected? | `number` | Index of the initially selected tab. Defaults to `0` |
| children  | `Tab`    | The tabs to render.                                  |

### `Dockable.Tab`

| Prop      | Value       | description                    |
| --------- | ----------- | ------------------------------ |
| id        | `string`    | Unique identifier for the tab. |
| name      | `string`    | Display name shown in the tab. |
| children? | `ReactNode` | The content to render.         |

## Layout State

You can also manage the layout state object directly to define layouts or to add custom functionality. Window children ids must match an id prop of a child `Tab` component. When Dockable first mounts, it serializes the children component layout into this format.

Example Layout Object:

```js
[
  {
    type: "Window",
    id: "window-0",
    children: ["tab-1"],
    size: 1,
    selected: "tab-1",
  },
  {
    type: "Panel",
    id: "panel-3",
    children: [
      {
        type: "Window",
        id: "window-1",
        children: ["tab-2"],
        size: 1,
        selected: "tab-2",
      },
      {
        type: "Window",
        id: "window-2",
        children: ["tab-3", "tab-4"],
        size: 1,
        selected: "tab-3",
      },
    ],
    size: 3,
  },
];
```

> ⚠️ Note: We will soon be releasing an imperative API to make manipulating this object easier.

The Layout object is an array of `LayoutNodes`

### LayoutNode

`PanelNode | WindowNode`

### PanelNode

| Property     | Value                                                                            |
| ------------ | -------------------------------------------------------------------------------- |
| id           | `string`<br>Unique identifier for the panel.                                     |
| type         | `"Panel"`<br>Discriminator to identify panel nodes.                              |
| orientation? | `"row" \| "column"`<br>The direction child panels will be arranged.              |
| size?        | `number`<br>Optional size in Fr units. Defaults to 1.                            |
| children     | `LayoutNode[]`<br>Array of child panel and window nodes that make up this panel. |

### WindowNode

| Property | Value                                                    |
| -------- | -------------------------------------------------------- |
| id       | `string`<br>Unique identifier for the window.            |
| type     | `"Window"`<br>Discriminator to identify window nodes.    |
| selected | `string`<br>ID of the currently selected tab.            |
| children | `string[]`<br>Array of tab IDs contained in this window. |
| size?    | `number`<br>Optional size in Fr units. Defaults to 1.    |

## License

This project is free to use for non-commercial purposes.  
For commercial licenses, become a [Github Sponsor](https://github.com/sponsors/DanFessler).  
See [LICENSE.md](./LICENSE.md) for more details
