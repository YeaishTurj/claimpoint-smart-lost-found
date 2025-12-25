import { useState } from "react";
import { ReportLostItemForm } from "../../components/user.components/ReportLostItemForm";

export function ReportLostItemPage({ authToken, onBack }) {
  const [showForm, setShowForm] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = () => {
    setShowForm(false);
    setSuccessMessage("Lost item reported successfully!");
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const handleClose = () => {
    onBack();
  };

  return (
    <div className="max-w-3xl mx-auto pt-24 px-6">
      {successMessage ? (
        <div className="text-center py-20">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
          <p className="text-gray-400">{successMessage}</p>
        </div>
      ) : (
        <ReportLostItemForm
          authToken={authToken}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
