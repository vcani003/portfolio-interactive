(() => {
  const eggSources = {
    "wizard-chess": "eggs/wizard-chess.js"
  };
  const eggHashes = {
    "3437cdca03d3809efc41618d6c7adc4e7b7e282687701e3dd04f0cc2256c98ff": "wizard-chess"
  };
  const localServer = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
  const tracked = new Set();
  let opener = null;
  let pendingEgg = null;

  function track(event) {
    if (tracked.has(event)) return;
    tracked.add(event);
    window.portfolioAnalytics?.capture(event);
    if (!localServer) return;
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
    login.setAttribute("aria-labelledby", "secret-login-title");
    login.innerHTML = `<form>
      <div class="secret-login-bar"><p id="secret-login-title">EASTER EGG</p><button type="button" id="close-secret-login">Close ×</button></div>
      <label>Guess the secret phrase <input name="password" type="text" maxlength="80" autocomplete="off" spellcheck="false" autocapitalize="none" aria-describedby="secret-phrase-notice"></label>
      <p id="secret-phrase-notice">Guesses are recorded—don’t enter a real password.</p>
      <button type="submit">enter</button>
      <p id="secret-login-status" role="status" aria-live="polite"></p>
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
    login.addEventListener("close", () => { loginAttempt++; opener?.focus?.({preventScroll:true}); });
    document.getElementById("close-secret-login").addEventListener("click", () => login.close());
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
    loginAttempt++;
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
    if (!crypto.subtle) throw new Error("Secret phrase checking is unavailable");
    const egg = eggHashes[await sha256Hex(password)];
    return egg ? {ok: true, egg} : {ok: false};
  }

  let loginAttempt = 0;
  async function submitLogin(password) {
    const attempt = ++loginAttempt;
    const status = document.getElementById("secret-login-status");
    const text = String(password || "");
    if (text.length > 80) {
      status.textContent = "ACCESS DENIED";
      return;
    }
    let result = null;
    try {
      const response = localServer ? await fetch("/api/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({password: text})
      }) : null;
      if (response?.ok) {
        const body = await response.json();
        if (body && typeof body.ok === "boolean") result = body;
      }
    } catch {}
    if (attempt !== loginAttempt || !loginDialog().open) return;
    if (!result) {
      try {
        result = await matchLocal(text);
      } catch {
        if (attempt !== loginAttempt || !loginDialog().open) return;
        status.textContent = "try again";
        return;
      }
    }
    if (attempt !== loginAttempt || !loginDialog().open) return;
    window.portfolioAnalytics?.capture("secret_phrase_submitted", {guess: text, success: result.ok, egg: result.egg || null});
    if (!result.ok) {
      status.textContent = "ACCESS DENIED";
      loginDialog().querySelector("input").value = "";
      loginDialog().querySelector("input").focus();
      return;
    }
    pendingEgg = eggSources[result.egg] ? result.egg : null;
    window.portfolioAnalytics?.capture("secret_login_success", {egg: result.egg});
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
    if (pendingEgg !== id || !eggDialog()?.open) return;
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
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span>Guess the secret phrase</span>`;
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
    if (panel && !panel.querySelector('.cafe-tools-footer')) {
      const cafeFooter = document.createElement('div');
      cafeFooter.className = 'cafe-tools-footer';
      cafeFooter.innerHTML = '<div class="cafe-footer-brand"><svg aria-hidden="true"><use href="#cafe-cat"/></svg><div><strong>Banh Miow Cafe</strong><span>BEHIND THE COUNTER</span></div></div>';
      const cafeForm = document.createElement('form');
      cafeForm.className = 'cafe-login-form';
      cafeForm.setAttribute('aria-label','Optional Easter egg');
      cafeForm.innerHTML = '<label class="cafe-phrase-field">Guess the secret phrase<input type="text" name="credential" aria-describedby="cafe-phrase-notice" autocomplete="off" spellcheck="false" autocapitalize="none" maxlength="80"></label><button type="submit" class="button cafe-login">Try it <span aria-hidden="true">→</span></button><p id="cafe-phrase-notice">Guesses are recorded—don’t enter a real password.</p>';
      cafeForm.addEventListener('submit', event => {
        event.preventDefault();
        const input = cafeForm.elements.credential;
        const value = input.value;
        const source = event.submitter || input;
        input.value = '';
        openLogin(source);
        if (value) submitLogin(value);
      });
      cafeFooter.append(cafeForm);
      const cat = document.createElement('div');
      cat.className = 'cafe-footer-cat';
      cat.setAttribute('aria-hidden','true');
      cat.innerHTML = '<svg><use href="#cafe-cat"/></svg>';
      cafeFooter.append(cat);
      panel.querySelector(".quick-panel-content").append(cafeFooter);
    }
    const sidebar = document.querySelector(".editor-sidebar");
    if (sidebar && !sidebar.querySelector("[data-open-login]")) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.openLogin = "";
      button.textContent = "Secret phrase";
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
