"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../../hooks/useAuthStore";

function LoginPageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const returnUrl    = searchParams.get("returnUrl") ?? "/";
  const { sendOtp, googleLogin, isLoading } = useAuthStore();

  const [phone, setPhone] = useState("");

  const handleSendOtp = async () => {
    const fullPhone = `+91${phone}`;
    try {
      await sendOtp(fullPhone);
      toast.success("OTP sent!");
      router.push(`/auth/otp?phone=${encodeURIComponent(fullPhone)}&returnUrl=${encodeURIComponent(returnUrl)}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { getFirebaseAuth, googleProvider } = await import("../../lib/firebase");
      const { signInWithPopup } = await import("firebase/auth");
      const result  = await signInWithPopup(getFirebaseAuth(), googleProvider);
      const idToken = await result.user.getIdToken();
      await googleLogin(idToken);
      toast.success("Welcome to Kila Darbar!");
      router.replace(returnUrl);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      if (code === "auth/configuration-not-found" || code?.includes("api-key")) {
        toast.error("Google sign-in is not configured yet.");
        return;
      }
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, #D4AF37, transparent)" }} />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ background: "linear-gradient(135deg, #6B0F1A, #3d0409)", border: "1px solid rgba(212,175,55,0.4)" }}>
              <span className="font-royal text-gold-400 text-2xl">ک</span>
            </div>
          </Link>
          <h1 className="font-royal text-3xl text-ivory tracking-wide">Kila Darbar</h1>
          <p className="font-cormo text-ivory/40 mt-1 text-lg">Royal Mughal Cuisine</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(145deg, #1a0a0b, #111)", border: "1px solid rgba(212,175,55,0.15)" }}>
          <div className="p-8">
            <h2 className="font-royal text-xl text-ivory mb-1">Welcome Back</h2>
            <p className="font-cormo text-ivory/40 text-base mb-8">Sign in to place orders and track your royal feast.</p>

            {/* Phone input */}
            <div className="mb-5">
              <label className="font-royal text-[10px] tracking-[0.3em] uppercase text-ivory/40 block mb-2">
                Mobile Number
              </label>
              <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(212,175,55,0.2)" }}>
                <div className="flex items-center px-3 font-royal text-sm text-gold-400/70"
                  style={{ background: "rgba(212,175,55,0.05)", borderRight: "1px solid rgba(212,175,55,0.15)" }}>
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onKeyDown={(e) => e.key === "Enter" && phone.length === 10 && handleSendOtp()}
                  className="flex-1 px-4 py-3 bg-transparent text-ivory font-cormo text-base placeholder:text-ivory/20 outline-none"
                />
              </div>
            </div>

            {/* OTP button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSendOtp}
              disabled={phone.length !== 10 || isLoading}
              className="w-full h-12 rounded-xl font-royal text-sm tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-5 transition-opacity"
              style={{ background: "linear-gradient(135deg, #D4AF37, #B8960C)", color: "#111" }}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
              ) : (
                "Get OTP"
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.1)" }} />
              <span className="font-cormo text-xs text-ivory/30">or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.1)" }} />
            </div>

            {/* Google button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 rounded-xl flex items-center justify-center gap-3 font-royal text-sm tracking-wider text-ivory/70 hover:text-ivory disabled:opacity-40 transition-colors mb-4"
              style={{ border: "1px solid rgba(212,175,55,0.15)", background: "rgba(255,255,255,0.03)" }}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </motion.button>

            {/* Guest */}
            <Link
              href={returnUrl}
              className="w-full h-10 flex items-center justify-center font-cormo text-sm text-ivory/30 hover:text-ivory/60 transition-colors"
            >
              Continue as Guest →
            </Link>
          </div>

          {/* Footer */}
          <div className="px-8 py-4" style={{ borderTop: "1px solid rgba(212,175,55,0.08)", background: "rgba(0,0,0,0.2)" }}>
            <p className="font-cormo text-xs text-ivory/25 text-center">
              By continuing you agree to our{" "}
              <Link href="/terms" className="underline hover:text-ivory/60 transition-colors">Terms</Link>
              {" & "}
              <Link href="/privacy" className="underline hover:text-ivory/60 transition-colors">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
