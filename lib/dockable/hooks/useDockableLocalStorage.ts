import { useState } from "react";
import { useEffect } from "react";
import type { LayoutNode } from "../utils/serializeLayout";

export function useDockableLocalStorage(version: number) {
  const savedLayout = localStorage.getItem("layout");
  const parsedLayout = savedLayout ? JSON.parse(savedLayout) : undefined;

  // console.log(parsedLayout, parsedLayout && parsedLayout.version === version);

  const [layout, setLayout] = useState<LayoutNode[]>(
    parsedLayout && parsedLayout.version === version
      ? parsedLayout.layout
      : undefined
  );

  useEffect(() => {
    localStorage.setItem(
      "layout",
      JSON.stringify({ version: version, layout: layout })
    );
  }, [layout, version, parsedLayout]);

  return { layout, setLayout };
}
