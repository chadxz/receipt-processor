import { defineConfig } from "vitest/config";
import devServer from "@hono/vite-dev-server";
import build from "@hono/vite-build/node";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    devServer({
      entry: "src/index.ts",
    }),
    build({
      entry: "src/index.ts",
      port: 3000,
    }),
  ],
  test: {
    globals: true,
    environment: "node",
  },
});
