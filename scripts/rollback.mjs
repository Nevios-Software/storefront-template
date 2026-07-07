#!/usr/bin/env node
/**
 * One-command rollback — revert production to the previous version (Cloudflare
 * keeps prior Worker versions, so this is instant and free). Pass a version id
 * to roll back to a specific one.
 *
 *   npm run rollback                 # → previous version
 *   npm run rollback <version-id>    # → a specific version
 *   npx wrangler versions list       # see version history + ids
 */

import { execFileSync } from "node:child_process";

const target = process.argv[2];
const args = ["wrangler", "rollback"];
if (target) args.push(target);
args.push("--yes");

console.log(`$ npx ${args.join(" ")}`);
execFileSync("npx", args, { stdio: "inherit" });
