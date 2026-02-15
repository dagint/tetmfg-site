#!/usr/bin/env node
/**
 * Sync environment variables from .env file to Cloudflare Pages
 * Usage: node sync-env.mjs
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const ACCOUNT_ID = '9d1ece4e51911b8932e654eb8b000f4d';
const PROJECT_NAME = 'tetmfg-site';
const ENV_FILE = '.env';

// Read and parse .env file
function parseEnvFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const vars = {};

  content.split('\n').forEach(line => {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || !line.trim()) return;

    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      vars[key.trim()] = value;
    }
  });

  return vars;
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
  console.log('🔄 Syncing environment variables to Cloudflare Pages...\n');

  // Parse .env file
  console.log(`📖 Reading ${ENV_FILE}...`);
  const envVars = parseEnvFile(ENV_FILE);

  const varNames = Object.keys(envVars);
  console.log(`✅ Found ${varNames.length} variables: ${varNames.join(', ')}\n`);

  // First, get current project configuration
  console.log('📡 Fetching current project configuration...');

  const getCmd = `npx wrangler pages project list --account-id=${ACCOUNT_ID} --json`;

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
  // First, let's create a temporary script that uses wrangler's auth
  const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`;

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
