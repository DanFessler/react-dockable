import TabView from "./Window";
import PanelGroup from "../../panelgroup/PanelGroup";
import React from "react";
import { LayoutNode, PanelNode, WindowNode } from "../utils/serializeLayout";
import { useDockable } from "../store";
import DroppableDivider from "../dndkit/DroppableDivider";
import styles from "./Panel.module.css";

type PanelProps = {
  orientation: "row" | "column";
  children:
    | React.ReactElement<React.ComponentProps<typeof View>>
    | React.ReactElement<React.ComponentProps<typeof View>>[];
  address: number[];
  gap?: number;
  panels: LayoutNode[];
};

// a list of TabViews with horizontal or vertical orientation
function PanelView({
  orientation = "row",
  children,
  address,
  gap,
  panels,
}: PanelProps) {
  const { dispatch } = useDockable();

  const sizes = panels.map((panel) => panel.size || 1);

  // Normalize children to an array
  const childArray = React.Children.toArray(children) as React.ReactElement<
    React.ComponentProps<typeof View>
  >[];

  function handleResizeEnd(sizes: number[]) {
    // console.log(sizes);
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
                console.log("tabid", tabId);
                throw new Error(`Tab ${tabId} not found`);
              }
              return {
                id: tab.props.id,
                name: tab.props.name,
                content: tab,
              };
            });
            return (
              <TabView
                id={panel.id}
                tabs={panelTabs}
                selected={(panel as WindowNode).selected.toString()}
                orientation={orientation}
                address={address.concat(index)}
              />
            );
          } else {
            const _panel = panel as PanelNode;
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
};

export const View: React.FC<WindowProps> = ({ children }) => <>{children}</>;

export default PanelView;
