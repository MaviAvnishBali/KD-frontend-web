"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { getFirebaseAuth, googleProvider } from "../../lib/firebase";
import { useAuthStore } from "../../hooks/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { sendOtp, googleLogin, isLoading } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [countryCode] = useState("+91");

  const handleSendOtp = async () => {
    const fullPhone = `${countryCode}${phone}`;
    try {
      await sendOtp(fullPhone);
      toast.success("OTP sent successfully!");
      router.push(`/auth/otp?phone=${encodeURIComponent(fullPhone)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      toast.error(message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
      const idToken = await result.user.getIdToken();
      await googleLogin(idToken);
      toast.success("Welcome to Kila Darbar!");
      router.push("/");
    } catch (err: unknown) {
      if ((err as { code?: string }).code === "auth/popup-closed-by-user") return;
      const message = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-royal-gradient flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: "url('/images/mughal-pattern.svg')", backgroundSize: "300px" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-gold-500 mb-4 shadow-gold">
            <span className="text-3xl font-mughal text-royal-dark font-bold">کِلا</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-gold-400">Kila Darbar</h1>
          <p className="text-white/70 mt-1">Royal Mughal Cuisine</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-royal-dark-surface rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-serif font-bold text-royal-maroon dark:text-brand-gold-400 mb-1">
              Welcome!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Sign in or create an account to enjoy royal dining
            </p>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-royal-dark-variant mb-6" />

            {/* Phone input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Mobile Number
              </label>
              <div className="flex rounded-xl border border-gray-200 dark:border-royal-dark-variant overflow-hidden focus-within:border-royal-maroon dark:focus-within:border-brand-gold-500 transition-colors">
                <div className="flex items-center px-3 bg-gray-50 dark:bg-royal-dark-variant border-r border-gray-200 dark:border-royal-dark-variant">
                  <span className="text-royal-maroon dark:text-brand-gold-400 font-semibold text-sm">
                    🇮🇳 +91
                  </span>
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
                  className="flex-1 px-4 py-3 bg-white dark:bg-royal-dark-surface text-gray-900 dark:text-royal-cream placeholder:text-gray-400 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Send OTP button */}
            <button
              onClick={handleSendOtp}
              disabled={phone.length !== 10 || isLoading}
              className="w-full h-12 rounded-xl bg-royal-maroon hover:bg-brand-maroon-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors flex items-center justify-center gap-2 mb-4"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Get OTP
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-100 dark:bg-royal-dark-variant" />
              <span className="text-xs text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-royal-dark-variant" />
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 rounded-xl border border-gray-200 dark:border-royal-dark-variant bg-white dark:bg-royal-dark-variant hover:bg-gray-50 dark:hover:bg-royal-dark disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-royal-cream font-medium transition-colors flex items-center justify-center gap-3 mb-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Guest */}
            <Link
              href="/"
              className="w-full h-10 flex items-center justify-center text-sm text-royal-maroon/70 dark:text-brand-gold-500/70 hover:text-royal-maroon dark:hover:text-brand-gold-400 transition-colors"
            >
              Continue as Guest
            </Link>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 dark:bg-royal-dark border-t border-gray-100 dark:border-royal-dark-variant">
            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-royal-maroon">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-royal-maroon">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
