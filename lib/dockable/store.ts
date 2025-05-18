import React, { createContext, useContext } from "react";
import type { LayoutNode } from "./utils/serializeLayout";

type DockableState = {
  children: LayoutNode[];
};

type DockableContextType = {
  state: DockableState;
  dispatch: React.Dispatch<any>;
};

export const StoreContext = createContext<DockableContextType | undefined>(
  undefined
);

export function useDockable() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useDockable must be used within a DockableProvider");
  }
  return context;
}
