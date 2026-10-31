# Savelanded Company

A responsive Next.js logistics platform with PostgreSQL-backed shipment tracking, role-protected operations, enquiry forms, and a support assistant restricted to approved answers.

## Run locally

Requires Node.js 22+ and PostgreSQL 16+. Use the existing checkout; cloud tasks are already isolated and do not need a worktree.

1. `npm ci`
2. Copy `.env.example` to `.env` and configure `DATABASE_URL`, `NEXTAUTH_URL`, and a random `NEXTAUTH_SECRET` (`openssl rand -base64 48`). Do not commit secrets.
3. For a local database, set `LOCAL_DB_PASSWORD` securely and run `docker compose up -d`. Set `DATABASE_URL` to the corresponding `savelanded` user/password/database on localhost:5432. Do not use the onboarding instance's test database in production.
4. `npx prisma generate && npm run db:migrate`
5. Set `ADMIN_SETUP_EMAIL` and `ADMIN_SETUP_PASSWORD` securely in your shell, then `npm run admin:create`. Password must have at least 14 characters; an existing administrator is never overwritten. Unset setup variables after use.
6. `npm run dev` (port 3000). Production: `npm run build && npm run start`.

Visit `/admin` to sign in and create a shipment. Tracking numbers are generated with 64 bits of cryptographic randomness. No demo shipments are seeded. Public tracking uses real records and displays only city/region routes and public milestones; never put private addresses or customer information in these fields.

## Validation

- `npm test`: server input validation and tracking format checks.
- `npm run typecheck`: TypeScript.
- `npm run build`: production compilation and static generation.
- Start the app, then `npx playwright install chromium && npm run test:e2e`: PostgreSQL-backed browser workflows, responsive layouts, access controls, tracking, enquiry persistence, and chatbot fallback. Use a **dedicated test database**. Tests create temporary users and records, then remove them. Never run these tests against customer data.
- If Chromium is already installed, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`.
- `npm audit --omit=dev --audit-level=high`.

See [architecture and discovery](docs/architecture.md), [API reference](docs/api.md), and [deployment and maintenance](docs/deployment.md).

## Integrations and verified company content

No carrier integrations, live GPS, synthetic tracking movement, fake testimonials, insurance promises, or unverified company history are included. Company-published branding, China–Nigeria service information, public contacts, three office addresses, and photos were retrieved from the official WordPress site on 31 October 2026 and incorporated. See [company sources and discrepancies](docs/company-sources.md) for original URLs, image provenance, and conflicting office hours. Illustrative shipping imagery does not imply company-owned equipment. Transport methods still require confirmation per shipment. No reference screenshot was supplied; the layout follows the written visual specification.

The contact page has official public defaults; optional NEXT_PUBLIC business contact variables override its primary contact channels. Confirm office hours, address spelling, privacy details, and legal terms before launch. Email, AI, and production hosting still require their separately documented credentials and configuration.

### AI assistant

Set `LLM_API_KEY` for OpenAI and optionally `LLM_MODEL` (default `gpt-4.1-mini`). Keys stay on the server. The model classifies a question against the approved FAQ and published knowledge; it cannot compose a customer-facing answer. The server validates the selected index and returns the stored approved text. Invalid/provider failures produce a support fallback. Public tracking lookup is performed by a server-controlled exact tracking-number match and returns status/time only in chat. It never exposes enquiries or admin data. Without a key, curated FAQ matching works and is labeled as approved information. Messages are independent; the application does not store conversation transcripts. An external AI provider may process or retain requests according to its own terms. Configure retention and contractual terms before launch.

### Email

Set `RESEND_API_KEY`, a verified `EMAIL_FROM`, and `ADMIN_EMAIL`. Enquiry and email jobs save atomically. Sending failures retain an outbox entry. Configure a scheduler to `POST /api/mail` with `Authorization: Bearer <MAIL_JOB_SECRET>` every few minutes. The bearer secret is server-only. Resend idempotency keys prevent duplicate sends during overlapping attempts within the provider's idempotency window. Jobs retry at most five times; inspect failures operationally. Email delivery has not been verified without provider credentials. A saved enquiry never falsely reports that an email was delivered.

## Database migrations

`prisma/schema.prisma` is the ORM source. SQL lives in `prisma/migrations`. Prisma's JS driver avoids native binary downloads. The Prisma 6 WASM migration engine encountered an unsupported PostgreSQL `name` type during validation; `scripts/migrate.ts` applies the generated SQL with transactions, SHA-256 drift checking, and a PostgreSQL advisory lock instead. Use `npm run db:migrate` consistently; do not mix this migration ledger with Prisma Migrate's ledger. To generate a subsequent migration, use `prisma migrate diff` with the previous schema and new schema in a development environment, review the SQL, and add an ordered migration directory. Never edit an already applied migration. Back up and stage changes before production.
