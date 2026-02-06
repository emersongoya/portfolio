Se você quiser, aplico agora a alteração para servir a pasta `admin/` pelo Express e crio o endpoint `/api/verify/:id` com verificação bcrypt e um token simples de sessão. Deseja que eu prossiga com isso agora?

Decisão atual: fluxo manual (configuração escolhida)
------------------------------------------------
Você optou pelo fluxo manual: o painel admin roda localmente e **não** faz push automático para o repositório remoto.
As mudanças em `data/cases.json` devem ser publicadas manualmente com `git commit` + `git push` quando quiser que o site no GitHub Pages atualize.

Checklist mínimo — publicar manualmente
-------------------------------------
1. Faça suas alterações na UI admin: abra `http://localhost:3000/admin/`, edite `visible`/`restricted` e defina senhas.
2. No terminal, confirme as mudanças e envie para o GitHub:

```powershell
git add data/cases.json
git commit -m "Atualiza visibilidade/senhas dos cases"
git push origin main
```

Notas rápidas
------------
- A API local altera somente o arquivo no seu computador; GitHub Pages só muda após commit/push.
- `admin-config.js` ainda pode conter uma `globalPassword` usada apenas como fallback no cliente quando o servidor `/api/verify` não estiver disponível.
- O servidor valida apenas senhas por case (hash em `data/cases.json`).

Se quiser que eu implemente o auto-commit/push no servidor local (opção que automatiza o passo 2 acima), diga `auto` e eu implemento — isso exige que você configure chaves Git/SSH ou um PAT e esteja ciente dos riscos de automação.

*** Fim da documentação

Usar `nodemon` em desenvolvimento sem comprometer o repositório
-----------------------------------------------------------
Se quiser reiniciar automaticamente o servidor durante o desenvolvimento, recomendo instalar `nodemon` globalmente (ou usar `npx nodemon`) em vez de adicioná‑lo ao `package.json` do projeto.

- Instalar globalmente (uma vez por máquina):

```powershell
npm install -g nodemon
nodemon --version
```

- Iniciar o servidor em modo dev (sem tocar no `package.json` do repo):

```powershell
nodemon server.js
```

Vantagem: mantém o repositório livre de ferramentas de desenvolvimento que possam introduzir alertas de vulnerabilidade nas dependências do projeto. Se preferir, também é possível usar `npx nodemon server.js` para executar sem instalação global.

Como testar localmente (Passo a passo)
-----------------------------------
Siga estes passos no seu ambiente local para verificar o fluxo admin → verificação → navegação protegida.

1) Iniciar o servidor admin

```powershell
# a partir da raiz do repositório
npm install
$env:ADMIN_TOKEN='admin-token'   # use seu token preferido
npm start
```

2) Abrir a UI admin

- No navegador abra: `http://localhost:3000/admin/`
- Insira o `x-admin-token` (o mesmo `ADMIN_TOKEN`), clique em "Reload cases".

3) Teste rápido pela UI

- Ative `restricted` no case `dell-salesforce` e clique em "Set Password". Use a senha `Portfolio-2025` (exemplo) ou outra de sua escolha.

4) Verificar via API (opcional)

- Teste a verificação do servidor (retorna `{"ok":true}` se a senha estiver correta):

```bash
curl -X POST http://localhost:3000/api/verify/dell-salesforce \
  -H "Content-Type: application/json" \
  -d '{"password":"Portfolio-2025"}'
```

