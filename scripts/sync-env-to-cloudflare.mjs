#!/usr/bin/env node
/**
 * Sync environment variables from .env (and .env.local) to Cloudflare Pages
 * Requires: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in .env.local (or env)
 * Usage: node scripts/sync-env-to-cloudflare.mjs
 */

import { readFileSync, existsSync } from 'fs';

const PROJECT_NAME = 'tetmfg-site';
const LOCAL_ONLY_KEYS = ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN'];

// Parse .env-style file (returns {} if file missing)
function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const content = readFileSync(filePath, 'utf-8');
  const vars = {};
  content.split('\n').forEach(line => {
    if (line.trim().startsWith('#') || !line.trim()) return;
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      vars[key.trim()] = valueParts.join('=').trim();
    }
  });
  return vars;
}

// Load .env then .env.local (local overrides), exclude local-only keys from sync
function loadEnvForSync() {
  const env = { ...parseEnvFile('.env'), ...parseEnvFile('.env.local') };
  return Object.fromEntries(
    Object.entries(env).filter(([k]) => !LOCAL_ONLY_KEYS.includes(k))
  );
}

async function main() {
  const fromFiles = { ...parseEnvFile('.env'), ...parseEnvFile('.env.local') };
  const apiToken = process.env.CLOUDFLARE_API_TOKEN ?? fromFiles.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID ?? fromFiles.CLOUDFLARE_ACCOUNT_ID;

  if (!apiToken) {
    console.error('❌ Error: CLOUDFLARE_API_TOKEN not set\n');
    console.log('Set it in .env.local or run with: CLOUDFLARE_API_TOKEN=your_token node scripts/sync-env-to-cloudflare.mjs');
    console.log('Get a token: https://dash.cloudflare.com/profile/api-tokens (Pages:Edit)\n');
    process.exit(1);
  }

  if (!accountId) {
    console.error('❌ Error: CLOUDFLARE_ACCOUNT_ID not set\n');
    console.log('Add CLOUDFLARE_ACCOUNT_ID=your_account_id to .env.local (do not commit).');
    console.log('Find it in Cloudflare Dashboard → any domain → Overview (right sidebar).\n');
    process.exit(1);
  }

  console.log('🔄 Syncing environment variables to Cloudflare Pages...\n');

  const envVars = loadEnvForSync();
  console.log(`📖 Loaded .env + .env.local (excluding local-only keys)`);
  console.log(`✅ Found ${Object.keys(envVars).length} variables to sync\n`);

  // Format for Cloudflare API
  const envVarsFormatted = {};
  Object.entries(envVars).forEach(([key, value]) => {
    envVarsFormatted[key] = { type: 'plain_text', value };
  });

  // Update Cloudflare Pages project
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${PROJECT_NAME}`;

  const payload = {
    deployment_configs: {
      production: {
        env_vars: envVarsFormatted
      },
      preview: {
        env_vars: envVarsFormatted
      }
    }
  };

  console.log('📡 Sending to Cloudflare Pages API...');

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ API Error:', data);
      if (data.errors) {
        data.errors.forEach(err => console.error(`   - ${err.message}`));
      }
      process.exit(1);
    }

    console.log('\n✅ Successfully synced environment variables!\n');
    console.log('Updated variables:');
    Object.keys(envVars).forEach(key => {
      const value = envVars[key];
      const masked = value.length > 6
        ? value.substring(0, 3) + '***' + value.substring(value.length - 3)
        : '***';
      console.log(`  ✓ ${key} = ${masked}`);
    });

    console.log('\n🚀 Next deployment will use these values.');
    console.log('💡 Trigger a new deployment to apply: git push or redeploy in Cloudflare dashboard\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
