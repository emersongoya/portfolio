const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const DATA_FILE = path.join(__dirname, 'data', 'cases.json');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token';

const app = express();
app.use(cors());
app.use(express.json());

// Serve admin UI statically at /admin
app.use('/admin', express.static(path.join(__dirname, 'admin')));

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function requireAdmin(req, res) {
  const token = req.header('x-admin-token') || req.query.token;
  if (!token || token !== ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

app.get('/api/cases', (req, res) => {
  const data = readData();
  res.json(data);
});

app.put('/api/cases/:id', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const id = req.params.id;
  const data = readData();
  const idx = data.findIndex(c => c.id === id || c.slug === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  // Allow updating selected fields only
  const allowed = ['title','slug','path','visible','restricted','order','meta','heroImage'];
  allowed.forEach(k => { if (k in req.body) data[idx][k] = req.body[k]; });
  writeData(data);
  res.json(data[idx]);
});

app.post('/api/cases/:id/password', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const id = req.params.id;
  const { password } = req.body || {};
  const data = readData();
  const idx = data.findIndex(c => c.id === id || c.slug === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (!password) {
    // remove password
    data[idx].passwordHash = null;
    data[idx].restricted = false;
    writeData(data);
    return res.json({ ok: true, message: 'Password removed' });
  }
  const hash = bcrypt.hashSync(password, 10);
  data[idx].passwordHash = hash;
  data[idx].restricted = true;
  writeData(data);
  res.json({ ok: true });
});

// Verify password for a given case id/slug/path
app.post('/api/verify/:id', (req, res) => {
  const id = req.params.id;
  const { password } = req.body || {};
  const data = readData();
  const findBy = (entry) => entry.id === id || entry.slug === id || entry.path === id || entry.path === `case-studies/${id}` || entry.path === `./case-studies/${id}` || entry.path === `/${id}`;
  const c = data.find(entry => findBy(entry) || findBy(entry));
  if (!c) return res.status(404).json({ ok: false, error: 'Case not found' });
  if (!c.passwordHash) return res.status(400).json({ ok: false, error: 'No password set' });
  try {
    const match = bcrypt.compareSync(password || '', c.passwordHash);
    if (match) return res.json({ ok: true });
    return res.status(401).json({ ok: false });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Admin API listening on http://localhost:${port}`));
