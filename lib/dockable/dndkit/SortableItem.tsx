import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({
  id,
  children,
  style,
  data,
}: {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    isSorting,
  } = useSortable({ id, data: { children, ...data } });

  const itemStyle = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    transition: isSorting
      ? "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      : "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...itemStyle, ...style }}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

export default SortableItem;
