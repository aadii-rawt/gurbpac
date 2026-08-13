import { useSortable } from "@dnd-kit/sortable";
import type { BoardTask } from "../../types/task";
import TaskCard from "./TaskCard";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

const  SortableTask = React.memo(({
  task,
  onClick,
}: {
  task: BoardTask;
  onClick: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(
      transform
    ) ,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`cursor-grab ${isDragging
          ? "opacity-30"
          : ""
        }`}
    >
      <TaskCard
        task={task}
        onClick={onClick}
      />
    </div>
  );
})

export default SortableTask