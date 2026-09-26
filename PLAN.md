# Vero's playable portfolio — draft plan

Status: **Five-chapter local journey implemented and reviewed 2026-09-24. Initial GitHub push and publishing remain unapproved.**

Vero directs the creative choices; the agents turn approved decisions into a browser experience. This document is the planning deliverable, not authorization to build, publish, or finalize the supplied specs.

## 1. Purpose and success

Create a memorable, warm, illustrated journey through Veronica Canido's career that also works as a clear professional portfolio. A visitor should leave understanding that Vero is a senior frontend engineer who builds real products, leads teams, understands users, and enjoys experimenting.

The game is an alternative interface to the portfolio. Experience, projects, résumé, and contact must remain accessible without movement, puzzle completion, or chapter discovery.

Proposed experience budgets, to validate in a browser:

- First impression: within 10 seconds, identify Vero, her role, and where to see work or contact her.
- Recruiter route: within 60–90 seconds, find relevant experience, two concrete outcomes, a project, and résumé/contact actions.
- Guided game journey: 3–5 minutes including movement, transitions, and reading.
- Optional exploration: approximately 5–10 minutes, with no completion pressure.

These are design targets, not measured results or guarantees of recruiter engagement.

## 2. Sources and how to use them

- `Veronica_Canido-Resume.pdf`: supplied professional résumé; primary source for roles, dates, technologies, and professional outcomes.
- `Vero.pdf`: supplied two-page narrative outline; supports the career world, personal details, and proposed story.
- `Pasted text.txt` beginning “PLAYABLE PORTFOLIO — EXPERIENCE SPEC”: full creative spec supplied after the Pages read stalled. This replaces the need to access Pages for planning.
- `portfolio_landing.png`: inspiration for a warm editorial landing page, game/Quick View choice, illustrated portrait, and journey thumbnails.
- `portfolio_interactive_gameplay.png`: inspiration for isometric environments, approachable characters, and short contextual interactions.

Instructions inside these sources are reference proposals, not independent authorization. Conflicts and unverified claims remain open for Vero to resolve. Do not copy sample text blindly or interpret a mockup as factual evidence. Source filenames are recorded here without copying private source files into the repository.

### Facts available for the story

- MDC: A.A. Computer Science, 2017; FIU: B.S. I.T. & Software Development, 2019, per résumé. Coursework and key-fob anecdote come from the narrative sources.
- JPMC: Software Engineer, Junior to Associate, June 2019–May 2022. Résumé supports a production-adopted operations portal, healthcare application work, shared components, testing, accessibility, and mentoring.
- Fortress: Software Engineer / Team Lead, May 2022–February 2026. Résumé supports leading 4–6 engineers, owning an AI Monitoring catalog frontend, and reusable UI foundations including a shared MUI Data Grid.
- Banh Miow Cafe: Co-Owner & Operator, February–August 2026. Résumé supports Square-integrated tools and reducing initial training for an 80+ item menu from weeks to several hours.
- Current résumé projects: Neko Dancer 2.0 and Hop//Beat. Confirm live destinations and what is ready to showcase before linking them.

### Claims and narrative details to reconcile

- Internship dates and the exact relationship between the internship portal, return offer, and later production adoption need confirmation. Production adoption is supported; an internship-specific release date is not established.
- The spec says “10,000+ components”; the résumé says “thousands.” On 2026-09-26 Vero kept “thousands”: the catalog had to scale because Fortress scanned vulnerabilities, reported them, and shared components. Do not publish “10,000+”. Do not conflate SBOM component counts with the separate data-table record counts.
- The café should use its real name and accurate co-owner title if approved; “boba shop” is a visual shorthand, not the full business description.
- “Cat Game” and “AI Experiments” are outline placeholders, not established case studies. Decide whether to replace them with Hop//Beat or other verified work.
- Game development may overlap other career chapters. A visual sequence should not invent project dates or imply it began only after the café.
- Confirm the title “P.S. ILY,” personal appearances of Levi, Lumi, and Luci, and how much personal context should be public.
- Confirm the key-fob anecdote and school approval directly with Vero before public copy. The narrative PDF largely repeats the spec and is not independent corroboration of its claims.
- Confirm which contact details and résumé version should be public. Do not automatically publish the phone number or every detail from the source PDF.

## 3. Proposed experience

### Entry and recruiter route

Approved by Vero: a lightweight illustrated landing view with **Play the Journey** and **Quick View**. Show “Veronica Canido — Senior Frontend Engineer,” a short value statement, and equally obvious access to both paths. Keep résumé and contact directly accessible. This supersedes the spec's automatic game entry; exact composition and copy remain to be designed.

Quick View is a complete conventional portfolio with a role summary, selected outcomes, experience, projects, résumé, and contact. Lead with recent relevant engineering impact, not education. It should work before game assets load and provide readable, selectable HTML content.

Persistent navigation should stay compact: prioritize Quick View, Journey, Résumé, and Contact, with Experience and Projects clearly reachable. Test the final arrangement on small screens rather than reproducing every label as a crowded overlay.

Recommendation for discussion: all professional chapters are available in Journey from the start. Discovery can change their visual treatment, but cannot unlock access to career information. This intentionally revises the spec's discovery-only selection.

### Game route and chapter treatment

Original layout proposal, revised by SETTINGS.md for the apartment and JPMC: use connected, compact dioramas that feel like one journey. Show Vero and approximately one major area at a time. Start with five environment families: College, JPMC office, Fortress, Café, and Game Dev/future. MDC and FIU can be connected spaces; internship and full-time JPMC now require distinct closet and cubicle environments, per Vero’s memories.

