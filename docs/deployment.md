# Deployment and maintenance

## Before accepting customers

1. Review the company content imported from the official site (see company-sources.md), confirm conflicting office hours and address spelling, and obtain privacy contact, retention periods, and reviewed shipping terms. Have legal pages reviewed. Do not add fictitious routes, offices, testimonials, experience, insurance, or partners.
2. Provision a managed PostgreSQL database with TLS, restricted access, backups and restore testing. Set a pooled runtime DATABASE_URL if supported; ensure migration sessions use a direct/session connection because the runner uses an advisory lock and transactions. Do not use PgBouncer transaction pooling for migrations.
3. Configure NEXTAUTH_URL to the final HTTPS domain, a strong unique NEXTAUTH_SECRET, and DATABASE_URL securely. Do not prefix secrets with NEXT_PUBLIC_. Use the Node.js server runtime, not a static export or Edge runtime.
4. Run `npm ci`, `npx prisma generate`, `npm run db:migrate` against the intended database, and `npm run build`. Provision the first owner using `npm run admin:create` in a secure shell. Do not seed production with tests. Additional EDITOR accounts can be created by an authorized operator with bcrypt-12 hashes; no public registration exists.
5. Configure transactional email: RESEND_API_KEY, verified EMAIL_FROM, ADMIN_EMAIL. Add MAIL_JOB_SECRET and schedule the authenticated POST `/api/mail`. Test actual customer confirmation, team notification, provider idempotency, and retries before launch. Monitor unsent jobs and five-attempt failures; do not delete enquiries to fix mail delivery.
6. Optionally configure LLM_API_KEY and LLM_MODEL. Validate supported JSON-object response mode, approved FAQ selection, unknown questions, provider outages, and prompt-injection attempts. Confirm provider retention/privacy terms. Core FAQ and human support work without a key. Do not represent the fallback as a connected LLM.
7. On Vercel, import the repository with the standard Next.js preset, set environment variables, and run reviewed migrations in a separate release job before promoting the deployment. Connect `www.savelandedcompany.com` through the hosting dashboard and configure DNS/HTTPS. No deployment has been performed from this task. Use a staging database for preview deployments.
8. Run unit, browser, access-control, responsive, and production-build checks; audit dependencies. Configure proxy-level request-size limits (32KB for JSON forms/chat), upstream X-Forwarded-For overwriting, request timeouts, and platform DDoS protections. Enforce strict HTTPS/HSTS after verifying the domain. Consider MFA/SSO before broader admin access.

## Current validation

The onboarding machine uses an isolated local PostgreSQL container and generated local session secret. No production credentials were supplied. Production build, schema application/repeat application, unit validation, admin creation and edits, public timeline, enquiry/outbox persistence, chatbot fallback, access denial, and responsive overflow checks have been exercised. External email delivery, paid AI responses, remote hosting, DNS, new-task restoration, and production publication are not verified by these local results.

## Operations

- Database: retain automated backups, test restore, review migrations in staging, never modify applied migration SQL; deployment runner verifies its hash. Regularly archive rate-limit rows whose resetAt has passed and remove old sent email jobs according to an approved retention schedule.
- Data: define customer-data retention and deletion procedures; restrict dashboard access; review public milestone notes for personal information; keep audit records appropriately. Exporting/removing personal data requires an authorized database operator until a dedicated workflow is built.
- Admin: create unique accounts; disable compromised accounts by deleting/revoking their database row; role lookup on protected requests takes immediate effect. Rotate session secret after compromise, recognizing it invalidates all sessions. Use a secure operator procedure for password changes, not email/chat plaintext.
- Integrations: monitor queued emails and provider failures. AI does not author arbitrary replies; periodically review approved knowledge. Conversation transcripts are intentionally not retained. Human escalation uses the contact form and configured business channels.
- Dependencies: CI runs tests, production build, and audit. Review pinned transitive overrides when upgrading Next.js or Prisma; overrides currently patch postcss and deepmerge-ts advisories. Retest migrations/client generation and CSS after changes.
- Scale: admin currently shows latest 200 shipments/enquiries; add cursor pagination for larger workloads. Set database connection limits appropriate to hosting concurrency. For sensitive shipments replace capability-only tracking with customer authentication/OTP.

## Cloud runtime startup

Use the existing `/workspace/Saved` checkout, without a worktree. Run `npm ci` if dependencies are missing; set local environment securely; start the configured database; `npx prisma generate && npm run db:migrate`; start `npm run dev` or the tested production server. Processes do not survive snapshots. A running port alone is not readiness: request the homepage and run the dedicated test database workflows. Never run destructive/reset commands or browser seed tests against production.

## Fixing the Vercel admin server exception