PowerShell (equivalente):

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/verify/dell-salesforce' -Method Post -Body (ConvertTo-Json @{ password = 'Portfolio-2025' }) -ContentType 'application/json'
```

5) Teste do fluxo de usuário (modal)

- Abra `case-studies/index.html` no navegador (ou abra o site servido localmente).
- Clique no card do case protegido (`Dell Salesforce`). O modal de senha deve aparecer.
- Insira `Portfolio-2025` → se correto, o modal fecha e a página do case é aberta.

6) Publicar no GitHub Pages (quando estiver satisfeito)

```powershell
git add data/cases.json
git commit -m "Atualiza visibilidade/senhas dos cases"
git push origin main
```

Se algo falhar durante o teste, cole aqui a mensagem de erro e eu te ajudo a depurar.
# Documentação — Admin API e UI (português)

Resumo
------
Este repositório recebeu uma implementação mínima para administrar visibilidade e proteção de páginas de case studies.

- `data/cases.json` — arquivo JSON com o estado canônico dos cases (visível/restrito, meta, caminho, etc.).
- `server.js` — API Express mínima para ler/atualizar `data/cases.json` e definir/remover senhas por case (bcrypt).
- `package.json` — dependências para rodar a API (`express`, `bcryptjs`, `cors`).
- `admin/` — UI simples (`index.html`, `admin.js`, `styles.css`) para administrar flags `visible`/`restricted` e definir senhas via API.
- `README-admin.md` — instruções rápidas já adicionadas.

Objetivo
--------
Fornecer uma forma simples, compatível com uso local ou deploy em um servidor admin, para:

- alterar `visible` (mostrar/ocultar) cases;
- marcar `restricted` (proteger) e definir ou remover senha por case.

Observação importante sobre proteção atual
---------------------------------------
Há duas abordagens presentes no projeto: um mecanismo *cliente* (scripts estáticos usados nas páginas públicas) e a API/server.

- `case-studies/case-protect.js` e `admin-config.js` implementam um **mecanismo cliente** que abre um modal e valida uma senha contra valores definidos em `admin-config.js` (campo `globalPassword` ou `casePasswords`). Esse fluxo é totalmente front-end e funciona sem servidor — porém oferece proteção fraca (somente obfuscação).
- A API (`server.js`) **armazena senhas como hashes bcrypt** em `data/cases.json`. Hoje não existe um endpoint público de verificação (`/api/verify/:id`) consumido pelo `case-protect.js`. Ou seja, definir uma senha via API grava o hash para uso futuro por um backend, mas o script cliente não o valida automaticamente.

Para proteção consistente em produção considere uma das opções:

1. Manter proteção leve e usar `admin-config.js` (modo estático) — já funcional e compatível com GitHub Pages.
2. Implementar `POST /api/verify/:id` no `server.js` que valida a senha enviada contra o `passwordHash` e retorna um token de sessão; então adaptar `case-protect.js` para usar esse endpoint (recomendado se quiser hashes no servidor).

Como rodar a API (local)
------------------------
No diretório do projeto execute:

```powershell
npm install
$env:ADMIN_TOKEN='seu-token-secreto'
npm start
```

Por padrão o servidor escuta em `http://localhost:3000`.

Endpoints principais
--------------------
- `GET /api/cases` — retorna o conteúdo de `data/cases.json`.
- `PUT /api/cases/:id` — atualiza campos permitidos (ex.: `visible`, `restricted`, `title`, `order`, `meta`, `heroImage`, `path`). Requer header `x-admin-token` com o valor de `ADMIN_TOKEN`.
- `POST /api/cases/:id/password` — define ou remove a senha de um case. Body JSON: `{ "password": "novaSenha" }`. Para remover, envie body vazio ou `{}`. Requer `x-admin-token`.

Exemplo usando `curl` (definir senha):

```bash
curl -X POST http://localhost:3000/api/cases/dell-salesforce/password \
  -H "x-admin-token: seu-token-secreto" \
  -H "Content-Type: application/json" \
  -d '{"password":"minhaSenha"}'
```

Como usar a UI admin
---------------------
Opções para abrir a UI localizada em `admin/index.html`:

1. Servir via Express (recomendado): adicione ao `server.js` a linha abaixo e reinicie o servidor:

```javascript
// servir arquivos estáticos do painel admin
app.use('/admin', express.static(path.join(__dirname, 'admin')));
```

Depois abra: `http://localhost:3000/admin/`

2. Servir com um servidor estático separado (se preferir não alterar o `server.js`):

```bash
# a partir da raiz do projeto
npx serve admin
# ou, python 3.x
python -m http.server 8001 --directory admin
```

Em ambos os casos, insira o `x-admin-token` no campo superior da UI, clique em "Reload cases", e use os controles para marcar `visible`/`restricted` ou definir/remover senhas.

Modelo de `data/cases.json`
--------------------------
Cada entry é um objeto com, pelo menos, os campos abaixo:

- `id` (string): identificador canônico, ex.: `prudential`.
- `title` (string)
- `slug` (string)
- `path` (string): caminho relativo para a página do case, ex.: `case-studies/prudential.html`.
- `visible` (boolean)
- `restricted` (boolean)
- `passwordHash` (string|null): bcrypt hash quando protegido via API.
- `order` (number): ordenação
- `meta` (object): `{ company, role, period }`
- `heroImage` (string)

Próximos passos recomendados
---------------------------
- Adicionar endpoint `POST /api/verify/:id` que receba `{ password }`, compare com o `passwordHash` e retorne um token de sessão temporário. Atualizar `case-protect.js` para chamar esse endpoint em vez de comparar com `admin-config.js`.
- Implementar `app.use('/admin', express.static(...))` para servir a UI admin a partir do próprio servidor.
- Se for publicar em produção, certifique-se de rodar a API atrás de HTTPS e proteger `ADMIN_TOKEN` (variável ambiente) com um segredo forte e controles de acesso.

Arquivo(s) modificados/criados
-----------------------------
- `data/cases.json` — criado/estado inicial.
- `server.js` — API Express mínima (GET/PUT/password).
- `package.json` — dependências e scripts.
- `admin/index.html`, `admin/admin.js`, `admin/styles.css` — UI admin.
- `README-admin.md` — instruções rápidas.

Se quiser, aplico agora a alteração para servir a pasta `admin/` pelo Express e crio o endpoint `/api/verify/:id` com verificação bcrypt e um token simples de sessão. Deseja que eu prossiga com isso agora?