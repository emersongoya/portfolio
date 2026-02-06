// Minimal admin UI for cases
document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('list');
  const reloadBtn = document.getElementById('reloadBtn');
  const tokenInput = document.getElementById('adminToken');
  const statusEl = document.getElementById('status');

  function setStatus(msg, err) {
    statusEl.textContent = msg || '';
    statusEl.style.color = err ? '#e11d48' : '';
  }

  async function fetchCases() {
    listEl.innerHTML = 'Loading…';
    try {
      const res = await fetch('/api/cases');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      renderList(data);
      setStatus('Loaded ' + data.length + ' cases');
    } catch (err) {
      listEl.innerHTML = '<div class="error">Could not load cases. Is the admin API running?</div>';
      setStatus('Error fetching cases', true);
    }
  }

  function renderList(items) {
    if (!items || !items.length) {
      listEl.innerHTML = '<div class="muted">No cases found in data/cases.json</div>';
      return;
    }
    const html = items.sort((a,b)=> (a.order||0)-(b.order||0)).map(c => {
      return `
        <div class="case" data-id="${c.id}">
          <div class="meta">
            <div class="title">${escapeHtml(c.title)}</div>
            <div class="small">${escapeHtml(c.meta?.company||'')} • ${escapeHtml(c.meta?.role||'')}</div>
          </div>
          <div class="controls">
            <label>Visible <input type="checkbox" class="visible" ${c.visible? 'checked':''}></label>
            <label>Restricted <input type="checkbox" class="restricted" ${c.restricted? 'checked':''}></label>
            <button class="set-pass">Set Password</button>
            <button class="remove-pass">Remove Password</button>
          </div>
        </div>`;
    }).join('');
    listEl.innerHTML = html;
    attachHandlers();
  }

  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>\"]/g, ch=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[ch]); }

  function attachHandlers(){
    listEl.querySelectorAll('.case').forEach(node => {
      const id = node.dataset.id;
      const visibleEl = node.querySelector('.visible');
      const restrictedEl = node.querySelector('.restricted');
      const setBtn = node.querySelector('.set-pass');
      const removeBtn = node.querySelector('.remove-pass');

      visibleEl.addEventListener('change', () => updateField(id, { visible: visibleEl.checked }));
      restrictedEl.addEventListener('change', () => updateField(id, { restricted: restrictedEl.checked }));
      setBtn.addEventListener('click', async () => {
        const pass = prompt('Enter new password for case (leave empty to cancel):');
        if (pass === null) return; // cancelled
        await setPassword(id, pass);
      });
      removeBtn.addEventListener('click', async () => {
        if (!confirm('Remove password for this case?')) return;
        await setPassword(id, '');
      });
    });
  }

  async function updateField(id, body) {
    setStatus('Saving...');
    try {
      const token = tokenInput.value.trim();
      const res = await fetch('/api/cases/' + encodeURIComponent(id), {
        method: 'PUT',
        headers: Object.assign({'Content-Type':'application/json'}, token ? {'x-admin-token': token} : {}),
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Unauthorized or failed');
      const updated = await res.json();
      setStatus('Saved');
      setTimeout(()=> setStatus(''), 1200);
    } catch (err) {
      setStatus('Save failed (check token/API)', true);
      console.error(err);
    }
  }

  async function setPassword(id, password) {
    setStatus('Updating password...');
    try {
      const token = tokenInput.value.trim();
      const res = await fetch('/api/cases/' + encodeURIComponent(id) + '/password', {
        method: 'POST',
        headers: Object.assign({'Content-Type':'application/json'}, token ? {'x-admin-token': token} : {}),
        body: JSON.stringify(password ? { password } : {})
      });
      if (!res.ok) throw new Error('Unauthorized or failed');
      const json = await res.json();
      setStatus(json.message || 'Password updated');
      setTimeout(()=> setStatus(''), 1200);
    } catch (err) {
      setStatus('Password update failed (check token/API)', true);
      console.error(err);
    }
  }

  reloadBtn.addEventListener('click', fetchCases);
  // initial load
  fetchCases();
});