If `/admin` crashes and `/api/auth/providers` reports a server configuration error, first inspect Vercel's private runtime logs. The same failure is reproducible when NEXTAUTH_SECRET is absent: NextAuth throws `NO_SECRET` during server rendering. The admin pages now render a safe setup screen when required configuration or the first account is missing, and a recovery screen if database access fails. They never generate a fallback secret, provision a public administrator, or bypass authentication.

For `https://saved-one.vercel.app`, open that Vercel project's Settings → Environment Variables and set **Production** values for:

- NEXTAUTH_SECRET: generate a strong random value locally, e.g. `openssl rand -base64 48`. Store it securely, never in Git or chat.
- DATABASE_URL: an authenticated managed PostgreSQL connection string with the provider's required TLS settings. A localhost URL from development cannot work on Vercel.
- NEXTAUTH_URL: `https://saved-one.vercel.app` (change this when the canonical custom domain is activated).

Redeploy after environment changes. Run `npm run db:migrate` using a direct/session connection to the same production database, then securely set ADMIN_SETUP_EMAIL and ADMIN_SETUP_PASSWORD in an operator shell and run `npm run admin:create`. The password must have 14+ characters. Do not deploy the ADMIN_SETUP_PASSWORD as a public variable or use a default password. Remove the setup variables from that shell afterwards. The database is never populated with a production user automatically.

Verify `/admin/login` displays sign-in, correct credentials open the dashboard, incorrect credentials remain rejected, and anonymous `/api/admin` access returns 401. A setup screen is a safe failure state, not proof that production credentials and migrations are complete.

## Supabase production preparation

The Supabase project **Saved** (`hpmciuedonhshxstjcgk`, eu-north-1) was prepared on 31 October 2026. The application tables and migration ledger exist. A dedicated `savelanded_app` login has no superuser, role-creation, database-creation, schema-creation, or RLS-bypass privileges. Application tables use server-role RLS policies; `anon` and `authenticated` browser roles have no access. Audit/history updates and application deletes are not granted. The security configuration is captured in `202610310002_server_only_access`.

Production connection details and a newly generated session secret are stored locally in the ignored, owner-readable `.env.production.savelanded` file for the deployment operation. Do not commit, print, or reuse these credentials in a preview environment. The connection uses the Supabase session pooler with TLS verification. The main Supabase database password was not rotated. Future migrations require a privileged operator connection or the Supabase management API; the application login intentionally cannot run schema migrations.

At preparation time, Vercel authentication and initial administrator credentials were still unavailable. Table grants and RLS policies were verified through read-only management queries. A connection from the Vercel runtime and production admin sign-in must still be tested after configuration is deployed; prepared schema alone does not establish a working live dashboard. Provision an administrator only after a secure email/password has been supplied through protected configuration.

## Production connection verified — 31 October 2026

The Supabase database is connected to the Vercel project `saved` at `https://saved-one.vercel.app`. Production has encrypted DATABASE_URL and NEXTAUTH_SECRET bindings, NEXTAUTH_URL set to that origin, and DATABASE_SSL_CA configured with Supabase's public CA. The initial OWNER account was provisioned using the owner's confirmed email and a bcrypt hash of the password supplied through protected configuration. Account passwords and Supabase/Vercel management tokens were not added to Vercel application variables or Git.

Live verification passed for: sign-in page HTTP 200, anonymous admin API HTTP 401, credentials sign-in, OWNER session, authenticated admin API/database queries HTTP 200, dashboard rendering HTTP 200, and sign-out followed by HTTP 401. No demonstration shipments or customer enquiries were inserted.

Two deployment requirements were confirmed and fixed:

- Next.js serverless tracing must include `node_modules/.prisma/client/query_compiler_bg.wasm`. `outputFileTracingIncludes` retains it, and `npm run test:prisma-tracing` checks the real build manifests in CI.
- Supabase's certificate chain needs its public root CA. `databaseConnectionOptions` adds DATABASE_SSL_CA to Node's standard trusted roots and keeps `rejectUnauthorized: true`. It removes URL SSL parameters that would replace the explicit CA options. Runtime, provisioning, and migration commands share this configuration. Never disable certificate verification to work around trust errors.

The public CA was retrieved over verified HTTPS from `https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt`, as described by Supabase's SSL enforcement documentation. Its subject is Supabase Root 2021 CA, valid through 26 April 2031, with SHA-256 fingerprint `807025AD50D4ED219D2C9C7D299C004F824EB00CF7F65AFEF607D07B72E6CAFA`. Review the provider's current CA guidance when rotating certificates.

Custom-domain DNS, external email delivery, and paid AI provider responses remain separate configuration tasks and were not established by the admin login checks.
