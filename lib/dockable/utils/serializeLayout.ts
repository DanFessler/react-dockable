import React from "react";
import { Panel, Window, Tab } from "..";

export type LayoutNode = PanelNode | WindowNode;

type TabId = string;

export type WindowNode = {
  id: string;
  type: "Window";
  selected: TabId;
  children: TabId[];
  size?: number;
};

export type PanelNode = {
  id: string;
  type: "Panel";
  orientation?: "row" | "column";
  size?: number;
  children: LayoutNode[];
};

import type { PanelProps, WindowProps, TabProps } from "..";

let idNonce = 0;

function serializeLayout(
  element: React.ReactElement,
  tabs: React.ReactElement[]
): LayoutNode {
  console.log({ element, type: element.type });
  if (!React.isValidElement(element)) {
    console.log(element);
    throw new Error("Invalid element");
  }

  // Handle <Panel>
  if (element.type === Panel) {
    const props = element.props as PanelProps;
    const orientation = props.orientation;

    const children = React.Children.toArray(
      props.children
    ) as React.ReactElement[];
    const parsedChildren = children.map((child) =>
      serializeLayout(child, tabs)
    );

    for (const child of parsedChildren) {
      if (child.type !== "Panel" && child.type !== "Window") {
        throw new Error("Panels can only contain other Panels or Windows");
      }
    }

    return {
      type: "Panel",
      id: `panel-${idNonce++}`,
      orientation,
      children: parsedChildren,
      size: props.size || 1,
    };
  }

  // Handle <Window>
  if (element.type === Window) {
    const props = element.props as WindowProps;
    const children = React.Children.toArray(
      props.children
    ) as React.ReactElement[];

    const tabIds = children.map(parseTab);

    return {
      type: "Window",
      id: `window-${idNonce++}`,
      children: tabIds,
      size: props.size || 1,
      selected: tabIds[props.selected || 0],
    };
  }

  // automatically wrap a <Tab> in a <Window> if it is not already a <Window>
  if (element.type === Tab) {
    return {
      type: "Window",
      id: `window-${idNonce++}`,
      children: [parseTab(element)],
      size: 1,
      selected: parseTab(element),
    };
  }

  function parseTab(child: React.ReactElement): string {
    if (!React.isValidElement(child) || child.type !== Tab) {
      throw new Error("Windows can only contain <Tab> elements");
    }

    const childProps = child.props as TabProps;

    const tabId = childProps.id;
    if (typeof tabId !== "string") {
      throw new Error("Each <Tab> must have an 'id' prop");
    }

    tabs.push(child);

    return tabId;
  }

  throw new Error(`Unknown component: ${element.type}`);
}

export default serializeLayout;
