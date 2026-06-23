"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../../hooks/useAuthStore";

const OTP_LENGTH = 6;
const RESEND_DELAY = 60;

function OtpPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone     = searchParams.get("phone") ?? "";
  const returnUrl = searchParams.get("returnUrl") ?? "/";
  const { verifyOtp, sendOtp, isLoading } = useAuthStore();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    setError(null);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigits((prev) => { const next = [...prev]; next[index] = ""; return next; });
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setDigits((prev) => { const next = [...prev]; next[index - 1] = ""; return next; });
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [digits]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted.length === 0) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }, []);

  const handleVerify = async () => {
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setError("Please enter all 6 digits");
      return;
    }
    try {
      await verifyOtp(phone, otp);
      toast.success("Welcome to Kila Darbar!");
      router.replace(returnUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid OTP, please try again";
      setError(message);
      // Clear and refocus
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp(phone);
      toast.success("OTP resent successfully!");
      setSecondsLeft(RESEND_DELAY);
      setDigits(Array(OTP_LENGTH).fill(""));
      setError(null);
      inputRefs.current[0]?.focus();
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  const otp = digits.join("");
  const isComplete = otp.length === OTP_LENGTH;

  return (
    <div className="min-h-screen bg-royal-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: "url('/images/mughal-pattern.svg')", backgroundSize: "300px" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative"
      >
        {/* Back link */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-serif font-bold text-brand-gold-400">Verify OTP</h1>
          <p className="text-white/70 mt-2 text-sm">
            We sent a 6-digit code to
          </p>
          <p className="text-white font-semibold">{phone}</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-royal-dark-surface rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              Enter the 6-digit OTP · Valid for 5 minutes
            </p>

            {/* OTP boxes */}
            <div className="flex gap-2 justify-center mb-2" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  className={[
                    "w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all",
                    "dark:bg-royal-dark dark:text-royal-cream",
                    error
                      ? "border-red-400 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                      : digit
                        ? "border-royal-maroon bg-red-50 dark:bg-royal-dark-variant text-royal-maroon dark:text-brand-gold-400"
                        : "border-gray-200 dark:border-royal-dark-variant focus:border-royal-maroon dark:focus:border-brand-gold-500 bg-white",
                  ].join(" ")}
                />
              ))}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center mb-4"
              >
                {error}
              </motion.p>
            )}

            <div className="h-4" />

            {/* Verify button */}
            <button
              onClick={handleVerify}
              disabled={!isComplete || isLoading}
              className="w-full h-12 rounded-xl bg-royal-maroon hover:bg-brand-maroon-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors flex items-center justify-center gap-2 mb-4"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Verify & Login"
              )}
            </button>

            {/* Resend */}
            <div className="flex items-center justify-center gap-1 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Didn't receive it?</span>
              {secondsLeft > 0 ? (
                <span className="text-gray-400 dark:text-gray-500">Resend in {secondsLeft}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-royal-maroon dark:text-brand-gold-400 font-semibold hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-50 dark:bg-royal-dark border-t border-gray-100 dark:border-royal-dark-variant">
            <p className="text-xs text-gray-400 text-center">
              Wrong number?{" "}
              <Link href="/auth/login" className="text-royal-maroon dark:text-brand-gold-400 underline">
                Change number
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpPageInner />
    </Suspense>
  );
}
