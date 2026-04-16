import "dotenv/config";
import mongoose from "mongoose";
import WorkspaceModel from "./src/models/workspace.model";
import MemberModel from "./src/models/member.model";
import RoleModel from "./src/models/roles-permission.model";

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const workspaceId = "69e13cb5e0858060104d670f";
    
    const workspace = await WorkspaceModel.findById(workspaceId);
    console.log("Workspace:", workspace?.name);

    const members = await MemberModel.find({ workspaceId }).populate("role");
    console.log("Members in this workspace:");
    members.forEach((m: any) => {
      console.log(`- UserID: ${m.userId}, Role: ${m.role?.name}`);
      console.log(`  Permissions: ${m.role?.permissions}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();
