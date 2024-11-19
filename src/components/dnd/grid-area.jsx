import { useDrop } from "react-dnd";
import { DraggableGridItem } from "./draggable-grid-item";
import { ItemTypes } from ".";

export const GridArea = ({
  gridItems,
  onDrop,
  onResize,
  onRemove,
  onDragGridItem,
  onColumnDrop,
  connections,
}) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.TABLE,
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      onDrop(item, offset); // Handle table drop
    },
  }));

  return (
    <div ref={drop} className="gridArea">
      {gridItems.map((item) => (
        <DraggableGridItem
          key={item.instanceId}
          item={item}
          onResize={onResize}
          onRemove={onRemove}
          onDrag={onDragGridItem}
          onColumnDrop={onColumnDrop}
        />
      ))}
    </div>
  );
};
