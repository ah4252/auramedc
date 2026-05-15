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
