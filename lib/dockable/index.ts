import React, { useEffect, useState } from "react";
import { ParsedNode } from "./utils/serializeLayout";
import { Dockable } from "./components/Root";

export function useDockableLocalStorage(version: number) {
  const savedLayout = localStorage.getItem("layout");
  const parsedLayout = savedLayout ? JSON.parse(savedLayout) : undefined;
  const [layout, setLayout] = useState<ParsedNode[]>(
    parsedLayout && parsedLayout.version === version
      ? parsedLayout.layout
      : undefined
  );

  useEffect(() => {
    localStorage.setItem(
      "layout",
      JSON.stringify({ version: version, layout: layout })
    );
  }, [layout]);

  return { layout, setLayout };
}

export type WindowProps = {
  children: React.ReactNode;
  size?: number;
  selected?: number;
};

export function Window(props: WindowProps) {
  return props.children;
}

export type ViewProps = {
  id: string;
  name: string;
  children: React.ReactNode;
};

export function View(props: ViewProps) {
  return props.children;
}

export type PanelProps = {
  orientation?: "row" | "column";
  size?: number;
  children: React.ReactNode;
};

export function Panel(props: PanelProps) {
  return props.children;
}

export default {
  Root: Dockable,
  Panel,
  Window,
  View,
};
