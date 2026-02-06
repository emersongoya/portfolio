# Git Básico — Commit e Branch (instruções rápidas)

Este guia rápido explica o que é um *commit* e uma *branch* e mostra os comandos básicos que você usará para publicar `data/cases.json` no GitHub Pages.

O que é um commit?
- Um *commit* é uma foto (snapshot) do estado dos arquivos do repositório. Salva alterações com uma mensagem.
- Fluxo mínimo:
  - `git add <arquivo>` — prepara (stage) a mudança.
  - `git commit -m "mensagem curta"` — cria o commit.
  - `git push origin main` — envia os commits para o repositório remoto (GitHub).

O que é uma branch?
- Uma *branch* é uma linha separada de desenvolvimento. Use branches para trabalhar em mudanças sem tocar diretamente na `main`.
- Vantagem: você pode testar e revisar antes de juntar (merge) na `main`.

Comandos básicos de branch
- Criar e mudar para uma nova branch (ex.: `admin-changes`):
  - `git checkout -b admin-changes`
- Atualizar branch a partir da main antes de trabalhar (mantém branch atualizada):
  - `git fetch origin`
  - `git checkout main`
  - `git pull origin main`
  - `git checkout admin-changes`
  - `git rebase main`  (ou `git merge main` se preferir merge)
- Depois de pronto, enviar sua branch ao remoto:
  - `git push -u origin admin-changes`

Fluxo recomendado para publicar `data/cases.json` (simples, seguro)
1. Crie branch para suas mudanças:
   ```bash
   git checkout -b admin-update-cases
   ```
2. Faça as alterações com a UI admin local (ou edite o arquivo): `data/cases.json` será modificado.
3. Stage, commit e push da branch:
   ```bash
   git add data/cases.json
   git commit -m "Atualiza visibilidade/senhas dos cases"
   git push -u origin admin-update-cases
   ```
4. No GitHub abra um Pull Request (PR) da `admin-update-cases` → `main` e revise. Quando pronto, faça merge através da interface do GitHub.
   - Alternativamente, se você preferir não usar PRs, pode fazer `git checkout main` + `git merge admin-update-cases` localmente e `git push origin main`.

Comandos de checagem úteis
- Ver histórico: `git log --oneline --graph --decorate`
- Ver status: `git status`
- Ver diferenças: `git diff` (antes do commit) ou `git show <commit>` (após)

Notas rápidas
- Commit pequeno e com mensagem clara facilita auditoria e rollback.
- Usar branches é boa prática para separar trabalho experimental do estado estável (`main`).
- Para publicar no GitHub Pages, o `git push origin main` (após merge) atualiza o site.

Se quiser, eu crio automaticamente um branch e abro um PR com as mudanças atuais — diga `criar-pr` e eu faço isso (requer suas credenciais/git remoto configurado).
