require('dotenv').config();
const mongoose = require('mongoose');

// Định nghĩa sơ bộ bộ quyền chuẩn
const RolePermissions = {
  OWNER: [
    "CREATE_WORKSPACE", "EDIT_WORKSPACE", "DELETE_WORKSPACE", "MANAGE_WORKSPACE_SETTINGS",
    "ADD_MEMBER", "CHANGE_MEMBER_ROLE", "REMOVE_MEMBER",
    "CREATE_PROJECT", "EDIT_PROJECT", "DELETE_PROJECT",
    "CREATE_TASK", "EDIT_TASK", "DELETE_TASK", "VIEW_ONLY"
  ],
  ADMIN: [
    "ADD_MEMBER", "CREATE_PROJECT", "EDIT_PROJECT", "DELETE_PROJECT",
    "CREATE_TASK", "EDIT_TASK", "DELETE_TASK", "MANAGE_WORKSPACE_SETTINGS", "VIEW_ONLY"
  ],
  MEMBER: ["VIEW_ONLY", "CREATE_TASK", "EDIT_TASK"]
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("--- KẾT NỐI DATABASE THÀNH CÔNG ---");

    // 1. Cập nhật các Role
    const Role = mongoose.model('Role', new mongoose.Schema({
      name: String,
      permissions: [String]
    }), 'roles');

    for (const [name, perms] of Object.entries(RolePermissions)) {
      await Role.findOneAndUpdate({ name: name }, { permissions: perms }, { upsert: true });
      console.log(`=> Đã cập nhật quyền cho Role: ${name}`);
    }

    // 2. Kiểm tra tài khoản hiện tại (ví dụ lấy tài khoản đầu tiên hoặc theo email nếu bạn cung cấp)
    const User = mongoose.model('User', new mongoose.Schema({ email: String, currentWorkspace: mongoose.Schema.Types.ObjectId }), 'users');
    const Member = mongoose.model('Member', new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, workspaceId: mongoose.Schema.Types.ObjectId, role: mongoose.Schema.Types.ObjectId }), 'members');

    const firstUser = await User.findOne().sort({ createdAt: -1 }); // Lấy user mới nhất
    if (firstUser) {
      console.log(`--- KIỂM TRA USER: ${firstUser.email} ---`);
      const membership = await Member.findOne({ userId: firstUser._id, workspaceId: firstUser.currentWorkspace }).populate('role');
      if (membership) {
        console.log(`- Bạn đang ở Workspace: ${membership.workspaceId}`);
        // Do model chưa load hết nên ta xem raw
        const rawRole = await Role.findById(membership.role);
        console.log(`- Quyền hiện tại: ${rawRole ? rawRole.name : 'N/A'}`);
        console.log(`- Danh sách Permissions:`, rawRole ? rawRole.permissions : []);
      }
    }

    console.log("--- TẤT CẢ ĐÃ ĐƯỢC XỬ LÝ XONG ---");
  } catch (err) {
    console.error("LỖI:", err.message);
  } finally {
    mongoose.connection.close();
  }
}

run();
