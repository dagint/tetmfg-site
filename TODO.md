# TODO / Future Improvements

## Open Issues

### 🔧 Cloudflare API Token Integration for Env Sync

**Status:** Deferred
**Priority:** Low
**Added:** 2026-02-15

**Problem:**
The `npm run sync-env` script requires a Cloudflare API token to sync environment variables from `.env` to Cloudflare Pages. Currently this requires:
1. Manually creating an API token in Cloudflare dashboard
2. Setting `CLOUDFLARE_API_TOKEN` environment variable
3. Running the sync command

This adds friction to the workflow. Variables are currently manageable via the Cloudflare dashboard, so this isn't blocking.

**Potential Solutions:**
1. Auto-detect Cloudflare credentials from wrangler config
2. Interactive prompt for API token with secure storage
3. Use wrangler's built-in auth instead of requiring separate token
4. Create a simpler wrapper around wrangler that handles auth automatically

**Workaround:**
Manually update environment variables in Cloudflare Pages dashboard:
- Dashboard → Pages → tetmfg-site → Settings → Environment variables

**Files Involved:**
- `scripts/sync-env-to-cloudflare.mjs`
- `scripts/sync-env.sh`
- `docs/CLOUDFLARE_SYNC.md`

**Related:**
- Wrangler Pages API documentation
- Cloudflare API token permissions

---

## Future Enhancements

### Content Management
- [ ] Consider adding Decap CMS (formerly Netlify CMS) for easier content editing
- [ ] Add image upload capability for facility photos
- [ ] Create a services/facilities admin interface

### Developer Experience
- [ ] Add pre-commit hooks for linting
- [ ] Set up automated testing
- [ ] Add Playwright for E2E testing

### SEO & Performance
- [ ] Add Open Graph image (convert SVG to PNG for better compatibility)
- [ ] Implement analytics review process
- [ ] Add structured data (JSON-LD) for local business

---

## Completed
- ✅ Content collections for services and facilities (2026-02-15)
- ✅ Editing guide for non-technical users (2026-02-15)
- ✅ Repository organization (docs/ and scripts/ folders) (2026-02-15)
- ✅ Landing page copy updates (60" diameter, industries) (2026-02-15)
