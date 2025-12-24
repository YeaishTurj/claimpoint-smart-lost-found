import { useState } from "react";
import api from "../services/api";
import { X, Loader } from "lucide-react";

export function ClaimItemModal({ itemId, authToken, onClose }) {
  const [fields, setFields] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addField = () => setFields([...fields, { key: "", value: "" }]);
  const removeField = (idx) => setFields(fields.filter((_, i) => i !== idx));
  const updateField = (idx, field, value) => {
    const updated = [...fields];
    updated[idx][field] = value;
    setFields(updated);
  };

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
      await api.userClaimItem(authToken, itemId, claimDetails);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to submit claim. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Claim This Item</h2>
        {success ? (
          <div className="text-green-400 font-semibold text-center py-8">
            Claim submitted successfully! Staff will review and notify you if
            matched.
            <button
              className="mt-6 px-4 py-2 rounded-lg bg-blue-500 text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
            {error && (
              <div className="text-red-400 text-xs font-semibold">{error}</div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 hover:shadow-lg hover:shadow-blue-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  "Submit Claim"
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
        )}
      </div>
    </div>
  );
}
