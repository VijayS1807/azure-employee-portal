# Azure Migration — Phase 0: Foundations & Cost Safety

**Project:** Employee Leave Management Portal → Azure (React + .NET 9 + Azure SQL)
**Author:** Vijay
**Date:** 2026-06-21
**Goal of Phase 0:** Set up the Azure account structure, tooling, and cost guardrails so all later work stays at **₹0 cost**.

---

## 1. Core Concepts Learned

### 1.1 The Azure Hierarchy
```
Account (login)
 └── Subscription        → billing boundary; all charges roll up here
      └── Resource Group  → logical folder grouping one project's resources
           ├── App Service       (the .NET API host)
           ├── Static Web App    (the React frontend host)
           └── Azure SQL Database (the database)
```
- **Subscription** — where cost is tracked.
- **Resource Group (RG)** — a container for related resources. Deleting the RG deletes everything inside it (our reset/cleanup switch).
- **Region** — physical data-center location chosen per resource. We standardise on **one region** to reduce latency and avoid cross-region data charges.

### 1.2 Two ways to manage Azure
| Tool | What | When we use it |
|------|------|----------------|
| **Portal** (portal.azure.com) | Web UI, click-based | Learning, visualising, verifying |
| **Azure CLI** (`az`) | Command-line | Fast, repeatable, automatable actions |

### 1.3 How billing works (and how we stay free)
- Azure bills **per resource by usage**, not a flat account fee.
- Strategy: use only **Free SKUs** (e.g. App Service `F1`, Static Web Apps Free, Azure SQL Free offer).
- A **Budget alert** notifies us if spend exceeds the threshold.
- Cleanup: delete the Resource Group when finished.

---

## 2. Tooling Set Up

| Tool | Version | Purpose |
|------|---------|---------|
| .NET SDK | 9.0.304 | Build the Web API |
| Node.js | v24.16 | Build the React frontend |
| Git | 2.46 | Version control |
| GitHub CLI (`gh`) | 2.93 | Repo + CI/CD automation |
| Azure CLI (`az`) | _installed in Phase 0_ | Manage Azure resources |

---

## 3. Actions Performed in Phase 0

_(filled in as we execute — see checklist below)_

- [ ] 0.1 Installed Azure CLI
- [ ] 0.2 `az login` — connected CLI to Azure account
- [ ] 0.3 Created project folder + new GitHub repo `azure-employee-portal`
- [ ] 0.4 Created Resource Group `rg-learn-azure` in region `<region>`
- [ ] 0.5 Created `$0` Budget alert as cost safety net
- [ ] 0.6 Documented Phase 0 (this file)

---

## 4. Project Folder Structure
```
azure-employee-portal/
├── frontend/   → React 19 + Vite app (from existing portal)
├── api/        → .NET 9 Web API (rebuilt from Express backend)
├── infra/      → Bicep Infrastructure-as-Code (later phases)
└── docs/       → Learning documents (one per phase)
```

---

## 5. Key Commands Reference (Phase 0)
```bash
az login                                   # sign in
az account show                            # show active subscription
az group create -n rg-learn-azure -l <region>   # create resource group
az group list -o table                     # list resource groups
az group delete -n rg-learn-azure          # delete everything (cleanup)
```

---

## 6. Outcome
At the end of Phase 0 we have: a clean Azure account structure, all tooling installed, a single Resource Group to hold the project, and a cost alert guaranteeing no surprise charges. Ready to deploy the frontend in Phase 1.