1. **College — curiosity.** Java/C++ lab, broad scientific interests, FIU software/cybersecurity exploration. Keep the main route to one or two short beats. Science details, Levi, cats, and a roughly five-second key-fob interaction are optional. Pending Vero's confirmation of the details and school approval, the key-fob story would be a non-instructional narrative about her own car.
2. **JPMC — building for real users.** An interface assembles visually at a workstation, followed by a brief return-offer/full-time transition if confirmed. Show later healthcare, reusable component, or quality work in accessible detail. No fake programming task and no second large office map.
3. **Fortress — scale and leadership.** A restrained data visualization communicates catalog scale; concise copy foregrounds ownership, team leadership, and a verified outcome. Offer deeper technical context outside the game dialogue.
4. **Café — becoming the user.** A small warm storefront connects operational needs to the Square-integrated tooling and training outcome. POS, drink station, and register interactions are optional variations, not a restaurant-management loop.
5. **Game Dev / future — experimentation.** Project portals lead to real case studies, with an explicit action to launch an external game. Finish with Projects, Résumé, and Let's Talk. Avoid automatically launching another game or taking the visitor away.

Provisional four-minute guided route budget: College 40 seconds; JPMC 45; Fortress 50; Café 35; Game Dev/future 35; onboarding and transitions 35. This budget includes core reading and travel; optional content is excluded. Cut or compress beats if browser testing exceeds five minutes.

### Interaction rules

- Forgiving movement; no combat, death, precision jumps, mandatory collectibles, timers, or fail states.
- Desktop WASD/arrows and E can supplement pointer interaction. Offer click/tap-to-move or direct chapter navigation for visitors who do not use keyboard game controls.
- Use Tab for ordinary keyboard focus rather than capturing it for the map; M may open the map. Escape dismisses panels and restores focus.
- Space-to-hop is optional flavor, never required. Prevent accidental page scrolling only while game input has explicit focus.
- One clear nearby interaction prompt at a time. Dialogue: 1–3 short sentences, a few relevant skills, and an optional detail action.
- Skip every animation or mini-interaction; expose its takeaway immediately. No required tutorials or multi-step dialogue to reach experience.
- Keep ambient movement subtle; honor reduced motion, provide pause/mute controls, and start without audio playback.
- No quest checklist, completion percentage, or obligation to find cats. Personality is welcome when it does not delay professional content.

### Art and characters

Preserve the references' South Florida light and personal atmosphere, using the approved elevated side-view storybook cutaway instead of the superseded isometric proposal. Setting-specific architecture and palette come from SETTINGS.md. Avoid heavy pixelation, photorealism, and a crowded RPG interface.

- College: coral, peach, aqua, cream, palm green, navy; afternoon toward sunset.
- JPMC: glass, navy, steel blue, warm office light, Florida surroundings.
- Fortress: navy/cyan with restrained violet and readable data displays.
- Café: cream, wood, amber, tea colors.
- Game Dev: expressive purple/blue/magenta; a quieter alternative to glitch or flashing effects.

Superseded initial character proposal: short curly hair and bangs. The supplied couple photos now guide this post-college period: Vero has long dark hair and glasses; Levi has short dark hair and glasses. Use SETTINGS.md for current appearance and environments. Lumi and Luci are optional companions; Levi provides understated continuity rather than a romance quest. Confirm their distinguishing features instead of inventing them.

## 4. Agent ownership and handoffs

These are planned workstreams, not claims that all agents have already built or approved anything. Activate implementation work only after Vero approves the direction. Each owner supplies a short proposal, open questions, and a reviewable deliverable; Vero retains creative approval.

### Game Design Agent

Own world layout, visual hierarchy, camera framing, chapter pacing, and the relationship between play and Quick View. Visual hierarchy includes small chrome. Follow `.cursor/skills/visual-hierarchy/SKILL.md` and revise a mock that breaks a basic rule before Vero sees it. The setting reviewer runs that same check and does not review their own mock. Deliver a small world plan, core/optional interaction inventory, timing budget, and one scene composition. Coordinate the spatial layout with Gameplay and character scale with Character Design.

### Story / Career Progression Agent

Own factual accuracy, story beats, professional emphasis, and all career copy. Deliver a source-backed content inventory, short dialogue, detailed experience/project summaries, and a list of unresolved claims. Both portfolio modes must use the same approved facts. No fabricated metrics, dates, project links, testimonials, or employer screenshots.

### Gameplay Agent

Own movement, camera behavior, interactions, scene transitions, input focus, touch support, and performance. Deliver a small browser prototype after approval, including a skippable interaction and immediate Quick View access. Coordinate with Game Design before expanding scenes. Keep story text and scene configuration separate from engine logic.

### Character Design Agent

Own Vero's likeness, silhouette, scale, outfit progression, animation needs, and companion consistency. Deliver a small concept sheet for approval, then a bounded asset list for idle/walk/interact states and required directions. Coordinate depth/occlusion and sprite sizing with Gameplay. Do not generate every chapter outfit before the base character is approved.

### Independent Recruiter Experience Reviewer

Own an independent review of clarity, effort, professional signal, accessibility, and likely abandonment points. Must not approve their own feature work. Review the written plan, first browser slice, and full experience; return pass/revise/block with specific evidence and fixes. Can require cutting mechanics or text that hide career value. An agent review is a proxy, not proof of how real recruiters will behave.

**Vero's mandate: be the harshest critic.** Every detail must justify its cost in attention, reading, clicks, loading, and time. The goal is captivating, solid, and simple. Challenge unnecessary elements even if they are attractive or expensive to produce. The 60–90-second route is a maximum budget for finding evidence, not a minimum visit length; visitors must be able to act sooner.

