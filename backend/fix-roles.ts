import "dotenv/config";
import mongoose from "mongoose";
import RoleModel from "./src/models/roles-permission.model";
import { RolePermissions } from "./src/utils/role-permission";

async function fixRoles() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to DB...");

    for (const roleName in RolePermissions) {
      const permissions = RolePermissions[roleName as keyof typeof RolePermissions];
      
      const role = await RoleModel.findOne({ name: roleName });
      if (role) {
        role.permissions = permissions;
        await role.save();
        console.log(`Updated Role: ${roleName}`);
      } else {
        const newRole = new RoleModel({
          name: roleName,
          permissions: permissions
        });
        await newRole.save();
        console.log(`Created Role: ${roleName}`);
      }
    }

    console.log("ALL ROLES ARE NOW UP TO DATE!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}
fixRoles();
