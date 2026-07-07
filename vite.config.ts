import { fileURLToPath } from "node:url";

import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 3030 },
  // Mirror tsconfig `paths` ("~/*" → "./app/*") so the Cloudflare dev runner
  // resolves "~/..." imports. The reactRouter build honours tsconfig, but the
  // workerd module runner needs the alias declared to Vite explicitly too.
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    reactRouter(),
  ],
});
