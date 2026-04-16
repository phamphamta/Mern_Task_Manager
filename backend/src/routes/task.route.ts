import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
  uploadTaskAttachmentController,
  deleteTaskAttachmentController
} from "../controllers/task.controller";
import { upload } from "../config/cloudinary.config";

const taskRoutes = Router();

taskRoutes.post(
  "/project/:projectId/workspace/:workspaceId/create",
  createTaskController
);

taskRoutes.delete("/:id/workspace/:workspaceId/delete", deleteTaskController);

taskRoutes.put(
  "/:id/project/:projectId/workspace/:workspaceId/update",
  updateTaskController
);

taskRoutes.post(
  "/:id/project/:projectId/workspace/:workspaceId/upload",
  upload.single("file"),
  uploadTaskAttachmentController
);

taskRoutes.delete(
  "/:id/project/:projectId/workspace/:workspaceId/attachment/:publicId/delete",
  deleteTaskAttachmentController
);

taskRoutes.get("/workspace/:workspaceId/all", getAllTasksController);

taskRoutes.get(
  "/:id/project/:projectId/workspace/:workspaceId",
  getTaskByIdController
);

export default taskRoutes;
