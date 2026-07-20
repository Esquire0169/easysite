"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site";

/** Lightweight tab prank — 13g-style, EasySite wording. */
export function TabTitle() {
  useEffect(() => {
    const original = document.title;

    const onVisibility = () => {
      if (document.hidden) {
        document.title = `👋 ${siteConfig.name}: сайт за сутки`;
      } else {
        document.title = original;
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = original;
    };
  }, []);

  return null;
}
