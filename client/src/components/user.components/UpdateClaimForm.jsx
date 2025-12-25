import React, { useEffect, useState } from "react";
import { X, Loader, Trash2, Upload } from "lucide-react";
import api from "../../services/api";

export function UpdateClaimForm({ authToken, claim, onSuccess, onClose }) {
  const [fields, setFields] = useState([{ key: "", value: "" }]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    if (!claim) return;
    setImageUrls(claim.image_urls || []);
    if (claim.claim_details && typeof claim.claim_details === "object") {
      setFields(
        Object.entries(claim.claim_details).map(([key, value]) => ({
          key,
          value,
        }))
      );
    } else {
      setFields([{ key: "", value: "" }]);
    }
  }, [claim]);

  const addField = () => setFields([...fields, { key: "", value: "" }]);
  const removeField = (idx) => setFields(fields.filter((_, i) => i !== idx));
  const updateField = (idx, field, value) => {
    const updated = [...fields];
    updated[idx][field] = value;
    setFields(updated);
  };

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
      }
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      setError("Failed to upload images. Please try again.");
      console.error("Image upload error:", err);
    } finally {
      setUploading(false);
    }
  };
  const removeImage = (idx) =>
    setImageUrls(imageUrls.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {

      const claimDetails = Object.fromEntries(
        fields
          .filter((f) => f.key.trim())
          .map((f) => [f.key.trim(), f.value.trim()])
      );
      if (Object.keys(claimDetails).length === 0) {
        setError("Please provide at least one identifying detail.");
        setLoading(false);
        return;
      }
      const submitData = {
        claim_details: claimDetails,
        image_urls: imageUrls,
      };
      const response = await api.updateUserClaim(
        authToken,
        claim.id,
        submitData
      );
      onSuccess?.(response?.claim || null);
    } catch (err) {
      setError(err.message || "Failed to update claim. Please try again.");
      console.error("Form submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full p-6 relative border border-blue-500/30">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Edit Claim</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="space-y-2">
              {fields.map((field, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) => updateField(idx, "key", e.target.value)}
                    placeholder="Detail (e.g. Color, Serial No.)"
                    className="flex-1 rounded-lg border border-white/20 bg-white/5 px-2 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateField(idx, "value", e.target.value)}
                    placeholder="Value"
                    className="flex-1 rounded-lg border border-white/20 bg-white/5 px-2 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(idx)}
                    className="text-red-400 hover:text-red-300 transition p-1.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addField}
                className="text-blue-400 hover:text-blue-300 text-xs mt-2"
              >
                + Add Another Detail
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-white/20 bg-white/5 p-4 cursor-pointer hover:border-blue-500 hover:bg-white/10 transition">
              <Upload size={20} className="text-blue-400" />
              <span className="text-xs text-gray-400">
                Click to upload images of the claimed item
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
                <Loader size={14} className="animate-spin" />
                Uploading...
              </div>
            )}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {imageUrls.map((img, idx) => (
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
          {error && (
            <div className="text-red-400 text-xs font-semibold">{error}</div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 hover:shadow-lg hover:shadow-blue-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                "Update Claim"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
