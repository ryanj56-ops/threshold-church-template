# Threshold Church Template

Master template for the CFM Church Website Generator (PastorSite).

The n8n onboarding workflow (`CFM_ONBOARD_signup`) fetches `sites/template/index.html`
from this repo and hydrates it with each church's data-editable fields to generate their live site.

## Structure

- `sites/template/index.html` — main church website template
- `sites/template/css/` — stylesheets (style.css + editor.css)
- `sites/template/js/` — scripts (main.js + editor.js)
- `sites/template/feed.json` — social sync feed (auto-updated by CFM_SYNC_social)

## Data-editable fields

All pastor-customizable fields use `data-editable` attributes. The generator replaces
these with church data from cfmmap.org at onboarding.

See CLAUDE.md in the cfm-websites repo for the full field schema.

## n8n Variables required

| Variable | Value |
|---|---|
| `GITHUB_USERNAME` | `ryanj56-ops` |
| `GITHUB_REPO` | `threshold-church-template` |
| `GITHUB_TOKEN` | Personal access token with `repo` read scope |
