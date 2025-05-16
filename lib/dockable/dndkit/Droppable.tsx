import { useDroppable } from "@dnd-kit/core";

type DroppableProps = {
  id: string;
  style?: React.CSSProperties;
  overStyle?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};
function Droppable({
  id,
  style,
  overStyle,
  className,
  children,
  data,
}: DroppableProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: data,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        ...(isOver && overStyle),
        // Add visual feedback when dragging over
        // backgroundColor: isOver ? "RED" : "BLUE",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default Droppable;
