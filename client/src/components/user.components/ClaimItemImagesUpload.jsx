import { useState } from "react";
import { Upload, X, Loader } from "lucide-react";

export function ClaimItemImagesUpload({ onImagesChange }) {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", file);
        cloudinaryFormData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: cloudinaryFormData,
          }
        );
        if (!response.ok) {
          throw new Error("Image upload failed");
        }
        const data = await response.json();
        uploadedUrls.push(data.secure_url);
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviewImages((prev) => [...prev, event.target.result]);
        };
        reader.readAsDataURL(file);
      }
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
      onImagesChange([...imageUrls, ...uploadedUrls]);
    } catch (err) {
      setError("Failed to upload images. Please try again.");
      console.error("Image upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    onImagesChange(newImageUrls);
  };

  return (
    <div className="space-y-3">
      <label className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-white/20 bg-white/5 p-4 cursor-pointer hover:border-blue-500 hover:bg-white/10 transition">
        <Upload size={20} className="text-blue-400" />
        <span className="text-xs text-gray-400">
          Click to upload images (optional)
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>
      {uploading && (
        <div className="flex items-center gap-2 text-xs text-blue-400">
          <Loader size={14} className="animate-spin" /> Uploading...
        </div>
      )}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previewImages.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={img}
                alt={`Preview ${idx + 1}`}
                className="w-full h-20 object-cover rounded-lg border border-white/10"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 rounded-full p-0.5 transition"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <div className="text-red-400 text-xs">{error}</div>}
    </div>
  );
}
