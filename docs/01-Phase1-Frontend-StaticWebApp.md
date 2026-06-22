# Azure Migration — Phase 1: Frontend on Azure Static Web Apps

**Project:** Employee Leave Management Portal → Azure
**Author:** Vijay
**Date:** 2026-06-22
**Goal of Phase 1:** Deploy the React frontend to the internet using Azure Static Web Apps (Free tier) with automated CI/CD from GitHub.

---

## 1. Concepts Learned

### 1.1 Azure Static Web Apps
A service for hosting **static front-end apps** (the HTML/CSS/JS that React compiles to). It provides:
- A free public URL (`*.azurestaticapps.net`)
- Automatic **HTTPS/SSL**
- A global **CDN** (fast loading worldwide)
- A built-in **CI/CD pipeline** via GitHub Actions
- **Cost: ₹0** on the Free tier

### 1.2 CI/CD (Continuous Integration / Continuous Deployment)
When the Static Web App was created, Azure automatically:
1. Added a workflow file to the repo: `.github/workflows/azure-static-web-apps-*.yml`
2. Stored a secret **deployment token** in the GitHub repo
3. Configured: **push to `master` → GitHub Actions builds the app → deploys to Azure**

Result: we never upload files manually. Code push = live update.

### 1.3 Dev build vs Production build (key lesson)
- `npm run dev` (Vite dev server) does **not** type-check — that's why pre-existing TypeScript errors were invisible locally.
- The production `build` script was `tsc -b && vite build`, where `tsc -b` strictly type-checks and **failed** the first deployment.
- **Decision (Option A):** changed `build` to just `vite build` (Vite transpiles TS→JS via esbuild without type-checking) to deploy now. Kept a `typecheck` script to track the debt. Fixing the actual type errors is deferred (Option B) to after all Azure phases.

---

## 2. Actions Performed

- [x] Copied React app from the original project into `frontend/`
- [x] Added `.gitignore` (excludes `node_modules`, `dist`, `.env`)
- [x] Pushed frontend to GitHub repo `VijayS1807/azure-employee-portal`
- [x] Created Static Web App `swa-employee-portal` (Free, region East US 2) via Portal
- [x] Connected GitHub repo + branch `master`, build preset React, app location `/frontend`, output `dist`
- [x] First build FAILED on TypeScript errors → diagnosed via `gh run view --log-failed`
- [x] Fixed build script (Option A), verified build locally, pushed
- [x] Second build SUCCEEDED → app deployed

---

## 3. Result

**Live URL:** https://polite-cliff-08e66600f.7.azurestaticapps.net

The React frontend is publicly accessible over HTTPS. Backend-dependent features (login, data) are pending Phases 2–3 (API + database).

---

## 4. Key Commands Reference (Phase 1)
```bash
# Watch the deployment build
gh run list --limit 3
gh run watch <run-id> --exit-status
gh run view <run-id> --log-failed     # diagnose a failed build

# Get the live URL
az staticwebapp show --name swa-employee-portal \
  --resource-group rg-learn-azure --query "defaultHostname" -o tsv

# Local build check before pushing
cd frontend && npm install && npm run build
```

---

## 5. Known Tech Debt (Option B — deferred)
The frontend has ~12 pre-existing TypeScript errors (unrelated to Azure). Run `npm run typecheck` in `frontend/` to list them. To be fixed after all Azure phases are complete.

---

## 6. Outcome
Phase 1 complete: React frontend is live on Azure with automated CI/CD at ₹0 cost. Next: Phase 2 — build and deploy the .NET 9 API on Azure App Service.
