import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Package,
  MapPin,
  Calendar,
  Upload,
  FileText,
  ArrowLeft,
  Loader,
  Save,
  Plus,
  Trash2,
  X,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";

const AddFoundItem = () => {
  // Cloudinary config from env vars
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});

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
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Detail fields management
  const addDetailField = () => {
    setDetailFields([...detailFields, { key: "", value: "", isPublic: true }]);
  };

  const removeDetailField = (index) => {
    if (detailFields.length > 1) {
      const updated = detailFields.filter((_, i) => i !== index);
      setDetailFields(updated);
    }
  };

  const updateDetailField = (index, field, value) => {
    const updated = [...detailFields];
    updated[index][field] = value;
    setDetailFields(updated);
  };

  const togglePublic = (index) => {
    const updated = [...detailFields];
    updated[index].isPublic = !updated[index].isPublic;
    setDetailFields(updated);
  };

  // Image handling
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Validate file sizes
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: `${oversizedFiles.length} file(s) exceed 5MB limit`,
      }));
      return;
    }

    // Create previews
    const newPreviews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          setPreviewImages((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles((prev) => [...prev, ...files]);

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const removePreviewImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async () => {
    if (selectedFiles.length === 0) return [];

    setUploadingImages(true);
    const uploadedUrls = [];

    try {
      for (const file of selectedFiles) {
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

      return uploadedUrls;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to upload images to cloud storage");
    } finally {
      setUploadingImages(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.item_type.trim()) {
      newErrors.item_type = "Item type is required";
    }

    if (!formData.date_found) {
      newErrors.date_found = "Date found is required";
    }

    if (!formData.location_found.trim()) {
      newErrors.location_found = "Location is required";
    }

    // Validate detail fields
    const hasValidFields = detailFields.some(
      (field) => field.key.trim() && field.value.trim()
    );

    if (!hasValidFields) {
      newErrors.details =
        "At least one detail field with key and value is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("You must be logged in to add items");
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields", { autoClose: 5000 });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images first
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        toast.info("Uploading images...", { autoClose: 3000 });
        imageUrls = await uploadImagesToCloudinary();
      }

      // Separate fields into hidden and public details
      const hidden_details = {};
      const public_details = {};

      detailFields.forEach((field) => {
        if (field.key.trim() && field.value.trim()) {
          if (field.isPublic) {
            public_details[field.key.trim()] = field.value.trim();
          } else {
            hidden_details[field.key.trim()] = field.value.trim();
          }
        }
      });

      // Prepare payload
      const payload = {
        item_type: formData.item_type.trim(),
        date_found: new Date(formData.date_found).toISOString(),
        location_found: formData.location_found.trim(),
        hidden_details,
        public_details,
        image_urls: imageUrls,
      };

      const response = await api.post("/staff/found-items", payload);

      if (response.status === 201 || response.status === 200) {
        toast.success("Found item added successfully! 🎉", { autoClose: 5000 });
        setTimeout(() => {
          navigate("/manage-items");
        }, 2500);
      }
    } catch (error) {
      console.error("Error adding found item:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add found item. Please try again.";
      toast.error(errorMessage, { autoClose: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-8 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/manage-items")}
            className="flex items-center text-emerald-400 hover:text-emerald-300 transition mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Manage Items
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Add Found Item
              </h1>
              <p className="text-slate-300">
                Record details of a found item for users to claim
              </p>
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="mb-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-200">
              <p className="font-semibold mb-1">Important Information:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Add custom fields with details about the found item</li>
                <li>
                  Toggle fields as{" "}
                  <span className="text-emerald-400 font-semibold">Public</span>{" "}
                  (visible to users) or{" "}
                  <span className="text-amber-400 font-semibold">Hidden</span>{" "}
                  (staff only)
                </li>
                <li>Upload multiple images if available (max 5MB each)</li>
                <li>
                  All marked public details will be visible to users browsing
                  items
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/50 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-emerald-400" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Item Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Item Type <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="item_type"
                      value={formData.item_type}
                      onChange={handleChange}
                      placeholder="e.g., Wallet, Phone, Keys"
                      className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border ${
                        errors.item_type ? "border-red-500" : "border-slate-600"
                      } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition`}
                    />
                  </div>
                  {errors.item_type && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.item_type}
                    </p>
                  )}
                </div>

                {/* Date Found */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Date Found <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="datetime-local"
                      name="date_found"
                      value={formData.date_found}
                      onChange={handleChange}
                      max={new Date().toISOString().slice(0, 16)}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border ${
                        errors.date_found
                          ? "border-red-500"
                          : "border-slate-600"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition`}
                    />
                  </div>
                  {errors.date_found && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.date_found}
                    </p>
                  )}
                </div>

                {/* Location Found */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Location Found <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      name="location_found"
                      value={formData.location_found}
                      onChange={handleChange}
                      placeholder="e.g., Library 2nd Floor, Main Entrance"
                      className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border ${
                        errors.location_found
                          ? "border-red-500"
                          : "border-slate-600"
                      } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition`}
                    />
                  </div>
                  {errors.location_found && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.location_found}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Detail Fields Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-emerald-400" />
                  Item Details
                </h2>
                <button
                  type="button"
                  onClick={addDetailField}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Field
                </button>
              </div>

              <div className="space-y-3">
                {detailFields.map((field, index) => (
                  <div
                    key={index}
                    className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={field.key}
                          onChange={(e) =>
                            updateDetailField(index, "key", e.target.value)
                          }
                          placeholder="Field Name (e.g., Color, Brand)"
                          className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                        />
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) =>
                            updateDetailField(index, "value", e.target.value)
                          }
                          placeholder="Field Value (e.g., Black, Samsung)"
                          className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => togglePublic(index)}
                          className={`p-2 rounded-lg transition ${
                            field.isPublic
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-amber-600 hover:bg-amber-700 text-white"
                          }`}
                          title={
                            field.isPublic
                              ? "Public (visible to users)"
                              : "Hidden (staff only)"
                          }
                        >
                          {field.isPublic ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5" />
                          )}
                        </button>

                        {detailFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDetailField(index)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-400">
                      {field.isPublic ? (
                        <span className="text-emerald-400 font-medium">
                          ● Public - Visible to users
                        </span>
                      ) : (
                        <span className="text-amber-400 font-medium">
                          ● Hidden - Staff only
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {errors.details && (
                <p className="text-red-400 text-sm mt-2">{errors.details}</p>
              )}
            </div>

            {/* Image Upload Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-emerald-400" />
                Images (Optional)
              </h2>

              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <label className="cursor-pointer">
                  <span className="text-emerald-400 hover:text-emerald-300 font-medium">
                    Click to upload
                  </span>
                  <span className="text-slate-400"> or drag and drop</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-slate-400 mt-1">
                  PNG, JPG, JPEG up to 5MB each
                </p>
              </div>

              {errors.images && (
                <p className="text-red-400 text-sm mt-2">{errors.images}</p>
              )}

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => removePreviewImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || uploadingImages}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
              >
                {isSubmitting || uploadingImages ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {uploadingImages ? "Uploading Images..." : "Adding Item..."}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Add Found Item
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/manage-items")}
                disabled={isSubmitting || uploadingImages}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFoundItem;
