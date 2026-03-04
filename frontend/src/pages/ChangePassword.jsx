import { useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import { Eye, EyeOff, KeyRound, Save, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ChangePassword() {
  const email = localStorage.getItem("email"); // make sure login saves this
  const name = localStorage.getItem("name");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!newPassword || !confirmPassword) {
      setErr("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 4) {
      setErr("Password must be at least 4 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const workspaceId = localStorage.getItem("workspaceId");

      await api.put("/api/auth/change-password", {
        email,
        newPassword,
        workspaceId,
      });

      setMsg("Your password has been securely updated.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      console.log(e);
      setErr("Failed to update password. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* PREMIUM HEADER */}
      <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-900 border border-brand-800/50 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-400/30 transition-colors duration-700 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 mix-blend-screen"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center justify-center p-2.5 bg-white/10 rounded-xl mb-4 backdrop-blur-md border border-white/10 shadow-inner">
              <ShieldCheck className="text-teal-300 w-6 h-6" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Account Security
            </h2>
            <p className="text-brand-100 mt-2 text-sm max-w-md">
              Update your password to keep your {name ? `${name}'s ` : ''}account secure.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-10"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center border border-teal-100 shadow-inner">
              <KeyRound size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Change Password
              </h2>
              <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                Logged in as <span className="font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">{email}</span>
              </p>
            </div>
          </div>

          {/* Alert Messages */}
          {msg && (
            <div className="mb-6 bg-teal-50 border border-teal-200 text-teal-800 px-4 py-4 rounded-[1rem] flex items-start gap-3 shadow-sm animate-fade-in-up">
              <CheckCircle2 className="text-teal-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-sm">Success</h4>
                <p className="text-sm mt-0.5 opacity-90">{msg}</p>
              </div>
            </div>
          )}

          {err && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-4 rounded-[1rem] flex items-start gap-3 shadow-sm animate-fade-in-up">
              <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-bold text-sm">Action Required</h4>
                <p className="text-sm mt-0.5 opacity-90">{err}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">

            <div className="space-y-5 bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-100">
              {/* New password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                <div className="relative group">
                  <input
                    type={showNew ? "text" : "password"}
                    className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all shadow-sm font-medium"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative group">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all shadow-sm font-medium"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 text-white py-4 rounded-[1rem] hover:from-brand-700 hover:to-indigo-700 transition-all font-bold shadow-md shadow-brand-500/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed border border-transparent"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={20} strokeWidth={2.5} /> Update Password
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500 font-medium">
          Make sure your password is at least 8 characters long and includes a mix of letters, numbers, and symbols for better security.
        </p>
      </div>
    </Layout>
  );
}
