PR title: chore: unify styles, restore breadcrumb/modal flow, add active nav underline, fix hover/layout

Short summary
----------------
This change unifies styling, restores the breadcrumb and modal password protection flow for protected cases, fixes hover/underline issues affecting cards, and adds an active navigation underline that follows scroll position. It centralizes CSS, consolidates breadcrumb behavior across pages, and improves UX consistency site-wide.

Key changes
---------
- Centralized and cleaned `styles.css` (moved inline styles to single file, added utilities, fixed malformed rules).
- Restored dynamic breadcrumb across `index.html` and `case-studies/index.html`; made it transparent at top and apply glass background on scroll.
- Repaired breadcrumb alignment logic and height; ensured consistent look on large screens.
- Implemented nav active underline on scroll and click (keeps text color unchanged) and added logic so `Cases` is active on the listing page.
- Restored modal/password flow for protected cases and improved session/localStorage behavior (`case-studies/case-protect.js`).
- Prevented anchor-as-card hover from underlining/recoloring entire card content; only `.case-link` is underlined/blue.
- Restored expertise cards grid on Home (`.skills-grid`) and added extra bottom padding to `#contact` so the section can be scrolled into view and trigger active state.

Files changed (high-level)
-------------------------
- `styles.css` — major refactor and fixes
- `script.js` — breadcrumb visibility, alignment, active nav detection
- `case-studies/index.html` — breadcrumb IDs and cleanup
- `case-studies/case-protect.js` — modal & session logic
- multiple case pages — removed legacy auth includes
- `CHANGELOG.md` — summary of changes

Testing notes
-------------
1. Load Home (`index.html`) and Case Studies (`case-studies/index.html`) in Chrome.
2. Verify breadcrumb starts transparent at top, becomes glassy on scroll, and aligns under the logo.
3. Scroll the Home page: the nav link underline should move between About, Skills, Tools, Contact as sections enter the viewport. Contact will be marked active when near the bottom.
4. On Cases listing: breadcrumb should show "Home › Case Studies" and the Cases nav item should be underlined (active).
5. Card hover: only the `.case-link` ("View Full Case Study") should appear blue/underlined; rest of the card should not change color or underline.
6. Protected cases: clicking a protected card should open the modal password dialog; unlocking persists for the session duration.

PR checklist / Notes
-------------------
- No external dependencies added.
- If you want, I can open a branch and push a PR with this description pre-filled.
