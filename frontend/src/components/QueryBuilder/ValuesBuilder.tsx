import { useDraggable } from "@dnd-kit/core";

export default function DraggableValueRow({ value, children }: any) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `value-${value.columnId}`, // IMPORTANT UNIQUE ID
    data: {
      columnId: value.columnId,
      type: "value",
      aggregate: value.aggregate,
    },
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {/* your existing row UI */}
      {children}
    </div>
  );
}
