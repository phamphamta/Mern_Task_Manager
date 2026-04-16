import "dotenv/config";
import mongoose from "mongoose";
import WorkspaceModel from "./src/models/workspace.model";
import UserModel from "./src/models/user.model";

async function check() {
  await mongoose.connect(process.env.MONGO_URI!);
  const workspaceId = "69e13cb5e0858060104d670f";
  const workspace = await WorkspaceModel.findById(workspaceId);
  console.log("Workspace:", workspace);
  const users = await UserModel.find({});
  console.log("Users Count:", users.length);
  process.exit(0);
}
check();
