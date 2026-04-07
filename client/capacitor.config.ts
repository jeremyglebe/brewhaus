import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jeremyglebe.brewhaus',
  appName: 'Brewhaus',
  webDir: 'dist',
  android: {
    // SECURITY NOTE: allowMixedContent disables the browser's mixed content
    // protection, permitting HTTP requests from the HTTPS WebView origin
    // (https://localhost). This is a known security risk and is only acceptable
    // here because this is a local demo project. The correct solution for any
    // real deployment is to serve the GraphQL server over HTTPS.
    allowMixedContent: true,
  },
};

export default config;
