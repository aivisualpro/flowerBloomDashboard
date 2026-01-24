import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

export const uploadToCloudinary = async (file: File | Blob): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'dashboard-uploads' },
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result.secure_url);
        reject(new Error('Unknown upload error'));
      }
    ).end(buffer);
  });
};
