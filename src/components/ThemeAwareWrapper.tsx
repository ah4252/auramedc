"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  darkClass?: string;
  lightClass?: string;
};

export default function ThemeAwareWrapper({ children, darkClass = "", lightClass = "" }: Props) {
  const divRef = useRef<HTMLDivElement>(null);

  const applyTheme = () => {
    if (!divRef.current) return;
    const isDark = document.documentElement.classList.contains("dark");
    // Remove all classes from both darkClass and lightClass first
    const darkClasses = darkClass.split(" ").filter(Boolean);
    const lightClasses = lightClass.split(" ").filter(Boolean);
    divRef.current.classList.remove(...darkClasses, ...lightClasses);
    if (isDark) {
      divRef.current.classList.add(...darkClasses);
    } else {
      divRef.current.classList.add(...lightClasses);
    }
  };

  useEffect(() => {
    // Apply immediately on mount
    applyTheme();

    // Watch for class changes on <html> (e.g. dark class toggled)
    const observer = new MutationObserver(() => {
      applyTheme();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkClass, lightClass]);

  // Render with the correct initial class using SSR-safe check
  // We default to empty so it won't flash wrong color
  return <div ref={divRef}>{children}</div>;
}
