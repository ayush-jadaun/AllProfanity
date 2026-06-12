# Next.js Moderated Comments — AllProfanity example

A complete Next.js (App Router) example: a comment form whose submissions are
moderated server-side with [allprofanity](../../README.md).

## What it demonstrates

- **Server-side moderation policy** ([`lib/moderation.ts`](./lib/moderation.ts)):
  a shared `AllProfanity` instance with result caching, a whitelist for domain
  vocabulary, and a severity-based policy — clean text is accepted, MILD/MODERATE
  profanity is auto-censored, SEVERE/EXTREME is rejected.
- **API route integration** ([`app/api/comments/route.ts`](./app/api/comments/route.ts)):
  input validation, moderating both the display name (hard reject) and the
  comment body (tiered), returning severity and detection details to the client.
- **Client UX** ([`app/comment-section.tsx`](./app/comment-section.tsx)):
  feedback banners for accepted / censored / rejected submissions and a
  "censored" tag on cleaned comments.
- **Evasion protection in action**: try `f*ck`, `f u c k`, `fuuuuck`, `sh1t`,
  `ｆｕｃｋ` or `fυck` in the form — all caught. "Scunthorpe", "bass guitar"
  and "a classic movie" always pass.

## Run it

```bash
# from this directory
npm install
npm run dev
# open http://localhost:3000
```

The example depends on the library via `file:../..`, so it always runs against
the local build — run `npm run build` in the repository root first if you've
changed library code.

## Adapt it

- Swap the in-memory store ([`lib/store.ts`](./lib/store.ts)) for your database.
- Tune the policy thresholds in `lib/moderation.ts` (e.g. reject at MODERATE
  for a kids' platform, or load more languages with `loadLanguages`).
- Drop in a [configuration preset](../../examples-config/README.md) via
  `AllProfanity.fromConfig()` instead of inline options.
