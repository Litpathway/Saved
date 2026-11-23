AUDIT REPORT
============
Recommendation: WARN
Reason: Local security and UI checks passed after accessibility fixes, but failed email jobs need an automated retry path and the local test runner is blocked by a host Node error.

FINDINGS
--------
[A-01] [MEDIUM] [SILENT FAILURE]
File: src/lib/email.ts:12
Issue: Email delivery selects only jobs with fewer than five attempts, while the pending count includes exhausted jobs; no scheduled caller for the mail route is configured.
Evidence: `where: { sentAt: null, attempts: { lt: 5 } }` and `pending = () => jobsStore.count({ where: { sentAt: null } })`.
Impact: A transient mail outage can leave confirmation and admin notification jobs unsent indefinitely after five attempts.
Fix: Configure a scheduled caller for `POST /api/mail` with `MAIL_JOB_SECRET`, alert when `failed > 0`, and expose exhausted jobs separately for manual retry.

ENV VAR CROSS-REFERENCE
-----------------------
✅ MATCHED   DATABASE_URL — workflow → app: connected
✅ MATCHED   NEXTAUTH_URL — workflow → app: connected
✅ MATCHED   NEXTAUTH_SECRET — workflow → app: connected
❌ APP ONLY  DATABASE_SSL_CA — optional production database CA, not needed in CI
❌ APP ONLY  LLM_API_KEY, LLM_MODEL — optional AI provider, FAQ fallback used when unset
❌ APP ONLY  RESEND_API_KEY, EMAIL_FROM, ADMIN_EMAIL, MAIL_JOB_SECRET — optional mail delivery configuration, not set in CI
❌ APP ONLY  BLOB_READ_WRITE_TOKEN — optional gallery storage configuration, not set in CI
❌ APP ONLY  NEXT_PUBLIC_BUSINESS_EMAIL — optional contact override, not set in CI
❌ APP ONLY  LOCAL_ADMIN_ACCESS, LOCAL_ADMIN_SERVER, LOCAL_DEV_DIST, PORT — local runtime settings, not set in CI
❌ APP ONLY  ADMIN_SETUP_EMAIL, ADMIN_SETUP_PASSWORD — one-time admin setup settings, not set in CI

SUMMARY
-------
Critical: 0 | High: 0 | Medium: 1 | Low: 0 | Total: 1

⚠️  DEPLOY WITH CAUTION — review findings before pushing
