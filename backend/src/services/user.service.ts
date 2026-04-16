import UserModel from "../models/user.model";
import MemberModel from "../models/member.model";
import { BadRequestException } from "../utils/appError";

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .populate("currentWorkspace")
    .select("-password");

  if (!user) {
    throw new BadRequestException("User not found");
  }

  // Fetch the user's member details for the current workspace to get their permissions
  const member = await MemberModel.findOne({
    userId: user._id,
    workspaceId: user.currentWorkspace,
  }).populate("role");

  const userWithPermissions = {
    ...user.toObject(),
    role: member?.role || null,
  };

  return {
    user: userWithPermissions,
  };
};
