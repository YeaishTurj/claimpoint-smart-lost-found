import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Package,
  MapPin,
  Calendar,
  Upload,
  ArrowLeft,
  Loader,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Info,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import { PageShell } from "../components/layout";
import { LoadingState } from "../components/ui";

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

  // Helper to format ISO date for datetime-local input
  const formatForInput = (iso) => {
    try {
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return "";
    }
  };

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
        toast.error("Failed to load report");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addProofField = () =>
    setProofFields([{ key: "", value: "" }, ...proofFields]);

  const removeProofField = (index) => {
    if (proofFields.length > 1) {
      setProofFields(proofFields.filter((_, i) => i !== index));
    }
  };

  const updateProofField = (index, field, value) => {
    const updated = [...proofFields];
    updated[index][field] = value;
    setProofFields(updated);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      setErrors((prev) => ({ ...prev, images: "Some files exceed 5MB limit" }));
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const uploadImagesToCloudinary = async () => {
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
        const data = await response.json();
        uploadedUrls.push(data.secure_url);
      }
      return uploadedUrls;
    } finally {
      setUploadingImages(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.item_type.trim()) newErrors.item_type = "Required";
    if (!formData.date_lost) newErrors.date_lost = "Required";
    if (!formData.location_lost.trim()) newErrors.location_lost = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.status !== "OPEN") return toast.error("Report is locked");
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const newUrls = await uploadImagesToCloudinary();
      const report_details = {};
      proofFields.forEach((f) => {
        if (f.key && f.value) report_details[f.key] = f.value;
      });

      const payload = {
        ...formData,
        date_lost: new Date(formData.date_lost).toISOString(),
        report_details,
        image_urls: [...existingImages, ...newUrls],
      };

      await api.patch(`/user/lost-reports/${id}`, payload);
      toast.success("Updated successfully");
      navigate("/my-dashboard");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <PageShell variant="centered">
        <LoadingState />
      </PageShell>
    );

  const disabled = formData.status !== "OPEN";

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 mb-6"
          >
            <ArrowLeft size={20} /> <span>Back</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Update Report</h1>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`mb-6 p-4 rounded-xl border-l-4 ${
            disabled
              ? "bg-amber-500/10 border-amber-500"
              : "bg-emerald-500/10 border-emerald-500"
          }`}
        >
          <div className="flex gap-3">
            <AlertCircle
              className={disabled ? "text-amber-400" : "text-emerald-400"}
            />
            <div>
              <p className="font-bold text-white">
                {disabled ? "Editing Locked" : "Open for Edits"}
              </p>
              <p className="text-sm text-slate-300">
                {disabled
                  ? "Matched reports cannot be changed."
                  : "Keep details updated for better matching."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            <form
              id="update-report-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Info size={18} className="text-emerald-400" /> Core Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">
                      Item Type
                    </label>
                    <input
                      name="item_type"
                      value={formData.item_type}
                      onChange={handleChange}
                      disabled={disabled}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 text-sm mb-1 block">
                        Location
                      </label>
                      <input
                        name="location_lost"
                        value={formData.location_lost}
                        onChange={handleChange}
                        disabled={disabled}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-1 block">
                        Date/Time
                      </label>
                      <input
                        type="datetime-local"
                        name="date_lost"
                        value={formData.date_lost}
                        onChange={handleChange}
                        disabled={disabled}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-white [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Attributes */}
              <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white font-bold">
                    Additional Attributes
                  </h2>
                  <button
                    type="button"
                    onClick={addProofField}
                    disabled={disabled}
                    className="text-emerald-400 flex items-center gap-1 text-sm"
                  >
                    <Plus size={16} /> Add Field
                  </button>
                </div>
                {proofFields.map((field, idx) => (
                  <div key={idx} className="flex gap-2 mb-3">
                    <input
                      placeholder="Name"
                      value={field.key}
                      onChange={(e) =>
                        updateProofField(idx, "key", e.target.value)
                      }
                      disabled={disabled}
                      className="flex-1 bg-slate-950 border border-white/10 rounded-lg p-2 text-white text-sm"
                    />
                    <input
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) =>
                        updateProofField(idx, "value", e.target.value)
                      }
                      disabled={disabled}
                      className="flex-1 bg-slate-950 border border-white/10 rounded-lg p-2 text-white text-sm"
                    />
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => removeProofField(idx)}
                        className="text-red-400 p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Upload size={18} /> Photos
              </h3>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors relative">
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  disabled={disabled}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-slate-500 mb-2" />
                <p className="text-xs text-slate-400">
                  Click or drag to upload new images
                </p>
              </div>

              {/* Previews */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {existingImages.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded overflow-hidden relative"
                  >
                    <img
                      src={img}
                      className="object-cover w-full h-full opacity-50"
                      alt="Existing"
                    />
                    {!disabled && (
                      <button
                        onClick={() =>
                          setExistingImages(
                            existingImages.filter((_, idx) => idx !== i)
                          )
                        }
                        className="absolute top-1 right-1 bg-red-500 p-1 rounded text-white"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                ))}
                {previewImages.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded overflow-hidden border border-emerald-500"
                  >
                    <img
                      src={img}
                      className="object-cover w-full h-full"
                      alt="New"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="update-report-form"
                disabled={disabled || isSubmitting}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default UpdateReportPage;
