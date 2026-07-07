// Minimal Env shape (regenerate richer types with `pnpm cf-typegen`).
// These are the publishable vars from wrangler.jsonc / .dev.vars.
interface Env {
  NEVIOS_API_URL: string;
  NEVIOS_MARKET: string;
  NEVIOS_PUBLISHABLE_KEY: string;
}
