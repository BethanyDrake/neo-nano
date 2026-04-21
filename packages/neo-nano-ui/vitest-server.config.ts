import { defineConfig } from 'vitest/config'
import path from "path";
export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/vitest-server.setup.ts'],
    clearMocks: true,
    fileParallelism: false,
    include: ['./src/lib/serverFunctions/**/*.test.ts'],
    coverage: {
      enabled: true
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
