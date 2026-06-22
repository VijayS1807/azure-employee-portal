# Azure Migration — Phase 3: Azure SQL Database

**Project:** Employee Leave Management Portal → Azure
**Author:** Vijay
**Date:** 2026-06-22
**Goal of Phase 3:** Create an Azure SQL Database (Free tier), connect the .NET API to it, run EF Core migrations automatically on startup, and verify all endpoints work end-to-end on Azure.

---

## 1. Concepts Learned

### 1.1 Azure SQL Database vs SQL Server on VM

| | Azure SQL Database | SQL Server on Azure VM |
|---|---|---|
| Type | **Fully managed PaaS** | IaaS (you manage the OS) |
| Patching | Automatic | Manual |
| Backups | Automatic (7–35 days retention) | Manual or scripted |
| You manage | Schema + data only | Everything (OS, SQL Server, backups) |
| Best for | New cloud-native apps | Lift-and-shift from on-premise |
| Free tier | Yes (32 GB, serverless) | No |

**We use Azure SQL Database** — managed, zero maintenance, free tier available.

### 1.2 Logical Server vs Database

Azure SQL has a two-level hierarchy:

```
SQL Server (logical server)          ← sql-employee-portal-vj
  └── SQL Database                   ← EmployeePortalDb
  └── SQL Database (another one)     ← could host multiple DBs on same server
```

- **Logical server** = admin endpoint, firewall rules, authentication settings
- **Database** = actual data, compute, storage

You connect to the database via the server's hostname: `sql-employee-portal-vj.database.windows.net`

### 1.3 Authentication Options

| Option | How it works | Security level |
|---|---|---|
| **SQL authentication** | Username + password in connection string | Good for learning/dev |
| Microsoft Entra only | Azure AD identity, no password | Enterprise best practice |
| Both | Supports either method | Migration period |

We use SQL authentication now. In **Phase 4**, we upgrade to **Managed Identity** — the App Service connects to the DB using its Azure identity, no password required at all.

### 1.4 Connectivity and Firewall

Azure SQL is protected by a firewall at the server level. Nobody can connect unless their IP is explicitly allowed.

| Rule | What it allows |
|---|---|
| **Allow Azure services** | All Azure resources (App Service, Functions, etc.) |
| **Client IP rule** | Your specific machine's IP — for SSMS, Azure Data Studio |

We enabled both:
- "Allow Azure services and resources to access this server" → ON (lets App Service connect)
- "Add current client IP address" → Yes (lets your laptop connect for debugging)

### 1.5 Connection Policy

| Policy | Behaviour |
|---|---|
| **Default** | Redirect for Azure connections (fast), Proxy for external connections |
| Proxy | All traffic through Azure gateway — simpler firewall, slightly slower |
| Redirect | Direct to DB node always — fastest, needs extra ports (1433 + 11000–11999) |

We use **Default** — recommended by Azure, no extra configuration needed.

### 1.6 Free Tier (Azure SQL Database Free Offer)

Available once per subscription:
- **32 GB** storage
- **100,000 vCore seconds/month** compute
- Serverless compute tier — pauses automatically when idle (saves vCore seconds)
- **$0 charge** as long as limits are not exceeded

Serverless = the database pauses after ~1 hour of inactivity and resumes on next connection (cold start ~6 seconds). Fine for development and portfolio projects.

### 1.7 Connection String Format

Azure SQL uses a slightly different connection string than local SQL Server:

**Local (appsettings.Development.json):**
```
Server=UFOURS-DELL;Database=EmployeePortalDb;User Id=sa;Password=123456;TrustServerCertificate=True;
```

**Azure SQL:**
```
Server=tcp:sql-employee-portal-vj.database.windows.net,1433;
Initial Catalog=EmployeePortalDb;
Persist Security Info=False;
User ID=sqladmin;
Password=<your-password>;
MultipleActiveResultSets=False;
Encrypt=True;
TrustServerCertificate=False;
Connection Timeout=30;
```

Key differences:
- `tcp:` prefix and port `1433` explicitly stated
- `Encrypt=True` — Azure SQL requires encrypted connections
- `TrustServerCertificate=False` — use Azure's real certificate (not self-signed like local)

### 1.8 EF Core Migrations on Azure

Our `Program.cs` runs migrations automatically on startup:

```csharp
db.Database.Migrate();       // creates tables if they don't exist, applies new migrations
await DbSeeder.SeedAsync(db); // seeds LeaveTypes + default employees if tables are empty
```

This means: on the **first boot after connecting the database**, EF Core creates all tables and seeds the data. No manual SQL scripts needed.

The `try/catch` around this block ensures the API boots cleanly even if the DB is not reachable (e.g. before Phase 3 was done).

---

## 2. Azure Resources Created

| Resource | Name | Location |
|---|---|---|
| SQL Server (logical) | `sql-employee-portal-vj` | Central US |
| SQL Database | `EmployeePortalDb` | Central US (same server) |
| Pricing tier | Free offer (General Purpose Serverless) | — |
| Backup redundancy | Locally-redundant | Cheapest option |

**Why Central US?** To match the App Service region — lower latency when the API calls the DB.

---

## 3. Tables Created by Migration

