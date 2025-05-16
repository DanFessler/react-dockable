function PanelHandle({
  className,
  direction,
  onDrag,
  onDragStart,
  onDragEnd,
  gap = 3,
  size = gap + 4,
  handleComponent,
}: {
  className?: string;
  direction: "row" | "column";
  onDrag?: (delta: { x: number; y: number }) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  size?: number;
  gap?: number;
  handleComponent?: React.ReactNode;
}) {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDragStart?.();

    // set cursor
    document.body.style.cursor =
      direction === "row" ? "col-resize" : "row-resize";

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDrag?.({
        x: e.movementX,
        y: e.movementY,
      });
    };

    const handleMouseUp = () => {
      onDragEnd?.();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const sizeGapDifference = size - gap;
  const offset = sizeGapDifference / 2;

  const style: React.CSSProperties =
    direction === "row"
      ? {
          top: 0,
          right: -size + offset,
          width: size,
          height: "100%",
          cursor: "col-resize",
        }
      : {
          bottom: -size + offset,
          left: 0,
          width: "100%",
          height: size,
          cursor: "row-resize",
        };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={className}
      style={{
        position: "absolute",
        zIndex: 10,
        // backgroundColor: "transparent",
        transition: "background-color 0.1s ease-in-out",
        borderRadius: 2,
        overflow: "hidden",
        ...style,
      }}
    >
      {handleComponent}
    </div>
  );
}

export default PanelHandle;
