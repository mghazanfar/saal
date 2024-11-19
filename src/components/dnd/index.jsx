import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./Container.css";
import { tables } from "../../constants";
import { SidebarSection } from "./sidebar-section";
import { GridArea } from "./grid-area";

export const ItemTypes = {
  TABLE: "table",
  COLUMN: "column",
};

// Container Component
export const Container = () => {
  const [gridItems, setGridItems] = useState([]);
  const [connections, setConnections] = useState([]);

  const handleDrop = (item, offset) => {
    setGridItems((prevItems) => {
      const isRepositioning = prevItems.some(
        (gridItem) => gridItem.instanceId === item.instanceId
      );

      if (isRepositioning) {
        return prevItems.map((gridItem) =>
          gridItem.instanceId === item.instanceId
            ? { ...gridItem, x: offset.x - 450, y: offset.y }
            : gridItem
        );
      }

      const isDuplicate = prevItems.some((gridItem) => gridItem.id === item.id);
      if (isDuplicate) {
        alert(`${item.name} is already added!`);
        return prevItems;
      }

      const newInstance = {
        ...item,
        instanceId: `${item.id}_${Date.now()}`,
        x: offset ? offset.x : 50,
        y: offset ? offset.y : 50,
        width: 300,
        height: 250,
      };

      return [...prevItems, newInstance];
    });
  };

  const handleColumnDrop = (column, offset, targetTableId) => {
    const fromTable = column.tableId; // Source table ID
    const toTable = targetTableId; // Target table ID where the column is dropped

    const updatedGridItems = gridItems.map((table) => {
      if (table.id === fromTable) {
        const updatedColumns = table.columns.filter(
          (col) => col.column_id !== column.column_id
        );
        return { ...table, columns: updatedColumns };
      }
      return table;
    });

    // Add the column to the target table
    const updatedGridItemsWithColumn = updatedGridItems.map((table) => {
      if (table.id === toTable) {
        return {
          ...table,
          columns: [...table.columns, column], // Add the dropped column
        };
      }
      return table;
    });

    setGridItems(updatedGridItemsWithColumn);

    // Create a connection line from source to target
    const sourceTable = gridItems.find((item) => item.id === fromTable);
    const targetTable = gridItems.find((item) => item.id === toTable);

    if (sourceTable && targetTable) {
      const newConnection = {
        fromTable,
        toTable,
        start: {
          x: sourceTable.x + sourceTable.width / 2,
          y: sourceTable.y + sourceTable.height / 2,
        },
        end: {
          x: targetTable.x + targetTable.width / 2,
          y: targetTable.y + targetTable.height / 2,
        },
      };

      setConnections((prev) => [...prev, newConnection]);
    }
  };

  const handleResize = (instanceId, width, height) => {
    setGridItems((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId ? { ...item, width, height } : item
      )
    );
  };

  const handleRemove = (instanceId) => {
    setGridItems((prev) =>
      prev.filter((item) => item.instanceId !== instanceId)
    );
    setConnections((prev) =>
      prev.filter(
        (conn) => conn.fromTable !== instanceId && conn.toTable !== instanceId
      )
    );
  };

  const handleDragGridItem = (instanceId, x, y) => {
    setGridItems((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId ? { ...item, x, y } : item
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="Container">
        <div className="sidebar">
          <h3>Tables</h3>
          {tables.map((section) => (
            <SidebarSection key={section.id} section={section} />
          ))}
        </div>
        <GridArea
          gridItems={gridItems}
          onDrop={handleDrop}
          onResize={handleResize}
          onRemove={handleRemove}
          onDragGridItem={handleDragGridItem}
          onColumnDrop={handleColumnDrop}
          connections={connections}
        />
      </div>
    </DndProvider>
  );
};
