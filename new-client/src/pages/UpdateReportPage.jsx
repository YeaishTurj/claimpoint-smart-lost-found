import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
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
  AlertCircle,
  Info,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";

const UpdateReportPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    item_type: "",
    date_lost: "",
    location_lost: "",
    status: "OPEN",
  });

  const [proofFields, setProofFields] = useState([{ key: "", value: "" }]);

  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/user/lost-reports/${id}`);
        const report = res.data.lostReport;
        if (!report) throw new Error("Report not found");
        setFormData({
          item_type: report.item_type || "",
          date_lost: report.date_lost ? formatForInput(report.date_lost) : "",
          location_lost: report.location_lost || "",
          status: report.status || "OPEN",
        });
        setExistingImages(
          Array.isArray(report.image_urls) ? report.image_urls : []
        );
        const details = report.report_details || {};
        const fields = Object.entries(details).map(([key, value]) => ({
          key,
          value: String(value),
        }));
        setProofFields(fields.length > 0 ? fields : [{ key: "", value: "" }]);
      } catch (error) {
        console.error("Failed to load lost report", error);
        toast.error(error.response?.data?.message || "Failed to load report");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [id, navigate]);

  if (!isAuthenticated || user?.role !== "USER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={36} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Authentication Required
          </h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            You must be logged in as a regular user to update a lost report.
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

  const formatForInput = (iso) => {
    try {
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, "0");
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mi = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    } catch {
      return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addProofField = () =>
    setProofFields([{ key: "", value: "" }, ...proofFields]);

  const removeProofField = (index) => {
    if (proofFields.length > 1) {
      const updated = proofFields.filter((_, i) => i !== index);
      setProofFields(updated);
    }
  };

  const updateProofField = (index, field, value) => {
    const updated = [...proofFields];
    updated[index][field] = value;
    setProofFields(updated);
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

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
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
    if (!formData.item_type.trim())
      newErrors.item_type = "Item type is required";
    if (!formData.date_lost) newErrors.date_lost = "Date lost is required";
    if (!formData.location_lost.trim())
      newErrors.location_lost = "Location is required";
    const hasValidFields = proofFields.some(
      (field) => field.key.trim() && field.value.trim()
    );
    if (!hasValidFields)
      newErrors.details = "At least one detail attribute is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("You must be logged in");
      navigate("/login");
      return;
    }
    if (formData.status !== "OPEN") {
      toast.error("Cannot edit a report that is matched or resolved.");
      return;
    }
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

      const report_details = {};
      proofFields.forEach((field) => {
        if (field.key.trim() && field.value.trim()) {
          report_details[field.key.trim()] = field.value.trim();
        }
      });

      const payload = {
        item_type: formData.item_type.trim(),
        date_lost: new Date(formData.date_lost).toISOString(),
        location_lost: formData.location_lost.trim(),
        report_details,
        image_urls: [...existingImages, ...imageUrls],
      };

      const response = await api.patch(`/user/lost-reports/${id}`, payload);
      if (response.status === 200) {
        toast.success("Lost report updated successfully");
        setTimeout(() => navigate("/my-dashboard"), 1200);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update lost report."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <Loader size={48} className="text-emerald-400 animate-spin" />
      </div>
    );
  }

  const disabled = formData.status !== "OPEN";

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
                Update Lost Report
              </h1>
              <p className="text-slate-400 mt-1">
                Edit details, attributes, and photos for your report
              </p>
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        <div
          className={`mb-6 px-6 py-4 rounded-r-xl border-l-4 ${
            disabled
              ? "bg-amber-500/10 border-amber-500"
              : "bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-emerald-500"
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className={`${
                disabled ? "text-amber-400" : "text-emerald-400"
              } mt-0.5 flex-shrink-0`}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-100 text-sm mb-1">
                {disabled ? "Editing Locked" : "Update Policy"}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {disabled
                  ? `This report is ${formData.status}. You can no longer edit it.`
                  : "Reports marked OPEN can be edited. Provide clear attributes and photos to help match with found items."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <form id="update-report-form" onSubmit={handleSubmit}>
              {/* Core Details */}
              <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Info className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Core Details
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Item Type <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Package size={18} />
                      </div>
                      <input
                        type="text"
                        name="item_type"
                        value={formData.item_type}
                        onChange={handleChange}
                        disabled={disabled}
                        placeholder="e.g. iPhone 13, Wallet, Backpack"
                        className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border ${
                          errors.item_type
                            ? "border-red-500/50"
                            : "border-white/10"
                        } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm backdrop-blur-sm ${
                          disabled ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                    {errors.item_type && (
                      <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.item_type}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Location Lost <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <MapPin size={18} />
                        </div>
                        <input
                          type="text"
                          name="location_lost"
                          value={formData.location_lost}
                          onChange={handleChange}
                          disabled={disabled}
                          placeholder="e.g. Cafeteria, Parking Lot, Library"
                          className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border ${
                            errors.location_lost
                              ? "border-red-500/50"
                              : "border-white/10"
                          } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm backdrop-blur-sm ${
                            disabled ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                      {errors.location_lost && (
                        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.location_lost}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Date & Time <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Calendar size={18} />
                        </div>
                        <input
                          type="datetime-local"
                          name="date_lost"
                          value={formData.date_lost}
                          onChange={handleChange}
                          max={formatForInput(new Date().toISOString())}
                          disabled={disabled}
                          className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border ${
                            errors.date_lost
                              ? "border-red-500/50"
                              : "border-white/10"
                          } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm [color-scheme:dark] backdrop-blur-sm ${
                            disabled ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                      {errors.date_lost && (
                        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.date_lost}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Info className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      Attributes
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={addProofField}
                    disabled={disabled}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold border border-emerald-500/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Add Field
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                    <div className="col-span-5">Attribute Name</div>
                    <div className="col-span-6">Value</div>
                    <div className="col-span-1"></div>
                  </div>

                  {proofFields.map((field, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start p-4 bg-slate-950/50 border border-white/10 rounded-xl hover:border-emerald-500/30 transition-all backdrop-blur-sm"
                    >
                      <div className="md:col-span-5">
                        <label className="md:hidden text-xs font-semibold text-slate-400 mb-2 block">
                          Name
                        </label>
                        <input
                          type="text"
                          value={field.key}
                          onChange={(e) =>
                            updateProofField(index, "key", e.target.value)
                          }
                          disabled={disabled}
                          placeholder="Color, Brand, Model, ..."
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="md:col-span-6">
                        <label className="md:hidden text-xs font-semibold text-slate-400 mb-2 block">
                          Value
                        </label>
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) =>
                            updateProofField(index, "value", e.target.value)
                          }
                          disabled={disabled}
                          placeholder="Red, Nike, Scratched corner, ..."
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="md:col-span-1 flex items-center justify-end">
                        {proofFields.length > 1 && !disabled && (
                          <button
                            type="button"
                            onClick={() => removeProofField(index)}
                            className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all active:scale-95 border border-white/10 hover:border-red-500/30"
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

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 h-fit">
            {/* Image Upload */}
            <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                Evidence Photos
              </h3>

              <div className="relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={disabled}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <div
                  className={`border-2 border-dashed border-white/20 bg-slate-950/50 rounded-xl p-8 text-center transition-all group-hover:border-emerald-500/50 group-hover:bg-slate-900/50 backdrop-blur-sm ${
                    disabled ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200">
                    {disabled
                      ? "Editing disabled for locked reports"
                      : "Click to upload"}
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

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-slate-300 font-semibold">
                    Current Photos
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {existingImages.map((url, index) => (
                      <div
                        key={url + index}
                        className="relative aspect-square rounded-lg overflow-hidden group border border-white/10"
                      >
                        <img
                          src={url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {!disabled && (
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="text-white hover:text-red-400 p-2 bg-slate-900/80 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Previews */}
              {previewImages.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-slate-300 font-semibold">
                    New Photos
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {previewImages.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden group border border-white/10"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <button
                            type="button"
                            onClick={() => removePreviewImage(index)}
                            className="text-white hover:text-red-400 p-2 bg-slate-900/80 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <Info
                    size={14}
                    className="mt-0.5 text-emerald-400 flex-shrink-0"
                  />
                  <span>
                    Provide accurate details to improve matching with found
                    items.
                  </span>
                </li>
                <li className="text-xs text-slate-400 flex items-start gap-2">
                  <Info
                    size={14}
                    className="mt-0.5 text-emerald-400 flex-shrink-0"
                  />
                  <span>Upload clear images that show unique identifiers.</span>
                </li>
                <li className="text-xs text-slate-400 flex items-start gap-2">
                  <Info
                    size={14}
                    className="mt-0.5 text-emerald-400 flex-shrink-0"
                  />
                  <span>Only reports with status OPEN can be edited.</span>
                </li>
              </ul>
            </div>

            {/* Primary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate("/my-dashboard")}
                className="col-span-1 py-3 px-4 bg-transparent border border-white/20 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all active:scale-95"
                disabled={isSubmitting || uploadingImages}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="update-report-form"
                disabled={disabled || isSubmitting || uploadingImages}
                className="col-span-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting || uploadingImages ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>
                      {uploadingImages ? "Uploading..." : "Saving..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
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

export default UpdateReportPage;
