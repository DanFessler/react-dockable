import React, { useReducer, useEffect, useState } from "react";
import PanelView from "../components/Panel";
import appReducer from "../reducer";
import serializeLayout, { type LayoutNode } from "../utils/serializeLayout";
import colors from "../colors";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { StoreContext } from "../store";
import { dockableCollision } from "../dndkit/dockableCollision";
import DroppableDivider from "../dndkit/DroppableDivider";
import Droppable from "../dndkit/Droppable";
import {
  type MoveTabAction,
  type ReorderTabsAction,
  type SplitWindowAction,
  type InsertPanelAction,
} from "../reducer";
import { type TabProps, type PanelProps, type WindowProps } from "..";

type DockableProps = {
  orientation?: "row" | "column";
  layout?: LayoutNode[];
  children:
    | React.ReactElement<PanelProps | WindowProps | TabProps>
    | React.ReactElement<PanelProps | WindowProps | TabProps>[];
  onChange?: (panels: LayoutNode[]) => void;
  gap?: number;
  radius?: number;
};

export function Dockable({
  orientation = "row",
  children,
  layout: controledPanels,
  onChange,
  gap = 4,
  radius = 4,
}: DockableProps) {
  const views: React.ReactElement<TabProps>[] = [];
  const [active, setActive] = useState<{
    id: string;
    type: string;
    children: React.ReactNode;
  } | null>(null);

  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement[];

  const declarativePanels = childrenArray.map((child) =>
    serializeLayout(child, views)
  );

  const [state, dispatch] = useReducer(appReducer, {
    children: controledPanels || declarativePanels,
    id: "root",
    type: "Panel",
    size: 1,
  });

  useEffect(() => {
    if (onChange) {
      onChange(state.children);
    }
  }, [state, onChange]);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const sensors = useSensors(pointerSensor);

  function handleDragStart({ active }: DragStartEvent) {
    const type = active.data.current?.type;
    const children = active.data.current?.children;
    setActive({ id: active.id.toString(), type, children });
  }

  function handleDragCancel() {
    // console.log("drag cancel");
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) return;
    switch (over.data.current?.type) {
      case "tab-bar": {
        return dispatch({
          type: "moveTab",
          tabId: active.id.toString(),
          sourceWindowAddress: active.data.current?.address,
          targetWindowAddress: over.data.current?.address,
        } as MoveTabAction);
      }
      case "tab": {
        if (active.data.current?.parentId === over.data.current?.parentId) {
          return dispatch({
            type: "reorderTabs",
            sourceTabId: active.id.toString(),
            targetTabId: over.id.toString(),
            address: active.data.current?.address,
          } as ReorderTabsAction);
        }
        return dispatch({
          type: "moveTab",
          tabId: active.id.toString(),
          sourceWindowAddress: active.data.current?.address,
          targetWindowAddress: over.data.current?.address,
        } as MoveTabAction);
      }
      case "edge-zone": {
        return dispatch({
          type: "splitWindow",
          tabId: active.id.toString(),
          sourceWindowAddress: active.data.current?.address,
          targetWindowAddress: over.data.current?.address,
          direction: over.data.current.side,
          orientation: over.data.current.orientation,
        } as SplitWindowAction);
      }
      case "insert-panel": {
        return dispatch({
          type: "insertPanel",
          tabId: active.id.toString(),
          sourceAddress: active.data.current?.address,
          targetAddress: over.data.current.address,
        } as InsertPanelAction);
      }
    }
    setActive(null);
  }

  function handleDragOver({ over }: DragOverEvent) {
    if (!over) return;
    console.log(over.data.current?.type);
  }

  function renderEdgeDroppables() {
    return (
      <>
        <div
          style={{
            width: gap + 4,
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 10,
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <DroppableDivider address={[]} index={-1} />
        </div>
        <div
          style={{
            width: gap + 4,
            height: "100%",
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 10,
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <DroppableDivider address={[]} index={state.children.length} />
        </div>
        <div
          style={{
            width: "100%",
            height: gap + 4,
            position: "absolute",
            left: 0,
            bottom: 0,
            zIndex: 10,
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <Droppable
            id={`bottom-edge`}
            data={{
              type: "edge-zone",
              orientation,
              parentId: "root",
              address: [],
              side: "Bottom",
            }}
            style={{
              width: "calc(100% + 16px)",
              height: "calc(100% + 16px)",
              position: "absolute",
              top: "-8px",
              left: "-8px",
              transition: "all 0.1s ease-in-out",
            }}
            overStyle={{
              backgroundColor: "var(--selected)",
            }}
          />
        </div>
        <div
          style={{
            width: "100%",
            height: gap + 4,
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 10,
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <Droppable
            id={`top-edge`}
            data={{
              type: "edge-zone",
              orientation,
              parentId: "root",
              address: [],
              side: "Top",
            }}
            style={{
              width: "calc(100% + 16px)",
              height: "calc(100% + 16px)",
              position: "absolute",
              top: "-8px",
              left: "-8px",
              transition: "all 0.1s ease-in-out",
            }}
            overStyle={{
              backgroundColor: "var(--selected)",
            }}
          />
        </div>
      </>
    );
  }

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: gap,
          color: colors.text,
          background: colors.gap,
          boxSizing: "border-box",
          // @ts-expect-error - radius is variable
          "--radius": radius + "px",
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={dockableCollision}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          onDragOver={handleDragOver}
        >
          <PanelView
            orientation={orientation}
            panels={state.children}
            address={[]}
            gap={gap}
          >
            {views}
          </PanelView>

          <DragOverlay>
            {active ? (
              <div
                style={{
                  borderRadius: radius,
                  overflow: "hidden",
                  boxShadow: "0 1px 5px 1px rgba(0, 0, 0, 0.25)",
                }}
              >
                {active.children}
              </div>
            ) : null}
          </DragOverlay>

          {renderEdgeDroppables()}
        </DndContext>
      </div>
    </StoreContext.Provider>
  );
}
