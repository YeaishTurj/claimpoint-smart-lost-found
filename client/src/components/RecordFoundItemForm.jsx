import {
  Package,
  Upload,
  X,
  Loader,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import api from "../services/api";

export function RecordFoundItemForm({ authToken, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    item_type: "",
    date_found: "",
    location_found: "",
    image_urls: [],
  });

  const [detailFields, setDetailFields] = useState([
    { key: "", value: "", isPublic: true },
  ]);

  const [previewImages, setPreviewImages] = useState([]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
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

      setFormData((prev) => ({
        ...prev,
        image_urls: [...prev.image_urls, ...uploadedUrls],
      }));
    } catch (err) {
      setError("Failed to upload images. Please try again.");
      console.error("Image upload error:", err);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addDetail = () => {
    setDetailFields([...detailFields, { key: "", value: "", isPublic: true }]);
  };

  const removeDetail = (index) => {
    setDetailFields(detailFields.filter((_, i) => i !== index));
  };

  const updateDetail = (index, field, value) => {
    const updated = [...detailFields];
    updated[index][field] = value;
    setDetailFields(updated);
  };

  const togglePublic = (index) => {
    const updated = [...detailFields];
    updated[index].isPublic = !updated[index].isPublic;
    setDetailFields(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (
        !formData.item_type ||
        !formData.date_found ||
        !formData.location_found
      ) {
        throw new Error("Please fill in all required fields");
      }

      const public_details = {};
      const full_details = {};

      detailFields.forEach((field) => {
        if (field.key && field.value) {
          if (field.isPublic) {
            public_details[field.key] = field.value;
          } else {
            full_details[field.key] = field.value;
          }
        }
      });

      const submitData = {
        ...formData,
        public_details,
        full_details,
      };

      await api.recordFoundItem(authToken, submitData);
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to record item. Please try again.");
      console.error("Form submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-xl border border-white/10 w-full max-w-6xl shadow-2xl shadow-black/50 relative h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 p-6 border-b border-white/10">
          <Package className="text-blue-400" size={24} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
              Found Item
            </p>
            <h3 className="text-2xl font-bold text-white">Record Found Item</h3>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 text-sm text-red-400 bg-red-500/10 rounded-lg p-3 border border-red-500/30">
            ⚠ {error}
          </div>
        )}

        {/* Scrollable Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-wider">
                  Basic Information
                </h4>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-300">
                    Item Type *
                  </span>
                  <input
                    type="text"
                    value={formData.item_type}
                    onChange={(e) =>
                      setFormData({ ...formData, item_type: e.target.value })
                    }
                    placeholder="e.g., Electronics, Clothing, Bag, Wallet, Phone"
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-300">
                    Date Found *
                  </span>
                  <input
                    type="datetime-local"
                    value={formData.date_found}
                    onChange={(e) =>
                      setFormData({ ...formData, date_found: e.target.value })
                    }
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-300">
                    Location Found *
                  </span>
                  <input
                    type="text"
                    value={formData.location_found}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location_found: e.target.value,
                      })
                    }
                    placeholder="e.g., Library 2nd Floor"
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </label>
              </div>

              {/* Merged Details with Public/Private Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                      Item Details
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Toggle the eye icon to make details public or staff-only
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addDetail}
                    className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition"
                  >
                    <Plus size={14} /> Add Field
                  </button>
                </div>

                {detailFields.map((field, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) =>
                        updateDetail(index, "key", e.target.value)
                      }
                      placeholder="Field name (e.g., color, brand, description)"
                      className="w-1/3 rounded-lg border border-white/20 bg-white/5 px-2 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        updateDetail(index, "value", e.target.value)
                      }
                      placeholder="Value"
                      className="flex-1 rounded-lg border border-white/20 bg-white/5 px-2 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => togglePublic(index)}
                      className={`p-1.5 rounded-lg transition ${
                        field.isPublic
                          ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                          : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                      }`}
                      title={
                        field.isPublic
                          ? "Visible to all users (click to make staff-only)"
                          : "Visible to staff only (click to make public)"
                      }
                    >
                      {field.isPublic ? (
                        <Eye size={14} />
                      ) : (
                        <EyeOff size={14} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDetail(index)}
                      className="text-red-400 hover:text-red-300 transition p-1.5"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-wider">
                  Images
                </h4>

                <label className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-white/20 bg-white/5 p-4 cursor-pointer hover:border-blue-500 hover:bg-white/10 transition">
                  <Upload size={20} className="text-blue-400" />
                  <span className="text-xs text-gray-400">
                    Click to upload images
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImages}
                  />
                </label>

                {uploadingImages && (
                  <div className="flex items-center gap-2 text-xs text-blue-400">
                    <Loader size={14} className="animate-spin" />
                    Uploading...
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
              </div>
            </div>
          </div>

          {/* Footer with Buttons */}
          <div className="flex gap-3 p-6 border-t border-white/10">
            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 hover:shadow-lg hover:shadow-blue-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Recording...
                </>
              ) : (
                "Record Item"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:bg-white/10 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
