// Case protection logic for case-studies/index.html (pilot version)
// Requires admin-config.js to be loaded before this script

(function() {
  // Utility: SVG icons (blue)
  const lockClosedSVG = `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle"><rect x="4" y="8" width="12" height="8" rx="2" stroke="#6366f1" stroke-width="2" fill="none"/><path d="M7 8V6a3 3 0 1 1 6 0v2" stroke="#6366f1" stroke-width="2" fill="none"/></svg>`;
  const lockOpenSVG = `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle"><rect x="4" y="8" width="12" height="8" rx="2" stroke="#6366f1" stroke-width="2" fill="none"/><path d="M13 8V6a3 3 0 0 0-6 0" stroke="#6366f1" stroke-width="2" fill="none"/></svg>`;

  // Load config
  const config = window.CASE_PROTECTION_CONFIG;
  if (!config) return;

  // Session logic
  function getSessionKey(caseFile) {
    return `case_access_${caseFile}`;
  }
  function isCaseUnlocked(caseFile) {
    const item = localStorage.getItem(getSessionKey(caseFile));
    if (!item) return false;
    try {
      const data = JSON.parse(item);
      if (!data || !data.timestamp) return false;
      return Date.now() - data.timestamp < config.sessionDuration;
    } catch { return false; }
  }
  function unlockCase(caseFile) {
    localStorage.setItem(getSessionKey(caseFile), JSON.stringify({ timestamp: Date.now() }));
  }
  function lockCase(caseFile) {
    localStorage.removeItem(getSessionKey(caseFile));
  }

  // Modal logic
  function showPasswordModal(caseFile, onSuccess) {
    // Remove any existing modal
    document.getElementById('case-password-modal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'case-password-modal';
    modal.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(10,10,20,0.65);z-index:9999;display:flex;align-items:center;justify-content:center;">
        <div style="background:#181828;padding:2.5rem 2rem 2rem 2rem;border-radius:18px;box-shadow:0 8px 32px #0008;min-width:320px;max-width:90vw;position:relative;">
          <button id="close-modal-btn" style="position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;color:#6366f1;cursor:pointer;">&times;</button>
          <h2 style="margin-bottom:1.5rem;font-size:1.25rem;color:#e4e4e7;font-weight:600;">Protected Case</h2>
          <form id="case-password-form" autocomplete="off">
            <label for="case-password-input" style="display:block;margin-bottom:0.5rem;color:#a1a1aa;font-size:1rem;">Enter password to access:</label>
            <input id="case-password-input" type="password" style="width:100%;padding:0.75rem 1rem;border-radius:8px;border:1px solid #6366f1;background:#22223a;color:#e4e4e7;font-size:1rem;margin-bottom:1rem;outline:none;" autofocus />
            <button type="submit" style="width:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6);color:#fff;font-weight:600;padding:0.75rem 0;border:none;border-radius:8px;font-size:1rem;cursor:pointer;">Access</button>
            <div id="case-password-error" style="color:#f43f5e;font-size:0.95rem;margin-top:0.75rem;display:none;"></div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    // Close logic
    modal.querySelector('#close-modal-btn').onclick = () => modal.remove();
    // Form logic
    const form = modal.querySelector('#case-password-form');
    const input = modal.querySelector('#case-password-input');
    const error = modal.querySelector('#case-password-error');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const pass = input.value;
      const shortId = caseFile.replace(/^.*\//, '').replace(/\.html$/, '');
      // Try server-side verification first
      try {
        const resp = await fetch('/api/verify/' + encodeURIComponent(shortId), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pass })
        });
        if (resp.ok) {
          const body = await resp.json();
          if (body && body.ok) {
            unlockCase(caseFile);
            modal.remove();
            onSuccess();
            return;
          }
        }
      } catch (err) {
        // network/server not available — fall back to client-side config
      }

      // Fallback: check per-case password first (client-only config)
      const casePass = config.casePasswords[caseFile];
      const valid = (casePass && pass === casePass) || (!casePass && pass === config.globalPassword);
      if (valid) {
        unlockCase(caseFile);
        modal.remove();
        onSuccess();
      } else {
        error.textContent = "Oops! Incorrect password, please try again.";
        error.style.display = 'block';
        input.value = '';
        input.focus();
      }
    };
    input.onkeydown = (e) => { if (e.key === 'Escape') modal.remove(); };
  }

  // Enhance case links (modal/cadeado only, no login.html)
  document.addEventListener('DOMContentLoaded', function() {
    const caseCards = document.querySelectorAll('.card.u-mb-4');
    caseCards.forEach(card => {
      const href = card.getAttribute('href');
      if (!href) return;
      const isProtected = config.protectedCases.includes(href);
      // Intercept click para cases protegidos: modal; para abertos: navega direto
      card.addEventListener('click', function(e) {
        if (isProtected) {
          if (isCaseUnlocked(href)) return; // allow navigation
          e.preventDefault();
          showPasswordModal(href, () => { window.location.href = href; });
        } // else: navega normalmente
      });
    });
  });
})();
