# Changelog

All notable changes to this project are documented in this file.

## 2026-01-26 — Unify styles, restore breadcrumb & UX fixes

### Added
- `CHANGELOG.md` (this file)

### Changed
- Centralized and cleaned `styles.css` (migrated inline styles, added utilities).
- Unified breadcrumb markup/behavior across `index.html` and `case-studies/index.html`.
- Restored dynamic breadcrumb visibility and alignment logic in `script.js`.
- Implemented active underline behavior for navigation links on scroll and click.

### Fixed
- Restored modal/password protection flow and session logic for protected cases (`case-studies/case-protect.js`).
- Prevented global hover/underline from coloring card content; only `.case-link` is underlined.
- Repaired layout for expertise cards on the home page (`.skills-grid`).
- Ensured breadcrumb height is consistent and visible across pages.
- Added Contact section bottom padding to allow scrolling to the section and trigger active nav state.
- Fixed missing breadcrumb on `case-studies` and force-visible behavior for listing pages.

### Files touched
- `styles.css` — major edits
- `script.js` — breadcrumb & nav active logic
- `case-studies/index.html` — breadcrumb IDs, removed duplicate script include
- `case-studies/case-protect.js` — modal/session updates
- Multiple case page HTML files — removed legacy auth includes

If you want a more detailed commit-by-commit changelog or a PR summary, I can generate one.