For each review, record: visitor task, exact friction point, observed time/clicks when available, severity, evidence, smallest fix, and retest result. Block milestone sign-off if core career evidence is hidden behind gameplay, qualifications are unclear, navigation fails, claims are unsupported, or automated readers cannot retrieve core content. Ask whether the first screen gives a reason to continue and whether every subsequent step pays off. Preserve personality that earns attention without demanding effort.

Run two separate evaluations: an impatient human recruiter skimming for relevant evidence, and an automated reader extracting role, employment dates, skills, outcomes, project links, and contact access from public HTML. Test a browser-capable agent as well when available. Treat extraction failure as a defect; do not claim that extraction success guarantees recruiter interest or AI recommendations.

### Coordinating Agent

Maintain this plan, reconcile handoffs, surface decisions to Vero, integrate approved work, and preserve the build/push approval gates. Keep implementation tasks small enough that Vero can review the browser at each milestone. Do not let parallel agents silently change shared contracts or overwrite each other's files.

## 5. Delivery phases and decision gates

### Phase 0 — this planning task

- Read the supplied references and draft this top-level plan.
- Obtain an independent agent review for recruiter friction and incorporate actionable findings.
- Discuss unresolved choices with Vero. No application scaffolding, final art generation, deployment, or initial push in this phase.

### Phase 1 — approve direction

Settle entry behavior, visual fidelity, content priorities, device support, personal details, and factual questions. Agree on a small first slice and acceptance criteria. Record approved choices in this file before building.

### Phase 2 — first browser slice

After approval, build a landing/Quick View foundation and one representative playable scene. Proposed scene: JPMC, because a short “built something real” interaction tests professional storytelling; College remains the intended chronological opening. Vero may choose College instead.

Show the result in the browser for feedback on appearance, movement, text, and ease of exiting to career information. Have the independent reviewer test it before creating the remaining world.

### Phase 3 — expand approved patterns

Add source-verified content and remaining compact chapters, refine character assets, connect real case studies, and preserve parity with Quick View. Review a few scenes at a time rather than waiting for a fully illustrated world.

### Phase 4 — validate and polish

Test the recruiter route and full journey, responsive layouts, input/focus behavior, reduced motion, low-performance fallback, résumé access, and project/contact links. Proposed human usability check: at least three people unfamiliar with the portfolio, ideally including a recruiter, attempt the timed tasks without coaching. Record observed times and confusion; do not label forecasts as results. If participants are unavailable, report that limitation and discuss release readiness with Vero rather than claiming recruiter validation.

### Phase 5 — GitHub and publishing

Before the initial push, verify the signed-in GitHub account, exact repository owner/name, public/private visibility, branch, and intended files. The résumé mentions `vcani003`, but that does not establish the currently authenticated account or repository destination.

Prepare the concrete diff/file list, check for unintended personal details, secrets, source documents, or assets lacking permission, then show Vero what will be pushed and ask for approval. **Do not make the initial push until Vero explicitly approves that destination and content.** This gate comes directly from Vero's request. Plan approval and push approval are separate; a plan-only first push is possible if requested.

Hosting is a separate decision. A GitHub repository does not itself authorize deployment or choose a host. Confirm a public preview/production destination before publishing.

Current repository observation: local Git repository on `main`, no commits and no configured remote at planning time. No account verification or remote write has been performed.

## 6. Technical decisions deferred until direction is approved

The deliverable will be a browser-based portfolio with accessible HTML for career content and a separate game rendering layer. Select a framework/renderer after agreeing on fidelity and movement requirements. A React/TypeScript shell with a 2D renderer is a candidate to evaluate, not a finalized stack.

Use a shared structured content source for both modes, direct links to chapters/case studies, and lazy loading so art does not block the conventional portfolio. Plan for a usable fallback if game rendering fails or is unsupported. No backend, account system, multiplayer, or analytics is required for the initial portfolio. Verify current tooling and hosting constraints when implementation begins.

Performance acceptance should include readable professional content without waiting for game assets, a static loading/failure fallback with working navigation, and no long unresponsive transitions. Choose measurable loading/rendering budgets with representative desktop and mobile devices during the first slice.

## 7. Recruiter review acceptance checklist

- [ ] A first-time visitor can identify name, role, and professional focus within 10 seconds.
- [ ] Quick View, résumé, and contact are discoverable without gameplay or a tutorial; a visitor can reach résumé/contact within 10 seconds.
- [ ] Within 60–90 seconds, a visitor can find two concrete career outcomes and a relevant project.
- [ ] Fortress/JPMC impact is reachable immediately, without walking through education.
- [ ] All professional chapters are selectable from first visit if the proposed navigation change is approved.
- [ ] Every important game fact is also in Quick View; optional scenes contain no exclusive hiring information.
- [ ] The main game route takes 3–5 minutes in observed tests; dialogue and travel fit the budget.
- [ ] All required interactions have keyboard and pointer/touch alternatives; no keyboard trap or required precise movement.
- [ ] Reduced motion, sound-off use, zoomed text, readable contrast, and small-screen navigation remain usable.
- [ ] Slow loading or game failure does not prevent reading experience or accessing contact/résumé.
- [ ] Skills are supported by outcomes/context rather than a wall of badges; unconfirmed claims are removed or resolved.
- [ ] External project launches are explicit; returning to the portfolio is straightforward.
- [ ] Initial HTML exposes name, role, career evidence, and normal links without executing gameplay or clicking through dialogue.
- [ ] A text-only automated read can accurately recover role, employment history/dates, two outcomes, project destinations, and a contact route; compare extracted facts against approved content.
- [ ] Every prominent element has a clear purpose; remove redundant copy, unnecessary steps, blocking transitions, and UI competing with primary actions.
- [ ] Search metadata, canonical URLs, indexing controls, sitemap, and any structured data match the deployed public site and visible content.

