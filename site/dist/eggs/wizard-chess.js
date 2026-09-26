/* First egg module. A successful password opens the short Vero supplied. */
window.portfolioEggs = window.portfolioEggs || {};
window.portfolioEggs["wizard-chess"] = {
  id: "wizard-chess",
  start(ctx) {
    const frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/6Rf70tgOYBc";
    frame.title = "Harry Potter reimagined";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    const wrap = document.createElement("div");
    wrap.className = "egg-video";
    wrap.append(frame);
    ctx.mount.replaceChildren(wrap);
    ctx.mount.closest("dialog")?.classList.add("has-video");
    return true;
  }
};
