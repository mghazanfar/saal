import { useDrag } from "react-dnd";
import { ItemTypes } from ".";

export const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TABLE,
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        background: "#fff",
        padding: "8px",
        border: "1px solid #ccc",
        marginBottom: "8px",
        borderRadius: "4px",
      }}
    >
      {item.name}
    </div>
  );
};
