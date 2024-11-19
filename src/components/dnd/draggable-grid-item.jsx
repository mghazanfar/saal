import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ResizableBox } from "react-resizable";
import { DraggableColumn } from "./draggable-column";
import { ItemTypes } from ".";

export const DraggableGridItem = ({
  item,
  onResize,
  onRemove,
  onDrag,
  onColumnDrop,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TABLE,
    item: { ...item },
    canDrag: !isResizing,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(ref);

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.COLUMN,
    drop: (column, monitor) => {
      const offset = monitor.getClientOffset();
      onColumnDrop(column, offset, item.id); // Pass target table ID when column is dropped
    },
  }));

  drop(ref);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: item.y,
        left: item.x,
        opacity: isDragging ? 0.5 : 1,
        cursor: isResizing ? "se-resize" : "move",
      }}
    >
      <ResizableBox
        width={item.width}
        height={item.height}
        minConstraints={[200, 150]}
        maxConstraints={[500, 300]}
        onResizeStart={(e) => {
          e?.stopPropagation();
          setIsResizing(true);
        }}
        onResizeStop={(e, data) => {
          setIsResizing(false);
          onResize(item.instanceId, data.size.width, data.size.height);
        }}
        style={{ overflowY: "hidden" }}
      >
        <div className="gridItemContent">
          <h4>{item.name}</h4>
          <table className="dataTable">
            <thead>
              <tr>
                <th>Key</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {item.columns.map((col) => (
                <DraggableColumn key={col.column_id} column={col} />
              ))}
            </tbody>
          </table>
          <button
            className="removeButton"
            onClick={() => onRemove(item.instanceId)}
          >
            Remove
          </button>
        </div>
      </ResizableBox>
    </div>
  );
};
