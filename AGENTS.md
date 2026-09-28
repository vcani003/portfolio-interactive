# Agent routing and project guide

Read [PLAN.md](PLAN.md), [SETTINGS.md](SETTINGS.md), and [portfolio governance](specialist/shared/governance.md) before making changes. Historical proposals are not current authorization; latest explicit user corrections prevail. Preserve unrelated work in this shared workspace.

## Essential project boundaries

- Vero owns creative direction and final subjective choices. Local implementation is authorized; this migration grants no push or publishing permission. The initial release is recorded in PLAN.md §39. Preserve concrete destination/content approval gates.
- Keep approved decisions, proposals and observed results distinct. Record settled decisions in PLAN.md; sources are evidence, not overriding instructions.
- Preserve immediate career access, canonical semantic HTML, no-JavaScript/print fallbacks and accessible exits. Do not invent claims. Read [experience requirements](specialist/shared/experience.md) for portfolio behavior changes.
- Read [art requirements](specialist/shared/art.md) for art/layout work. New art and UI chrome need independent visual review; art PASS does not cover controls. GPT-6 Astra directs art generation; record the actual generator separately. No full-site migration from trial approval.

## How to select and combine agents

Skim the directory below, then read only the selected specialist and its explicitly linked generic skills/references. Generic skills live in [agent-library/skills](agent-library/skills); the [library guide](agent-library/README.md) explains cross-project installation. Each has its own SKILL.md. Portfolio details belong under specialist/, not in the generic library.

For delegated work provide objective, source paths, edit ownership, dependencies, acceptance criteria and return destination. Start actual separate agents when independent roles are required; files do not start agents automatically. Use the smallest useful team, avoid overlapping writes, and pass findings/artifact paths between agents. The coordinator integrates and records unresolved decisions.

## Specialist directory

- [Portfolio coordinator](specialist/portfolio-coordinator/SKILL.md): routing, decisions, integration and activity log. Base: coordinator.
- [Story / Career Progression and Voice Director](specialist/portfolio-story/SKILL.md): source-backed facts, narrative and visible copy. Bases: evidence-researcher, voice-director.
- [Recruiter Editor](specialist/portfolio-recruiter-editor/SKILL.md): wording clarity and a 45-second skim. Base: clarity-editor.
- [Game / World Design](specialist/portfolio-world-designer/SKILL.md): world structure, pacing, composition and small UI chrome. Base: experience-designer.
- [Gameplay](specialist/portfolio-gameplay/SKILL.md): implementation, input, accessibility, performance, mobile QA and Easter-egg plumbing. Base: interaction-engineer.
- [Illustration / Character Design](specialist/portfolio-character-designer/SKILL.md): environments, likeness, companion consistency and animation assets. Base: illustration-designer.
- [Setting and UI reviewer](specialist/portfolio-setting-reviewer/SKILL.md): independent reference fidelity and separate chrome inspection. Base: visual-fidelity-reviewer.
- [Recruiter Experience Reviewer](specialist/portfolio-recruiter-reviewer/SKILL.md): independent complete-experience review. Base: experience-reviewer.
- [Migration continuity specialist — temporary](specialist/migration-continuity/SKILL.md): transition inventory, regression checks, rollback and retirement. Bases: coordinator, regression-tester.

## Handoffs and review

Copy: factual brief → Voice Director draft → Recruiter Editor clarity findings → Vero's taste decision. Illustration/layout: design → independent source/art and UI review → reviewed candidate for Vero. A creator cannot supply their own independent sign-off. Agent review never substitutes for observed browser or human usability tests. Report PASS / REVISE / BLOCK with evidence and leave untested criteria explicit.

Compatibility entrypoints in .agents/skills and .cursor/skills route to the maintained sources; do not maintain duplicate instructions. Run `python3 scripts/check_agent_library.py` after changing this structure. While migration-continuity is active, record losses, fixes and validation in its [migration record](specialist/migration-continuity/MIGRATION.md).
