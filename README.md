# neighborly-exchange
Neighborhood skill exchange platform — ASP.NET Core 10 + React + Azure

chmod +x install-packages.sh
./install-packages.sh


dotnet build NeighborlyExchange.slnx

dotnet add NeighborlyExchange.Core package Microsoft.Extensions.Identity.Stores


=======================================

# Neighborly Exchange

A neighborhood skill-exchange platform where people help each other with childcare, tutoring, gardening, tech support, and more — no money involved. Built as a full-stack portfolio project to refresh ASP.NET Core / C# skills alongside modern React and Azure cloud patterns.

## The Idea

Many people have useful skills they're willing to share, while others need occasional help. Neighborly Exchange connects neighbors directly: offer a skill, request help, build trust through a reputation system — all without payment changing hands.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 10 Web API |
| Language | C# 14 |
| ORM | Entity Framework Core |
| Database | SQL Server (Docker locally, Azure SQL in production) |
| Auth | ASP.NET Identity + JWT |
| Real-time | SignalR |
| Frontend | React + TypeScript (Vite) |
| UI | Material UI |
| Cloud | Azure (App Service, Static Web Apps, Blob Storage, Key Vault) |
| CI/CD | GitHub Actions |

## Project Structure

```
neighborly-exchange/
├── NeighborlyExchange.slnx
├── docker-compose.yml
├── install-packages.sh
├── NeighborlyExchange.API/              # ASP.NET Core Web API
├── NeighborlyExchange.Core/             # Domain entities, DTOs, interfaces
├── NeighborlyExchange.Infrastructure/   # EF Core, DbContext, data access
├── NeighborlyExchange.Tests/            # xUnit tests
└── neighborly-exchange-ui/              # React + TypeScript frontend
```

## Core Features (MVP)

- **User Accounts** — register, login, edit profile, upload photo
- **Skill Listings** — post and browse skills offered by neighbors
- **Help Requests** — request help; track status (Open → Accepted → Completed)
- **Messaging** — real-time chat via SignalR after a request is accepted
- **Reputation** — star ratings and reviews after each completed exchange

## Prerequisites

Before running this project locally, install:

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js (LTS)](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/downloads)
- VS Code with the **C# Dev Kit** and **SQL Server (mssql)** extensions

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/SonaliBedge/neighborly-exchange.git
cd neighborly-exchange
```

### 2. Start SQL Server in Docker

```bash
docker-compose up -d
```

This runs SQL Server 2022 locally in a container, exposed on `localhost,1433`. Data persists in a Docker volume between restarts.

### 3. Configure local secrets

Copy your connection string and JWT secret into `NeighborlyExchange.API/appsettings.Development.json` (this file is gitignored and never committed):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=NeighborlyExchangeDb;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_GENERATED_SECRET_KEY",
    "Issuer": "NeighborlyExchangeAPI",
    "Audience": "NeighborlyExchangeClient",
    "ExpiryMinutes": 60
  }
}
```

### 4. Restore and build the backend

```bash
dotnet build NeighborlyExchange.slnx
```

Or use the install script (re-installs all NuGet packages from scratch if needed):

```bash
chmod +x install-packages.sh
./install-packages.sh
```

### 5. Run the database migration

```bash
dotnet ef database update \
  --project NeighborlyExchange.Infrastructure \
  --startup-project NeighborlyExchange.API
```

### 6. Run the API

```bash
cd NeighborlyExchange.API
dotnet run
```

Swagger UI will be available at `https://localhost:7xxx/swagger`.

### 7. Run the frontend

```bash
cd neighborly-exchange-ui
npm install
npm run dev
```

React app will be available at `http://localhost:5173`.

## Database Access

SQL Server runs in Docker. Connect using VS Code's **SQL Server (mssql)** extension (or Azure Data Studio's successor tooling) with:

| Field | Value |
|---|---|
| Server | `localhost,1433` |
| Authentication | SQL Login |
| User | `sa` |
| Password | (your local password, see `appsettings.Development.json`) |
| Trust server certificate | Yes |

## Roadmap

- [x] Project scaffolding — solution, Docker, React app
- [x] NuGet packages, EF Core, JWT, SignalR registered
- [ ] User authentication (register/login)
- [ ] Skill listings CRUD
- [ ] Help request flow
- [ ] Real-time messaging
- [ ] Reviews & reputation
- [ ] Azure deployment + CI/CD

## License

MIT (or update as preferred)