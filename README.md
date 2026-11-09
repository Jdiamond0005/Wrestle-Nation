# Wrestle-Nation

A responsive, accessible **static preview** of the planned Wrestle-Nation wrestling platform. This package does not contain a functional membership backend or Stripe integration. Checkout is intentionally disabled.

## Preview

Open `index.html` in a browser, or run `python3 -m http.server 8000` from this folder and visit http://localhost:8000.

## Upload to GitHub

1. Open https://github.com/Jdiamond0005/Wrestle-Nation
2. Choose **Add file → Upload files** on the `main` branch.
3. Unzip this archive and upload its **contents**, including `index.html`, `styles.css`, `script.js`, `.gitignore`, `README.md`, and `SECURITY.md`. Replace the existing README if prompted.
4. Commit the changes. GitHub Pages can later serve this static preview if enabled in repository settings.

## Planned membership pricing

- Pro Athlete: $4.99/month.
- Clubs & Teams: $79.99/year.
- Both paid tiers will receive premium access after implementation.
- Initial launch: United States only. Tax obligations must be evaluated before enabling live billing.

## Required before production

- Verified authentication, roles and authorization; organization membership and ownership checks.
- Secure backend and database, with tests, backups and monitoring.
- Stripe test-mode Checkout and Billing using server-generated sessions, verified webhook signatures, idempotency and server-side entitlements. Do not trust client-provided prices or premium flags.
- Tax determination and configuration; applicable business registrations.
- Privacy policy, terms, support and cancellation/refund disclosures.
- Youth protection, age gating, parental consent where applicable, moderation and data minimization before collecting minors' information.
- CI tests, deployment configuration, accessibility checks and security review.

Never commit Stripe API secrets, webhook signing secrets or personal data.
