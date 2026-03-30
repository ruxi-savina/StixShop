/**
 * scripts/set-env.js
 * Injects the API_URL environment variable into environment.prod.ts at build time.
 * Used by Render (and any CI) so the backend URL doesn't need to be hardcoded.
 *
 * Usage: node scripts/set-env.js
 * Requires env var: API_URL (e.g. https://stixshop-api.onrender.com/api)
 */

const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL;

if (!apiUrl) {
  console.warn(
    '[set-env] WARNING: API_URL env var not set. Using existing environment.prod.ts as-is.',
  );
  process.exit(0);
}

const envFilePath = path.resolve(
  __dirname,
  '../src/environments/environment.prod.ts',
);

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

fs.writeFileSync(envFilePath, content, 'utf8');
console.log(`[set-env] environment.prod.ts updated with apiUrl: ${apiUrl}`);
