"use client";

import { useEffect } from "react";

export default function ProtectionGuard() {
  useEffect(() => {
    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Prevent Keyboard Shortcuts for DevTools, Print, Save, Screenshot
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (DevTools/Source)
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C" || e.key === "i" || e.key === "j" || e.key === "c")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u"))
      ) {
        e.preventDefault();
      }

      // Prevent Print (Ctrl+P) and Save (Ctrl+S)
      if (e.ctrlKey && (e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S")) {
        e.preventDefault();
      }

      // Detect Screenshot keys and show overlay
      let isScreenshotKey = false;

      // PrintScreen
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText(""); // Clear clipboard
        e.preventDefault();
        isScreenshotKey = true;
      }

      // Mac shortcuts (Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5)
      if (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) {
        e.preventDefault();
        isScreenshotKey = true;
      }
      
      // Windows Snipping Tool (Win+Shift+S)
      if (e.metaKey && e.shiftKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        isScreenshotKey = true;
      }

      if (isScreenshotKey) {
        handleObscure();
        // Hide overlay after 4 seconds
        setTimeout(() => {
          handleReveal();
        }, 4000);
      }
    };

    // 3. Obscure content when window loses focus (e.g. app switcher on mobile / Alt-Tab)
    const handleObscure = () => {
      let overlay = document.getElementById("protection-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "protection-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
        overlay.style.backdropFilter = "blur(15px)";
        overlay.style.WebkitBackdropFilter = "blur(15px)";
        overlay.style.zIndex = "9999999";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.color = "white";
        overlay.style.fontFamily = "system-ui, -apple-system, sans-serif";
        overlay.style.padding = "2rem";
        overlay.style.textAlign = "center";
        
        overlay.innerHTML = `
          <div style="font-size: 5rem; margin-bottom: 1rem;">🚫</div>
          <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: #ef4444; text-shadow: 0 2px 10px rgba(239,68,68,0.3);">تحذير أمني</h1>
          <p style="font-size: 1.5rem; font-weight: 600; line-height: 1.5; color: #f8fafc;">
            اوقف التسجيل ولا تاخذ لقطة شاشة ايها الغبي 🤡
          </p>
          <p style="font-size: 1rem; color: #94a3b8; margin-top: 2rem;">
            عُد إلى الصفحة لاستكمال التصفح
          </p>
        `;
        document.body.appendChild(overlay);
      }
      overlay.style.opacity = "1";
      overlay.style.visibility = "visible";
      
      // Hide the main content slightly to ensure nothing bleeds through
      const mainContent = document.getElementById("main-content-wrapper");
      if (mainContent) mainContent.style.opacity = "0";
    };

    const handleReveal = () => {
      const overlay = document.getElementById("protection-overlay");
      if (overlay) {
        overlay.style.opacity = "0";
        overlay.style.visibility = "hidden";
      }
      
      const mainContent = document.getElementById("main-content-wrapper");
      if (mainContent) mainContent.style.opacity = "1";
    };

    // Prevent drag on images
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    // Initial CSS to prevent selection
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    // Adding media print style to prevent printing/saving as PDF
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        html, body {
          display: none !important;
        }
      }
      * {
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
      input, textarea {
        -webkit-user-select: auto;
        -khtml-user-select: auto;
        -moz-user-select: auto;
        -ms-user-select: auto;
        user-select: auto;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      
      document.body.style.userSelect = "auto";
      document.body.style.webkitUserSelect = "auto";
      document.head.removeChild(style);
      
      const overlay = document.getElementById("protection-overlay");
      if (overlay) overlay.remove();
    };
  }, []);

  return null;
}
