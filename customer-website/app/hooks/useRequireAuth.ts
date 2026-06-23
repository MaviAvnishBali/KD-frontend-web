"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "./useAuthStore";

export function useRequireAuth() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken && !user) {
      router.replace(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [accessToken, user, pathname, router]);

  return { isAuthenticated: !!(accessToken || user) };
}
