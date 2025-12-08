import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

export function AuthSection({
  authToken,
  authError,
  authLoading,
  loginForm,
  setLoginForm,
  onLogin,
  registerForm,
  setRegisterForm,
  onRegister,
  initialMode = "login",
  onClose,
}) {
  const [activeTab, setActiveTab] = useState(initialMode);

  return (
    <section id="auth" className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
          Authentication
        </p>
        <h2 className="mb-2 text-3xl font-bold text-white">
          {activeTab === "login"
            ? "Login to ClaimPoint"
            : "Create Your Account"}
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-sm">
          {activeTab === "login"
            ? "Sign in with your existing account to access ClaimPoint"
            : "General users can report lost items and claim found items. Staff and Admin accounts are created by administrators only."}
        </p>
      </div>

      {authError && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3">
          <AlertCircle
            size={20}
            className="text-red-400 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="font-semibold text-red-200">Authentication Error</p>
            <p className="text-sm text-red-300">{authError}</p>
          </div>
        </div>
      )}

      {/* Single Form Display */}
      <div className="w-full max-w-lg mx-auto">
        {activeTab === "login" ? (
          <LoginForm
            loading={authLoading}
            onSubmit={onLogin}
            form={loginForm}
            setForm={setLoginForm}
          />
        ) : (
          <RegisterForm
            loading={authLoading}
            onSubmit={onRegister}
            form={registerForm}
            setForm={setRegisterForm}
          />
        )}
      </div>

      {/* Toggle Link */}
      <div className="text-center text-sm text-gray-400">
        {activeTab === "login" ? (
          <>
            Don't have an account?{" "}
            <button
              onClick={() => setActiveTab("register")}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Register here
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setActiveTab("login")}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Sign in here
            </button>
          </>
        )}
      </div>
    </section>
  );
}
