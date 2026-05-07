const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadFile(buffer, folder = "uploads") {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // image, vid eo, raw
        folder: folder
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
}

module.exports = { uploadFile };
