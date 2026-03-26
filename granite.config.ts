import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'lunch-roulette',
  brand: {
    displayName: '점심 룰렛',
    primaryColor: '#E85D04',
    icon: 'https://raw.githubusercontent.com/sssoolleee-art/lunch-roulette/main/public/icon.png',
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
