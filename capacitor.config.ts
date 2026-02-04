import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.radhakrishn.pacer',
  appName: 'PACER',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  }
};

export default config;
