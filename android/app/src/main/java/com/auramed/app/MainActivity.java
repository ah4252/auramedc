package com.auramed.app;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        Log.d("AuraDownloader", "MainActivity started");
        Log.d("AuraDownloader", "Registering AuraDownloaderPlugin...");
        registerPlugin(AuraDownloaderPlugin.class);
        Log.d("AuraDownloader", "registerPlugin() finished");
        super.onCreate(savedInstanceState);
        
        // طباعة جميع الـ Plugins المسجلة في الـ Bridge
        if (bridge != null && bridge.getPlugins() != null) {
            Log.d("AuraDownloader", "Registered Plugins: " + bridge.getPlugins().keySet().toString());
        } else {
            Log.d("AuraDownloader", "Bridge or Plugins map is null!");
        }
    }
}
