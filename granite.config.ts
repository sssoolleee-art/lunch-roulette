import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'lunch-roulette',
  brand: {
    displayName: '뭐먹지',
    primaryColor: '#E85D04',
    icon: 'https://static.toss.im/appsintoss/27863/8cd6680f-c7e7-46a4-aedb-7ac5a414798a.png',
  },
  web: {
    host: 'localhost',
    port: 5174,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
});
