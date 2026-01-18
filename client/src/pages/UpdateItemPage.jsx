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
  FileText, // Added missing import
  X, // Added missing import
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import { PageShell } from "../components/layout";
import { AccessCard, LoadingState } from "../components/ui";

// --- Sub-Components (Outside to prevent re-renders & focus loss) ---

const FormInput = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50">
        <Icon size={18} />
      </div>
      <input
        {...props}
        className={`w-full bg-slate-950 border-2 border-slate-800 pl-14 pr-6 py-4 rounded-2xl text-white font-bold transition-all focus:outline-none focus:border-emerald-500 placeholder:text-slate-800 [color-scheme:dark] ${
          error ? "border-rose-500/50 focus:border-rose-500" : ""
        }`}
      />
    </div>
    {error && (
      <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-4">
        {error}
      </p>
    )}
  </div>
);

// --- Main Page Component ---

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
    [formData.status],
  );

  // Helper to fill form with data
  const hydrateFromItem = (item) => {
    setFormData({
      item_type: item.item_type || "",
      date_found: item.date_found
        ? new Date(item.date_found).toISOString().slice(0, 16)
        : "",
      location_found: item.location_found || "",
      status: item.status || "FOUND",
    });
    setExistingImages(item.images || []);
    if (item.details) {
      setDetailFields(
        Object.entries(item.details).map(([key, info]) => ({
          key,
          value: info.value,
          isPublic: info.isPublic,
        })),
      );
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${itemId}`);
        hydrateFromItem(res.data.item);
      } catch (err) {
        toast.error("Failed to load item");
        navigate("/manage-items");
      } finally {
        setIsFetching(false);
      }
    };

    if (!isAuthenticated) return;
    if (state?.item) {
      hydrateFromItem(state.item);
      setIsFetching(false);
    } else if (itemId) {
      fetchItem();
    }
  }, [itemId, isAuthenticated, state, navigate]);

  // Event Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addDetailField = () =>
    setDetailFields([...detailFields, { key: "", value: "", isPublic: true }]);

  const removeDetailField = (index) =>
    setDetailFields(detailFields.filter((_, i) => i !== index));

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
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  const removePreviewImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Transform detailFields back to Object for API
    const detailsObj = {};
    detailFields.forEach((f) => {
      if (f.key.trim())
        detailsObj[f.key] = { value: f.value, isPublic: f.isPublic };
    });

    try {
      // 1. Upload new images if any
      let finalImages = [...existingImages];
      if (selectedFiles.length > 0) {
        setUploadingImages(true);
        const imgData = new FormData();
        selectedFiles.forEach((file) => imgData.append("images", file));
        const uploadRes = await api.post("/upload", imgData);
        finalImages = [...finalImages, ...uploadRes.data.urls];
      }

      // 2. Update Item
      await api.patch(`/admin/items/${itemId}`, {
        ...formData,
        details: detailsObj,
        images: finalImages,
      });

      toast.success("Item updated successfully");
      navigate("/manage-items");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
      setUploadingImages(false);
    }
  };

  if (!isAuthenticated)
    return (
        <AccessCard />
    );
  if (isFetching) return <LoadingState label="Decrypting item data..." />;

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto pt-15">
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
          <div className="lg:col-span-8 space-y-8">
            <header>
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                Update <span className="text-emerald-500">Found Item.</span>
              </h1>
              <p className="text-slate-400 font-medium">
                Edit item details, attributes, and media.
              </p>
            </header>

            <form
              id="update-item-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="bg-[#0b1120] border border-slate-800 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-800 bg-slate-900/30 flex items-center gap-3">
                  <FileText size={16} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Core Details
                  </span>
                </div>
                <div className="p-8 space-y-6">
                  <FormInput
                    label="Item Type / Name"
                    name="item_type"
                    value={formData.item_type}
                    onChange={handleChange}
                    icon={Package}
                    disabled={isLocked}
                    error={errors.item_type}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Location Found"
                      name="location_found"
                      value={formData.location_found}
                      onChange={handleChange}
                      icon={MapPin}
                      disabled={isLocked}
                    />
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Date Found
                      </label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50">
                          <Calendar size={18} />
                        </div>
                        <input
                          type="datetime-local"
                          name="date_found"
                          value={formData.date_found}
                          onChange={handleChange}
                          disabled={isLocked}
                          className="w-full bg-slate-950 border-2 border-slate-800 pl-14 pr-6 py-4 rounded-2xl text-white font-bold [color-scheme:dark]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0b1120] border border-slate-800 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Item Attributes
                  </span>
                  <button
                    type="button"
                    onClick={addDetailField}
                    disabled={isLocked}
                    className="text-[9px] text-emerald-500 font-black flex items-center gap-2"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div className="p-8 space-y-4">
                  {detailFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap md:flex-nowrap gap-3 items-center"
                    >
                      <input
                        placeholder="Key"
                        value={field.key}
                        onChange={(e) =>
                          updateDetailField(index, "key", e.target.value)
                        }
                        disabled={isLocked}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white"
                      />
                      <input
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) =>
                          updateDetailField(index, "value", e.target.value)
                        }
                        disabled={isLocked}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => togglePublic(index)}
                        className="p-3 bg-slate-800 rounded-xl text-emerald-500"
                      >
                        {field.isPublic ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDetailField(index)}
                        className="p-3 text-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0b1120] border border-slate-800 rounded-[2.5rem] p-8 space-y-6 lg:sticky lg:top-10">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Upload size={14} className="text-emerald-500" /> Photos
              </h3>

              <div className="relative border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  disabled={isLocked}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-slate-600 mb-2" />
                <p className="text-[10px] text-slate-500 font-black uppercase">
                  Upload New Media
                </p>
              </div>

              {/* Combined Image Gallery */}
              <div className="grid grid-cols-2 gap-2">
                {existingImages.map((src, i) => (
                  <div
                    key={`ex-${i}`}
                    className="relative aspect-square rounded-lg overflow-hidden border border-slate-800 group"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    <button
                      onClick={() => removeExistingImage(i)}
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {previewImages.map((src, i) => (
                  <div
                    key={`pre-${i}`}
                    className="relative aspect-square rounded-lg overflow-hidden border border-emerald-500/50 group"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover opacity-60"
                      alt=""
                    />
                    <button
                      onClick={() => removePreviewImage(i)}
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  form="update-item-form"
                  disabled={isSubmitting || isLocked}
                  className="w-full py-4 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase rounded-2xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full py-4 bg-slate-900 text-slate-500 text-[10px] font-black uppercase rounded-2xl"
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

export default UpdateItemPage;
