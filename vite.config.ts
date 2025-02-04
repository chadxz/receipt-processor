import { defineConfig } from "vitest/config";
import devServer from "@hono/vite-dev-server";
import { nodeAdapter as adapter } from "@hono/vite-dev-server/node";
import build from "@hono/vite-build/node";

export default defineConfig({
  keepProcessEnv: true,
  build: {
    sourcemap: true,
  },
  envPrefix: "APP_", // stripped off in config.ts
  plugins: [
    devServer({
      entry: "src/index.ts",
      adapter,
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
