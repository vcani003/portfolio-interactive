(() => {
  const eggSources = {
    "wizard-chess": "eggs/wizard-chess.js"
  };
  const eggHashes = {
    "3437cdca03d3809efc41618d6c7adc4e7b7e282687701e3dd04f0cc2256c98ff": "wizard-chess"
  };
  const tracked = new Set();
  let opener = null;
  let pendingEgg = null;

  function track(event) {
    if (tracked.has(event)) return;
    tracked.add(event);
    fetch("/api/events", {
      method: "POST",
      credentials: "same-origin",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({event})
    }).catch(() => {});
  }

  function loginDialog() {
    return document.getElementById("secret-login");
  }

  function eggDialog() {
    return document.getElementById("egg-note");
  }

  function ensureDialogs() {
    if (loginDialog()) return;
    const login = document.createElement("dialog");
    login.id = "secret-login";
    login.innerHTML = `<form>
      <p id="secret-login-title">LOGIN</p>
      <label>password <input name="password" type="password" autocomplete="off" spellcheck="false"></label>
      <button type="submit">enter</button>
      <p id="secret-login-status" role="status"></p>
    </form>`;
    const egg = document.createElement("dialog");
    egg.id = "egg-note";
    egg.innerHTML = `<p id="egg-granted">ACCESS GRANTED</p>
      <p>a classic <span class="egg-mark">🪄♟️</span></p>
      <div id="egg-mount"></div>
      <div class="egg-actions">
        <button type="button" id="egg-skip">skip</button>
      </div>`;
    document.body.append(login, egg);
    login.addEventListener("close", () => opener?.focus?.());
    login.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();
      submitLogin(new FormData(event.currentTarget).get("password"));
    });
    login.addEventListener("cancel", event => {
      event.preventDefault();
      login.close();
    });
    document.getElementById("egg-skip").addEventListener("click", closeEgg);
    egg.addEventListener("cancel", event => {
      event.preventDefault();
      closeEgg();
    });
  }

  function openLogin(source) {
    ensureDialogs();
    opener = source || document.activeElement;
    const dialog = loginDialog();
    const status = document.getElementById("secret-login-status");
    status.textContent = "";
    dialog.showModal();
    dialog.querySelector("input").value = "";
    dialog.querySelector("input").focus();
    track("secret_login_opened");
  }

  async function sha256Hex(text) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
  }

  async function matchLocal(password) {
    if (!crypto.subtle) return null;
    const egg = eggHashes[await sha256Hex(password)];
    return egg ? {ok: true, egg} : {ok: false};
  }

  async function submitLogin(password) {
    const status = document.getElementById("secret-login-status");
    const text = String(password || "");
    if (text.length > 80) {
      status.textContent = "ACCESS DENIED";
      return;
    }
    let result = null;
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({password: text})
      });
      if (response.ok) {
        const body = await response.json();
        if (body && typeof body.ok === "boolean") result = body;
      }
    } catch {}
    if (!result) {
      try {
        result = await matchLocal(text);
      } catch {
        status.textContent = "try again";
        return;
      }
    }
    if (!result.ok) {
      status.textContent = "ACCESS DENIED";
      loginDialog().querySelector("input").value = "";
      loginDialog().querySelector("input").focus();
      return;
    }
    pendingEgg = eggSources[result.egg] ? result.egg : null;
    tracked.add("secret_login_success");
    loginDialog().close();
    const egg = eggDialog();
    egg.classList.remove("has-video");
    document.getElementById("egg-mount").replaceChildren();
    egg.showModal();
    if (pendingEgg) launchEgg();
  }

  function closeEgg() {
    pendingEgg = null;
    const egg = eggDialog();
    egg?.classList.remove("has-video");
    const frame = egg?.querySelector("iframe");
    if (frame) frame.src = "about:blank";
    egg?.close();
    opener?.focus?.();
  }

  function loadEgg(id) {
    if (window.portfolioEggs?.[id]) return Promise.resolve(window.portfolioEggs[id]);
    return new Promise(resolve => {
      const script = document.createElement("script");
      script.src = eggSources[id];
      script.onload = () => resolve(window.portfolioEggs?.[id] || null);
      script.onerror = () => resolve(null);
      document.body.append(script);
    });
  }

  async function launchEgg() {
    const id = pendingEgg;
    track("easter_egg_started");
    const egg = id ? await loadEgg(id) : null;
    const held = egg?.start?.({
      mount: document.getElementById("egg-mount"),
      close: closeEgg,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
    });
    if (!held && eggDialog()?.open) closeEgg();
  }

  function promptButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "term-prompt";
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span>Enter credential here</span>`;
    button.addEventListener("click", () => openLogin(button));
    return button;
  }

  function mountControls() {
    const footer = document.querySelector("footer");
    if (footer && !footer.querySelector(".term-prompt")) {
      footer.insertBefore(promptButton(), footer.lastElementChild);
    }
    const panel = document.getElementById("quick-panel");
    if (panel && !panel.querySelector(".term-prompt")) panel.append(promptButton());
    const sidebar = document.querySelector(".editor-sidebar");
    if (sidebar && !sidebar.querySelector("[data-open-login]")) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.openLogin = "";
      button.textContent = "login";
      button.addEventListener("click", () => openLogin(button));
      sidebar.append(button);
    }
  }

  function watch(dialog, event) {
    if (!dialog) return;
    new MutationObserver(() => {
      if (dialog.open) track(event);
    }).observe(dialog, {attributes: true, attributeFilter: ["open"]});
  }

  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (href === "#projects") track("project_opened");
    if (href === "#resume") track("resume_opened");
    if (href === "#contact" || link.classList.contains("nav-contact")) track("contact_opened");
  });
  document.addEventListener("click", event => {
    const tab = event.target.closest("[data-quick-section]");
    if (!tab) return;
    if (tab.dataset.quickSection === "projects") track("project_opened");
    if (tab.dataset.quickSection === "resume") track("resume_opened");
  });

  mountControls();
  watch(document.getElementById("game"), "play_journey_started");
  watch(document.getElementById("quick-panel"), "quick_view_opened");
  track("portfolio_opened");
})();
