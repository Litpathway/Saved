# API reference

All responses are JSON. Failed requests return `{ "error": "message" }`. No external API authentication is offered; admin uses same-origin NextAuth cookie sessions. Origin must match NEXTAUTH_URL for mutations. Invalid input returns 400; forbidden 403; missing session 401; rate limit 429; unavailable database/provider 503 where applicable.

## GET /api/tracking/:number

Format: `SL-` + 16 uppercase hexadecimal characters; input is normalized. 30 attempts/IP/minute. Returns `trackingNumber`, `origin`, `destination`, `method`, `status`, nullable `estimatedDelivery`, `updatedAt`, and `milestones[{status,note,occurredAt}]`. UTC ISO timestamps. Unknown valid number: 404. No customer contacts, internal IDs, or admin records.

## POST /api/enquiries

5 submissions/IP/10 minutes. Body: `kind` (`QUOTE` or `CONTACT`), `name`, `email`, `message`; optional `phone`, `origin`, `destination`, `method`, `cargo`, `weight`, `dimensions`. Quotes require nonempty origin/destination/cargo. Optional `website` honeypot must be empty. Returns 201 `{reference,message}` after atomic database/outbox persistence. No invented quote price.

## POST /api/chat

15 requests/IP/10 minutes. Body `{message}` (1–1000 characters). Response `{reply,mode}` where mode is `knowledge`, `ai`, or `tracking`. Exact tracking identifiers are looked up server-side. Only limited public status/time are returned. AI selects approved answers; arbitrary generated output is never rendered. Messages are not stored.

## GET /api/admin

Authorized OWNER/EDITOR session, 120 reads/IP/minute. Returns latest `shipments`, `enquiries`, `knowledge`, `statuses`, and `audits`. Never returns password hashes.

## POST /api/admin

Authorized session, same-origin, 60 writes/admin/minute. Each modification records an audit entry atomically.

- `action: shipment`: optional `id` to edit; required `origin`, `destination`, `method`, `status`; optional `estimatedDelivery` (YYYY-MM-DD or empty), `note`. New record generates tracking number. Every save appends a timestamped milestone. Notes are public.
- `action: enquiry`: `id`, `status` (`NEW`, `IN_PROGRESS`, `RESOLVED`).
- `action: knowledge`: OWNER only; optional `id`, `question`, `answer`, `published` boolean.
- `action: status`: OWNER only; `name`. Existing history is preserved; adding does not rename old milestones.

## POST /api/mail

Server scheduler bearer `MAIL_JOB_SECRET`. Processes up to 20 unsent jobs with fewer than five attempts. Response `{configured,sent}`. Resend sender/domain must be verified separately. Never expose the bearer secret to a browser.

## /api/auth/*

NextAuth-managed credentials flow, CSRF, session, sign-in and sign-out. Sign-in limits: 10 attempts/email and 30/IP per 15 minutes. Configure trusted proxy forwarding and HTTPS. Password/account creation is available only through the server-side `admin:create` script.
