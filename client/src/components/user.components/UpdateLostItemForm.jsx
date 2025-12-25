import { AlertCircle, Upload, X, Loader, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";

export function UpdateLostItemForm({ authToken, report, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    item_type: "",
    date_lost: "",
    location_lost: "",
    image_urls: [],
  });

  const [reportDetails, setReportDetails] = useState([{ key: "", value: "" }]);
  const [previewImages, setPreviewImages] = useState([]);

  const toLocalDateTimeInput = (value) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (!report) return;
    const detailEntries =
      report.report_details && typeof report.report_details === "object"
        ? Object.entries(report.report_details)
        : [];
    setFormData({
      item_type: report.item_type || "",
      date_lost: report.date_lost ? toLocalDateTimeInput(report.date_lost) : "",
      location_lost: report.location_lost || "",
      image_urls: report.image_urls || [],
    });
    setReportDetails(
      detailEntries.length
        ? detailEntries.map(([key, value]) => ({ key, value }))
        : [{ key: "", value: "" }]
    );
    setPreviewImages(report.image_urls || []);
  }, [report]);

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

  const addDetailField = () => {
    setReportDetails([...reportDetails, { key: "", value: "" }]);
  };

  const removeDetailField = (index) => {
    setReportDetails(reportDetails.filter((_, i) => i !== index));
  };

  const updateDetailField = (index, field, value) => {
    const updated = [...reportDetails];
    updated[index][field] = value;
    setReportDetails(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (
        !formData.item_type ||
        !formData.date_lost ||
        !formData.location_lost
      ) {
        throw new Error("Please fill in all required fields");
      }
      const dateLostISO = new Date(formData.date_lost).toISOString();
      const report_details = {};
      reportDetails.forEach((field) => {
        if (field.key && field.value) {
          report_details[field.key] = field.value;
        }
      });
      const submitData = {
        item_type: formData.item_type,
        report_details,
        date_lost: dateLostISO,
        location_lost: formData.location_lost,
        image_urls: formData.image_urls,
      };
      const response = await api.updateUserLostReport(
        authToken,
        report.id,
        submitData
      );
      onSuccess?.(response?.report || null);
    } catch (err) {
      setError(
        err.message || "Failed to update lost report. Please try again."
      );
      console.error("Form submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-white/10 w-full max-w-4xl mx-auto shadow-2xl shadow-black/50 relative mt-8 mb-12 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-6 border-b border-white/10">
        <AlertCircle className="text-blue-400" size={24} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
            Update Lost Item
          </p>
          <h3 className="text-2xl font-bold text-white">Update Lost Report</h3>
        </div>
      </div>
      {error && (
        <div className="mx-6 mt-4 text-sm text-red-400 bg-red-500/10 rounded-lg p-3 border border-red-500/30">
          ⚠ {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 px-6 py-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
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
                    placeholder="e.g., Electronics, Clothing, Bag, Wallet, Document"
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-300">
                    Date Lost *
                  </span>
                  <input
                    type="datetime-local"
                    value={formData.date_lost}
                    onChange={(e) =>
                      setFormData({ ...formData, date_lost: e.target.value })
                    }
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-300">
                    Location Lost *
                  </span>
                  <input
                    type="text"
                    value={formData.location_lost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location_lost: e.target.value,
                      })
                    }
                    placeholder="e.g., Airport Terminal 2, Gate 5"
                    className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </label>
              </div>
              {/* Report Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-orange-300 uppercase tracking-wider">
                      Item Details
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Describe distinguishing features to help recovery
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addDetailField}
                    className="text-xs text-orange-400 hover:text-orange-300 transition px-2 py-1 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20"
                  >
                    + Add Field
                  </button>
                </div>
                {reportDetails.map((field, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) =>
                        updateDetailField(index, "key", e.target.value)
                      }
                      placeholder="e.g., brand, color, serial number"
                      className="w-1/3 rounded-lg border border-white/20 bg-white/5 px-2 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        updateDetailField(index, "value", e.target.value)
                      }
                      placeholder="Value"
                      className="flex-1 rounded-lg border border-white/20 bg-white/5 px-2 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeDetailField(index)}
                      className="text-red-400 hover:text-red-300 transition p-1.5"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Image Upload */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-wider">
                Images (Optional)
              </h4>
              <label className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-white/20 bg-white/5 p-4 cursor-pointer hover:border-blue-500 hover:bg-white/10 transition">
                <Upload size={20} className="text-blue-400" />
                <span className="text-xs text-gray-400">
                  Click to upload images of the lost item
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
            className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 hover:shadow-lg hover:shadow-blue-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update Lost Report"
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-blue-500/30 px-4 py-2.5 text-sm font-semibold text-blue-300 hover:bg-blue-500/10 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
