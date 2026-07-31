"use client";

import { useEffect } from "react";

export default function AppLinkGuard() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      const isExternal = /^https?:\/\//i.test(href);
      const isSameOrigin = href.startsWith("/") || href.startsWith("./") || href.startsWith("?") || href.startsWith(window.location.origin);

      if (anchor.hasAttribute("download")) return;

      if (anchor.getAttribute("target") === "_blank" || (isExternal && !isSameOrigin)) {
        event.preventDefault();
        if (isExternal) {
          window.location.href = href;
          return;
        }
        window.location.assign(href);
      }
    };

    const originalWindowOpen = window.open;
    window.open = ((url?: string | URL, target?: string, features?: string) => {
      if (url) {
        const nextUrl = typeof url === "string" ? url : url.toString();
        const isInternal = nextUrl.startsWith("/") || nextUrl.startsWith("./") || nextUrl.startsWith("?") || nextUrl.startsWith(window.location.origin);

        if (target === "_blank" || (!isInternal && /^https?:\/\//i.test(nextUrl))) {
          window.location.href = nextUrl;
          return null;
        }
      }

      return originalWindowOpen.call(window, url, target ?? "_self", features);
    }) as typeof window.open;

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.open = originalWindowOpen;
    };
  }, []);

  return null;
}
