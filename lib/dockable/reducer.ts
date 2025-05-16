import createReducer from "./utils/createReducer";
import { ParsedNode, PanelNode, WindowNode } from "./utils/serializeLayout";
import { arrayMove } from "@dnd-kit/sortable";
// import { current } from "immer";

type State = PanelNode & {
  // children: ParsedNode[];
};

export type ResizeAction = {
  type: "resize";
  sizes: number[];
  address: number[];
};

export type AddPanelAction = {
  type: "addPanel";
  panel: ParsedNode;
};

export type ReorderTabsAction = {
  type: "reorderTabs";
  sourceTabId: string;
  targetTabId: string;
  address: number[];
};

export type SelectTabAction = {
  type: "selectTab";
  tabId: string;
  address: number[];
};

export type MoveTabAction = {
  type: "moveTab";
  tabId: string;
  sourceWindowAddress: number[];
  targetWindowAddress: number[];
};

export type SplitWindowAction = {
  type: "splitWindow";
  tabId: string;
  sourceWindowAddress: number[];
  targetWindowAddress: number[];
  direction: "Left" | "Right" | "Top" | "Bottom";
  orientation: "row" | "column";
};

export type InsertPanelAction = {
  type: "insertPanel";
  tabId: string;
  sourceAddress: number[];
  targetAddress: number[];
};

type Action =
  | ResizeAction
  | AddPanelAction
  | ReorderTabsAction
  | SelectTabAction
  | MoveTabAction
  | SplitWindowAction
  | InsertPanelAction;

const appReducer = createReducer<State, Action>({
  resize: (state, { sizes, address }: ResizeAction) => {
    const children = getNodeFromAddress(state, address).children as PanelNode[];

    // update the size of the panels
    children.forEach((p, i) => {
      p.size = sizes[i];
    });
  },

  addPanel: (state, { panel }: AddPanelAction) => {
    state.children.push(panel);
  },

  insertPanel: (
    state,
    { tabId, sourceAddress, targetAddress }: InsertPanelAction
  ) => {
    const sourceWindow = getNodeFromAddress(state, sourceAddress) as WindowNode;
    const targetParent = getNodeFromAddress(
      state,
      targetAddress.slice(0, -1)
    ) as PanelNode;
    const targetIndex = targetAddress.slice(-1)[0];
    const tabIndex = sourceWindow.children.indexOf(tabId);
    const newPanel: WindowNode = {
      type: "Window",
      id: "window-" + Date.now(),
      children: [tabId],
      selected: tabId,
      size: 1,
    };
    sourceWindow.children.splice(tabIndex, 1);
    sourceWindow.selected = sourceWindow.children[0];
    targetParent.children.splice(targetIndex + 1, 0, newPanel);
    cleanup(state);
  },

  reorderTabs: (
    state,
    { sourceTabId, targetTabId, address }: ReorderTabsAction
  ) => {
    const ParentPanel = getNodeFromAddress(state, address) as WindowNode;
    const activeIndex = ParentPanel.children.indexOf(sourceTabId);
    const overIndex = ParentPanel.children.indexOf(targetTabId);
    ParentPanel.selected = sourceTabId;
    ParentPanel.children = arrayMove(
      ParentPanel.children,
      activeIndex,
      overIndex
    );
  },

  selectTab: (state, { tabId, address }: SelectTabAction) => {
    const ParentPanel = getNodeFromAddress(state, address) as WindowNode;
    ParentPanel.selected = tabId;
  },

  moveTab: (
    state,
    { tabId, sourceWindowAddress, targetWindowAddress }: MoveTabAction
  ) => {
    const sourceWindow = getNodeFromAddress(
      state,
      sourceWindowAddress
    ) as WindowNode;
    const targetWindow = getNodeFromAddress(
      state,
      targetWindowAddress
    ) as WindowNode;

    // dont need to move it if it's the same window
    if (sourceWindow === targetWindow) return;

    const activeIndex = sourceWindow.children.indexOf(tabId);
    const overIndex = targetWindow.children.length; // always the last tab

    // Remove tab from active parent
    sourceWindow.children.splice(activeIndex, 1);

    // Insert tab into over parent
    targetWindow.children.splice(overIndex, 0, tabId);
    targetWindow.selected = tabId;

    // If active tab was selected, select first remaining tab
    if (sourceWindow.selected === tabId) {
      sourceWindow.selected = sourceWindow.children[0];
    }

    // clean up the tree of empty nodes
    if (sourceWindow.children.length === 0) {
      cleanup(state);
    }
  },

  splitWindow: (
    state,
    {
      tabId,
      sourceWindowAddress,
      targetWindowAddress,
      direction,
      orientation,
    }: SplitWindowAction
  ) => {
    const [sourceWindow, targetWindow, targetPanel, targetWindowIndex] = [
      getNodeFromAddress(state, sourceWindowAddress) as WindowNode,
      getNodeFromAddress(state, targetWindowAddress) as WindowNode,
      getNodeFromAddress(state, targetWindowAddress.slice(0, -1)) as PanelNode,
      targetWindowAddress.slice(-1)[0],
    ];

    // if the source window is the same as the target window and the source window has only one tab, we don't need to do anything
    if (sourceWindow === targetWindow && sourceWindow.children.length === 1) {
      return;
    }

    // remove tab from the source window
    const tabIndex = sourceWindow.children.indexOf(tabId);
    sourceWindow.children.splice(tabIndex, 1);

    // select the first tab in the window since we (likely) removed the selected tab
    sourceWindow.selected = sourceWindow.children[0];

    // create new window
    const newWindow: WindowNode = {
      type: "Window",
      id: "window-" + Date.now(),
      children: [tabId],
      selected: tabId,
    };

    const isAligned =
      (orientation === "row" && ["Left", "Right"].includes(direction)) ||
      (orientation === "column" && ["Top", "Bottom"].includes(direction));

    // if the split direction is aligned with the parent panel, we only need to insert into the panel's children
    if (isAligned) {
      const halfSize = (targetWindow.size || 1) / 2;
      const offset = direction === "Left" || direction === "Top" ? 0 : 1;
      targetWindow.size = halfSize;
      newWindow.size = halfSize;
      targetPanel.children.splice(targetWindowIndex + offset, 0, newWindow);
    }

    // otherwise we need to encapsulate the target window and source window in a new panel with a new orientation
    if (!isAligned) {
      const shouldReverse = direction === "Left" || direction === "Top";
      const newPanel: PanelNode = {
        type: "Panel",
        id: "panel-" + Date.now(),
        children: shouldReverse
          ? [newWindow, { ...targetWindow }]
          : [{ ...targetWindow }, newWindow],
        size: targetWindow.size,
      };
      newWindow.size = 1;
      targetWindow.size = 1;

      if (targetWindowIndex === undefined) {
        state.children = [newPanel];
      } else {
        targetPanel.children[targetWindowIndex] = newPanel;
      }
    }

    cleanup(state);
  },
});

