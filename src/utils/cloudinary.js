// Function to upload images and videos to Cloudinary
// Supports both signed (secure) and unsigned uploads

export const uploadToCloudinary = async (file, fileType = 'image') => {
  const API_URL = 'https://anjali-tent-backend.onrender.com';
  
  try {
    // 1. Get signed signature from our backend
    const sigResponse = await fetch(`${API_URL}/cloudinary-signature`);
    if (!sigResponse.ok) {
      throw new Error('Failed to get upload signature from backend');
    }
    const { signature, timestamp, api_key, cloud_name } = await sigResponse.json();

    // 2. Prepare upload to Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/${fileType}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
    }

    const data = await response.json();
    return data; // returns the entire response (e.g., data.secure_url, data.public_id)
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    
    // Fallback to environment variables if backend fails (unsigned upload)
    console.log("Attempting fallback to unsigned upload...");
    const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
    
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(`Cloudinary upload failed: ${error.message}. Also, unsigned credentials missing.`);
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${fileType}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(url, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Unsigned upload also failed');
    return await response.json();
  }
};
