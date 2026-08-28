---
name: Third-party API key hardening
description: Required pattern for adding any new external/paid API (e.g. Coinness) to the api-server, established preemptively before such a key existed.
---

When the user asks to secure the app ahead of adding a new external API key (paid or quota-limited), apply this pattern rather than waiting until the integration exists:

- Store the key via Replit Secrets; never hardcode it or put it in a URL that gets logged.
- Call the provider only from the server (api-server), never from the mobile/web client — the client must never see the key.
- Wrap every outbound call in a timeout (AbortController) so a slow upstream can't hang a request.
- Never forward raw upstream error text/response bodies/URLs to the client — they can contain the key or internal hosts. Log full detail server-side, return a generic message to the client.
- Add global rate limiting (per-IP) in front of `/api` once behind it sits a quota-limited provider, so one abusive client can't burn the quota or trigger provider-side bans for everyone.
- Add `helmet()` for baseline security headers if not already present.

**Why:** the user asked to preemptively harden Market Pulse's api-server against a planned-but-not-yet-integrated Coinness API key, rather than fixing it reactively after the key leaks or gets rate-limited.

**How to apply:** in `artifacts/api-server`, reuse `src/lib/externalFetch.ts` (`fetchExternal`) for any new outbound call, and the sanitized-error pattern in `src/routes/market.ts`'s `sendExternalDataError`. `helmet()` and a 120 req/min rate limiter are already wired into `src/app.ts`.
