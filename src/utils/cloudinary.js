// Function to upload mainly images and videos to Cloudinary
// To use this, you need to create an "unsigned" upload preset in your Cloudinary Dashboard
// Settings -> Upload -> Upload presets -> Add upload preset (Mode: Unsigned)

export const uploadToCloudinary = async (file, fileType = 'image') => {
  // Replace these with your actual Cloudinary cloud name and upload preset
  const CLOUD_NAME = 'dwohs6fpq';
  const UPLOAD_PRESET = "anjali_tent_upload";

  // Endpoint depends on fileType: image, video, or raw
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
    }

    const data = await response.json();
    return data; // returns the entire response (e.g., data.secure_url)
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
