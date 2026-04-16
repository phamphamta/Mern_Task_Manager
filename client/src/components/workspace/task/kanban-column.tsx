import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskType } from "@/types/api.type";
import { TaskStatusEnumType } from "@/constant";
import { KanbanItem } from "./kanban-item";

type KanbanColumnProps = {
  column: { id: TaskStatusEnumType; title: string };
  tasks: TaskType[];
};

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div className="flex flex-col bg-slate-100 dark:bg-slate-900 rounded-lg w-[300px] min-w-[300px] h-full overflow-hidden">
      <div className="p-3 border-b flex items-center justify-between font-semibold">
        <span>{column.title}</span>
        <span className="bg-slate-200 dark:bg-slate-800 text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div 
        ref={setNodeRef} 
        className={`flex-1 p-2 overflow-y-auto scrollbar transition-colors ${
          isOver ? 'bg-slate-200 dark:bg-slate-800' : ''
        }`}
      >
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 min-h-[100px]">
            {tasks.map((task) => (
              <KanbanItem key={task._id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
