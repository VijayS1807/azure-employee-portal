# Reference — How CI/CD & GitHub Actions (YAML) Work

**Project:** Employee Leave Management Portal → Azure
**Author:** Vijay
**Type:** Concept reference (applies to all phases)

---

## 1. What is CI/CD?

**CI/CD = Continuous Integration / Continuous Deployment.**
It means: every time code is pushed to GitHub, an automated pipeline **builds** the app and **deploys** it to Azure — no manual uploading.

```
Developer pushes code  →  GitHub Actions builds it  →  Deploys to Azure  →  App is live
```

---

## 2. What is a YAML (.yml) file?

YAML is a **configuration file format** — human-readable settings using indentation (spaces) to show structure. No programming, just `key: value` pairs and lists.

```yaml
key: value          # a setting
parent:             # a group
  child: value      # indentation = belongs to parent
list:
  - item1
  - item2
```

A **GitHub Actions workflow** is a YAML file stored in `.github/workflows/`. It tells GitHub: "when X happens, run these steps."

---

## 3. Who creates the workflow file?

**Azure creates it automatically.** When you create a Static Web App (or App Service) in the Portal and connect it to a GitHub repo:
1. Azure asks for GitHub permission (the "Authorize" popup — note the *"Workflow: Update GitHub Action Workflow files"* permission).
2. Azure **commits the `.yml` file directly into your repo**.
3. Azure also stores a secret **deployment token** in your repo (GitHub → Settings → Secrets and variables → Actions).

You then `git pull` to download the file Azure added.

---

## 4. Anatomy of the Static Web App workflow

File: `.github/workflows/azure-static-web-apps-polite-cliff-08e66600f.yml`

| Section | Purpose |
|---------|---------|
| `name:` | Label shown in the GitHub Actions tab |
| `on: push: branches: [master]` | **Trigger** — runs on every push to `master` |
| `jobs: ... runs-on: ubuntu-latest` | GitHub spins up a **fresh temporary Linux VM** to do the work |
| `steps: - uses: actions/checkout` | Step 1: copies your repo onto the temp VM |
| `steps: - uses: Azure/static-web-apps-deploy` | Step 2: builds the app and uploads it to Azure |
| `app_location: "/frontend"` | Where the source code is (matches the Portal form) |
| `output_location: "dist"` | Where the build output goes (matches the Portal form) |
| `azure_static_web_apps_api_token: ${{ secrets.X }}` | The encrypted deploy key linking GitHub ↔ Azure |

The values `app_location` and `output_location` are exactly what was typed into the Portal "Build Details" form — Azure baked them into the file.

---

## 5. The secret token

```yaml
azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_... }}
```

- This is the password that lets GitHub upload to Azure.
- `${{ secrets.X }}` reads a hidden value stored in the repo — never shown in plain text.
- This is how the two services trust each other without exposing credentials in code.

---

## 6. Key takeaways

| Concept | Meaning |
|---------|---------|
| CI/CD | Automated build + deploy on every push |
| Who writes the YAML | Azure auto-generates and commits it |
| The temp machine | GitHub's throwaway Linux VM that builds the code |
| The secret token | Azure's deploy key, stored encrypted in GitHub |
| The trigger | `push to master` → auto-deploy |

---

## 7. Note for the .NET API (Phase 2)

When the .NET API is deployed to App Service, Azure generates a **second** workflow file (e.g. `master_api-employee-portal.yml`). It works the same way but runs `dotnet build` + `dotnet publish` instead of `npm install` + `npm run build`.
