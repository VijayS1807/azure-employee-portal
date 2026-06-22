# Phase 2 — .NET 9 API Deployment to Azure App Service

**Project:** Employee Leave Management Portal → Azure  
**Author:** Vijay  
**Phase:** 2 of 7  
**Status:** Complete  

---

## 1. What We Built

A production-ready .NET 9 Web API deployed to Azure App Service with full CI/CD via GitHub Actions.

**Live API URL:**  
`https://api-employee-portal-vj-gyayffgpcecgcmhu.centralus-01.azurewebsites.net`

**Health check:**  
`GET /` → `{"status": "EmployeePortal API is running"}`

---

## 2. Azure Concepts Learned

### App Service
Azure's fully managed platform for hosting web applications and APIs. You deploy code — Azure handles the OS, patching, load balancing, and uptime.

| Concept | Detail |
|---|---|
| **App Service Plan** | The underlying VM pool. Defines OS, region, and pricing. One plan can host multiple apps. |
| **SKU: Free (F1)** | Shared infrastructure, 60 CPU minutes/day, no custom domain SSL. Sufficient for learning. |
| **Runtime stack** | `.NET 9 (STS)` — tells Azure which runtime to install on the host |
| **Region** | Central US — chosen because East US had 0 VM quota on our reactivated subscription |
| **Secure unique hostname** | Enabled — Azure appends a unique suffix to prevent subdomain takeover attacks |

### Why Central US (not East US)?
A freshly reactivated Pay-As-You-Go subscription sometimes has 0 VM quota in certain regions. Central US had available quota without needing a support request. VM quota ≠ cost — it is just a safety limit Azure sets per region per subscription.

### App Settings (Environment Variables)
Azure App Settings are how configuration is injected into a hosted app without committing secrets to git.

| Local Dev | Azure |
|---|---|
| `appsettings.Development.json` (gitignored) | App Settings in Portal (encrypted at rest) |

**Hierarchy separator:** In Azure App Settings, `__` (double underscore) maps to `:` in `appsettings.json`.  
Example: `Jwt__Key` in Portal = `Jwt:Key` in .NET config.

App Settings **override** `appsettings.json` at runtime — the file stays in git with empty/safe values, and Azure injects the real secrets.

### Settings configured

| App Setting | Purpose |
|---|---|
| `Jwt__Key` | Secret signing key for JWT tokens (32+ chars) |
| `Jwt__Issuer` | Token issuer identifier (`EmployeePortalApi`) |
| `Jwt__Audience` | Token audience identifier (`EmployeePortalClient`) |
| `Jwt__ExpiryHours` | Token lifetime in hours (`8`) |
| `Cors__AllowedOrigins__0` | React frontend URL allowed to call this API |

---

## 3. API Architecture

### Technology stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | .NET 9 Web API | HTTP request handling, routing |
| ORM | EF Core 9 (Code-First) | C# entities → SQL tables via migrations |
| Auth | JWT Bearer tokens | Stateless authentication |
| Passwords | BCrypt.Net-Next | Secure password hashing (never plaintext) |
| API Docs | Swashbuckle (Swagger) | Dev-only — hidden in Production |

### Project structure

```
api/
  EmployeePortal.sln
  EmployeePortal.Api/
    Controllers/        ← AuthController, EmployeesController, LeaveController
    Services/           ← Business logic (IAuthService, IEmployeeService, ILeaveService)
    Auth/               ← IJwtTokenGenerator + JwtTokenGenerator
    Data/               ← AppDbContext, DbSeeder
    Entities/           ← EF Core entity classes (5 tables)
    Models/             ← DTOs for request/response
    Migrations/         ← EF Core auto-generated schema history
```

### Endpoints

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | None | Login, returns JWT |
| GET | `/api/employees` | Required | List employees (paginated) |
| GET | `/api/employees/{id}` | Required | Get single employee |
| POST | `/api/employees` | Required | Create employee |
| PUT | `/api/employees/{id}` | Required | Update employee |
| PUT | `/api/employees/{id}/status` | Required | Enable/disable |
| POST | `/api/leave` | Required | Apply for leave |
| GET | `/api/leave/employee/{id}` | Required | Employee's leave history |
| GET | `/api/leave/pending` | Required | All pending approvals |
| PUT | `/api/leave/{id}/action` | Required | Approve or reject |
| GET | `/api/leave/balance/{id}` | Required | Leave balance |

### Resilient startup (Phase 3 readiness)
`Program.cs` wraps DB migration and seeding in `try/catch` so the API boots on Azure even before Azure SQL is connected in Phase 3:

