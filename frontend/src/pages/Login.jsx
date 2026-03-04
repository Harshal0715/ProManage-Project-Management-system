import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff, LayoutDashboard, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const workspaceId = localStorage.getItem("workspaceId") || "";
      const res = await api.post("/api/auth/login", { email, password, workspaceId });

      const { token, role, employeeId, name, workspaceId: wsId, userId, ownerId } = res.data;
      const normalizedRole = role ? role.toUpperCase() : "";

      const finalUserId = userId || ownerId || "";
      const finalOwnerId = ownerId || userId || "";

      if (token) {
        localStorage.setItem("token", token);
      }

      localStorage.setItem("role", normalizedRole);
      localStorage.setItem("employeeId", employeeId || "");
      localStorage.setItem("name", name || (normalizedRole === "ADMIN" ? "Admin" : ""));
      localStorage.setItem("workspaceId", wsId || "");
      localStorage.setItem("userId", finalUserId);
      localStorage.setItem("ownerId", finalOwnerId);
      localStorage.setItem("email", res.data.email || email);
      localStorage.setItem("user", JSON.stringify(res.data));

      window.dispatchEvent(new Event("workspaceChanged"));

      if (normalizedRole === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (normalizedRole === "EMPLOYEE") {
        navigate("/employee/dashboard", { replace: true });
      } else {
        setError("Invalid role returned from server");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Invalid login. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const fillAdminDemo = () => {
    setEmail("admin@gmail.com");
    setPassword("admin123");
  };

  const fillEmployeeDemo = () => {
    setEmail("harshal@gmail.com");
    setPassword("1234");
    localStorage.setItem("workspaceId", "ws001");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-teal-500/20 rounded-full blur-[100px] mix-blend-screen animate-float"></div>
      </div>

      <div className="z-10 w-full max-w-5xl mx-4 animate-fade-in-up">
        <div className="glass-card rounded-3xl overflow-hidden grid lg:grid-cols-2 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">

          {/* Branding Panel (Left) */}
          <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-900/90 to-gray-900/90 relative overflow-hidden border-r border-white/5">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            <div className="relative z-20">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-8 backdrop-blur-md border border-white/20 shadow-lg">
                <LayoutDashboard className="text-brand-300 w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
                Elevate your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-teal-300">
                  ProManage
                </span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Streamline workflows, empower your team, and deliver results faster with our all-in-one intelligent platform.
              </p>

              <ul className="mt-10 space-y-4">
                {['Smart Dashboards', 'Real-time Analytics', 'Team Collaboration'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300 gap-3 animate-fade-in-right" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                    <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                      <ArrowRight className="w-3 h-3 text-brand-300" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-gray-400 relative z-20">
              © {new Date().getFullYear()} ProjectSync. All rights reserved.
            </p>
          </div>

          {/* Login Form (Right) */}
          <div className="p-10 sm:p-14 lg:p-16 bg-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -z-10 opacity-50"></div>

            <div className="max-w-md mx-auto">
              <div className="lg:hidden inline-flex items-center justify-center p-3 bg-brand-50 rounded-xl mb-6 text-brand-600">
                <LayoutDashboard className="w-6 h-6" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
              <p className="text-gray-500 mt-2 text-base">Enter your credentials to access your account</p>

              {error && (
                <div className="mt-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center animate-fade-in">
                  <div className="w-1 h-full bg-red-500 rounded-full mr-3"></div>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5 mt-8">
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

                <div>
                  <div className="flex items-center justify-between mb-1.5 ml-1 pr-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                    </div>
                    <input
                      type={showPass ? "text" : "password"}
                      className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
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
                        <span>Sign In</span>
                        <LogIn size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Demo Login Options */}
              <div className="mt-10 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-400">Quick access for testing</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={fillAdminDemo}
                  className="flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md transition-all"
                >
                  Admin Demo
                </button>
                <button
                  onClick={fillEmployeeDemo}
                  className="flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm transition-all"
                >
                  Employee Demo
                </button>
              </div>

              {/* Registration Link */}
              <div className="mt-8 text-center text-sm text-gray-500">
                Don't have a workspace yet?{" "}
                <button
                  onClick={() => navigate("/signup-company")}
                  className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Register Company
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

