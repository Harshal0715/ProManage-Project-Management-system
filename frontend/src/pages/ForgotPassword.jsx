import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Mail, RefreshCcw, ArrowLeft, LayoutDashboard } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/forgot-password", { email });
      setMessage("If an account exists with this email, a reset link has been sent.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="z-10 w-full max-w-md mx-4 animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-white/20">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-500 to-teal-400"></div>

          <div className="p-8 sm:p-10">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-2xl mb-6 text-brand-600">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Forgot Password</h2>
              <p className="text-gray-500 mt-2 text-sm">
                No worries! Enter your email and we'll send you reset instructions.
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center animate-fade-in">
                <div className="w-1 h-full bg-red-500 rounded-full mr-3"></div>
                {error}
              </div>
            )}

            {message && (
              <div className="mb-6 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center animate-fade-in">
                <div className="w-1 h-full bg-green-500 rounded-full mr-3"></div>
                {message}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-brand-500/30 hover:bg-brand-700 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <RefreshCcw size={18} />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-gray-100">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors"
                type="button"
              >
                <ArrowLeft size={16} />
                <span>Back to Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

