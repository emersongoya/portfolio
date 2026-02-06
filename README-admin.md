# Admin API (minimal)

This small Express API provides endpoints to manage the site `data/cases.json` file used for case visibility and per-case protection. It's intended for local admin use or deployment behind a simple auth layer.

Quick start

1. Install dependencies

```bash
npm install
```

2. Set an admin token (recommended)

On Windows PowerShell:

```powershell
$env:ADMIN_TOKEN = 'your-secret-token'
npm start
```

Or set `ADMIN_TOKEN` in your environment or your process manager.

3. API endpoints

- `GET /api/cases` — returns array from `data/cases.json`.
- `PUT /api/cases/:id` — update allowed fields for a case (requires header `x-admin-token`).
- `POST /api/cases/:id/password` — set or remove password for a case (body: `{ "password": "..." }`). If `password` omitted/empty, the password is removed.

Examples

Set password for case `dell-salesforce`:

```bash
curl -X POST http://localhost:3000/api/cases/dell-salesforce/password -H "x-admin-token: your-secret-token" -H "Content-Type: application/json" -d '{"password":"mycasepass"}'
```

Remove password (unprotect):

```bash
curl -X POST http://localhost:3000/api/cases/dell-salesforce/password -H "x-admin-token: your-secret-token" -H "Content-Type: application/json" -d '{}'
```

Notes

- This API stores passwords as bcrypt hashes in `data/cases.json`. The protection implemented here is intended for low-sensitivity use; for stronger security deploy behind HTTPS and consider server-side session management.
- The admin token is a simple bearer-like secret; rotate and keep it private.

Publicar alterações no GitHub Pages (fluxo manual)
--------------------------------------------------
As alterações feitas pelo admin local atualizam apenas o arquivo `data/cases.json` no seu computador. Para publicar no GitHub Pages, execute:

```powershell
git add data/cases.json
git commit -m "Atualiza visibilidade/senhas dos cases"
git push origin main
```

Se preferir que o servidor local faça commits e pushs automaticamente, posso adicionar essa opção (requer chaves SSH ou PAT configurado localmente). Diga `auto` se quiser que eu implemente.
