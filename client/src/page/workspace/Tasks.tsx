import CreateTaskDialog from "@/components/workspace/task/create-task-dialog";
import TaskTable from "@/components/workspace/task/task-table";
import KanbanBoard from "@/components/workspace/task/kanban-board";
import TaskCalendar from "@/components/workspace/task/task-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Tasks() {
  return (
    <div className="w-full h-full flex-col space-y-8 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Tasks</h2>
          <p className="text-muted-foreground">
            Here&apos;s the list of tasks for this workspace!
          </p>
        </div>
        <CreateTaskDialog />
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="board">Kanban Board</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-0">
          <TaskTable />
        </TabsContent>
        <TabsContent value="board" className="mt-0">
          <KanbanBoard />
        </TabsContent>
        <TabsContent value="calendar" className="mt-0">
          <TaskCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
}
