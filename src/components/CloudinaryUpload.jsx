import { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon, Video } from 'lucide-react';
import { uploadToCloudinary } from '../utils/cloudinary';

const CloudinaryUpload = ({ onUploadSuccess, uploadType = 'image', className = "" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const data = await uploadToCloudinary(file, uploadType);
      
      // Pass the uploaded URL and full response data to the parent component
      if (onUploadSuccess) {
        onUploadSuccess(data.secure_url, data);
      }
    } catch (err) {
      setError(err.message || 'Error occurred during upload');
    } finally {
      setIsUploading(false);
      // Reset input if needed
      e.target.value = null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        id={`cloudinary-upload-${uploadType}`}
        accept={uploadType === 'image' ? 'image/*' : 'video/*'}
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />
      
      <label
        htmlFor={`cloudinary-upload-${uploadType}`}
        className={`flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-xl cursor-pointer hover:border-brand-500 hover:bg-slate-800 transition-all ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isUploading ? (
          <Loader2 size={20} className="animate-spin text-brand-500" />
        ) : uploadType === 'image' ? (
          <ImageIcon size={20} className="text-slate-400" />
        ) : (
          <Video size={20} className="text-slate-400" />
        )}
        
        <span className="text-sm font-medium text-slate-300">
          {isUploading ? 'Uploading...' : `Upload ${uploadType === 'image' ? 'Image' : 'Video'}`}
        </span>
      </label>

      {error && (
        <p className="mt-3 text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">{error}</p>
      )}
    </div>
  );
};

export default CloudinaryUpload;
