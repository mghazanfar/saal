import { useDrag } from "react-dnd";
import { ItemTypes } from ".";

export const DraggableColumn = ({ column }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COLUMN,
    item: column,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <tr ref={drag} style={{ cursor: "grab", opacity: isDragging ? 0.5 : 1 }}>
      <td>{column.name}</td>
      <td>{column.column_data_type}</td>
    </tr>
  );
};
