"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import api from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("v1/auth/admin/login", { email, password });
      const { accessToken, user } = data.data;
      localStorage.setItem("kd_admin_token", accessToken);
      localStorage.setItem("kd_admin_name",  user?.name ?? "Admin");
      router.replace("/dashboard");
    } catch (e: any) {
      setError(typeof e === "string" ? e : e?.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"
            style={{ background: "linear-gradient(135deg, #7C1D1D, #4a0b0b)" }}
          >
            KD
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Kila Darbar Restaurant Management</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
        >
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="admin@kiladarbar.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={!email || !password || loading}
            className="btn-primary w-full justify-center disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Admin access only · MANAGER / OWNER / SUPER_ADMIN
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-3 text-center">
            <p className="text-xs text-amber-700 font-medium mb-2">Dev mode — backend not required</p>
            <button
              onClick={() => {
                localStorage.setItem("kd_admin_token", "dev-bypass-token");
                localStorage.setItem("kd_admin_name",  "Dev Admin");
                router.replace("/dashboard");
              }}
              className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              Skip Login (Dev)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
