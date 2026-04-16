import { useState } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskType } from "@/types/api.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";
import { CalendarIcon, Paperclip, Edit } from "lucide-react";
import EditTaskDialog from "./edit-task-dialog";
import { Button } from "@/components/ui/button";

type KanbanItemProps = {
  task: TaskType;
  isOverlay?: boolean;
};

export function KanbanItem({ task, isOverlay }: KanbanItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const name = task.assignedTo?.name || "Unassigned";
  const initials = getAvatarFallbackText(name);
  const avatarColor = getAvatarColor(name);

  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="bg-primary/20 border-2 border-primary border-dashed rounded-md h-[120px] opacity-50" 
      />
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-white dark:bg-slate-950 p-3 rounded-md shadow-sm border border-border cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors group relative ${
          isOverlay ? 'rotate-2 shadow-lg scale-105' : ''
        }`}
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onPointerDown={e => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditOpen(true)}>
            <Edit className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex gap-1 mb-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm 
            ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 
              task.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 
              'bg-green-100 text-green-700'}`}
          >
            {task.priority}
          </span>
        </div>

        <h4 className="font-medium text-sm mb-1 leading-tight">{task.title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
              {task.dueDate && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  {format(new Date(task.dueDate), "MMM d")}
                </div>
              )}
              {task.attachments && task.attachments.length > 0 && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Paperclip className="w-3 h-3 mr-1" />
                  {task.attachments.length}
                </div>
              )}
          </div>
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignedTo?.profilePicture || ""} alt={name} />
            <AvatarFallback className={`text-[10px] ${avatarColor}`}>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <EditTaskDialog task={task} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </>
  );
}
