import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  Upload,
  Save,
  Loader,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldAlert,
  Info,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import { PageShell } from "../components/layout";
import { AccessCard, LoadingState } from "../components/ui";

const UpdateItemPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { itemId } = useParams();
  const { isAuthenticated } = useAuth();

  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    item_type: "",
    date_found: "",
    location_found: "",
    status: "FOUND",
  });

  const [detailFields, setDetailFields] = useState([
    { key: "", value: "", isPublic: true },
  ]);

  const [existingImages, setExistingImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const isLocked = useMemo(
    () => formData.status?.toLowerCase() === "claimed",
    [formData.status]
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    const preloaded = state?.item;
    if (preloaded) {
      hydrateFromItem(preloaded);
      setIsFetching(false);
    } else if (itemId) {
      fetchItem();
    }
  }, [itemId, state, isAuthenticated]);

  const hydrateFromItem = (item) => {
    setFormData({
      item_type: item.item_type || "",
      date_found: item.date_found
        ? new Date(item.date_found).toISOString().slice(0, 16)
        : "",
      location_found: item.location_found || "",
      status: item.status || "FOUND",
    });

    const fields = [];
    if (item.public_details) {
      Object.entries(item.public_details).forEach(([key, value]) => {
        fields.push({ key, value, isPublic: true });
      });
    }
    if (item.hidden_details) {
      Object.entries(item.hidden_details).forEach(([key, value]) => {
        fields.push({ key, value, isPublic: false });
      });
    }
    setDetailFields(
      fields.length ? fields : [{ key: "", value: "", isPublic: true }]
    );
    setExistingImages(item.image_urls || []);
  };

  const fetchItem = async () => {
    setIsFetching(true);
    try {
      const response = await api.get(`/items/found-items/${itemId}`);
      hydrateFromItem(response.data.data);
    } catch (error) {
      console.error("Failed to fetch item:", error);
      toast.error(
        error.response?.data?.message || "Failed to load item details",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
      navigate(-1);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addDetailField = () => {
    setDetailFields([{ key: "", value: "", isPublic: true }, ...detailFields]);
  };

  const removeDetailField = (index) => {
    if (detailFields.length > 1) {
      setDetailFields(detailFields.filter((_, i) => i !== index));
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const oversized = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversized.length) {
      setErrors((prev) => ({
        ...prev,
        images: `${oversized.length} file(s) exceed 5MB limit`,
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

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removePreviewImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async () => {
    if (!selectedFiles.length) return [];
    setUploadingImages(true);
    const uploaded = [];
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
        uploaded.push(data.secure_url);
      }
      return uploaded;
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
    if (!formData.date_found) newErrors.date_found = "Date found is required";
    if (!formData.location_found.trim())
      newErrors.location_found = "Location is required";
    const hasValidFields = detailFields.some(
      (f) => f.key.trim() && f.value.trim()
    );
    if (!hasValidFields)
      newErrors.details = "At least one detail attribute is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;
    if (!validateForm()) {
      toast.error("Please check the form for errors");
      return;
    }
    setIsSubmitting(true);
    try {
      const newUrls = await uploadImagesToCloudinary();
      const hidden_details = {};
      const public_details = {};
      detailFields.forEach((field) => {
        if (field.key.trim() && field.value.trim()) {
          if (field.isPublic)
            public_details[field.key.trim()] = field.value.trim();
          else hidden_details[field.key.trim()] = field.value.trim();
        }
      });

      const payload = {
        item_type: formData.item_type.trim(),
        location_found: formData.location_found.trim(),
        hidden_details,
        public_details,
        image_urls: [...existingImages, ...newUrls],
        status: formData.status,
      };

      if (formData.date_found) {
        payload.date_found = new Date(formData.date_found).toISOString();
      }

      await api.patch(`/staff/found-items/${itemId}`, payload);
      toast.success("Item updated successfully", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => navigate("/manage-items"), 1200);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageShell variant="centered">
        <AccessCard />
      </PageShell>
    );
  }

  if (isFetching) {
    return (
      <PageShell variant="centered">
        <LoadingState label="Loading item details..." />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Update Found Item
              </h1>
              <p className="text-slate-400 mt-1">
                Edit details, attributes, images, or status
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
                Update Policy
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Items marked as claimed cannot be modified. Use hidden
                attributes for owner verification.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <form id="update-item-form" onSubmit={handleSubmit}>
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
                        disabled={isLocked}
                        placeholder="e.g. Black Sony Wireless Headphones"
                        className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border ${
                          errors.item_type
                            ? "border-red-500/50"
                            : "border-white/10"
                        } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm backdrop-blur-sm ${
                          isLocked ? "opacity-70 cursor-not-allowed" : ""
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
                        Location Found <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <MapPin size={18} />
                        </div>
                        <input
                          type="text"
                          name="location_found"
                          value={formData.location_found}
                          onChange={handleChange}
                          disabled={isLocked}
                          placeholder="e.g. Library, 2nd Floor"
                          className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border ${
                            errors.location_found
                              ? "border-red-500/50"
                              : "border-white/10"
                          } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm backdrop-blur-sm ${
                            isLocked ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                      {errors.location_found && (
                        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.location_found}
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
                          name="date_found"
                          value={formData.date_found}
                          onChange={handleChange}
                          disabled={isLocked}
                          max={new Date().toISOString().slice(0, 16)}
                          className={`w-full pl-12 pr-4 py-3 bg-slate-950/50 border ${
                            errors.date_found
                              ? "border-red-500/50"
                              : "border-white/10"
                          } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm [color-scheme:dark] backdrop-blur-sm ${
                            isLocked ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                      {errors.date_found && (
                        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.date_found}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={isLocked}
                        className={`w-full px-4 py-3 bg-slate-950/50 border ${
                          isLocked
                            ? "opacity-70 cursor-not-allowed border-slate-700/50"
                            : "border-white/10 hover:border-emerald-500/50"
                        } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm`}
                      >
                        <option value="FOUND">FOUND</option>
                        <option value="RETURNED">RETURNED</option>
                        <option value="CLAIMED">CLAIMED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                      {isLocked && (
                        <p className="text-xs text-amber-300 flex items-center gap-1 mt-2">
                          <AlertCircle size={12} /> Claimed items cannot be
                          edited
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
                    onClick={addDetailField}
                    disabled={isLocked}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold border border-emerald-500/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Add Field
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                    <div className="col-span-4">Attribute Name</div>
                    <div className="col-span-5">Value</div>
                    <div className="col-span-3">Visibility</div>
                  </div>

                  {detailFields.map((field, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start p-4 bg-slate-950/50 border border-white/10 rounded-xl hover:border-emerald-500/30 transition-all backdrop-blur-sm"
                    >
                      <div className="md:col-span-4">
                        <label className="md:hidden text-xs font-semibold text-slate-400 mb-2 block">
                          Name
                        </label>
                        <input
                          type="text"
                          value={field.key}
                          onChange={(e) =>
                            updateDetailField(index, "key", e.target.value)
                          }
                          disabled={isLocked}
                          placeholder="Color, Brand, etc."
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="md:col-span-5">
                        <label className="md:hidden text-xs font-semibold text-slate-400 mb-2 block">
                          Value
                        </label>
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) =>
                            updateDetailField(index, "value", e.target.value)
                          }
                          disabled={isLocked}
                          placeholder="Red, Nike, etc."
                          className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="md:col-span-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => togglePublic(index)}
                          disabled={isLocked}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                            field.isPublic
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          {field.isPublic ? (
                            <>
                              <Eye size={14} /> Public
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} /> Hidden
                            </>
                          )}
                        </button>

                        {detailFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDetailField(index)}
                            disabled={isLocked}
                            className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all active:scale-95 border border-white/10 hover:border-red-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
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
                      <ShieldAlert size={16} />
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
                  disabled={isLocked}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <div
                  className={`border-2 border-dashed border-white/20 bg-slate-950/50 rounded-xl p-8 text-center transition-all group-hover:border-emerald-500/50 group-hover:bg-slate-900/50 backdrop-blur-sm ${
                    isLocked ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200">
                    {isLocked
                      ? "Editing disabled for claimed items"
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
                        {!isLocked && (
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
                  <ShieldAlert
                    size={14}
                    className="mt-0.5 text-emerald-400 flex-shrink-0"
                  />
                  <span>
                    Use hidden attributes for security questions (serial
                    numbers, engravings).
                  </span>
                </li>
                <li className="text-xs text-slate-400 flex items-start gap-2">
                  <Info
                    size={14}
                    className="mt-0.5 text-emerald-400 flex-shrink-0"
                  />
                  <span>
                    Clear, well-lit photos speed up claim verification.
                  </span>
                </li>
              </ul>
            </div>

            {/* Primary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate("/manage-items")}
                className="col-span-1 py-3 px-4 bg-transparent border border-white/20 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all active:scale-95"
                disabled={isSubmitting || uploadingImages}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="update-item-form"
                disabled={isSubmitting || uploadingImages || isLocked}
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
    </PageShell>
  );
};

export default UpdateItemPage;
