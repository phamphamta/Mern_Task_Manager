import { Request } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const CloudinaryStorage = require("multer-storage-cloudinary");
import { config } from "./app.config";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const storage = CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    // Determine resource_type based on mimetype
    // Cloudinary uses "image", "video", or "raw" (for documents/zips)
    let resource_type = "auto";
    if (
      file.mimetype.includes("pdf") ||
      file.mimetype.includes("msword") ||
      file.mimetype.includes("wordprocessingml") ||
      file.mimetype.includes("zip") ||
      file.mimetype.includes("rar") ||
      file.mimetype.includes("csv") ||
      file.mimetype.includes("plain")
    ) {
      resource_type = "raw";
    }

    return {
      folder: "task_attachments",
      resource_type: resource_type,
      public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9]/g, "_")}`,
    };
  },
});

export const upload = multer({ storage });
export { cloudinary };
