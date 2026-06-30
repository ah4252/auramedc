import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.auramed.app',
  appName: 'AuraMed Elite',
  webDir: 'public',
  server: {
    url: 'https://auramedc.vercel.app',
    cleartext: false
  }
};

export default config;