import type { Config } from "@react-router/dev/config";

export default {
  // Server-side render every route (catalog + order pages are SSR'd for speed
  // + SEO; cart/checkout are interactive on the client via the kit providers).
  ssr: true,
  // Required with @cloudflare/vite-plugin: it builds via Vite's Environments
  // API, so RR must opt in or the client/server build directories diverge
  // (dist/ssr vs build/server) and `react-router build` fails.
  future: {
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
