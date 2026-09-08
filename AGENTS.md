# Repository guidance

- This repository is the canonical downstream source for the `gmail`
  plugin. Its public monorepo upstream is `https://github.com/openai/plugins`.
- Preserve OpenAI attribution and the exact upstream license declaration. Keep
  OpenAI-authored files and downstream additions distinguishable. Never restore
  historical private refs when preparing a public release.
- Prefer adding a downstream skill over rewriting an OpenAI skill unless the
  change genuinely belongs in the vendor workflow and can be contributed
  upstream.
- Keep the Codex and Claude manifests synchronized. Preserve OpenAI attribution
  while identifying this repository as the downstream source.
- Marketplace catalogs reference this repository; do not duplicate runtime
  behavior back into a marketplace repository.
- Keep credentials and personal data out of Git. Preserve stable command names,
  service labels, connector identifiers, and credential identifiers across
  releases.
- Bump the plugin version for released behavior changes and run `npm test`, the
  bundled `plugin-creator/scripts/validate_plugin.py .` validator, and `claude
  plugin validate .` before publishing.
