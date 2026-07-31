import { registerPlugin, Capacitor } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';
import { openInAppLink } from '@/lib/utils';

export interface FileItem {
  name: string;
  uri: string;
  mimeType: string;
  size: number;
  dateModified: number;
}

export interface AuraDownloaderPlugin {
  saveFile(options: {
    data: string;
    fileName: string;
    mimeType?: string;
  }): Promise<{ uri: string }>;

  download(options: {
    url: string;
    fileName: string;
    mimeType?: string;
  }): Promise<{ downloadId?: string; alreadyExists: boolean; uri?: string }>;

  share(options: {
    url?: string;
    text?: string;
    title?: string;
    base64?: string;
    uri?: string;
  }): Promise<void>;

  open(options: { url?: string; uri?: string }): Promise<void>;

  cancel(options: { downloadId: string }): Promise<void>;

  exists(options: { fileName: string }): Promise<{ exists: boolean }>;

  getUri(options: { fileName: string }): Promise<{ uri: string | null }>;

  deleteFile(options: { uri: string }): Promise<{ deleted: boolean }>;

  list(options: { type?: string; folder?: string }): Promise<{ files: FileItem[] }>;

  addListener(
    eventName: 'progress',
    listenerFunc: (progress: {
      downloadId: string;
      progress: number;
      total: number;
      expectedTotal: number;
    }) => void,
  ): Promise<PluginListenerHandle>;

  addListener(
    eventName: 'downloadComplete',
    listenerFunc: (result: {
      downloadId: string;
      uri?: string;
      error?: string;
      state: 'COMPLETED' | 'ERROR';
    }) => void,
  ): Promise<PluginListenerHandle>;
}

// Native Plugin Registration
const NativeAuraDownloader = registerPlugin<AuraDownloaderPlugin>('AuraDownloader');

/**
 * Utility to convert a Blob into a Base64 string
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });
};

/**
 * Web Fallbacks implemented directly in TypeScript
 * so the React Hook doesn't need platform checks.
 */
class WebAuraDownloader implements Partial<AuraDownloaderPlugin> {
  async saveFile(options: { data: string; fileName: string; mimeType?: string }) {
    let { data, mimeType } = options;
    if (!data.startsWith('data:')) {
      data = `data:${mimeType || 'application/octet-stream'};base64,${data}`;
    }
    const a = document.createElement('a');
    a.href = data;
    a.download = options.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return { uri: data };
  }

  async download(options: { url: string; fileName: string; mimeType?: string }) {
    const a = document.createElement('a');
    a.href = options.url;
    a.download = options.fileName;
    a.target = '_self';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return { alreadyExists: false, downloadId: 'web-download' };
  }

  async share(options: { url?: string; text?: string; title?: string; base64?: string; uri?: string }) {
    if (navigator.share) {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url || options.uri,
      });
    } else {
      console.warn('Web Share API not supported in this browser.');
    }
  }

  async open(options: { url?: string; uri?: string }) {
    openInAppLink(options.url || options.uri);
  }

  async exists(options: { fileName: string }) {
    return { exists: false };
  }

  async getUri(options: { fileName: string }) {
    return { uri: null };
  }

  async deleteFile(options: { uri: string }) {
    return { deleted: false };
  }

  async list(options: { type?: string; folder?: string }) {
    return { files: [] };
  }

  async cancel(options: { downloadId: string }) {
    console.warn('Cancel not supported on web fallback');
  }
}

// Export the correct instance based on platform
export const AuraDownloader = Capacitor.isNativePlatform()
  ? NativeAuraDownloader
  : (new WebAuraDownloader() as unknown as AuraDownloaderPlugin);
