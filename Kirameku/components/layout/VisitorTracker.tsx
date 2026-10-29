"use client";

import { useEffect } from "react";
import { siteConfig } from "@/siteConfig";

export default function VisitorTracker() {
  useEffect(() => {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || siteConfig.apiBaseUrl || "").replace(/\/+$/, "");
    if (!apiBase) return;

    // 访客记录
    if (!sessionStorage.getItem("visitor_recorded")) {
      fetch(`${apiBase}/api/visitors/record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-path": window.location.pathname,
        },
        body: JSON.stringify({
          path: window.location.pathname,
        }),
      })
        .then(() => {
          sessionStorage.setItem("visitor_recorded", "1");
        })
        .catch(() => {});
    }

    // 获取地理位置，供看板娘欢迎语使用
    if (!sessionStorage.getItem("visitor_location")) {
      fetch(`${apiBase}/api/visitors/location`)
        .then((r) => r.json())
        .then((res) => {
          if (res.code === 0 && res.data && (res.data.city || res.data.region)) {
            sessionStorage.setItem("visitor_location", JSON.stringify(res.data));
          }
        })
        .catch(() => {});
    }
  }, []);

  return null;
}
