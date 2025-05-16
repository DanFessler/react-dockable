import React, { useState, useRef, useEffect, useCallback } from "react";
import Panel from "./Panel";

const minSize = {
  x: 32,
  y: 32,
};

type PanelGroupProps = {
  children: React.ReactNode;
  orientation: "row" | "column";
  sizes?: number[];
  gap?: number;
  onResizeEnd?: (sizes: number[]) => void;
  className?: string;
  handleClassName?: string;
  handleComponent?: React.ReactNode | ((index: number) => React.ReactNode);
};

function PanelGroup({
  children,
  orientation,
  sizes,
  onResizeEnd,
  gap = 3,
  className,
  handleClassName,
  handleComponent,
}: PanelGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pxSizes, setPxSizes] = useState<number[]>([]);
  const [frSizes, setFrSizes] = useState<number[]>(
    sizes || Array.from({ length: React.Children.count(children) }, () => 1)
  );
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const getBoundingRectSizes = useCallback(() => {
    return panelRefs.current
      .map((ref) => {
        if (!ref) return null;
        const rect = ref.getBoundingClientRect();
        return orientation === "row" ? rect.width : rect.height;
      })
      .filter(Boolean) as number[];
  }, [orientation, panelRefs]);

  const calcNewSizes = useCallback(() => {
    const panelPixelSizes = getBoundingRectSizes();
    const totalSize = panelPixelSizes.reduce((acc, size) => acc + size, 0);
    const newSizes = panelPixelSizes.map((size) => size / totalSize);
    return newSizes;
  }, [getBoundingRectSizes]);

  // in an uncontrolled state, calculate new sizes when children count changes
  const childrenCount = React.Children.count(children);
  useEffect(() => {
    if (sizes) return; // if sizes are provided, don't calculate new sizes
    const newSizes = calcNewSizes();
    setFrSizes(newSizes);
    onResizeEnd?.(newSizes);
  }, [childrenCount, calcNewSizes, sizes, onResizeEnd]);

  // keep sizes in sync with the provided sizes
  useEffect(() => {
    setFrSizes(sizes || Array.from({ length: childrenCount }, () => 1));
  }, [sizes, childrenCount]);

  const handleDrag = (delta: { x: number; y: number }, index: number) => {
    setPxSizes((sizes) => {
      return getPanelDraggingSizes(
        index,
        delta[orientation === "row" ? "x" : "y"],
        sizes,
        minSize[orientation === "row" ? "x" : "y"]
      );
    });
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
    setPxSizes(getBoundingRectSizes());
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    const newSizes = calcNewSizes();
    setFrSizes(newSizes);
    onResizeEnd?.(newSizes);
  };

  function getSizeStyle() {
    const xy = orientation === "row" ? "x" : "y";

    // if we're not dragging, return the sizes as fr
    // we multiply by a constant because values under 1 might not fill the container
    // and multiplying proportionally has otherwise no effect on the size
    if (draggingIndex === null) {
      return frSizes
        .map((size) => `minmax(${minSize[xy]}px, ${100 * size}fr)`)
        .join(" ");
    }

    // otherwise, we're dragging, so we return the sizes as px which are easier to work with
    return pxSizes
      .map((size) => `minmax(${minSize[xy]}px, ${size}px)`)
      .join(" ");
  }

  function getPanelDraggingSizes(
    index: number,
    delta: number,
    sizes: number[],
    minSize: number
  ) {
    if (index < 0 || index >= sizes.length) return sizes;
    const newSizes = [...sizes];

    // update the sizes with the drag delta
    newSizes[index] += delta;
    newSizes[index + 1] -= delta;

    // if either panel is too small, calculate the difference and
    // recursively call the function to push the neighboring panels
    if (newSizes[index] < minSize) {
      const difference = minSize - newSizes[index];
      return getPanelDraggingSizes(index - 1, -difference, newSizes, minSize);
    }
    if (newSizes[index + 1] < minSize) {
      const difference = minSize - newSizes[index + 1];
      return getPanelDraggingSizes(index + 1, difference, newSizes, minSize);
    }

    return newSizes;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: "grid",
        [orientation === "row" ? "gridTemplateColumns" : "gridTemplateRows"]:
          getSizeStyle(),
        gap: gap,
        minWidth: "100%",
        width: "100%",
        minHeight: "100%",
        height: "100%",
        flex: 1,
      }}
    >
      {React.Children.map(children, (child, index) => (
        <Panel
          ref={(el) => {
            panelRefs.current[index] = el;
          }}
          direction={orientation}
          onDrag={(delta) => handleDrag(delta, index)}
          onDragStart={() => handleDragStart(index)}
          onDragEnd={() => handleDragEnd()}
          gap={gap}
          handleClassName={handleClassName}
          isLast={index === React.Children.count(children) - 1}
          handleComponent={
            typeof handleComponent === "function"
              ? handleComponent(index)
              : handleComponent
          }
        >
          {child}
        </Panel>
      ))}
    </div>
  );
}

export default PanelGroup;
