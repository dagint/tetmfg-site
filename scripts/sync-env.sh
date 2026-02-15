#!/bin/bash
# Sync .env variables to Cloudflare Pages
# Requires: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in .env.local (or export before running)
# Usage: ./scripts/sync-env.sh

set -e

PROJECT_NAME="tetmfg-site"
ENV_FILE=".env"

# Load .env then .env.local (local overrides) so CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are available
if [ -f "$ENV_FILE" ]; then set -a; source "$ENV_FILE"; set +a; fi
if [ -f .env.local ]; then set -a; source .env.local; set +a; fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ Error: CLOUDFLARE_API_TOKEN not set"
  echo "Add it to .env.local or run: CLOUDFLARE_API_TOKEN=your_token ./scripts/sync-env.sh"
  echo "Get a token: https://dash.cloudflare.com/profile/api-tokens (Pages:Edit)"
  exit 1
fi

if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
  echo "❌ Error: CLOUDFLARE_ACCOUNT_ID not set"
  echo "Add CLOUDFLARE_ACCOUNT_ID=your_account_id to .env.local (do not commit)."
  echo "Find it in Cloudflare Dashboard → Overview (right sidebar)."
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Error: $ENV_FILE file not found"
  exit 1
fi

ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID"

echo "🔄 Syncing environment variables to Cloudflare Pages..."
echo ""

# Parse .env file and create JSON
ENV_VARS_JSON="{"

FIRST=true
while IFS='=' read -r key value; do
  # Skip comments and empty lines
  if [[ $key =~ ^[[:space:]]*# ]] || [[ -z $key ]]; then
    continue
  fi

  # Trim whitespace
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)

  if [ ! -z "$key" ]; then
    if [ "$FIRST" = true ]; then
      FIRST=false
    else
      ENV_VARS_JSON="$ENV_VARS_JSON,"
    fi

    ENV_VARS_JSON="$ENV_VARS_JSON\"$key\":{\"type\":\"plain_text\",\"value\":\"$value\"}"

    # Show masked value
    if [ ${#value} -gt 6 ]; then
      MASKED="${value:0:3}***${value: -3}"
    else
      MASKED="***"
    fi
    echo "  • $key = $MASKED"
  fi
done < "$ENV_FILE"

ENV_VARS_JSON="$ENV_VARS_JSON}"

# Create payload
PAYLOAD=$(cat <<EOF
{
  "deployment_configs": {
    "production": {
      "env_vars": $ENV_VARS_JSON
    },
    "preview": {
      "env_vars": $ENV_VARS_JSON
    }
  }
}
EOF
)

echo ""
echo "📡 Sending to Cloudflare API..."

# Make API call
RESPONSE=$(curl -s -X PATCH \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

# Check for success
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Successfully synced environment variables!"
  echo ""
  echo "🚀 Next deployment will use these values."
  echo "💡 Push to git or redeploy in Cloudflare dashboard to apply."
else
  echo "❌ Error updating environment variables:"
  echo "$RESPONSE" | grep -o '"message":"[^"]*"' | sed 's/"message":"//g' | sed 's/"//g'
  exit 1
fi
