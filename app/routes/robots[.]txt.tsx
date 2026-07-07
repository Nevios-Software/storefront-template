/**
 * /robots.txt — resource route. Blocks the transactional / private surfaces
 * from crawlers and points them at the sitemap.
 */

export function loader({ request }: { request: Request }) {
  const origin = new URL(request.url).origin;

  const body = [
    "User-agent: *",
    "Disallow: /checkout",
    "Disallow: /account",
    "Disallow: /cart",
    "Disallow: /search",
    "Disallow: /design",
    "Disallow: /order/",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
