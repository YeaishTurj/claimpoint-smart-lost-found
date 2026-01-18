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
import { PageShell } from "../components/layout";
import { AccessCard } from "../components/ui";

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
    return <AccessCard />;
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
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        );
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          { method: "POST", body: cloudinaryFormData },
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
        setTimeout(() => navigate("/my-dashboard?tab=claims"), 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit claim");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto pt-15">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-400 transition-all mb-10"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          System Portal
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Form Content */}
          <div className="lg:col-span-8 space-y-8">
            <header>
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                Submit <span className="text-emerald-500">Claim.</span>
              </h1>
              <p className="text-slate-400 font-medium">
                Provide attributes and evidence to verify ownership.
              </p>
            </header>

            {/* Info Banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-6 flex items-start gap-4">
              <AlertCircle
                size={20}
                className="text-emerald-400 mt-1 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-black text-emerald-400 uppercase tracking-widest">
                  Verification Process
                </p>
                <p className="text-sm text-slate-300 mt-1">
                  Be prepared to answer security questions to verify ownership.
                  Use clear photos and precise attributes for faster
                  verification.
                </p>
              </div>
            </div>

            <form
              id="claim-item-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Card: Proof Attributes */}
              <div className="bg-[#0b1120] border border-slate-800 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Info size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Proof Attributes
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addField}
                    className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Plus size={12} /> Add Field
                  </button>
                </div>

                <div className="p-8 space-y-4">
                  {fields.map((field, index) => (
                    <div key={index} className="flex gap-4 group">
                      <input
                        type="text"
                        value={field.key}
                        onChange={(e) =>
                          updateField(index, "key", e.target.value)
                        }
                        placeholder="Attribute (e.g. Serial)"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-400 focus:border-emerald-500 focus:outline-none transition-all"
                      />
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) =>
                          updateField(index, "value", e.target.value)
                        }
                        placeholder="Value"
                        className="flex-[2] bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-emerald-500 focus:outline-none transition-all"
                      />
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="p-3 text-slate-600 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}

                  {errors.details && (
                    <div className="flex items-center gap-2 text-[9px] text-rose-500 mt-3 px-1">
                      <AlertCircle size={14} />
                      {errors.details}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Right: Media & Actions Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0b1120] border border-slate-800 rounded-[2.5rem] p-8 space-y-6 lg:sticky lg:top-10">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Upload size={14} className="text-emerald-500" /> Evidence
                Photos
              </h3>

              <div className="relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-slate-800 bg-slate-950 rounded-[2rem] p-8 text-center group-hover:border-emerald-500/50 transition-all">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-500">
                    <Upload size={20} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Drop Evidence Photos
                  </p>
                </div>
              </div>

              {errors.images && (
                <p className="text-[9px] text-rose-500 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.images}
                </p>
              )}

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">
                    Attached Evidence
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {previewImages.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 group"
                      >
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePreviewImage(index)}
                          className="absolute top-1 right-1 bg-rose-500 p-1 rounded text-white hover:bg-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guidelines */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  Submission Guidelines
                </p>
                <ul className="space-y-2">
                  <li className="text-[10px] text-slate-400 flex items-start gap-2">
                    <CheckCircle2
                      size={12}
                      className="text-emerald-500 mt-0.5 flex-shrink-0"
                    />
                    Provide specific details like serial numbers or receipts
                  </li>
                  <li className="text-[10px] text-slate-400 flex items-start gap-2">
                    <CheckCircle2
                      size={12}
                      className="text-emerald-500 mt-0.5 flex-shrink-0"
                    />
                    Clear photos increase verification speed
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  form="claim-item-form"
                  disabled={isSubmitting || uploadingImages}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                  {isSubmitting || uploadingImages ? (
                    <Loader className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  Submit Claim
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full px-6 py-3 bg-slate-900 text-slate-300 text-xs font-black uppercase tracking-widest rounded-2xl hover:text-white transition-all border border-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ClaimItemPage;
