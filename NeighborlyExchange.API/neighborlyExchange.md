Phase 1 — Install Software (~35 min)Step-by-step for every tool: .NET 9 SDK, Node.js LTS, Docker Desktop (including WSL 2 setup), VS Code, Git (with identity config), Azure CLI, and SSMS. Every step includes a terminal verify command so you know it worked.

============================================================
Phase 2 — VS Code Setup (~15 min)12 extensions to install (C# Dev Kit, Docker, ESLint, Prettier, Thunder Client, etc.) with a table explaining what each one does, plus the exact settings.json config.

===============================================================
Phase 3 — GitHub Setup (~15 min)Create repo, clone it, branch strategy (main/develop/feature/*), and the complete .gitignore additions for ASP.NET + React.


===============================================================
Phase 4 — Docker Setup (~20 min)The complete docker-compose.yml for SQL Server, how to start it, how to test it in SSMS, and a reference table of every Docker command you'll use daily.

Field                                 What to enter

Input type                  Parameters / Connection Details
Server                      localhost,1433
Authentication              SQL Login
User name                   sa
Password                    your chosen password
Database                    leave default / blank
Trust certificate           Yes
Profile name                NHX Local (or anything memorable)
Connection group            leave default, or skip


========================================================

Phase - 5
Step 1 — Confirm you're in the right folder
bashcd ~/Projects/neighborly-exchange
pwd
============================================
Step 2 — Create the Solution File
A .sln file is just a container that groups multiple related projects together so Visual Studio / VS Code / the dotnet CLI can build them all at once.
bashdotnet new sln -n NeighborlyExchange
Step 3 — Create the Four Backend Projects
bash# The API project — this is your actual web server
dotnet new webapi -n NeighborlyExchange.API

# Core — domain models, DTOs, interfaces (no dependencies on anything else)
dotnet new classlib -n NeighborlyExchange.Core

# Infrastructure — EF Core, database access, external services
dotnet new classlib -n NeighborlyExchange.Infrastructure

# Tests — your test project
dotnet new xunit -n NeighborlyExchange.Tests

Why this direction matters: Core has zero references to anything — it's the foundation. Infrastructure depends only on Core. API depends on both. This is intentional layering so your business logic (Core) never accidentally depends on database or web code.
Step 6 — Verify the Backend Builds
bashdotnet build NeighborlyExchange.sln
Expect: Build succeeded. 0 Warning(s) 0 Error(s) (a few warnings are fine, errors are not).
Step 7 — Create the React Frontend
Now switch to the frontend, using Vite (faster and more modern than Create React App):
bashnpm create vite@latest neighborly-exchange-ui -- --template react-ts
It'll ask a couple of confirmation prompts — accept defaults.
bashcd neighborly-exchange-ui
npm install
Step 8 — Install Frontend Libraries
Still inside neighborly-exchange-ui:
bashnpm install react-router-dom axios @mui/material @emotion/react @emotion/styled
npm install @microsoft/signalr
npm install -D @types/node
Step 9 — Verify React Runs
bashnpm run dev
Open http://localhost:5173 in your browser — you should see the default Vite + React starter page. Once confirmed, stop it with Ctrl+C.
bashcd ..
(back to project root)
Step 10 — Create the Internal Folder Structure
bash# API project folders
mkdir -p NeighborlyExchange.API/Controllers
mkdir -p NeighborlyExchange.API/Hubs
mkdir -p NeighborlyExchange.API/Middleware
mkdir -p NeighborlyExchange.API/Extensions

# Core project folders
mkdir -p NeighborlyExchange.Core/Entities
mkdir -p NeighborlyExchange.Core/DTOs/Auth
mkdir -p NeighborlyExchange.Core/DTOs/Requests
mkdir -p NeighborlyExchange.Core/DTOs/Reviews
mkdir -p NeighborlyExchange.Core/Interfaces

# Infrastructure project folders
mkdir -p NeighborlyExchange.Infrastructure/Data
mkdir -p NeighborlyExchange.Infrastructure/Repositories
mkdir -p NeighborlyExchange.Infrastructure/Services
mkdir -p NeighborlyExchange.Infrastructure/Migrations

# React folders
mkdir -p neighborly-exchange-ui/src/api
mkdir -p neighborly-exchange-ui/src/components
mkdir -p neighborly-exchange-ui/src/pages
mkdir -p neighborly-exchange-ui/src/hooks
mkdir -p neighborly-exchange-ui/src/context
mkdir -p neighborly-exchange-ui/src/types
(Note: -p works fine on Mac/Linux, unlike the Windows version which didn't need it — your terminal already understands this.)
Final Folder Tree — What You Should See
neighborly-exchange/
├── NeighborlyExchange.sln
├── docker-compose.yml
├── .gitignore
├── README.md
├── NeighborlyExchange.API/
│   ├── Controllers/
│   ├── Hubs/
│   ├── Middleware/
│   ├── Extensions/
│   ├── Program.cs
│   └── appsettings.json
├── NeighborlyExchange.Core/
│   ├── Entities/
│   ├── DTOs/
│   │   ├── Auth/
│   │   ├── Requests/
│   │   └── Reviews/
│   └── Interfaces/
├── NeighborlyExchange.Infrastructure/
│   ├── Data/
│   ├── Repositories/
│   ├── Services/
│   └── Migrations/
├── NeighborlyExchange.Tests/
└── neighborly-exchange-ui/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   ├── context/
    │   └── types/
    └── public/
Step 11 — Commit This Milestone
bashgit add .
git commit -m "chore: scaffold solution structure — API, Core, Infrastructure, Tests, React UI"
git push origin main
(If you haven't created a develop branch yet, pushing to main directly is fine for this initial scaffolding commit — we can set up the branch strategy next if you want.)