EF Core's `InitialCreate` migration (`20260622041152_InitialCreate.cs`) created these tables:

| Table | Columns |
|---|---|
| `Employees` | EmployeeId, EmployeeCode, FullName, Email (unique index), Password, Department, Designation, DateOfJoining, EmploymentType, Status, RoleId, CreatedAt |
| `LeaveTypes` | LeaveTypeId, LeaveName, MaxDaysAllowed |
| `LeaveRequests` | LeaveRequestId, EmployeeId (FK), LeaveTypeId (FK), FromDate, ToDate, DayType, TotalDays, Status, AppliedDate, ApprovedBy, ApprovedDate |
| `LeaveRequestDetails` | LeaveRequestDetailId, LeaveRequestId (FK), Date, DayType |
| `EmployeeLeaveBalances` | BalanceId, EmployeeId (FK), LeaveTypeId (FK), Year, TotalAllowed, Used, Remaining |

---

## 4. Seeded Data

`DbSeeder.cs` inserts default data on first run (only if `Employees` table is empty):

**Employees:**
| EmployeeId | Name | Email | Role | Password |
|---|---|---|---|---|
| 1 | Vijay S | vijay@test.com | Admin (RoleId=1) | BCrypt("Temp@123") |
| 2 | Sankar | sankar@ufours.com | Employee (RoleId=2) | BCrypt("Temp@123") |

**Leave Types:**
| LeaveTypeId | Name | Max Days |
|---|---|---|
| 1 | Casual Leave (CL) | 12 |
| 2 | Sick Leave (SL) | 10 |
| 3 | Loss of Pay (LOP) | null (unlimited) |

**Leave Balances (current year, for each employee):**
- CL: Total=12, Used=0, Remaining=12
- SL: Total=10, Used=0, Remaining=10

---

## 5. Connection String in Azure App Settings

Added to App Service → Environment variables:

| Setting Name | Value |
|---|---|
| `ConnectionStrings__DefaultConnection` | Full Azure SQL ADO.NET connection string |

The `__` (double underscore) maps to `:` in .NET config, so this overrides `ConnectionStrings:DefaultConnection` from `appsettings.json`.

**Security note:** The connection string (including password) is stored encrypted in Azure and never appears in source code or git history.

---

## 6. All Endpoints Tested on Azure

After connecting the database, all 10 endpoints were verified:

| # | Method | Route | Result |
|---|---|---|---|
| 1 | POST | `/api/auth/login` | ✅ JWT token returned |
| 2 | GET | `/api/employees` | ✅ Paginated list (3 employees) |
| 3 | GET | `/api/employees/1` | ✅ Vijay S returned |
| 4 | POST | `/api/employees` | ✅ New employee created (Id=3) |
| 5 | PUT | `/api/employees/{id}/status` | ✅ Status updated to Inactive |
| 6 | POST | `/api/leave` | ✅ Leave applied (2 days CL, Pending) |
| 7 | GET | `/api/leave/employee/2` | ✅ Sankar's leave history returned |
| 8 | GET | `/api/leave/pending` | ✅ 1 pending leave listed |
| 9 | PUT | `/api/leave/{id}/action` | ✅ Leave approved by Vijay S |
| 10 | GET | `/api/leave/balance/2` | ✅ CL Used=2, Remaining=10 (correctly decremented) |

**Balance deduction verified:** Sankar applied 2 days CL → approved → balance updated from 12 to 10. The approval flow works correctly end-to-end.

---

## 7. Issues Encountered and Fixed

| Issue | Root Cause | Fix |
|---|---|---|
| API returned 500 after adding connection string | App Service didn't restart — was still using the cached startup where DB was not configured | Manually restarted App Service from Portal; migration ran on next boot |
| Login returned 400 "Username and password are required" | Test used `email` field name but `LoginRequest` DTO uses `Username` property (legacy naming) | Used `{"username":"..."}` in request body |

---

## 8. Architecture So Far

```
User (Browser)
    │
    ▼
React Frontend          ← Azure Static Web Apps (Free)
https://polite-cliff-08e66600f.7.azurestaticapps.net
    │  (API calls with JWT)
    ▼
.NET 9 REST API         ← Azure App Service (Free F1)
https://api-employee-portal-vj-gyayffgpcecgcmhu.centralus-01.azurewebsites.net
    │  (EF Core + SQL)
    ▼
Azure SQL Database      ← Azure SQL Free Offer (Serverless)
sql-employee-portal-vj.database.windows.net / EmployeePortalDb
```

All three tiers are live. Total cost: **$0**.

---

## 9. Key Takeaways for TL Presentation

1. **Azure SQL Database** = fully managed — no DBA work, automatic backups, patching
2. **Firewall rules** = defence-in-depth — even inside Azure, access is locked down by IP/identity
3. **Serverless tier** = pay only for compute actually used — pauses when idle
4. **EF Core migrations on startup** = schema is version-controlled in C#, auto-applied on deploy
5. **Connection string via App Settings** = credentials never in git, encrypted at rest in Azure
6. **Full stack on free tier** = React + .NET API + SQL database at $0/month
7. **Next phase** = Key Vault + Managed Identity to eliminate the password from the connection string entirely
