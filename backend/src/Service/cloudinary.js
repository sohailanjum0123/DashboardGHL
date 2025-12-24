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

            // Decide resource_type based on file extension
    const isCsv = localFilePath.toLowerCase().endsWith(".csv");
    const resourceType = isCsv ? "raw" : "auto";

        //upload the file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType,
      folder: isCsv ? "csv_uploads" : "images_uploads", // keep things organized
      use_filename: true,
      unique_filename: false,
        })
        //file has been uploaded successfully
        console.log("file is uploaded on cloudinary",response.url)
        return response;
    } catch (error) {
        // cleanup if failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("❌ Uploading to Cloudinary error:", error);
    return null;
    }
}

export {uploadOnCloudinary}

