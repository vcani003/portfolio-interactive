# Portfolio analytics setup

Vero authorized PostHog integration and recording submitted Easter-egg guesses on 2026-09-28 after agreeing to replace password/login wording with a secret-phrase label and an adjacent recording notice. No publication or notification destination was authorized in this request.

## Activation

Edit `site/dist/analytics-config.js`: set `projectToken` to the public `phc_…` project token and `apiHost` to the HTTPS ingestion origin shown in PostHog's project setup (usually `https://us.i.posthog.com` or `https://eu.i.posthog.com`). Never use a personal API key. Empty settings disable delivery. Keep `trackLocalhost: false` for release. Local settings are not published until a separately authorized deployment.

The implementation uses the documented [PostHog capture API](https://posthog.com/docs/api/capture), directly from the static site. No additional Python hosting is needed. No SDK autocapture, session replay, keystroke listeners, or person profiles. One anonymous tab/session identifier is stored in sessionStorage and expires after 30 minutes of inactivity; blocked storage falls back to page memory. Counts are approximate sessions, not identified people or reliable cross-device unique visitors. DNT and Global Privacy Control disable capture. Geographic enrichment is disabled; source reporting means referring websites and tagged links.

## Events and dashboard

- `$pageview`, `portfolio_opened`: initial page visit.
- `play_journey_started`, `quick_view_opened`, `project_opened`, `resume_opened`, `contact_opened`: existing section events, once per page load. These are section interactions, not exhaustive document reading.
- `outbound_link_clicked`: external HTTP(S) link, with destination origin/path only.
- `resume_downloaded`: PDF link click (not proof the download completed).
- `secret_login_opened`: opens the optional secret-phrase dialog; legacy event name retained.
- `secret_phrase_submitted`: submitted `guess` (up to 80 characters), boolean `success`, and egg id on success. No partial typing is captured. Raw guesses are never stored in local analytics storage. The form notice is present before submission at both entry points.
- `secret_login_success`, `easter_egg_started`: successful unlock/launch; filter egg `wizard-chess` on success.

Selected `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` and `ref` values accompany events. Referring origin is retained without path/query. Current URLs exclude query/hash; outbound destinations exclude query/hash. Application `/j/8K3M/` forwards with `ref=8K3M` and preserves campaign tags. New application links generated with `scripts/add_referral.py` include a static redirect page. A ref labels a shared link, not the visitor's employer or identity.

In PostHog, inspect live Activity first. Create trends for `secret_phrase_submitted`, breaking down by `guess` and filtering `success=false` to see common wrong guesses. Track `secret_login_success` separately as an unlock goal; use source/ref properties to compare traffic. This minimal capture integration does not implement page-leave duration, browser/device enrichment, or the full SDK web-analytics feature set.

## Alerts and live validation still pending

No alert channel has been chosen or connected. A PostHog event destination can filter `secret_login_success` and send an alert; select email/Slack and configure delivery separately. The current code does not send email or Slack messages.

After credentials and publication: visit a tagged public link, submit a clearly synthetic wrong guess and the correct phrase, then verify ingestion and properties in the actual PostHog project. Live ingestion, dashboard configuration and alert delivery are untested until then. Ad blockers/network failures can prevent events; portfolio access must remain usable. Do not interpret missing events as proof no one visited.

## Local validation

Run `scripts/check_analytics.cjs` with Playwright against port4174. All PostHog requests are intercepted using a synthetic token; no real guesses are transmitted. Screenshots are local under `tmp/analytics-qa/`.

## Project configured — 2026-09-28

Vero supplied the public project token. Added it to analytics-config.js with the US ingestion origin (`https://us.i.posthog.com`), matching the US-hosted PostHog project shown during setup. Localhost remains excluded. Live ingestion, dashboard setup, alert delivery and publication are still pending; adding credentials does not deploy the site.