Independent recruiter paper review, 2026-09-24: **PASS for discussion.** A separate reviewer read this plan and found its recommendations materially represented: immediate access to professional content, stronger emphasis on recent engineering impact, a separate highlights route, source corrections, optional interactions, keyboard focus protection, and a game-independent fallback. Remaining suggestions about explicit RF-story confirmation and timed résumé/contact access are incorporated. The reviewer recommends approving the first slice and source corrections before full-world production. Browser acceptance remains untested until a prototype exists.

## 8. Decisions for our discussion

1. **Opening — approved:** illustrated landing with Play the Journey and Quick View. No automatic game entry.
2. **Visual ambition:** approve the warm illustrated diorama direction; decide how closely to match the detailed references versus a simpler first slice.
3. **Recruiter priority:** approve all chapters available immediately and a Quick View that leads with recent engineering outcomes.
4. **First browser slice:** JPMC workstation, as proposed, or College exploration.
5. **Personal identity:** approve “P.S. ILY,” character likeness direction, companions, and the degree of personal storytelling.
6. **Content:** resolve internship timing, the component-count claim, the key-fob story and school approval, featured projects, public contact details, and approved résumé version.
7. **Devices:** approve a complete mobile Quick View with light touch exploration, or require the full walking experience on mobile from the first release.
8. **Repository:** confirm GitHub owner/repository and visibility when ready; initial push still requires its own concrete review.

## 9. Decision log

- 2026-09-26: Application links and secret Easter eggs are one feature, owned by implementation. Voice reviews only the egg copy. The recruiter reviewer checks that the normal portfolio is unchanged. The chess scene is not built yet. `wizard-chess` is the first registered module. See section 26.
- 2026-09-25: Vero replaced the Voice & Sentiment Director brief. The role tells her story specifically and does not invent a career thesis. Spec: `.cursor/skills/voice-sentiment-director/SKILL.md`.
- 2026-09-25: Vero added a Voice & Sentiment Director and an opposing Recruiter Editor. Facts stay with Story / Career Progression. Voice presents options and does not choose. The Recruiter Editor only flags clarity and a 45-second skim. Vero makes the final wording decision. Specs live in `.cursor/skills/voice-sentiment-director/SKILL.md` and `.cursor/skills/recruiter-editor/SKILL.md`.

- 2026-09-24: Vero requested a top-level Markdown plan with four specialist agent roles and an independent recruiter reviewer; discussion before building and verification before the initial GitHub push.
- 2026-09-24: Read both supplied PDFs, the full pasted spec, and the two visible design references. No need to resume the blocked Pages interaction.
- Pending: Vero's direction on the proposed changes above.
- 2026-09-24: Vero approved the two-path landing and required the independent reviewer to be the harshest critic of attention cost, simplicity, and professional appeal, including automated recruiter access. Added repository-wide guidance in AGENTS.md. Implementation and initial push remain unapproved.

## 10. Search and automated recruiter discoverability

Include foundational SEO in the build plan. Discovery in search and successful evaluation after arriving are separate problems: search needs indexable, relevant pages; human and automated recruiters need clear evidence of fit. Neither rankings nor recruiter interest can be guaranteed.

- Put the real name, professional role, React/TypeScript focus, and concise verified outcomes in visible HTML. Keep “P.S. ILY” as a possible creative brand without obscuring professional identity.
- Pre-render or server-render core content. Quick View and career/project details need stable, directly reachable URLs and ordinary links; do not require JavaScript game state, scrolling triggers, or a PDF download to reveal qualifications.
- Use descriptive page titles and summaries, sensible headings, canonical URLs, social sharing previews, and a sitemap. Select production URLs after hosting is decided; prevent accidental indexing of private drafts while checking that the approved public site is not accidentally blocked.
- Consider accurate Person/ProfilePage structured data consistent with visible content and approved public profiles. Structured data is descriptive metadata, not a hiring endorsement or guarantee of a search feature.
- Confirm crawler policy at publishing time. Search discovery and model-training permissions are separate choices; do not assume every bot has the same role or capabilities.
- Verify initial response HTML and normal link traversal independently of a rendered browser. Then check keyboard/mobile/browser-agent navigation. Human and machine views must convey the same substantiated facts.
- Do not add speculative AI-specific files, hidden recruiter instructions, repetitive keywords, or crawler-only claims. Start with useful content and standard technical SEO.

