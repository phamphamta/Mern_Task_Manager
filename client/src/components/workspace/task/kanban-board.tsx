import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { getAllTasksQueryFn, editTaskMutationFn } from "@/lib/api";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { TaskType } from "@/types/api.type";
import { TaskStatusEnumType } from "@/constant";
import { KanbanColumn } from "./kanban-column";
import { KanbanItem } from "./kanban-item";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Column = {
  id: TaskStatusEnumType;
  title: string;
};

const COLUMNS: Column[] = [
  { id: "BACKLOG", title: "Backlog" },
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "IN_REVIEW", title: "Review" },
  { id: "DONE", title: "Done" },
];

export default function KanbanBoard() {
  const param = useParams();
  // projectId may come from URL (project page) or from individual task's project field
  const urlProjectId = param.projectId as string | undefined;
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();

  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["all-tasks", workspaceId, "kanban", urlProjectId],
    queryFn: () =>
      getAllTasksQueryFn({
        workspaceId,
        projectId: urlProjectId,
        pageSize: 100,
        pageNumber: 1,
      }),
  });

  useEffect(() => {
    if (data?.tasks) {
      setTasks(data.tasks);
    }
  }, [data]);

  const { mutate: updateTaskStatus } = useMutation({
    mutationFn: editTaskMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
      toast({ title: "Success", description: "Task status updated", variant: "success" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update task status", variant: "destructive" });
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the task
    const activeTask = tasks.find(t => t._id === activeId);
    if (!activeTask) return;

    // Determine new status (over can be another task or a column)
    let newStatus: TaskStatusEnumType | null = null;
    if (COLUMNS.some(c => c.id === overId)) {
      newStatus = overId as TaskStatusEnumType;
    } else {
      const overTask = tasks.find(t => t._id === overId);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus && newStatus !== activeTask.status) {
      // Determine the projectId: prefer URL param, then fall back to task's project field
      const taskProjectId = urlProjectId || activeTask.project?._id || "";

      if (!taskProjectId) {
        toast({ title: "Error", description: "Cannot determine project for this task", variant: "destructive" });
        return;
      }

      // Optimistic update
      setTasks(prev =>
        prev.map(t => t._id === activeId ? { ...t, status: newStatus as TaskStatusEnumType } : t)
      );

      // API call
      updateTaskStatus({
        workspaceId,
        projectId: taskProjectId,
        taskId: activeId,
        data: { status: newStatus }
      });
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader className="animate-spin w-8 h-8" /></div>;

  return (
    <div className="flex gap-4 overflow-x-auto h-[calc(100vh-220px)] pb-4 scrollbar">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {COLUMNS.map((col) => (
          <KanbanColumn 
            key={col.id} 
            column={col} 
            tasks={tasks.filter(t => t.status === col.id)} 
          />
        ))}

        <DragOverlay>
          {activeId ? (
            <KanbanItem task={tasks.find(t => t._id === activeId)!} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
