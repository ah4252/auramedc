package com.auramed.app;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.webkit.MimeTypeMap;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Locale;

@CapacitorPlugin(name = "AuraDownloader")
public class AuraDownloaderPlugin extends Plugin {

    private static final String TAG = "AuraDownloaderPlugin";
    private static final String FOLDER_NAME = "AuraMed";
    private boolean DEBUG = true;

    private BroadcastReceiver downloadReceiver;

    private void logDebug(String msg) {
        if (DEBUG) {
            Log.d(TAG, msg);
        }
    }

    @Override
    public void load() {
        super.load();
        Log.d("AuraDownloader", "AuraDownloaderPlugin.load() called");
        downloadReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                if (DownloadManager.ACTION_DOWNLOAD_COMPLETE.equals(action)) {
                    long downloadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                    if (downloadId != -1) {
                        checkDownloadStatus(downloadId);
                    }
                }
            }
        };
        
        IntentFilter filter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            getContext().registerReceiver(downloadReceiver, filter, Context.RECEIVER_EXPORTED);
        } else {
            getContext().registerReceiver(downloadReceiver, filter);
        }
    }

    @Override
    protected void handleOnDestroy() {
        unregisterDownloadReceiver();
        super.handleOnDestroy();
    }

    /**
     * Capacitor 8 also calls this when the Bridge is detached from the window.
     * Ensure cleanup runs in both cases.
     */
    @Override
    protected void handleOnDetachedFromWindow() {
        unregisterDownloadReceiver();
        super.handleOnDetachedFromWindow();
    }

    private void unregisterDownloadReceiver() {
        if (downloadReceiver != null) {
            try {
                getContext().unregisterReceiver(downloadReceiver);
                downloadReceiver = null;
            } catch (Exception ignored) {}
        }
    }

    private void checkDownloadStatus(long downloadId) {
        DownloadManager dm = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);
        DownloadManager.Query q = new DownloadManager.Query();
        q.setFilterById(downloadId);

        try (Cursor cursor = dm.query(q)) {
            if (cursor != null && cursor.moveToFirst()) {
                int status = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
                if (status == DownloadManager.STATUS_SUCCESSFUL) {
                    String title = cursor.getString(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_TITLE));
                    Uri definitiveUri = getUriInternal(title);
                    
                    JSObject completeData = new JSObject();
                    completeData.put("downloadId", String.valueOf(downloadId));
                    completeData.put("uri", definitiveUri != null ? definitiveUri.toString() : null);
                    completeData.put("state", "COMPLETED");
                    notifyListeners("downloadComplete", completeData);
                } else if (status == DownloadManager.STATUS_FAILED) {
                    int reason = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_REASON));
                    JSObject errorData = new JSObject();
                    errorData.put("downloadId", String.valueOf(downloadId));
                    errorData.put("error", "Download failed with reason code: " + reason);
                    errorData.put("state", "ERROR");
                    notifyListeners("downloadComplete", errorData);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "checkDownloadStatus error", e);
        }
    }

    private Uri getUriInternal(String fileName) {
        String[] projection = {MediaStore.Downloads._ID};
        // Ensure we only find files in our folder
        String selection = MediaStore.Downloads.DISPLAY_NAME + " = ? AND " + MediaStore.Downloads.RELATIVE_PATH + " LIKE ?";
        String[] selectionArgs = new String[]{fileName, "%" + Environment.DIRECTORY_DOWNLOADS + "/" + FOLDER_NAME + "%"};

        try (Cursor cursor = getContext().getContentResolver().query(
                MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                projection,
                selection,
                selectionArgs,
                null
        )) {
            if (cursor != null && cursor.moveToFirst()) {
                long id = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Downloads._ID));
                return Uri.withAppendedPath(MediaStore.Downloads.EXTERNAL_CONTENT_URI, String.valueOf(id));
            }
        } catch (Exception e) {
            Log.e(TAG, "getUriInternal error", e);
        }
        return null;
    }

    @PluginMethod
    public void getUri(PluginCall call) {
        String fileName = call.getString("fileName");
        if (fileName == null) {
            call.reject("Missing required parameter: fileName");
            return;
        }

        Uri uri = getUriInternal(fileName);
        JSObject ret = new JSObject();
        if (uri != null) {
            ret.put("uri", uri.toString());
        } else {
            ret.put("uri", JSObject.NULL);
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void saveFile(PluginCall call) {
        String base64 = call.getString("data");
        String fileName = call.getString("fileName");
        String providedMime = call.getString("mimeType");

        if (base64 == null || fileName == null) {
            call.reject("Missing required parameters: data, fileName");
            return;
        }

        try {
            if (base64.contains(",")) {
                base64 = base64.substring(base64.indexOf(",") + 1);
            }

            byte[] data = Base64.decode(base64, Base64.DEFAULT);
            String mime = providedMime != null ? providedMime : guessMimeType(fileName);

            ContentResolver resolver = getContext().getContentResolver();
            ContentValues values = new ContentValues();
            values.put(MediaStore.Downloads.DISPLAY_NAME, fileName);
            values.put(MediaStore.Downloads.MIME_TYPE, mime);
            values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/" + FOLDER_NAME);

            Uri uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
            if (uri == null) {
                call.reject("Failed to create MediaStore entry");
                return;
            }

            try (OutputStream out = resolver.openOutputStream(uri)) {
                if (out == null) {
                    call.reject("Unable to open output stream");
                    return;
                }
                out.write(data);
                out.flush();
            }

            logDebug("saveFile: Saved successfully to " + uri.toString());
            JSObject ret = new JSObject();
            ret.put("uri", uri.toString());
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "saveFile error", e);
            call.reject("saveFile failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void download(PluginCall call) {
        String urlString = call.getString("url");
        String fileName = call.getString("fileName");
        String providedMime = call.getString("mimeType");

        if (urlString == null || fileName == null) {
            call.reject("Missing required parameters: url, fileName");
            return;
        }

        Uri existingUri = getUriInternal(fileName);
        if (existingUri != null) {
            logDebug("download: File exists, using cache -> " + existingUri.toString());
            JSObject ret = new JSObject();
            ret.put("alreadyExists", true);
            ret.put("uri", existingUri.toString());
            call.resolve(ret);
            return;
        }

        try {
            Uri downloadUri = Uri.parse(urlString);
            DownloadManager.Request request = new DownloadManager.Request(downloadUri);

            request.setTitle(fileName);
            request.setDescription("Downloading...");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            
            String mime = providedMime != null ? providedMime : guessMimeType(fileName);
            request.setMimeType(mime);

            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, FOLDER_NAME + "/" + fileName);

            DownloadManager dm = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);
            long downloadId = dm.enqueue(request);

            JSObject ret = new JSObject();
            ret.put("alreadyExists", false);
            ret.put("downloadId", String.valueOf(downloadId));
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "download error", e);
            call.reject("download failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void cancel(PluginCall call) {
        String downloadIdStr = call.getString("downloadId");
        if (downloadIdStr == null) {
            call.reject("Missing required parameter: downloadId");
            return;
        }

        try {
            long downloadId = Long.parseLong(downloadIdStr);
            DownloadManager dm = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);
            dm.remove(downloadId);
            logDebug("cancel: Download " + downloadId + " cancelled.");
            call.resolve();
        } catch (Exception e) {
            call.reject("Cancel failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void exists(PluginCall call) {
        String fileName = call.getString("fileName");
        if (fileName == null) {
            call.reject("Missing required parameter: fileName");
            return;
        }

        Uri uri = getUriInternal(fileName);
        JSObject ret = new JSObject();
        ret.put("exists", uri != null);
        call.resolve(ret);
    }

    @PluginMethod
    public void deleteFile(PluginCall call) {
        String uriString = call.getString("uri");
        if (uriString == null) {
            call.reject("Missing required parameter: uri");
            return;
        }

        try {
            Uri uri = Uri.parse(uriString);
            int deleted = getContext().getContentResolver().delete(uri, null, null);
            JSObject ret = new JSObject();
            ret.put("deleted", deleted > 0);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "deleteFile error", e);
            call.reject("deleteFile failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void list(PluginCall call) {
        String typeFilter = call.getString("type");
        
        JSArray results = new JSArray();
        String[] projection = {
                MediaStore.Downloads._ID,
                MediaStore.Downloads.DISPLAY_NAME,
                MediaStore.Downloads.MIME_TYPE,
                MediaStore.Downloads.SIZE,
                MediaStore.Downloads.DATE_MODIFIED
        };
        
        String selection = MediaStore.Downloads.RELATIVE_PATH + " LIKE ?";
        String[] selectionArgs;

        if (typeFilter != null && !typeFilter.isEmpty()) {
            selection += " AND " + MediaStore.Downloads.MIME_TYPE + " LIKE ?";
            selectionArgs = new String[]{"%" + Environment.DIRECTORY_DOWNLOADS + "/" + FOLDER_NAME + "%", "%" + typeFilter + "%"};
        } else {
            selectionArgs = new String[]{"%" + Environment.DIRECTORY_DOWNLOADS + "/" + FOLDER_NAME + "%"};
        }

        try (Cursor cursor = getContext().getContentResolver().query(
                MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                projection,
                selection,
                selectionArgs,
                null
        )) {
            if (cursor != null && cursor.moveToFirst()) {
                do {
                    long id = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Downloads._ID));
                    String name = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Downloads.DISPLAY_NAME));
                    String mime = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Downloads.MIME_TYPE));
                    long size = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Downloads.SIZE));
                    long dateModified = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Downloads.DATE_MODIFIED));
                    
                    Uri uri = Uri.withAppendedPath(MediaStore.Downloads.EXTERNAL_CONTENT_URI, String.valueOf(id));

                    JSObject fileObj = new JSObject();
                    fileObj.put("name", name != null ? name : "");
                    fileObj.put("uri", uri.toString());
                    fileObj.put("mimeType", mime != null ? mime : "");
                    fileObj.put("size", size);
                    fileObj.put("dateModified", dateModified * 1000); // ms
                    results.put(fileObj);
                } while (cursor.moveToNext());
            }
            
            JSObject ret = new JSObject();
            ret.put("files", results);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "list error", e);
            call.reject("list failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void share(PluginCall call) {
        String urlStr = call.getString("url");
        String text = call.getString("text");
        String title = call.getString("title", "Share");
        String base64 = call.getString("base64");
        String uriStr = call.getString("uri");

        try {
            Intent intent = new Intent(Intent.ACTION_SEND);
            intent.setType("text/plain");

            if (text != null) {
                intent.putExtra(Intent.EXTRA_TEXT, text);
            }
            if (urlStr != null) {
                String shareText = text != null ? text + "\n" + urlStr : urlStr;
                intent.putExtra(Intent.EXTRA_TEXT, shareText);
            }

            if (uriStr != null) {
                // Since getUri now returns MediaStore content:// URIs directly!
                Uri contentUri = Uri.parse(uriStr);
                intent.putExtra(Intent.EXTRA_STREAM, contentUri);
                intent.setType("*/*");
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            } else if (base64 != null) {
                if (base64.contains(",")) {
                    base64 = base64.substring(base64.indexOf(",") + 1);
                }
                byte[] data = Base64.decode(base64, Base64.DEFAULT);
                
                File cacheDir = new File(getContext().getCacheDir(), "shared");
                if (!cacheDir.exists()) {
                    cacheDir.mkdirs();
                }
                File file = new File(cacheDir, "share_file");
                try (FileOutputStream fos = new FileOutputStream(file)) {
                    fos.write(data);
                    fos.flush();
                }

                Uri fileUri = FileProvider.getUriForFile(
                        getContext(), 
                        getContext().getPackageName() + ".fileprovider", 
                        file
                );
                
                intent.putExtra(Intent.EXTRA_STREAM, fileUri);
                intent.setType("*/*");
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            }

            Intent chooser = Intent.createChooser(intent, title);
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(chooser);
            
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "share error", e);
            call.reject("share failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void open(PluginCall call) {
        String url = call.getString("url");
        String uriStr = call.getString("uri");
        
        String targetStr = uriStr != null ? uriStr : url;
        if (targetStr == null) {
            call.reject("Missing required parameter: url or uri");
            return;
        }

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(targetStr));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
             Log.e(TAG, "open error", e);
             call.reject("open failed: " + e.getMessage());
        }
    }

    private String guessMimeType(String fileName) {
        String extension = "";
        int i = fileName.lastIndexOf('.');
        if (i > 0) {
            extension = fileName.substring(i + 1).toLowerCase(Locale.ROOT);
        }
        
        String mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        if (mimeType == null) {
            return "application/octet-stream";
        }
        return mimeType;
    }
}
