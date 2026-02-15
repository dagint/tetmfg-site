# Syncing Environment Variables to Cloudflare Pages

This guide explains how to automatically sync your `.env` file to Cloudflare Pages.

> **⚠️ Note:** The automated sync requires a Cloudflare API token. For now, the recommended approach is **Option 3: Manual via Dashboard** as it's simpler and environment variables don't change frequently. The automated scripts are available for future use if needed.

## Quick Start

### Option 1: Using Node.js (Recommended)

1. **Get your Cloudflare API Token:**
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"
   - Use the "Edit Cloudflare Pages" template
   - Copy the generated token

2. **Run the sync script:**
   ```bash
   CLOUDFLARE_API_TOKEN=your_token_here npm run sync-env
   ```

### Option 2: Using Bash Script

```bash
CLOUDFLARE_API_TOKEN=your_token_here ./scripts/sync-env.sh
```

### Option 3: Manual via Dashboard

1. Go to Cloudflare Dashboard → Pages → tetmfg-site
2. Click Settings → Environment variables
3. Add these variables for **Production** and **Preview**:
   - `TET_PHONE` = 860-349-1004
   - `TET_EMAIL_USER` = CustomerService
   - `TET_EMAIL_DOMAIN` = tetmfg.com
   - `SITE_URL` = https://tetmfg.com

## Creating a Cloudflare API Token

### Step-by-Step:

1. **Log in to Cloudflare:**
   - Visit https://dash.cloudflare.com/profile/api-tokens

2. **Create a new token:**
   - Click "Create Token"
   - Select "Edit Cloudflare Pages" template
   - Or create a custom token with these permissions:
     - Account → Cloudflare Pages → Edit

3. **Configure token (if custom):**
   - **Permissions:**
     - Account - Cloudflare Pages - Edit
   - **Account Resources:**
     - Include - Specific account - (select your account)
   - **Zone Resources:**
     - Not required

4. **Create and copy token:**
   - Click "Continue to summary"
   - Click "Create Token"
   - **IMPORTANT:** Copy the token now - you won't see it again!

5. **Save the token securely:**
   - Option A: Add to your shell profile:
     ```bash
     # Add to ~/.bashrc or ~/.zshrc
     export CLOUDFLARE_API_TOKEN=your_token_here
     ```
   - Option B: Create a `.env.cloudflare` file (don't commit this!):
     ```bash
     CLOUDFLARE_API_TOKEN=your_token_here
     ```
     Then source it before syncing:
     ```bash
     source .env.cloudflare && npm run sync-env
     ```

## What Gets Synced

The sync script reads your `.env` file and syncs these variables:

- `TET_PHONE` - Phone number for contact page
- `TET_EMAIL_USER` - Email username
- `TET_EMAIL_DOMAIN` - Email domain
- `SITE_URL` - Site URL for sitemap

Variables are set for both **Production** and **Preview** environments.

## After Syncing

1. **Verify in Dashboard:**
   - Go to Cloudflare Pages → tetmfg-site → Settings → Environment variables
   - Confirm all variables are set correctly

2. **Trigger a new deployment:**
   - Option A: Push a commit to your repo
   - Option B: In Cloudflare Dashboard → Deployments → "Retry deployment"

3. **Variables will be available at build time** in your Astro site

## Troubleshooting

### "API Token not set"
- Make sure you've exported the `CLOUDFLARE_API_TOKEN` environment variable
- Check that the token hasn't expired

### "Unauthorized" or "403 Forbidden"
- Token doesn't have correct permissions
- Create a new token with "Cloudflare Pages:Edit" permission

### "Project not found"
- Check that the project name is exactly `tetmfg-site`
- Verify you're using the correct account ID

### Changes not appearing on site
- Environment variables are read at **build time**
- You need to trigger a new deployment after syncing
- Hard refresh your browser (Ctrl+F5) to see changes

## Security Notes

- **Never commit** `.env` or API tokens to git
- `.env` is already in `.gitignore`
- API tokens should be treated like passwords
- Rotate tokens periodically
- Use separate tokens for different environments/projects

## Files

- `sync-env-to-cloudflare.mjs` - Node.js sync script
- `sync-env.sh` - Bash sync script
- `.env` - Your local environment variables (not committed)
- `.env.example` - Template for environment variables (committed)

---

**Need help?** See the main [README.md](./README.md) or [EDITING_GUIDE.md](./EDITING_GUIDE.md)
