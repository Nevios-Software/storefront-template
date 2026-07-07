import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// Flat file-based routes (Remix-style): app/routes/*.tsx
export default flatRoutes() satisfies RouteConfig;
