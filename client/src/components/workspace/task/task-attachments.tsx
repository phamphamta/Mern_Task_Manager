import { useState } from "react";
import { UploadCloud, File, Trash, Loader } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  uploadTaskAttachmentMutationFn, 
  deleteTaskAttachmentMutationFn 
} from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { TaskType } from "@/types/api.type";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";

export function TaskAttachments({ task }: { task: TaskType }) {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: uploadFile } = useMutation({
    mutationFn: uploadTaskAttachmentMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
      toast({
        title: "Success",
        description: "File uploaded successfully",
        variant: "success",
      });
      setIsUploading(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const { mutate: deleteFile, isPending: isDeleting } = useMutation({
    mutationFn: deleteTaskAttachmentMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
      toast({
        title: "Success",
        description: "File deleted successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      uploadFile({
        workspaceId,
        projectId: task.project?._id || "",
        taskId: task._id,
        file: e.target.files[0],
      });
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-medium mb-3">Attachments</h3>
      
      <div className="flex items-center gap-2 mb-4">
        <label className="flex items-center justify-center cursor-pointer border-2 border-dashed rounded-md p-4 w-full hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          <div className="flex flex-col items-center gap-1 text-sm text-slate-500">
            {isUploading ? <Loader className="animate-spin w-5 h-5 text-primary" /> : <UploadCloud className="w-5 h-5" />}
            <span>Click to upload file</span>
          </div>
          <input type="file" className="hidden" onChange={handleFileChange} disabled={isUploading} />
        </label>
      </div>

      <div className="space-y-2">
        {task.attachments?.map((file) => (
          <div key={file.publicId} className="flex flex-row items-center justify-between border rounded p-2">
            <a href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline text-sm truncate max-w-[80%] text-blue-600">
              <File className="w-4 h-4 shrink-0 text-slate-500" />
              <span className="truncate">{file.originalName}</span>
            </a>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-red-500"
              disabled={isDeleting}
              onClick={() => deleteFile({
                workspaceId,
                projectId: task.project?._id || "",
                taskId: task._id,
                publicId: file.publicId
              })}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {(!task.attachments || task.attachments.length === 0) && (
          <p className="text-sm text-slate-400 text-center py-2">No attachments yet</p>
        )}
      </div>
    </div>
  );
}