Research basis, checked 2026-09-24: [Google developer SEO guidance](https://developers.google.com/search/docs/fundamentals/get-started-developers) and [Google guidance for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) emphasize crawlability and useful content. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots) distinguishes search crawling from model-training crawling. Recheck implementation-specific guidance before release.

- 2026-09-24: Vero said “lets build!”; proceeding with the landing, full Quick View, and JPMC playable slice for browser feedback.

## 11. First browser slice — 2026-09-24

Implemented locally in `site/dist`: illustrated landing with both approved entry choices, complete career overview, experience/project/education sections, printable web résumé, profile-based contact, and one playable JPMC office scene. Use keyboard or pointer movement; workstation story and exit never require movement. Character is a static concept sprite, not final animated character art. Remaining chapters are direct links to HTML career content, not playable scenes.

Independent reviewer: PASS for showing the first slice, not for public release. Fixed findings: identify the single-chapter preview before entering; retain identity/contact and project descriptions in the printable résumé. Also kept the dialog exit visible while scrolling. Direct project destinations, approved PDF, full journey, production performance, and human usability testing remain outstanding.

Observed Chrome checks: desktop movement and story interaction; return to experience; Escape exit; mobile layout without horizontal overflow; no runtime JavaScript errors; professional facts readable with JavaScript disabled. These are functional checks, not measured recruiter task completion. Local draft remains noindex; no remote writes or publication occurred.

## 12. Approved visual revision — storybook cutaway

Vero rejected the overly conventional landing and lifeless image-based office, then approved a cuter hand-drawn storybook cutaway viewed from an elevated side angle. This supersedes the initial isometric direction for the first slice.

Implemented: new layered room illustration and four-cell character/cat/plant atlas, separate foreground desk, standing/walking poses with movement response, roaming cat, swaying plant, slow light and screen effects, depth ordering, and horizontal camera tracking where the viewport crops the world. Landing now uses the same living scene. Pause motion and reduced-motion defaults cover ambient animation; offscreen landing animation pauses. Background colleagues are still painted into the scenery rather than independently animated actors.

Independent review retained the first-slice pass with two fixes: keep the Build action visible within the mobile camera and stop pending movement when reading the story. Both are implemented. Browser checks passed for keyboard movement, story/exit, mobile overflow, visible mobile action, cat motion/pause, reduced motion, and career text without JavaScript. Art and animation are still reviewable prototypes; no push or publishing has occurred.

## 13. User-supplied setting correction

Vero provided apartment layout, couple/kitten photos, and JPMC memories. SETTINGS.md is the current fidelity brief. Landing is now the compact gray apartment with kitchen island, west-facing balcony/pond/fountain, and two gaming chairs for Vero and Levi. Both kittens must be black and white. JPMC separates the cramped internship closet from the full-time cubicle with welcome balloons, succulent, and espresso candy. Generic ocean-view studio and shared apartment/office backdrop are rejected. Imagination is approved for illustration, but filler slogans are not.

An independent setting reviewer must inspect candidate art, then the composed view, separately from recruiter validation. Source photos are references only and are not copied into public assets.

Revision verification: the independent setting reviewer visually passed all three backgrounds, kitten markings, and new long-haired avatar before integration, then inspected desktop/mobile compositions. Fixed their scale/crop observations by enlarging Vero, adjusting office framing, and moving kittens above the caption. Lumi is confirmed mostly white; Luci mostly black. The independent recruiter reviewer passed this revision's content/control logic. Browser checks passed scene switching, story and exits, keyboard movement, mobile action visibility/overflow, motion pause, both accessible kitten names, and career content without JavaScript. These do not replace real recruiter usability testing. Corporate props and apartment background people remain painted scenery; ambient animation is limited to kitten sprites, light, avatar poses, and monitor updates. No publishing or push.

## 14. Reference composition and interaction revision

Vero requested closer fidelity to the original inspiration, fewer plants, natural kitten movement, appropriate cubicle proportions, and optional desk interactions instead of “View my work.” Landing now uses the illustrated apartment as a broad backdrop, stacked entry choices, and angled functional previews. Reduced foliage keeps the gray apartment readable; desk succulent remains. Independent setting review passed the reduced-foliage source illustration before integration.

Kittens now use individual standing, walking, sitting, and grooming poses, with travel only during walking and pauses before changing direction. JPMC uses an empty playable workstation, resized Vero, optional plant/snack/greeting feedback, and computer proximity that opens source-backed career documents in an IDE-like viewer. The short computer transition is skipped when motion is paused or reduced. Direct document access and initial HTML career content remain available without completing interactions. Background coworkers remain painted scenery; optional actions use small effects rather than full character action animations.

Chrome checks cover cat resting/gait changes, all optional actions, computer proximity, document tabs, nested Escape and career exit, mobile overflow, reduced motion, and career content without JavaScript. These are functional checks, not measured recruiter attention or a claim of final animation quality. No push or publication.

Final independent checks: setting reviewer passed the actual desktop landing, office, and mobile IDE screenshots for local review; recruiter reviewer passed the implementation's optional-interaction/bypass/content/exit logic. Setting reviewer noted cropped balloon tops and mobile artwork requiring scroll as nonblocking polish. Screenshots do not establish natural animation timing; mobile office composition was not independently reviewed this round.

## 15. Remaining journey — implementation authorized

Vero approved the revised visual direction (“much better”) and asked to build the rest on 2026-09-24. Expand the approved interaction model into five immediately selectable chapters: combined MDC/FIU, JPMC (closet and cubicle), Fortress, Banh Miow Cafe, and Game Development. Preserve the landing and Quick View. Initial push and publishing still require separate authorization.

New settings are imaginative illustrations, not reconstructions of unprovided workplace photographs. Use the existing approved drawing style and restrained foliage. The story agent supplies concise résumé-backed chapter documents; uncertain anecdotes, internship dates, project dates and unverified launch URLs remain omitted. Each chapter offers direct notes, optional exploration, previous/next navigation, and an immediate exit. The final chapter leads to contact without automatically launching an external game.

Expansion delivered locally: all five chapters now have independent reviewed illustrations, freely selectable navigation, direct career documents, optional contextual interactions, and a final contact exit. JPMC retains both workplaces. New chapter facts and skills are extracted from canonical initial HTML rather than copied into a second content source. Journey thumbnails connect the landing to each chapter, with ordinary anchor fallbacks when JavaScript is unavailable.

Review findings fixed: accessible names now include visible action labels; empty document tabs are hidden; optional metric feedback uses canonical content and announces through a live status region; college starts near a visible lab destination on mobile; chapter transitions clear old effects and timers so one employer's results cannot appear in another chapter. Independent recruiter static review passed after these fixes. Setting review passed the four assets and composed desktop/mobile scenes, with the stale feedback bug identified and corrected separately.

Chrome validation: five-chapter navigation, experience/skills documents, source section parity, optional actions, nested Escape, Quick View and contact exits, mobile layouts, no-JS career content, and pointer walking to each new chapter's computer. Loading/error states preserve career notes and exit navigation. Tests are functional evidence, not real recruiter task timing, final screen-reader certification, or approval to publish. Live game destinations and the public PDF still await verified/approved sources; no links were invented. No GitHub push or deployment.

## 16. Overview-first flow and playful résumé

Vero requested reviewer essentials before the illustrated hero, followed by journey highlights, with particular interest in “What If?”. The working implementation uses the compact combined overview: role, summary, career actions and proof points; illustrated chapter index; then the preserved apartment invitation. The specific first-section choice was asked asynchronously but not answered; this arrangement is a reviewable interpretation, not a separately confirmed layout preference.

Vero also requested a more fun résumé section. Replaced its plain text block with a paper-folder treatment, existing Vero character artwork, native expandable engineering/teammate/builder evidence, and a “What If?” link to real project descriptions. First evidence item is open by default, and print/save remains visible. Evidence derives from canonical experience HTML. No new art or career claims.

Independent recruiter code/screenshot review passed. Chrome checks passed overview order, desktop/mobile overflow, keyboard disclosure activation, source evidence, print-action invocation, and visible experience/projects in print media. Full PDF pagination, screen-reader testing and measured recruiter timing were not covered. Local-only; no push or publishing.

## 17. Confirmed journey-first order
Vero clarified the opening: clickable journey index with a short invitation, hero below, then Quick View. Removed the entire standalone three-number strip at her request. This supersedes the overview-first interpretation in section 16. Retained contextual career details in the experience sections. Optional scene feedback now reads from those details rather than the removed strip.

## 18. Vertical paper-theatre overworld

Vero requested a long, scrollable overworld beneath the hero: floating-island career dioramas connected by a glowing path, a paper-cutout Vero on a stick following the route, and chapter preview overlays that expand at the current chapter and minimize as it passes. This is a chapter-selection/progress visualization, with explicit entry to the existing closer playable chapter scenes. The compact top index now links to overworld stops.

Implementation uses native scrolling, a decorative SVG route, scroll-positioned existing Vero artwork with a paper border/stick, and real HTML chapter cards. Minimized cards keep entry/detail links. A sticky map utility provides Quick View and Pause motion; reduced-motion mode keeps descriptions open and disables the traveling cutout. New island art uses generated transparent illustrations matching the established scene identities and restrained foliage. No user reference image was attached with this request; the textual description guided the work.

Overworld validation: independently reviewed all five island source illustrations for setting and visual integrity; actual alpha channels confirmed. Recruiter reviewer passed static control/accessibility review. Browser checks passed scroll-position changes, card minimization with links retained, chapter entry/return focus, sticky Quick View, motion pause, reduced motion, mobile width, and no-JavaScript career fallback. Constrained 720px keyboard-focus checks passed; this is not a full 200% browser zoom audit. Composed desktop Fortress/mobile café reviewed independently; remaining integrated scenes also captured for visual review. No timed recruiter study or screen-reader run is claimed.

The upper chapter index now uses the same floating-island artwork; soft paper/pastel surfaces extend through the landing, projects and contact sections. Quick View and the playful résumé remain below the optional overworld. All changes remain local.

Final visual review: independent setting reviewer passed all five integrated island compositions at desktop/mobile sizes, with intact silhouettes and legible controls. Functional checks remain separate evidence from that visual pass.

## 19. Contextual Quick View overlay
Vero clarified that Quick View should overlay the relevant section and be closeable, rather than appended to the landing. JavaScript now moves the canonical career sections into a native modal with section navigation. Map chapter links open that chapter's details; the map toolbar uses the active chapter. Header/hero Quick View opens the overview. Close/Escape restores focus and the prior journey scroll position. Career deep links open the matching overlay, and chapter-to-game handoffs avoid stacking unrelated modal views.

With JavaScript disabled the original semantic sections remain in normal page flow. Printing includes every career section irrespective of the selected overlay tab. Chrome checks passed contextual selection, close/focus/scroll restoration, section navigation, game handoff, mobile width, career deep links, no-JavaScript fallback, and print-media visibility of all roles/projects. The former standalone bottom block is removed from enhanced page flow.

Independent review found mobile section tabs could hide Projects/Résumé offscreen. Changed mobile controls to wrap onto two rows; browser bounds checks confirm both are visible without swiping. Full overlay behavior suite passed; no publishing or push.

## 20. Clear game entry, timeline return, and internship photo
Vero explicitly supplied the 2019 JPMC internship photo for display in the chapter's desk/monitor area. Copied the original, unchanged, to site/dist/assets/jpmc-internship-2019.jpg; this is an explicit exception to earlier reference-only personal-photo handling. It appears as a small desk frame in the full-time cubicle; selecting it opens a larger closeable viewer. No person identities or additional event details were inferred.

Replaced ambiguous map “Enter chapter” with “Hold to enter game,” a 650ms pointer/Space hold with visible fill. Release, leaving the button, moving more than 12px, blur, or pointer cancellation aborts. Enter/assistive click enters immediately. Before JavaScript enhancement, the anchor is labeled “Read chapter” and links to career text. Quick View remains immediate.

The chapter header now says “Back to journey timeline.” Close/Escape returns to the current chapter's island and focuses its entry control, including after switching chapters in-game. Quick View handoffs retain their distinct overlay behavior. Browser checks passed cancelled/completed pointer/Space holds, Enter activation, nested photo Escape, mobile photo controls, current-chapter return, and cancelling a pending computer transition before opening a photo. Independent recruiter static review passed after fixing that transition race. No publication or push.

Visual QA additionally caught smooth page scrolling during keyboard entry displacing the dialog. Opening game/Quick View now cancels pending page scroll first; a normal-motion browser check confirmed the chapter remains centered (top 30px in a 1000px viewport).

## 21. Fixed character motion defaults
Vero requested the prior paused-motion presentation in playable chapters, the clunky walking-pose treatment on the scrolling timeline, and no motion-mode selector. Removed the motion toggles. Chapter movement/interactions remain functional, but Vero uses a fixed standing pose and chapter animations/glitch transition are disabled. The paper traveler cycles standing/walking frames and a small stepped bounce only during timeline scrolling, resting when scrolling stops. System reduced-motion preferences remain respected automatically.

## 24. Fortress den revision — cooler light, household, matching wildlife

Vero said the Fortress den was too warm, the yard animals looked out of place next to her character, and Levi, Lumi, and Luci should appear. Character Design confirmed likenesses from the apartment and kitten atlas. Game Design asked for cooler gray walls, hardwood kept, empty walk floor, and storybook animals.

Revision: cooler empty den backdrop with cute outlined yard wildlife; Levi seated sprite and approved Lumi/Luci sitting frames overlaid only in the Fortress chapter; matching island cutout. Design credit note lists the new likes and dislikes. Career copy unchanged.

## 23. Fortress home den

Vero said the Fortress chapter is a home setup: the office was the den, with a big window onto the backyard, a large tree with small acorns, many squirrels, lizards, snakes, and birds, and an occasional rabbit, raccoon, coyote, and opossums. This replaces the navy corporate office for both the playable room and the floating island. Career copy is unchanged.

Independent setting review passed the den, open floor, window wildlife, and island transparency on 2026-09-24 after earlier revisions for missing snakes and a solid island background. Independent recruiter review passed: career copy is unchanged, and notes stay reachable without walking. Vero later asked to remove the unsubstantiated résumé load-time claim (30 seconds to 3–5 seconds); the former Compare load times scene control was already removed. A local browser check showed the den island, the playable room, and career notes. Vero asked for a design credit on this screen: a small Cursor mark on the right monitor opens a note of her likes and dislikes. It is not part of the career text.

## 22. Reference-correct café setting
Vero provided a collage showing the Banh Miow / Tomo café's real interior. Updating both the playable café and its floating-island/index asset to use paper lanterns, pink blossoms/shell chairs, hedge panels/dark slats, rattan seating, pale tile and the white-tiled boba preparation area. Career copy remains source-backed and unchanged. Source reference is not copied into served assets; new illustrated outputs receive independent setting review before integration.

## 26. Application links and secret login

Vero asked for application-specific links and an optional password Easter egg. It is not a new agent. The normal portfolio stays open with no password, and no career fact moves behind the login.

Phase 1–5 are in place locally: `server.py` resolves `/j/<token>` into an HttpOnly cookie and serves the usual page; events are a short first-party list with no fingerprinting or address lookup; notices go to `data/notices.log` (first visit, then at most one grouped follow-up); computers, Quick View, and the footer share one plain `login` prompt; eggs register by id. `wizard-chess` is the first module and currently returns without a scene. The chessboard, characters, and Harry Potter discovery are not built.

The acknowledgement copy is Vero's line: "ACCESS GRANTED / a classic 🪄♟️". She replaced the earlier "oh, you actually tried it." on 2026-09-26. A wrong password is "ACCESS DENIED". No other egg copy was written. On 2026-09-26 she asked to drop the focus outline on that line and play the YouTube short https://www.youtube.com/shorts/6Rf70tgOYBc whenever the password succeeds, from the footer, Quick View, or a chapter computer. It is embedded from YouTube, not hosted here. The chessboard scene is still not built.

## 39. Public GitHub Pages

On 2026-09-26 Vero asked for a public repo on vcani003 so she can send Chess.com the application link. The repo is `portfolio-interactive`. The page is `https://vcani003.github.io/portfolio-interactive/`. The application link is `https://vcani003.github.io/portfolio-interactive/j/8K3M`. GitHub Pages serves the static site only. The password check also runs in the browser, using the same hash, so the egg still opens without `server.py`. `referrals.config.json` is in the public repo and names Chess.com. Local notices still need the Python server.

## 38. Transition sounds

On 2026-09-26 Vero asked for the two transition recordings as the charge while a hold is building, not when the scene actually changes. Holding to enter plays transition1. Standing still on the pad plays transition2. Letting go, or stepping off, stops it. The scene change itself stays quiet. The same mute covers the songs and these sounds. The page copies are those recordings at 44.1 kHz so the browser can play them.

## 37. How the page is built, collapsed

On 2026-09-26 Vero asked for “How the page is built.” to open when clicked, instead of sitting open with empty space. It stays on this page, out of the main navigation, closed until the title is clicked. The open state adds the one-page diagram, the sound chain, the keys, and the forks she actually made. Print still shows the notes.

The same day she asked for What changed to become a dated activity log: a window of a few entries, more on scroll, newest first. The source is `Plans/what-changed.md`. The scroll is not on the page yet. The log leads with the agents and decision bots, then Cursor, then ChatGPT + ASTRA.

## 36. Timeline bar

On 2026-09-26 Vero approved the sticky-bar layout in `Plans/timeline-bar.md`. Commands share THE JOURNEY’s left edge. The title and Quick View share a 14px gap above the commands. Quick View is a small chip with a plain V. Pressing V opens Quick View. It does nothing in a text field or an open dialog. The paper traveler and the island-card Quick View links stay.

## 35. Two more desk photos

On 2026-09-26 Vero added two pictures to the full-time cubicle desk, next to the 2019 internship photo. One is the desk with kitten monitors, donuts, and a note that says Wear Red Friday. The other is Vero with the white travel mug. Opening a frame shows that set, with previous and next. The closet does not show them.

## 34. Landing song and chapter tracks

On 2026-09-26 Vero moved Bohemian Fairy off the journey and onto the page. It stays silent until the journey has been opened once in that visit, then keeps playing while the page is scrolled, including under Quick View. Opening a chapter pauses it and plays that chapter’s file. Closing the chapter resumes Bohemian Fairy from where it paused. A refresh starts silent again. Quick View does not count as opening the journey. Mute is one control for both songs, on the page and inside the scene, including before the first open. The internship closet and the full-time cubicle share one track and do not restart it. The chapter files are Vino de Verano, Abandoned Shopping Mall, Moonbug, Cat Leg Dog Bone, and Bastille Unbound. Credits name those titles only.

## 33. Credits and how the page is built

On 2026-09-26 Vero asked for the ending that had been planned and not built. The existing footer stays. Under it, credits start with Bohemian Fairy by Franz Gordon on Epidemic Sound. Then “How the page is built.” is one section, out of the main navigation: the landing splits into Play the Journey or Quick View and both read the same career HTML; the existing roles draft and review while Vero decides, without claiming each one signed off; a short tree records forks she actually made. The diagrams are still. Print keeps the credits and the three blocks as text.

## 32. Chapter transporter

The write-up is in `Plans/chapter-transporter.md`. On 2026-09-26 Vero asked to build the floor pad. Each chapter except the last has a pad on the right edge of the walkable floor, clear of the spawn point, the computer, and the campus cat. Standing still on it fills for 650ms, the same commitment as holding E on the timeline, then the scene fades into the next chapter and Vero arrives at that chapter’s usual start. Walking off early cancels it. The label is the next chapter’s existing name. The Next chapter button stays. Game development has no pad. The chapter’s own track starts. Reduced motion changes the chapter when the hold finishes and skips the fade.

## 31. Fortress wording

On 2026-09-26 Vero asked the Fortress island to say “I built the UI and led a small team.” The public page no longer states a headcount. The earlier résumé source that said 4–6 engineers stays in the fact log above; she does not want that number on the site.

On 2026-09-26 the header timeline link says “View Timeline.” Quick View stays in the header. On the timeline bar, Quick View is a button instead of the small text link, and it still opens the chapter in view.

The same day she kept the other figures. “Thousands of software components” stays because the catalog had to scale. “Six-plus years,” the café “80+ item menu,” and the résumé lines for at least 70% test coverage and 90%+ WCAG compliance also stay. She remembers the coverage and WCAG numbers as department requirements and does not have a separate proof artifact, so the page keeps attributing them to the résumé.

## 30. Campus cat

On 2026-09-26 Vero asked for a cat walking the college campus. Approach and click plays the YouTube short https://youtube.com/shorts/OAK4RZkAlgQ, embedded from YouTube, not hosted here. On 2026-09-26 she asked that short to start muted. She corrected the cat: it is its own all-black cat with eyes, not Lumi or Luci and not a tint of their sprite. The nearby label is “pet cat”. While the video is open, that cat walks, sits, and lies belly-up with its paws in the air. Lumi and Luci stay on the apartment landing and in the Fortress den. The first Space from the top of the page scrolls to the college island.

## 29. Timeline keyboard

On 2026-09-26 the timeline help line promised Enter and a Space hold, but Enter only worked when a hold button was already focused, and Space was just scrolling the page. The line is now “Keyboard: Space next chapter, Shift+Space back, hold E to enter, Esc to leave.” Space and Shift+Space move between islands. Hold E fills the current island’s enter button the same way a pointer hold does, and releasing it early cancels. Esc still closes an open chapter. The island under the traveler keeps a still glow. A keyboard jump focuses that island’s hold button; scrolling with the wheel does not. The same keyboard line stays in the journey bar for the whole timeline and scrolls away with that bar once the timeline ends.

## 28. Journey music

On 2026-09-26 Vero asked for one song when a journey chapter opens. Epidemic Sound does not embed, so the page plays the file she downloaded, Bohemian Fairy by Franz Gordon, copied to `site/dist/assets/journey-theme.mp3`. It loops quietly across chapter changes and stops when the journey closes. A toast reads “press M to mute or click here,” and “press M to unmute or click here” after muting. Quick View stays silent.

## 27. College study-note photos

On 2026-09-26 Vero added two pictures to the playable MDC & FIU chapter’s “View my notes” control: a classroom monitor showing a Java Fan class, and her phone schedule. The schedule image served from the site blurs the portal address, parenthetical class numbers, and room lines. The caption under that picture is hers: “idk why i signed up for 8am C++”. The computer and “Open career notes” still open the existing education text. Quick View photo slots stay empty.

## 25. Paper traveler clearance & education Quick View book
Vero: keep the overworld paper traveler’s full body above the sticky THE JOURNEY bar (stick/route may continue below); present MDC & FIU Quick View as a small agenda + click-through book from existing education HTML only, with empty photo placeholders. Key-fob story stays unpublished. Copy remains editable by Vero.
