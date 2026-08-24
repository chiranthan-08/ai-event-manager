import { v2 as cloudinary } from 'cloudinary';

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
};

export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      folder: 'event-management',
      ...options,
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

export const generateThumbnail = async (publicId, options = {}) => {
  try {
    const url = cloudinary.url(publicId, {
      transformation: [
        { width: 300, height: 200, crop: 'fill' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
      ...options,
    });
    return url;
  } catch (error) {
    throw new Error(`Thumbnail generation failed: ${error.message}`);
  }
};

export { cloudinary };
export default configureCloudinary;
