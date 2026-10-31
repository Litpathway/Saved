# Discovery, product scope, and architecture

## Evidence and open questions

The repository was initially empty. The official WordPress site became accessible after the environment was published with updated networking. Its logo, China–Nigeria shipping and sourcing information, office addresses, public contacts, and photos are now incorporated. Source URLs, asset provenance, and conflicting opening hours are recorded in company-sources.md. No reference screenshot was attached. Rates, delivery guarantees, insurance terms, and certifications remain unverified and are not invented.

## Sitemap and user journeys

- `/`: hero, tracking entry, process, shipping-method enquiry cards, FAQ, quote CTA.
- `/shipping`: sea and air freight services only, as confirmed by the owner.
- `/about`: accurate platform purpose and customer process.
- `/quote`, `/contact`: validated enquiries, persisted reference, truthful email state.
- `/track`: number search, recorded status, public route, method, optional delivery estimate, last update, chronological history.
- `/admin/login`, `/admin`: credentials authentication; shipment creation/update; enquiries and status; owner-managed approved knowledge and configurable status additions; audit log.
- `/privacy`, `/terms`: current data handling and required company/legal review.

Customer: enter supplied tracking number → validate → database query → history or helpful error. Quote: enter requirements → validate server-side → atomic enquiry/outbox save → reference. Operations: owner provisioned from shell → sign in → create a real shipment → share generated number → add milestones → public update. Support: ask a question → rate limit → exact authorized public lookup or approved-answer retrieval → human contact fallback.

## Design system

Manrope is self-hosted under its OFL license. Colors: #3979AF blue, #245C94 deep blue, #171717 ink, #777777 secondary, #F6F7F8 soft, #E5E7E9 borders. Max hero width 1260px, content 1160px; rounded photographic hero, translucent navigation and horizontal option cards, pill CTAs, thin process dividers, charcoal showcase. Responsive breakpoints: 1280, 1024, 768, 375px. Semantic forms, visible focus, skip link, keyboard carousel, stateful accordions, reduced motion, optimized local WebP hero, explicit illustration disclosure. No fake route timelines or partner strip.

## Technology and data flow

Next.js App Router + React + TypeScript + reusable CSS and Lucide icons; server route handlers; Prisma 6 JS engine with pg adapter; PostgreSQL; NextAuth credentials/JWT sessions; bcrypt password hashes. Minimal dependencies; no separate API server or vector database is needed for a small approved knowledge collection.

Models: Admin (email/hash/role), Shipment (random tracking ID/public route/method/current status/estimate), Milestone (append-only status/note/time), ShippingStatus (configurable list), Enquiry (private contact/cargo/message/status), Knowledge (question/answer/publication), AuditLog (actor/action/entity/time), RateLimit (hashed key/count/window), EmailJob (durable outbox/attempts/sent timestamp). Shipment updates, history, and audit records share one transaction.

## Authorization and privacy

OWNER and EDITOR can manage shipments and enquiries; only OWNER changes knowledge/status definitions. Authorization re-reads the admin role on every protected request, including revocation. Public tracking uses unpredictable 64-bit capability identifiers and returns an explicit allowlist of fields. It does not require a customer account; anyone with a valid tracking number can see its limited public record. If stronger confidentiality is required, add customer login/OTP before launch. No shipment customer addresses or names exist in the public model. Use city/region routes and sanitize milestone content operationally.

Same-origin write checks, NextAuth CSRF/session cookies, bcrypt, validated input, database-backed rate limits, no-store tracking/admin responses, and security headers provide baseline controls. The reverse proxy must overwrite untrusted X-Forwarded-For headers. Limits share the PostgreSQL database across instances. Application code does not log credentials or support transcript content. The dashboard lists the latest 200 shipments/enquiries and 50 audit entries; larger operations need pagination before exceeding this scope. No delete UI is provided for histories or audits.

## Known external prerequisites

Live email and AI were not exercised without credentials. Publication, external hosting, DNS, TLS, managed database backups, resolution of published office-hour/address ambiguities, privacy retention schedule, legal review, and production owner provisioning remain deployment tasks. No automatic deployment or real shipment movement is claimed.
