import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/auth.context";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={true}
        theme="dark"
        toastClassName={() =>
          "!rounded-lg !shadow-xl !backdrop-blur-md !bg-slate-900/95 !border !border-slate-700/50 !p-4"
        }
        bodyClassName={() => "!text-sm !font-medium !text-white"}
        limit={3}
      />
    </AuthProvider>
  </BrowserRouter>
);
