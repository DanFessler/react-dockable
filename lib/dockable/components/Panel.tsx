import TabView from "./Window";
import PanelGroup from "../../panelgroup/PanelGroup";
import React from "react";
import type {
  LayoutNode,
  PanelNode,
  WindowNode,
} from "../utils/serializeLayout";
import { useDockable } from "../store";
import DroppableDivider from "../dndkit/DroppableDivider";
import styles from "./Panel.module.css";
import type { CustomItems } from "./DropdownMenu";

type PanelProps = {
  orientation: "row" | "column";
  children:
    | React.ReactElement<React.ComponentProps<typeof View>>
    | React.ReactElement<React.ComponentProps<typeof View>>[];
  address: number[];
  gap?: number;
  panels: LayoutNode[];
  declarativePanels?: LayoutNode[];
};

function getWindowChrome(
  windowNode: WindowNode,
  declarativeNode?: LayoutNode,
  tabCount = 0
) {
  const declarativeWindow =
    declarativeNode?.type === "Window"
      ? (declarativeNode as WindowNode)
      : undefined;

  const hideTabsWhenSingle =
    declarativeWindow?.hideTabsWhenSingle ?? windowNode.hideTabsWhenSingle;

  const hideTabs =
    Boolean(declarativeWindow?.hideTabs) ||
    Boolean(windowNode.hideTabs) ||
    (Boolean(hideTabsWhenSingle) && tabCount <= 1);

  return {
    hideTabs,
    chromeless: declarativeWindow?.chromeless ?? windowNode.chromeless,
  };
}

// a list of TabViews with horizontal or vertical orientation
function PanelView({
  orientation = "row",
  children,
  address,
  gap,
  panels,
  declarativePanels,
}: PanelProps) {
  const { dispatch } = useDockable();

  const sizes = panels.map((panel) => panel.size || 1);

  // Normalize children to an array
  const childArray = React.Children.toArray(children) as React.ReactElement<
    React.ComponentProps<typeof View>
  >[];

  function handleResizeEnd(sizes: number[]) {
    dispatch({ type: "resize", sizes, address });
  }

  return (
    <>
      <PanelGroup
        orientation={orientation}
        gap={gap}
        sizes={sizes}
        onResizeEnd={handleResizeEnd}
        handleClassName={styles.handle}
        handleComponent={(index: number) => (
          <DroppableDivider address={address} index={index} />
        )}
      >
        {panels.map((panel, index) => {
          if (panel.type === "Window") {
            const panelTabs = panel.children.map((tabId) => {
              const tab = childArray.find(({ props }) => props.id === tabId);
              if (!tab) {
                throw new Error(`Tab ${tabId} not found`);
              }
              return {
                id: tab.props.id,
                name: tab.props.name,
                content: tab,
                actions: tab.props.actions,
              };
            });
            const windowNode = panel as WindowNode;
            const { hideTabs, chromeless } = getWindowChrome(
              windowNode,
              declarativePanels?.[index],
              panelTabs.length
            );

            return (
              <TabView
                id={panel.id}
                tabs={panelTabs}
                hideTabs={hideTabs}
                chromeless={chromeless}
                selected={windowNode.selected.toString()}
                orientation={orientation}
                address={address.concat(index)}
              />
            );
          } else {
            const _panel = panel as PanelNode;
            const declarativeChild = declarativePanels?.[index];

            return (
              <PanelView
                key={index}
                orientation={
                  _panel.orientation !== undefined
                    ? _panel.orientation
                    : orientation === "row"
                    ? "column"
                    : "row"
                }
                panels={_panel.children}
                declarativePanels={
                  declarativeChild?.type === "Panel"
                    ? declarativeChild.children
                    : undefined
                }
                children={children}
                address={address.concat(index)}
                gap={gap}
              />
            );
          }
        })}
      </PanelGroup>
    </>
  );
}

type WindowProps = {
  id: string;
  name: string;
  children: React.ReactNode;
  actions?: CustomItems;
};

export const View: React.FC<WindowProps> = ({ children }) => <>{children}</>;

export default PanelView;
