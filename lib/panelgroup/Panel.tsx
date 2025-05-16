import React from "react";
import PanelHandle from "./PanelHandle";

type PanelProps = {
  children: React.ReactNode;
  direction: "row" | "column";
  onDrag: (delta: { x: number; y: number }) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  gap?: number;
  handleClassName?: string;
  isLast?: boolean;
  handleComponent?: React.ReactNode;
};

function Panel(
  {
    children,
    direction,
    onDrag,
    onDragStart,
    onDragEnd,
    gap,
    handleClassName,
    isLast,
    handleComponent,
  }: PanelProps,
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      style={{ position: "relative", flex: 1, minWidth: 0, minHeight: 0 }}
    >
      <div
        style={{
          overflow: "hidden",
          maxWidth: "100%",
          maxHeight: "100%",
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        {children}
      </div>
      {!isLast && (
        <PanelHandle
          direction={direction}
          onDrag={onDrag}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          gap={gap}
          className={handleClassName}
          handleComponent={handleComponent}
        />
      )}
    </div>
  );
}
const PanelForwardRef = React.forwardRef(Panel);

export default PanelForwardRef;
