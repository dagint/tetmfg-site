#!/usr/bin/env node
/**
 * Sync environment variables from .env to Cloudflare Pages
 * Requires: Cloudflare API Token with Pages:Edit permission
 * Usage: CLOUDFLARE_API_TOKEN=your_token node sync-env-to-cloudflare.mjs
 */

import { readFileSync } from 'fs';

const ACCOUNT_ID = '9d1ece4e51911b8932e654eb8b000f4d';
const PROJECT_NAME = 'tetmfg-site';
const ENV_FILE = '.env';

// Parse .env file
function parseEnvFile(filePath) {
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

async function main() {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!apiToken) {
    console.error('❌ Error: CLOUDFLARE_API_TOKEN environment variable not set\n');
    console.log('To get an API token:');
    console.log('1. Go to https://dash.cloudflare.com/profile/api-tokens');
    console.log('2. Click "Create Token"');
    console.log('3. Use "Edit Cloudflare Pages" template or create custom token with Pages:Edit permission');
    console.log('4. Copy the token and run:\n');
    console.log(`   CLOUDFLARE_API_TOKEN=your_token node sync-env-to-cloudflare.mjs\n`);
    process.exit(1);
  }

  console.log('🔄 Syncing environment variables to Cloudflare Pages...\n');

  // Read .env file
  console.log(`📖 Reading ${ENV_FILE}...`);
  const envVars = parseEnvFile(ENV_FILE);
  console.log(`✅ Found ${Object.keys(envVars).length} variables\n`);

  // Format for Cloudflare API
  const envVarsFormatted = {};
  Object.entries(envVars).forEach(([key, value]) => {
    envVarsFormatted[key] = { type: 'plain_text', value };
  });

  // Update Cloudflare Pages project
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`;

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
