/**
 * Site-wide config. Sensitive values are read from environment variables at build time
 * so they are not stored in the repository. Set these in Cloudflare Pages (Environment variables / Secrets).
 *
 * Build-time only: process.env is available during `astro build`. These values are baked
 * into the static output and are not exposed to the client bundle as raw env vars.
 */
const getEnv = (key: string, fallback: string): string =>
  typeof process !== 'undefined' && process.env[key] !== undefined && process.env[key] !== ''
    ? process.env[key]!
    : fallback;

export const siteConfig = {
  name: 'T.E.T. Mfg. Co., Inc.',
  shortName: 'T.E.T. Manufacturing',
  tagline: 'Quality Parts. On Time. On Budget.',
  address: {
    line1: '2 Old Indian Trail',
    city: 'Middlefield',
    state: 'CT',
    zip: '06455',
  },
  /** Set TET_PHONE in Cloudflare Pages (e.g. 860-349-1004). Fallback only for local dev. */
  phonePlaceholder: getEnv('TET_PHONE', 'TEL_PLACEHOLDER'),
  /** Set TET_EMAIL_USER / TET_EMAIL_DOMAIN in Cloudflare Pages to keep email out of repo. */
  emailUser: getEnv('TET_EMAIL_USER', 'info'),
  emailDomain: getEnv('TET_EMAIL_DOMAIN', 'tetmfg.com'),
} as const;

export type SiteConfig = typeof siteConfig;
