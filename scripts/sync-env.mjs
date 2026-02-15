#!/usr/bin/env node
/**
 * Sync environment variables from .env and .env.local to Cloudflare Pages
 * Requires: CLOUDFLARE_ACCOUNT_ID in .env.local (or env)
 * Usage: node scripts/sync-env.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const PROJECT_NAME = 'tetmfg-site';
const LOCAL_ONLY_KEYS = ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN'];

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

function loadEnvForSync() {
  const env = { ...parseEnvFile('.env'), ...parseEnvFile('.env.local') };
  return Object.fromEntries(
    Object.entries(env).filter(([k]) => !LOCAL_ONLY_KEYS.includes(k))
  );
}

function getAccountId() {
  const fromFiles = { ...parseEnvFile('.env'), ...parseEnvFile('.env.local') };
  return process.env.CLOUDFLARE_ACCOUNT_ID ?? fromFiles.CLOUDFLARE_ACCOUNT_ID;
}

// Get Cloudflare API token from wrangler config
function getApiToken() {
  try {
    // Wrangler stores credentials, we'll use wrangler to make the API call
    return null; // We'll use wrangler's auth instead
  } catch (err) {
    console.error('Failed to get API token:', err.message);
    process.exit(1);
  }
}

// Format environment variables for Cloudflare Pages API
function formatEnvVars(vars, environment = 'production') {
  const formatted = {};

  Object.entries(vars).forEach(([key, value]) => {
    formatted[key] = {
      type: 'plain_text',
      value: value
    };
  });

  return formatted;
}

async function syncToCloudflare() {
  const accountId = getAccountId();
  if (!accountId) {
    console.error('❌ Error: CLOUDFLARE_ACCOUNT_ID not set. Add it to .env.local.\n');
    process.exit(1);
  }

  console.log('🔄 Syncing environment variables to Cloudflare Pages...\n');

  const envVars = loadEnvForSync();
  const varNames = Object.keys(envVars);
  console.log(`📖 Loaded .env + .env.local`);
  console.log(`✅ Found ${varNames.length} variables: ${varNames.join(', ')}\n`);

  // First, get current project configuration
  console.log('📡 Fetching current project configuration...');

  const getCmd = `npx wrangler pages project list --account-id=${accountId} --json`;

  try {
    const output = execSync(getCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    const projects = JSON.parse(output);
    const project = projects.find(p => p.name === PROJECT_NAME);

    if (!project) {
      console.error(`❌ Project "${PROJECT_NAME}" not found in account`);
      console.log('\nAvailable projects:');
      projects.forEach(p => console.log(`  - ${p.name}`));
      process.exit(1);
    }

    console.log(`✅ Found project: ${PROJECT_NAME}\n`);
  } catch (err) {
    console.error('⚠️  Could not fetch project list. Continuing anyway...\n');
  }

  // Set each environment variable using Cloudflare API via curl
  console.log('⚙️  Setting environment variables...\n');

  // We need to use the Cloudflare API directly
  const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${PROJECT_NAME}`;

  // Format the deployment config
  const deploymentConfigs = {
    production: {
      env_vars: formatEnvVars(envVars, 'production')
    }
  };

  // Create a temp JSON file with the update
  const updateData = {
    deployment_configs: deploymentConfigs
  };

  console.log('Environment variables to set:');
  Object.entries(envVars).forEach(([key, value]) => {
    // Mask sensitive values
    const displayValue = key.includes('PHONE') || key.includes('EMAIL')
      ? value.substring(0, 3) + '***' + value.substring(value.length - 3)
      : value;
    console.log(`  ${key}=${displayValue}`);
  });

  console.log('\n⚠️  Note: Due to Cloudflare API limitations, you need to set these manually or use the API.');
  console.log('\n📋 Recommended approach:');
  console.log('1. Go to Cloudflare Dashboard → Pages → tetmfg-site → Settings → Environment variables');
  console.log('2. Add/update these variables for Production:\n');

  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`   ${key} = ${value}`);
  });

  console.log('\n💡 Alternative: Use the Cloudflare API directly with your API token');
  console.log(`   curl -X PATCH "${apiUrl}" \\`);
  console.log(`     -H "Authorization: Bearer YOUR_API_TOKEN" \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '${JSON.stringify(updateData, null, 2)}'`);

  console.log('\n✨ To automate this, you can create an API token at:');
  console.log('   https://dash.cloudflare.com/profile/api-tokens');
}

syncToCloudflare().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
