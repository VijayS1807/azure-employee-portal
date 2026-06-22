# Azure Migration — Phase 2: .NET 9 Web API on Azure App Service

**Project:** Employee Leave Management Portal → Azure
**Author:** Vijay
**Date:** 2026-06-22
**Goal of Phase 2:** Build a production-ready .NET 9 REST API with EF Core, JWT authentication, and BCrypt password hashing, then deploy it to Azure App Service (Free tier) with automated CI/CD from GitHub.

---

## 1. Concepts Learned

### 1.1 Azure App Service
App Service is Azure's fully managed platform for hosting web applications and APIs. You upload code; Azure handles the OS, runtime, patching, load balancing, and auto-restart.

| Tier | Cost | RAM | Custom Domain | Always On |
|---|---|---|---|---|
| **F1 Free** | $0 | 1 GB shared | No | No (sleeps after 20 min) |
| B1 Basic | ~$13/mo | 1.75 GB | Yes | Yes |
| S1 Standard | ~$56/mo | 1.75 GB | Yes | Yes + auto-scale |

For this project we use **F1 Free** — sufficient for learning and portfolio demos.

### 1.2 EF Core Code-First
Entity Framework Core is Microsoft's ORM (Object-Relational Mapper). **Code-First** means:
1. You write C# entity classes (`Employee`, `LeaveRequest`, etc.)
2. EF Core generates SQL migrations from those classes
3. Running migrations creates/updates the actual database tables

