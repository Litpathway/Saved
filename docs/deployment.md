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