function cleanup(root: ParsedNode) {
  const children = root.children as ParsedNode[];
  for (let i = children.length - 1; i >= 0; i--) {
    const node = children[i];

    if (node.type === "Window") {
      const windowNode = node as WindowNode;
      // If window has no tabs, remove it
      if (windowNode.children.length === 0) {
        children.splice(i, 1);
        normalize(children);
      }
    } else if (node.type === "Panel") {
      const panelNode = node as PanelNode;

      // Recursively process child panels
      cleanup(node);

      // if a panel-child has a single child that is also a panel, we can inline the grandchildren
      // TODO we may have to consider the sizing implications of inlining panels
      const newChildren: ParsedNode[] = [];
      panelNode.children.forEach((child) => {
        if (
          child.type === "Panel" &&
          child.children.length === 1 &&
          child.children[0].type === "Panel"
        ) {
          // renormalize the size of the grandchild and push it into the new children array
          child.children[0].children.forEach((grandchild) => {
            const grandchildSize = grandchild.size || 1;
            const parentSize = child.size || 1;
            grandchild.size = grandchildSize * parentSize;
            newChildren.push(grandchild);
          });
        } else {
          newChildren.push(child);
        }
      });
      // const newChildren = panelNode.children;

      // normalize the sizes of the children
      normalize(newChildren);
      panelNode.children = newChildren;

      // If panel has no children after processing, remove it and also renormalize the sizes of the remaining children
      if (newChildren.length === 0) {
        children.splice(i, 1);
        normalize(children);
      }
    }
  }
}

function normalize(children: ParsedNode[]) {
  const totalSize = children.reduce((acc, child) => {
    const size = child.size || 1;
    return acc + size;
  }, 0);
  children.forEach((child) => {
    child.size = child.size ? child.size / totalSize : 1;
  });
}

function getNodeFromAddress(root: ParsedNode, address: number[]): ParsedNode {
  // if the address is empty, we found the node
  if (address.length === 0) return root;

  const children = root.children as ParsedNode[];

  // if the address has only one element, we return the panel at that index
  if (address.length === 1) return children[address[0]];

  // otherwise, recursively call the function, slicing off the first index each time
  return getNodeFromAddress(children[address[0]], address.slice(1));
}

export default appReducer;
