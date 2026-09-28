# Reusable agent skills

This directory is the versioned, maintained source for the generic team. Each folder under skills/ is a self-contained role skill. There are no portfolio facts or dependencies on specialist/ here. Use these skills directly or install them for unrelated projects with:

`python3 scripts/install_agent_library.py`

The installer writes generated copies to `~/.agents/skills/team-*`; it refuses to overwrite unowned or locally modified installations. Re-run after source updates. Do not edit generated copies. No external project needs this repository after installation.

The repository's `.agents/skills` entrypoints link to these source folders. Project adaptations live in `specialist/`, explicitly loading one or more generic skills. Skill files describe expertise; a coordinator must still start a separate agent and pass the selected paths when delegation is needed. Files alone do not create running agents.

Generic roles: coordinator, experience-designer, evidence-researcher, voice-director, clarity-editor, interaction-engineer, illustration-designer, experience-reviewer, visual-fidelity-reviewer, regression-tester.

Each role defines its task boundary, inputs/workflow and output/handoff. Independence means a separate reviewer instance, not merely loading another skill in the implementer's context. Installation does not authorize unrelated work or publication.
