#!/bin/bash
# Sync .env variables to Cloudflare Pages
# Usage: CLOUDFLARE_API_TOKEN=your_token ./sync-env.sh

set -e

ACCOUNT_ID="9d1ece4e51911b8932e654eb8b000f4d"
PROJECT_NAME="tetmfg-site"
ENV_FILE=".env"

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ Error: CLOUDFLARE_API_TOKEN environment variable not set"
  echo ""
  echo "Get your API token:"
  echo "1. Visit: https://dash.cloudflare.com/profile/api-tokens"
  echo "2. Create a token with 'Cloudflare Pages:Edit' permission"
  echo "3. Run: CLOUDFLARE_API_TOKEN=your_token ./sync-env.sh"
  echo ""
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Error: $ENV_FILE file not found"
  exit 1
fi

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
