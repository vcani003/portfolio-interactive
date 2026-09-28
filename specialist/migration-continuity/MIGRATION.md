# Agent library migration — 2026-09-28

Status: implemented locally; structural checks and independent source continuity passed. Ten independent simulated decisions and seven installer tests passed; fresh-session discovery remains untested. Temporary continuity specialist remains active.

## Scope and ownership

Vero authorized a reusable generic team, repository specialists and a temporary migration specialist with regression coverage. Coordinator owns implementation; migration_specialist independently inventoried the original guidance. Independent regression review passed the ten simulated scenarios and current installer/structural checks; see REGRESSION.md. No application behavior, public activity entry, commit, push or deployment is part of this migration.

The versioned generic source is agent-library/skills. User-level installation is generated from that source and can run without this repository. This keeps history and rollback reviewable while making the generic team usable on unrelated projects. Project specialists remain in specialist/. Existing .agents and .cursor entrypoints are preserved as routing wrappers/links rather than independent copies.

## Baseline and continuity map

[manifest.json](manifest.json) contains every old AGENTS.md section and its active destination, and hashes for the immutable [original guide](baseline/AGENTS.md.txt) and three original skills. The baseline records pre-migration working files, including existing uncommitted changes; it is not a Git HEAD rollback.

- Direction, responsibilities and activity log → [governance](../shared/governance.md).
- Recruiter, content/discoverability, landing, overworld, overlay and motion → [experience](../shared/experience.md).
- Setting fidelity, model preference and illustrated-world gate → [art](../shared/art.md).
- Approved voice instructions → [voice reference](../shared/voice-sentiment-director.md), loaded by portfolio-story.
- Approved recruiter wording checks → [editor reference](../shared/recruiter-editor.md), loaded by portfolio-recruiter-editor.
- Exact visual hierarchy checks → [hierarchy reference](../shared/visual-hierarchy.md), loaded by world designer and independent setting reviewer.
- PLAN.md, SETTINGS.md, rendering standard, résumé source and ART_ASSETS.md remain their existing sources; specialists link to them. History is not rewritten.

## Explicit precedence resolutions

These preserve decisions already recorded before migration, not new creative decisions:

- PLAN §39 records an existing public release. Earlier initial-push language is historical; no new publication is authorized here.
- Contextual Quick View overlay supersedes a separate bottom section in the enhanced experience; semantic fallback and full print content remain.
- Quiet chapters, walking traveler on scroll and system reduced motion supersede the earlier Pause/motion-selector UI.
- Latest Fortress correction uses white walls, two desks, centered window, left tree, acacia-like floor and homepage kitten sprites for that composition.
- Latest résumé corrections use labeled hyperlinks, Website, Florida and no phone; superseded numeric load-time claims and original source contact details must not return.
- Voice detail and strict UI hierarchy checks remain project constraints, not universal style rules.

## Regression evidence

- Baseline review: independent migration_specialist found all three .agents/.cursor original pairs byte-identical and supplied a continuity inventory plus realistic routing scenarios.
- Structural/source checks: PASS via `python3 scripts/check_agent_library.py`: all 12 old guide sections, three exact skills, 10 generic roles, nine specialists, local links and legacy routes. This checks actual section/reference continuity, not just headings.
- Installer safeguards and standalone copy: seven unittest cases PASS (standalone/idempotent install, unowned collision, customized skill, extra user file, top-level symlink, nested symlink, unsafe manifest path). Installed 10 generated standalone copies in `/Users/vero/.agents/skills`; unrelated projects do not need this repository. Source ownership stays with the versioned library; installer refuses modified copies.
- Independent source continuity review: PASS from migration_specialist after reading all generic roles, specialists, shared requirements and the manifest and independently running the checker. No material omission found. Historical/current-state distinctions and all approval, privacy, provenance and review rules remain reachable.
- Independent scenario evaluation: PASS for ten realistic dry-run tasks; see [full regression evidence](REGRESSION.md). Reviewer separately ran the structural checker and seven installer tests and verified nested-symlink refusal. Installed-source hash parity also passed for all 10 personal copies. No fresh-session discovery, art or site UX result is implied.
- Fresh desktop-session automatic discovery: untested. Explicit path loading is available now; current session catalogs may remain stale.

- Bundled skill-creator validator was attempted but could not run because PyYAML is absent in the available Python runtimes. The repository checker validates required frontmatter fields and all links; do not call this an official-validator pass.

## Rollback and retirement

Before rollback, compare current files against the migration result and preserve subsequent edits. Restore AGENTS.md from baseline/AGENTS.md.txt only if no later edits would be lost. Restore each legacy skill's baseline bytes to both original locations, first removing only the corresponding compatibility symlink. Remove only new migration-owned entrypoints/folders after checking their callers. Remove only the appended migration decision from PLAN.md, never restore the whole plan or reset the dirty workspace. User-level copies may be removed only if their ownership manifest and hashes still match; preserve user-edited copies.

Retire after structural validation, independent continuity and scenario checks pass, and a fresh-session discovery check is recorded. Mark this specialist retired and remove its active routing entry then; keep this record, manifest and baseline for audit. Do not represent source checks as measured future behavior or promise zero loss. New regressions should be recorded with evidence, smallest fix and retest.

## Publication handoff check

The refreshed current-task skill catalog now exposes all generic roles at repository and personal scopes and all nine specialists; this observes catalog discovery, not a fresh-task composition test. Migration remains active. Re-ran structural and seven installer checks: PASS. Replaced the story specialist’s direct link to the private untracked résumé transcription with `specialist/shared/career-sources.md`, a public-safe source/corrections guide. Private `Plans/resume-source.md` stays local and is optional evidence, not a required public dependency. `Plans/visual-rendering-standard.md` remains a required linked publication dependency; the release coordinator must include it and verify link closure in the actual staged checkout. No commit or push performed by this task.

## Publication preparation — 2026-09-28

Vero authorized pushing the finished restructuring after owner coordination. The owner confirmed implementation completion and the existing validation evidence. For public checkout continuity, portfolio-story now links to specialist/shared/career-sources.md and canonical published HTML/PDF instead of the private historical résumé transcription. The raw local source remains unchanged and excluded. Plans/visual-rendering-standard.md and current SETTINGS.md corrections accompany the migration. Baselines remain unchanged. The Chief of Agents is a separate local proposal, not implemented by this migration.
