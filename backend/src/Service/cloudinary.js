import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET
});

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null;

    const isCsv = localFilePath.toLowerCase().endsWith(".csv");
    const resourceType = isCsv ? "raw" : "auto";

       const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType,
      folder: isCsv ? "csv_uploads" : "images_uploads", 
      use_filename: true,
      unique_filename: false,
        })

        console.log("file is uploaded on cloudinary",response.url)
        return response;
    } catch (error) {

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("❌ Uploading to Cloudinary error:", error);
    return null;
    }
}

export {uploadOnCloudinary}

