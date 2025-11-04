"use client";

import { initAnalytics } from "@/lib/analytics";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize (noop) and prepare GA dataLayer if available
    initAnalytics();
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      if ((window as any).gtag) {
        // Ensure GA is configured once with send_page_view disabled
        (window as any).gtag("config", "G-PYNT9RRWHB", { send_page_view: false, anonymize_ip: true });
      }
    }
  }, []);

  useEffect(() => {
    // Track page views on route change
    if (pathname) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");

      // Send page_view manually to avoid duplicates (auto disabled in layout)
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "page_view", {
          page_path: url,
          page_title: document.title,
        });
      }
    }
  }, [pathname, searchParams]);

  return null;
}
