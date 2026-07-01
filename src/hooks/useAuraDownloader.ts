import { useState, useCallback, useEffect } from 'react';
import { AuraDownloader, blobToBase64 } from '@/capacitor/plugins/AuraDownloader';
import { Capacitor } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';

export function useAuraDownloader() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDownloadId, setCurrentDownloadId] = useState<string | null>(null);

  useEffect(() => {
    let progressListener: PluginListenerHandle | undefined;
    let completeListener: PluginListenerHandle | undefined;

    const setupListeners = async () => {
      if (!Capacitor.isNativePlatform()) return;

      progressListener = await AuraDownloader.addListener('progress', (data) => {
        if (data.downloadId === currentDownloadId) {
          setProgress(data.progress);
        }
      });

      completeListener = await AuraDownloader.addListener('downloadComplete', (data) => {
        if (data.downloadId === currentDownloadId) {
          setIsDownloading(false);
          setProgress(100);
          setCurrentDownloadId(null);
        }
      });
    };

    if (currentDownloadId) {
      setupListeners();
    }

    return () => {
      if (progressListener) progressListener.remove();
      if (completeListener) completeListener.remove();
    };
  }, [currentDownloadId]);

  const download = useCallback(async (url: string, fileName: string, mimeType?: string) => {
    try {
      setProgress(0);
      setIsDownloading(true);
      const res = await AuraDownloader.download({ url, fileName, mimeType });
      
      if (res.alreadyExists) {
        setIsDownloading(false);
        setProgress(100);
        return res;
      }

      setCurrentDownloadId(res.downloadId || null);
      
      // On web fallback, complete immediately since there's no native event
      if (!Capacitor.isNativePlatform()) {
        setTimeout(() => {
          setIsDownloading(false);
          setProgress(100);
          setCurrentDownloadId(null);
        }, 1000);
      }
      return res;
    } catch (e) {
      setIsDownloading(false);
      throw e;
    }
  }, []);

  const cancel = useCallback(async () => {
    if (currentDownloadId && Capacitor.isNativePlatform()) {
      await AuraDownloader.cancel({ downloadId: currentDownloadId });
      setIsDownloading(false);
      setCurrentDownloadId(null);
      setProgress(0);
    }
  }, [currentDownloadId]);

  const saveFile = useCallback(async (data: string, fileName: string, mimeType?: string) => {
    return await AuraDownloader.saveFile({ data, fileName, mimeType });
  }, []);

  // For backwards compatibility and convenience
  const saveBase64 = useCallback(async (base64: string, fileName: string, mimeType?: string) => {
    return await AuraDownloader.saveFile({ data: base64, fileName, mimeType });
  }, []);

  const saveBlob = useCallback(async (blob: Blob, fileName: string) => {
    const base64 = await blobToBase64(blob);
    return await AuraDownloader.saveFile({ data: base64, fileName, mimeType: blob.type });
  }, []);

  const share = useCallback(async (options: { url?: string; text?: string; title?: string; base64?: string; uri?: string }) => {
    return await AuraDownloader.share(options);
  }, []);

  const open = useCallback(async (options: { url?: string; uri?: string }) => {
    return await AuraDownloader.open(options);
  }, []);

  const exists = useCallback(async (fileName: string) => {
    return await AuraDownloader.exists({ fileName });
  }, []);

  const getUri = useCallback(async (fileName: string) => {
    return await AuraDownloader.getUri({ fileName });
  }, []);

  const deleteFile = useCallback(async (uri: string) => {
    return await AuraDownloader.deleteFile({ uri });
  }, []);

  const list = useCallback(async (options: { type?: string; folder?: string } = {}) => {
    return await AuraDownloader.list(options);
  }, []);

  return {
    download,
    cancel,
    saveFile,
    saveBase64,
    saveBlob,
    share,
    open,
    exists,
    getUri,
    deleteFile,
    list,
    isDownloading,
    progress,
    currentDownloadId
  };
}
