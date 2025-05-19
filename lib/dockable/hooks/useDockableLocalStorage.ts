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
    // if we have a version mismatch, we dont want to save the layout
    if (!parsedLayout || parsedLayout.version !== version) {
      localStorage.removeItem("layout");
      return;
    }

    localStorage.setItem(
      "layout",
      JSON.stringify({ version: version, layout: layout })
    );
  }, [layout, version, parsedLayout]);

  return { layout, setLayout };
}