```csharp
try
{
    db.Database.Migrate();
    await DbSeeder.SeedAsync(db);
}
catch (Exception ex)
{
    logger.LogError(ex, "Database migration/seed skipped — DB not reachable yet.");
}
```

---

## 4. CI/CD Pipeline

**File:** `.github/workflows/master_api-employee-portal-vj.yml`

Every push to `master` triggers:

```
Push to master
  └─ Job 1: build (windows-latest)
       ├─ Checkout code
       ├─ Install .NET 9 SDK
       ├─ dotnet build api/EmployeePortal.sln --configuration Release
       ├─ dotnet publish api/EmployeePortal.sln -c Release -o .../myapp
       └─ Upload artifact
  └─ Job 2: deploy (windows-latest)
       ├─ Download artifact
       ├─ Login to Azure (User-assigned identity)
       └─ Deploy to App Service slot: Production
```

### Why Windows runner?
We chose Windows OS for the App Service. GitHub Actions uses a matching OS (`windows-latest`) for the build VM.

### Authentication: User-assigned identity
The deploy job authenticates to Azure using a **User-assigned Managed Identity** — no passwords or secrets stored in GitHub. Azure and GitHub trust each other through OAuth federation.

Three secrets are auto-created in the GitHub repo by Azure:
- `AZUREAPPSERVICE_CLIENTID_...`
- `AZUREAPPSERVICE_TENANTID_...`
- `AZUREAPPSERVICE_SUBSCRIPTIONID_...`

### Fix applied to the auto-generated workflow
Azure's auto-generated `dotnet build` and `dotnet publish` commands did not include a project path — they would fail because the `.csproj` is not at the repo root. We added `api/EmployeePortal.sln` explicitly:

```yaml
# Before (broken)
run: dotnet build --configuration Release

# After (fixed)
run: dotnet build api/EmployeePortal.sln --configuration Release
```

---

## 5. Key Decisions & Why

### .sln solution file
Added `api/EmployeePortal.sln` to match real-world project structure. Visual Studio creates `.sln` automatically when using the IDE; CLI scaffolding skips it. A solution file groups projects (API, Tests, Shared libraries) so a single `dotnet build *.sln` builds everything. Currently only contains `EmployeePortal.Api`.

### Secrets never in git
`appsettings.json` holds empty values for `ConnectionString` and `Jwt:Key`. The real values live only in:
- **Local:** `appsettings.Development.json` (in `.gitignore`, never committed)
- **Azure:** App Settings (encrypted, Portal-managed)

Phase 4 will upgrade this further — secrets will be fetched from Azure Key Vault at runtime, so they never appear in the Portal UI either.

### Swagger disabled in Production
```csharp
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
```
Exposing API documentation publicly reveals endpoint structure to attackers. Swagger is available locally at `http://localhost:5099/swagger` and hidden on Azure.

---

## 6. Concepts for AZ-204 Exam

| Concept | What to know |
|---|---|
| **App Service Plan** | Defines compute, OS, region. Multiple apps can share one plan. |
| **Free F1 SKU** | 60 CPU min/day, no SLA, shared infrastructure |
| **App Settings** | Injected as environment variables at runtime. Override appsettings.json. |
| **`__` separator** | Azure convention: `Jwt__Key` = `Jwt:Key` in .NET |
| **Deployment slots** | Staging/Production swap for zero-downtime deployments (not used here — single slot) |
| **Managed Identity** | Azure AD identity for a resource — no credentials needed for service-to-service auth |
| **GitHub Actions integration** | Deployment Center wires GitHub → App Service; Azure commits the workflow YAML |

---

## 7. Phase 2 Checklist

- [x] .NET 9 API project scaffolded (EF Core, JWT, BCrypt)
- [x] All 11 endpoints implemented and tested locally
- [x] EF Core initial migration created
- [x] `appsettings.json` safe for git (no secrets)
- [x] `appsettings.Development.json` gitignored
- [x] Solution file (`EmployeePortal.sln`) added
- [x] App Service created (Central US, Free F1, Windows)
- [x] GitHub Actions CI/CD configured (User-assigned identity)
- [x] Workflow path fix applied (`api/EmployeePortal.sln`)
- [x] App Settings configured (JWT, CORS)
- [x] Health check live: `GET /` → 200 OK
- [x] React frontend CORS origin whitelisted

---

## 8. Next Phase

**Phase 3 — Azure SQL Database**

- Create Azure SQL Database (Free offer — 32 GB, serverless)
- Connect to the API via `ConnectionStrings__DefaultConnection` App Setting
- EF Core will run `Migrate()` on startup and create all tables
- DbSeeder will insert the two default users (Vijay Admin, Sankar Employee)
- Full end-to-end test: login from React → JWT → API → Azure SQL
