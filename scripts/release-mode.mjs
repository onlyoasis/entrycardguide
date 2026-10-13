#!/usr/bin/env node
// Which production release the deploy job can make. "full" needs a real D1
// database_id in wrangler.toml (MCP accounts live there). Until then the job
// makes a "static" release: the site ships without the D1 binding and every
// MCP route answers 503 mcp_not_configured (functions/_mcp/http.js).
// layouts/partials/mcp-open.html applies the same rule at build time.
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import TOML from '@iarna/toml';

export const D1_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function releaseMode(tomlText) {
  const database = TOML.parse(tomlText).d1_databases?.find(item => item.binding === 'DB');
  return D1_ID.test(database?.database_id || '') ? 'full' : 'static';
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const file = process.argv[2] || 'wrangler.toml';
  if (!existsSync(file)) { console.error(`release-mode: ${file} not found`); process.exit(1); }
  console.log(releaseMode(readFileSync(file, 'utf8')));
}
