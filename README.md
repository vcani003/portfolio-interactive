# Vero — interactive portfolio

Local playable portfolio: an illustrated landing, semantic HTML portfolio, printable web résumé, and five playable career chapters.

## Preview

From the repository root:

```sh
python3 server.py
```

Open http://127.0.0.1:4174. No package installation or compilation is required. All served source lives in `site/dist` and is intentionally tracked. This static foundation keeps career information readable without JavaScript; game interactions progressively enhance it.

`server.py` is the same static site plus application links (`/j/<token>`), a small first-party event log, and optional local notices in `data/`. The plain static server still shows the portfolio, without those links:

```sh
python3 -m http.server 4174 --bind 127.0.0.1 --directory site/dist
```

Add another application link with `python3 scripts/add_referral.py --company "Name" --role "Role" --egg wizard-chess`. Company names stay in `referrals.config.json`, not in the URL. Passwords are stored as SHA-256 hashes.

## Controls

Select **Play the Journey**. Use WASD/arrows or click/tap the floor. Walk up to the computer, press E near it, or select **Open career notes** to read career documents in an IDE-inspired viewer. Watering the succulent, eating an espresso candy, and greeting a coworker are optional. Escape closes the document first, then the game; **Back to portfolio** exits.

## Current boundaries

- Five chapters are immediately selectable: College (MDC/FIU), JPMC, Fortress, Banh Miow Cafe, and Game Development. JPMC retains its internship closet and full-time cubicle. Previous/next navigation ends at contact; Quick View never requires gameplay.
- The apartment landing uses separate Lumi/Luci kitten sprites. The JPMC settings use a period-correct standing/walking Vero sprite, subtle monitor updates, and horizontal camera tracking on narrow screens. The kittens alternate grounded walking poses with sitting/grooming pauses; Reduced motion keeps them seated. Detailed Vero walk cycles, environment collision, remain future work.
- Contact links use supplied LinkedIn/GitHub profiles. The private source résumé and its phone/email have not been copied into the site. Print/save creates a web résumé; the original PDF awaits public-version approval.
- Project descriptions are source-backed; direct playable/case-study links await verified destinations.
- The local draft intentionally uses `noindex,nofollow`. Production canonical URLs, sitemap, indexing policy, and structured data must be completed after an approved domain/hosting decision.
- Illustrations follow the approved visual direction and have independent setting review. New workplaces are imaginative settings, not architectural reconstructions or employer screenshots. See `ART_ASSETS.md`.
- Desktop/mobile interaction checks passed in installed Chrome; timed human recruiter tests and a full accessibility/performance audit remain pending.
- No GitHub push or deployment has occurred.

See `PLAN.md` for decisions and `AGENTS.md` for contributor guidance.

New chapter documents derive their career facts from the initial semantic HTML through `chapters.js`, so Quick View remains the canonical source and is readable without JavaScript. Image-loading failures preserve direct notes and exit controls.

## Vertical overworld

Below the apartment hero, a scroll-driven paper theatre connects five floating career islands. The paper-cutout traveler follows the glowing route; passed preview cards minimize while retaining entry/detail links. The map does not lock chapters or capture scrolling. Its sticky toolbar provides Quick View. Reduced-motion mode hides the moving traveler and keeps descriptions expanded. The compact top index links directly to map stops, and entering a chapter opens the existing playable room.

Quick View now opens a closeable overlay over the journey. Chapter Quick View links open the corresponding career section; the map toolbar uses the current chapter. Escape/Close returns to the same scroll position. Header/hero Quick View offers an overview with section navigation. Initial career HTML remains usable without JavaScript, and print includes all career sections.

Map game entry uses a short pointer/Space hold; Enter activates immediately. Release or move away to cancel. The chapter's **Back to journey timeline** button (or Escape) returns to its island. JPMC's full-time desk has the supplied internship photo in a clickable frame; Escape closes the photo before the chapter.

Motion defaults were revised: no motion toggle. Chapter characters move with a still pose; the timeline paper character walks while scrolling and rests afterward. Operating-system reduced-motion preferences are honored automatically.
