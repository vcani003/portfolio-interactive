(() => {
  const config = window.portfolioAnalyticsConfig || {};
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
  let host;
  try { host = new URL(config.apiHost); } catch {}
  const enabled = Boolean(config.projectToken?.startsWith("phc_") && host?.protocol === "https:"
    && (!local || config.trackLocalhost) && navigator.doNotTrack !== "1" && !navigator.globalPrivacyControl);
  const allowed = new Set(["$pageview", "portfolio_opened", "play_journey_started", "quick_view_opened",
    "project_opened", "resume_opened", "contact_opened", "secret_login_opened", "secret_login_success",
    "easter_egg_started", "secret_phrase_submitted", "outbound_link_clicked", "resume_downloaded"]);
  let session;
  const params = new URLSearchParams(location.search);
  const attribution = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"]) {
    if (params.has(key)) attribution[key] = params.get(key).slice(0, 120);
  }
  let referrer = "";
  try { referrer = new URL(document.referrer).origin; } catch {}
  function getSession() {
    if (!session) {
      try { session = JSON.parse(sessionStorage.getItem("portfolio.analytics")); } catch {}
    }
    if (!session?.id || Date.now() - session.last > 30 * 60 * 1000) {
      session = {id: crypto.randomUUID(), attribution: {...attribution, $referrer: referrer,
        $referring_domain: referrer ? new URL(referrer).hostname : "$direct"}};
    }
    // A newly tagged link takes precedence over an earlier link in this tab.
    Object.assign(session.attribution, attribution);
    session.last = Date.now();
    try { sessionStorage.setItem("portfolio.analytics", JSON.stringify(session)); } catch {}
    return session;
  }
  function capture(event, properties = {}) {
    if (!enabled || !allowed.has(event)) return;
    try {
      const current = getSession();
      const body = JSON.stringify({api_key: config.projectToken, event, distinct_id: current.id,
        timestamp: new Date().toISOString(), properties: {
          ...current.attribution, ...properties, $session_id: current.id,
          $current_url: location.origin + location.pathname, $pathname: location.pathname,
          $host: location.host, $process_person_profile: false, $geoip_disable: true
        }});
      // text/plain avoids a CORS preflight; keepalive allows outbound navigation.
      fetch(host.origin + "/i/v0/e/", {method: "POST", headers: {"Content-Type": "text/plain"},
        body, keepalive: true, credentials: "omit", referrerPolicy: "no-referrer"}).catch(() => {});
    } catch { /* Analytics must never interrupt the portfolio. */ }
  }
  window.portfolioAnalytics = {capture};
  capture("$pageview");
  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (!/^https?:$/.test(url.protocol)) return;
    const destination = url.origin + url.pathname;
    if (url.pathname.toLowerCase().endsWith(".pdf")) capture("resume_downloaded", {destination});
    else if (url.origin !== location.origin) capture("outbound_link_clicked", {destination});
  });
})();
