import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/Cloud.js"; // adjust path

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",  // folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

export default upload;
