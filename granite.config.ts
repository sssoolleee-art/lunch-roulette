import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'lunch-roulette',
  brand: {
    displayName: '점심 룰렛',
    primaryColor: '#E85D04',
    icon: 'https://via.placeholder.com/128x128/E85D04/FFFFFF?text=L',
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
