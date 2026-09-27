// Full Stack open, The University of Helsinki
// Exercises 5.13 - 5.16 Blog List Tests
// Url : https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16
// Created on 2026-09-09 01:50 HKT

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
  }
})
