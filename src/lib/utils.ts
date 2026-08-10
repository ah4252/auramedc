import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** دمج Tailwind classes بأمان مع حل التعارضات */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYoutubeThumbnail(url: string | null) {
  if (!url) return null;
  try {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
      }
    }
    
    if (url.includes("list=") && url.includes("v=")) {
       const vMatch = url.match(/[?&]v=([^&#]+)/);
       if (vMatch && vMatch[1]) {
          return `https://img.youtube.com/vi/${vMatch[1]}/hqdefault.jpg`;
       }
    }
  } catch (e) {}
  return null;
}

export function getSocialUrl(handle: string | null | undefined, platform: "facebook" | "instagram" | "telegram") {
  if (!handle) return "#";
  
  let cleanHandle = handle.trim();
  
  if (cleanHandle.startsWith("http://") || cleanHandle.startsWith("https://")) {
    return cleanHandle;
  }
  
  if (platform === "telegram") {
    cleanHandle = cleanHandle.replace(/^@/, "");
    if (cleanHandle.includes("t.me/")) cleanHandle = cleanHandle.split("t.me/")[1];
    return `https://t.me/${cleanHandle}`;
  }
  
  if (platform === "instagram") {
    cleanHandle = cleanHandle.replace(/^@/, "");
    if (cleanHandle.includes("instagram.com/")) cleanHandle = cleanHandle.split("instagram.com/")[1];
    return `https://instagram.com/${cleanHandle.split("/")[0]}`;
  }
  
  if (platform === "facebook") {
    if (cleanHandle.includes("facebook.com/")) {
       cleanHandle = cleanHandle.split("facebook.com/")[1];
    }
    cleanHandle = cleanHandle.replace(/\/$/, "");
    return `https://facebook.com/${cleanHandle}`;
  }
  
  return "#";
}

export function openInAppLink(url: string | null | undefined) {
  if (!url || url === "#") return;

  try {
    window.open(url, "_self", "noopener,noreferrer");
  } catch {
    window.location.href = url;
  }
}

export function getInAppLinkProps() {
  return {
    target: "_self" as const,
    rel: "noopener noreferrer",
  };
}

/** ضغط الصور برمجياً في المتصفح للحفاظ على حجم معقول لقاعدة البيانات */
export function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<File> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

