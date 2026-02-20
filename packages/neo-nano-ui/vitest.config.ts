import { defineConfig } from 'vitest/config'
import path from "path";
export default defineConfig({
  plugins: [stubNextAssetImport()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/vitest.setup.ts'],
    clearMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})


function stubNextAssetImport() {
  return {
    name: 'stub-next-asset-import',
    transform(_code: string, id: string) {
      if (/(jpg|jpeg|png|webp|gif|svg)$/.test(id)) {
        const imgSrc = path.relative(process.cwd(), id);
        return {
          code: `export default { src: '/${imgSrc}', height: 1, width: 1, blurDataURL:  '/${imgSrc}'}`,
        };
      }
    },
  };
}