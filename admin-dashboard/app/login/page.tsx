"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [phone,    setPhone]    = useState("");
  const [otp,      setOtp]      = useState("");
  const [step,     setStep]     = useState<"phone" | "otp">("phone");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const sendOtp = async () => {
    if (phone.length < 10) return;
    setLoading(true); setError("");
    try {
      await api.post("auth/send-otp", { phone: `+91${phone}` });
      setStep("otp");
    } catch (e: any) {
      setError(typeof e === "string" ? e : "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const verify = async () => {
    if (otp.length < 6) return;
    setLoading(true); setError("");
    try {
      const { data } = await api.post("auth/verify-otp", { phone: `+91${phone}`, otp });
      const { accessToken, user } = data.data;
      const role = user?.role ?? "";
      if (!["MANAGER", "OWNER", "SUPER_ADMIN"].includes(role)) {
        setError("You do not have admin access.");
        return;
      }
      localStorage.setItem("kd_admin_token", accessToken);
      localStorage.setItem("kd_admin_name",  user?.name ?? "Admin");
      router.replace("/dashboard");
    } catch (e: any) {
      setError(typeof e === "string" ? e : "Invalid OTP");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"
            style={{ background: "linear-gradient(135deg, #7C1D1D, #4a0b0b)" }}>
            KD
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Kila Darbar Restaurant Management</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {step === "phone" ? (
            <>
              <h2 className="font-semibold text-gray-900 mb-4">Sign in with OTP</h2>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:border-red-800 focus-within:ring-1 focus-within:ring-red-800 transition-all">
                  <span className="flex items-center px-3 text-sm text-gray-500 bg-gray-50 border-r border-gray-200">🇮🇳 +91</span>
                  <input
                    type="tel" inputMode="numeric" maxLength={10}
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                    className="flex-1 px-3 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>
              {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
              <button onClick={sendOtp} disabled={phone.length !== 10 || loading}
                className="btn-primary w-full justify-center">
                {loading ? "Sending…" : "Get OTP"}
              </button>
            </>
          ) : (
            <>
              <h2 className="font-semibold text-gray-900 mb-1">Enter OTP</h2>
              <p className="text-sm text-gray-500 mb-4">Sent to +91{phone}{" "}
                <button onClick={() => setStep("phone")} className="text-red-800 underline text-xs">Change</button>
              </p>
              <input
                type="text" inputMode="numeric" maxLength={6}
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && verify()}
                className="input mb-3 text-center text-xl tracking-[0.5em] font-bold"
              />
              {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
              <button onClick={verify} disabled={otp.length !== 6 || loading}
                className="btn-primary w-full justify-center">
                {loading ? "Verifying…" : "Sign In"}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Admin access only · MANAGER / OWNER / SUPER_ADMIN
        </p>
      </div>
    </div>
  );
}