This is the opposite of Database-First (where you start with the DB and generate C# classes).

```
C# Entity class  →  dotnet ef migrations add  →  Migration file (.cs)  →  db.Database.Migrate()  →  SQL table
```

### 1.3 JWT Authentication
JSON Web Token — a stateless authentication mechanism.

**Flow:**
1. Client sends `POST /api/auth/login` with username + password
2. API verifies credentials, returns a signed **JWT token**
3. Client stores the token and sends it in every request: `Authorization: Bearer <token>`
4. API validates the token signature on each request — no session, no database lookup

**JWT structure:** `header.payload.signature` (three Base64 parts separated by dots)
- Header: algorithm used
- Payload: claims (EmployeeId, RoleId, expiry)
- Signature: HMAC-SHA256 of header+payload using the secret key

Nobody can forge a token without the secret key.

### 1.4 BCrypt Password Hashing
Passwords are never stored as plain text. BCrypt is a slow, one-way hashing algorithm:

```csharp
// Store (on create)
string hash = BCrypt.Net.BCrypt.HashPassword("Temp@123");
// → "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

// Verify (on login)
bool ok = BCrypt.Net.BCrypt.Verify("Temp@123", hash); // → true
```

BCrypt is intentionally slow (work factor = 11 by default) to make brute-force attacks impractical.

### 1.5 Dependency Injection (DI)
.NET's built-in IoC container wires interfaces to implementations at startup:

```csharp
builder.Services.AddScoped<IAuthService, AuthService>();
```

This means: whenever a controller needs `IAuthService`, inject `AuthService`. **Scoped** = one instance per HTTP request.

| Lifetime | When created | When destroyed |
|---|---|---|
| Singleton | App start | App shutdown |
| Scoped | Per request | End of request |
| Transient | Each injection | When consumer is done |

### 1.6 CORS (Cross-Origin Resource Sharing)
Browsers block JavaScript from calling APIs on a different domain by default (security). CORS is the mechanism to explicitly allow it.

Our frontend at `polite-cliff-...azurestaticapps.net` calling our API at `api-employee-portal-vj...azurewebsites.net` = different domains = CORS required.

We configured:
```csharp
policy.WithOrigins("https://polite-cliff-08e66600f.7.azurestaticapps.net")
      .AllowAnyHeader().AllowAnyMethod();
```

### 1.7 App Settings vs appsettings.json

| Where | Visibility | Used for |
|---|---|---|
| `appsettings.json` (committed) | Everyone with repo access | Non-secret defaults |
| `appsettings.Development.json` (gitignored) | Local machine only | Local DB, dev JWT key |
| **Azure App Settings** (Portal) | Azure subscription owners only | Production secrets |

In Azure App Settings, the double-underscore `__` maps to `:` in .NET config hierarchy:
- `Jwt__Key` in Portal → `Jwt:Key` in C# → `builder.Configuration["Jwt:Key"]`
- `ConnectionStrings__DefaultConnection` → `ConnectionStrings:DefaultConnection` → `GetConnectionString("DefaultConnection")`

### 1.8 .sln Solution File
A `.sln` file groups multiple projects together. Created with:
```
dotnet new sln -n EmployeePortal
dotnet sln EmployeePortal.sln add EmployeePortal.Api/EmployeePortal.Api.csproj
```
Real projects always have one — enables `dotnet build EmployeePortal.sln` to build API + Tests + Shared libraries in one command.

---

## 2. Project Structure Built

```
api/
├── EmployeePortal.sln
└── EmployeePortal.Api/
    ├── EmployeePortal.Api.csproj      ← NuGet packages
    ├── Program.cs                      ← DI wiring, middleware pipeline
    ├── appsettings.json               ← Empty secrets (safe to commit)
    ├── appsettings.Development.json   ← Real local values (gitignored)
    ├── Auth/
    │   └── JwtTokenGenerator.cs       ← IJwtTokenGenerator interface + implementation
    ├── Controllers/
    │   ├── AuthController.cs          ← POST /api/auth/login
    │   ├── EmployeesController.cs     ← CRUD + status
    │   └── LeaveController.cs         ← Apply, list, approve/reject, balance
    ├── Data/
    │   ├── AppDbContext.cs            ← EF Core DbContext (5 DbSets, seed data)
    │   └── DbSeeder.cs                ← Seeds Vijay (Admin) + Sankar (Employee)
    ├── Entities/
    │   ├── Employee.cs
    │   ├── LeaveType.cs
    │   ├── LeaveRequest.cs
    │   ├── LeaveRequestDetail.cs
    │   └── EmployeeLeaveBalance.cs
    ├── Migrations/
    │   └── 20260622041152_InitialCreate.cs
    ├── Models/
    │   ├── Auth/AuthDtos.cs           ← LoginRequest, LoginResponse
    │   ├── Common/ApiResponse.cs      ← ApiResponse<T> wrapper
    │   ├── Common/Pagination.cs       ← PaginationRequest, PaginatedResponse<T>
    │   ├── Employee/EmployeeDtos.cs   ← CreateEmployeeRequest, EmployeeResponse
    │   └── Leave/LeaveDtos.cs         ← ApplyLeaveRequest, LeaveResponse, LeaveBalanceResponse
    └── Services/
        ├── AuthService.cs
        ├── EmployeeService.cs
        └── LeaveService.cs
```

---

## 3. Database Schema (EF Core Code-First)

| Table | Key Columns | Notes |
|---|---|---|
| `Employees` | EmployeeId, EmployeeCode, Email (unique), Password, RoleId | BCrypt-hashed password |
| `LeaveTypes` | LeaveTypeId, LeaveName, MaxDaysAllowed | Seeded: CL(12), SL(10), LOP(null) |
| `LeaveRequests` | LeaveRequestId, EmployeeId, LeaveTypeId, FromDate, ToDate, Status | Pending/Approved/Rejected |
| `LeaveRequestDetails` | Detail rows for multi-day leaves | Reserved for future use |
| `EmployeeLeaveBalances` | EmployeeId, LeaveTypeId, Year, TotalAllowed, Used, Remaining | Updated on approval |

---

## 4. API Endpoints

All endpoints except login require `Authorization: Bearer <token>` header.

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Login, returns JWT token |
| GET | `/api/employees` | List employees (paginated, searchable, sortable) |
| GET | `/api/employees/{id}` | Get single employee |
| POST | `/api/employees` | Create or update employee |
| PUT | `/api/employees/{id}/status` | Activate / deactivate employee |
| POST | `/api/leave` | Apply for leave |
| GET | `/api/leave/employee/{id}` | Get employee's own leave history |
| GET | `/api/leave/pending` | Get all pending leaves (Admin) |
| PUT | `/api/leave/{id}/action` | Approve or reject leave |
| GET | `/api/leave/balance/{id}` | Get remaining leave balance |

---

## 5. Key Code Decisions

### Startup migration with try/catch
```csharp
try
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await DbSeeder.SeedAsync(db);
}
catch (Exception ex)
{
    logger.LogError(ex, "Database migration/seed skipped — DB not reachable yet.");
}
```
**Why:** On first deploy to Azure, the database is not configured yet (Phase 3). Wrapping in try/catch allows the API to boot and serve the health check (`GET /`) even without a DB. Migration runs successfully once the connection string is added in Phase 3.

### EF Core LINQ projection rule
EF Core can only translate simple projections to SQL. Rules:
- Filter (`Where`) on entities **before** projecting
- Project to **anonymous type** (not record/ValueTuple — those can't be translated)
- Format dates (`ToString("yyyy-MM-dd")`) **after** `ToListAsync()`, in C# memory

```csharp
var raw = await (
    from l in source
    join e in _db.Employees on l.EmployeeId equals e.EmployeeId
    select new { l.LeaveRequestId, l.FromDate, EmployeeName = e.FullName }
).ToListAsync();

return raw.Select(r => new LeaveResponse {
    FromDate = r.FromDate.ToString("yyyy-MM-dd")  // done in memory, not SQL
}).ToList();
```

---

## 6. CI/CD Pipeline (GitHub Actions)

Azure auto-generated `.github/workflows/master_api-employee-portal-vj.yml`.

**We added the project path** to both build commands (Azure generates commands pointing at repo root, but our `.csproj` is inside `api/EmployeePortal.Api/`):

```yaml
- name: Build with dotnet
  run: dotnet build api/EmployeePortal.sln --configuration Release

- name: dotnet publish
  run: dotnet publish api/EmployeePortal.sln -c Release -o "${{env.DOTNET_ROOT}}/myapp"
```

**Pipeline flow:**
```
Push to master
  → Job 1 (build): checkout → install .NET 9 → dotnet build → dotnet publish → upload artifact
  → Job 2 (deploy): download artifact → az login (User-assigned identity) → deploy to App Service
```

**Authentication type chosen: User-assigned identity** (not Basic auth — Azure disables Basic auth by default on new subscriptions; Managed Identity is the modern, secure approach).

---

## 7. Azure Resources Created

| Resource | Name | SKU | Region |
|---|---|---|---|
| App Service Plan | ASP-rglearnazure-a1fd | **F1 Free** | Central US |
| App Service (Web App) | api-employee-portal-vj | .NET 9 (STS), Windows | Central US |

**Why Central US?** East US and East US 2 had VM quota = 0 on this subscription (common on reactivated Pay-As-You-Go accounts). Central US had available quota.

---

## 8. App Settings Configured in Azure Portal

| Setting | Value | Maps to |
|---|---|---|
| `Jwt__Key` | (secret key) | `Jwt:Key` in appsettings |
| `Jwt__Issuer` | `EmployeePortalApi` | `Jwt:Issuer` |
| `Jwt__Audience` | `EmployeePortalClient` | `Jwt:Audience` |
| `Jwt__ExpiryHours` | `8` | `Jwt:ExpiryHours` |
| `Cors__AllowedOrigins__0` | `https://polite-cliff-08e66600f.7.azurestaticapps.net` | First allowed CORS origin |
| `ConnectionStrings__DefaultConnection` | (Azure SQL connection string) | EF Core DB connection |

---

## 9. Live URLs

| Resource | URL |
|---|---|
| API Health Check | https://api-employee-portal-vj-gyayffgpcecgcmhu.centralus-01.azurewebsites.net |
| Login endpoint | `.../api/auth/login` |
| GitHub repo | https://github.com/VijayS1807/azure-employee-portal |
| GitHub Actions | https://github.com/VijayS1807/azure-employee-portal/actions |

**Note on the long URL:** Azure's "Secure unique default hostname" feature adds a random suffix to prevent subdomain takeover attacks (if you delete and recreate an app, someone else can't claim your old URL before you do).

---

## 10. Issues Encountered and Fixed

| Issue | Root Cause | Fix |
|---|---|---|
| App Service creation failed (quota error) in East US / East US 2 | Reactivated subscription had VM quota = 0 in those regions | Used Central US instead |
| GitHub Actions build failed on first run | Azure-generated workflow had no project path — `dotnet build` ran from repo root, couldn't find `.csproj` | Added `api/EmployeePortal.sln` to build and publish commands |
| Basic auth disabled error in Deployment Center | Azure disables SCM basic auth by default on new subscriptions | Switched to User-assigned identity authentication |
| API returned 500 after connection string added | App Service was using cached startup state from before DB was configured | Restarted the App Service — migration ran on next boot |

---

## 11. Key Takeaways for TL Presentation

1. **App Service** = managed platform — we deploy code, Azure manages infrastructure
2. **EF Core Code-First** = schema driven by C# classes, not SQL scripts
3. **JWT** = stateless auth, no server-side sessions — scales horizontally
4. **BCrypt** = industry-standard password hashing, not plain text or MD5
5. **App Settings with `__` notation** = secure config injection into .NET — secrets never in git
6. **CI/CD via GitHub Actions** = every push auto-deploys — no manual FTP uploads
7. **User-assigned Managed Identity** for deployment = no static credentials stored in GitHub
