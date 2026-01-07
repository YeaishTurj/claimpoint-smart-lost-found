import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import {
  FileText,
  Upload,
  AlertCircle,
  Save,
  ArrowLeft,
  Package,
  CheckCircle2,
  Plus,
  Trash2,
  X,
  Loader,
  Info,
} from "lucide-react";

const ClaimItemPage = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});

  const [fields, setFields] = useState([{ key: "", value: "" }]);

  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Login Required</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            You must be logged in to submit a claim for a found item.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const addField = () => setFields([{ key: "", value: "" }, ...fields]);
  const removeField = (index) =>
    setFields((prev) => prev.filter((_, i) => i !== index));
  const updateField = (index, field, value) => {
    const updated = [...fields];
    updated[index][field] = value;
    setFields(updated);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: `${oversizedFiles.length} file(s) exceed 5MB limit`,
      }));
      return;
    }

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
    if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
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
          { method: "POST", body: cloudinaryFormData }
        );
        if (!response.ok) throw new Error("Image upload failed");
        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      }
      return uploadedUrls;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const hasValidFields = fields.some((f) => f.key.trim() && f.value.trim());
    if (!hasValidFields) newErrors.details = "Add at least one proof attribute";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please check the form for errors");
      return;
    }
    setIsSubmitting(true);
    try {
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImagesToCloudinary();
      }
      const user_provided_proof = {};
      fields.forEach((f) => {
        if (f.key.trim() && f.value.trim()) {
          user_provided_proof[f.key.trim()] = f.value.trim();
        }
      });
      const payload = {
        user_provided_proof,
        image_urls: imageUrls,
      };
      const response = await api.post(`/user/claims/${itemId}`, payload);
      if (response.status === 201 || response.status === 200) {
        toast.success("Claim submitted successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => navigate("/found-items"), 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit claim");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-6"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Package size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Submit Claim
              </h1>
              <p className="text-slate-400 mt-1">
                Provide attributes and evidence to verify ownership.
              </p>
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="mb-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-l-4 border-emerald-500 px-6 py-4 rounded-r-xl">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-emerald-400 mt-0.5 flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-100 text-sm mb-1">
                Claim Verification Process
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Be prepared to answer security questions to verify ownership.
                Use clear photos and precise attributes for faster verification.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content: Proof Fields */}
          <div className="lg:col-span-8 space-y-6">
            <form id="claim-item-form" onSubmit={handleSubmit}>
              {/* Card: Proof Attributes */}
              <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Info className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      Proof Attributes
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={addField}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold border border-emerald-500/20 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Add Field
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                    <div className="col-span-5">Attribute Name</div>
                    <div className="col-span-7">Value</div>
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start p-4 bg-slate-950/50 border border-white/10 rounded-xl hover:border-emerald-500/30 transition-all backdrop-blur-sm"
                    >
                      {/* Key Input */}
                      <div className="md:col-span-5">
                        <label className="md:hidden text-xs font-semibold text-slate-400 mb-2 block">
                          Name
                        </label>
                        <input
                          type="text"
                          value={field.key}
                          onChange={(e) =>
                            updateField(index, "key", e.target.value)
                          }
                          placeholder="Color, Brand, etc."
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                      </div>

                      {/* Value Input */}
                      <div className="md:col-span-7 flex items-start gap-2">
                        <div className="flex-1">
                          <label className="md:hidden text-xs font-semibold text-slate-400 mb-2 block">
                            Value
                          </label>
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) =>
                              updateField(index, "value", e.target.value)
                            }
                            placeholder="Red, Nike, etc."
                            className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                          />
                        </div>

                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeField(index)}
                            className="mt-0 md:mt-0 p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all active:scale-95 border border-white/10 hover:border-red-500/30"
                            title="Remove field"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {errors.details && (
                    <div className="flex items-center gap-2 text-sm text-red-400 mt-3 px-1">
                      <AlertCircle size={16} />
                      {errors.details}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar: Evidence & Actions */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 h-fit">
            {/* Image Upload */}
            <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" /> Evidence Photos
              </h3>

              <div className="relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <div className="border-2 border-dashed border-white/20 bg-slate-950/50 rounded-xl p-8 text-center transition-all group-hover:border-emerald-500/50 group-hover:bg-slate-900/50 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200">
                    Click to upload
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </div>

              {errors.images && (
                <p className="text-red-400 text-xs mt-3 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.images}
                </p>
              )}

              {/* Minimalist Image Grid */}
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {previewImages.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden group border border-white/10"
                    >
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={() => removePreviewImage(index)}
                          className="text-white hover:text-red-400 p-2 bg-slate-900/80 rounded-lg transition-all active:scale-95"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle size={14} className="text-emerald-400" />{" "}
                Guidelines
              </h4>
              <ul className="space-y-2.5">
                <li className="text-xs text-slate-400 flex items-start gap-2">
                  <CheckCircle2
                    size={14}
                    className="mt-0.5 text-emerald-400 flex-shrink-0"
                  />
                  <span>
                    Provide specific details like serial numbers, unique marks,
                    or purchase receipts.
                  </span>
                </li>
                <li className="text-xs text-slate-400 flex items-start gap-2">
                  <CheckCircle2
                    size={14}
                    className="mt-0.5 text-emerald-400 flex-shrink-0"
                  />
                  <span>
                    Clear photos increase claim verification speed by 40%.
                  </span>
                </li>
              </ul>
            </div>

            {/* Primary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate("/found-items")}
                className="col-span-1 py-3 px-4 bg-transparent border border-white/20 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all active:scale-95"
                disabled={isSubmitting || uploadingImages}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="claim-item-form"
                disabled={isSubmitting || uploadingImages}
                className="col-span-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting || uploadingImages ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Submit Claim</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimItemPage;
