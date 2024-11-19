import { useState } from "react";
import { DraggableItem } from "./draggable-item";

export const SidebarSection = ({ section }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sidebarSection">
      <div className="sectionTitle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "▲ " : "▼ "} {section.title}
      </div>
      {isOpen && (
        <div className="sectionItems">
          {section.items.map((item) => (
            <DraggableItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
