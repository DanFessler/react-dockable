import React from "react";
import { Dockable as DockableRoot } from "./components/Root";
export { useDockableLocalStorage } from "./hooks/useDockableLocalStorage";
export {
  applyThemeCssVariables,
  colors,
  getPreferredTheme,
  getThemeColors,
  getThemeCssVariables,
} from "./colors";
export type {
  DockableTheme,
  DockableThemeColors,
  ThemeCssVariablesOptions,
} from "./colors";
import type { CustomItems } from "./components/DropdownMenu";
export type { LayoutNode } from "./utils/serializeLayout";
import Menu from "./components/DropdownMenu";

export type WindowProps = {
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
  size?: number;
  selected?: number;
  hideTabs?: boolean;
  hideTabsWhenSingle?: boolean;
  chromeless?: boolean;
};

export function Window(props: WindowProps) {
  return props.children;
}

export type TabProps = {
  id: string;
  name: string;
  children: React.ReactNode;
  actions?: CustomItems;
  hideTabs?: boolean;
  hideTabsWhenSingle?: boolean;
  chromeless?: boolean;
};

export function Tab(props: TabProps) {
  return props.children;
}

export type PanelProps = {
  orientation?: "row" | "column";
  size?: number;
  children:
    | React.ReactElement<PanelProps | WindowProps | TabProps>
    | React.ReactElement<PanelProps | WindowProps | TabProps>[];
};

export function Panel(props: PanelProps) {
  return props.children;
}

export const Dockable = {
  Root: DockableRoot,
  Panel,
  Window,
  Tab,
  Menu,
};
