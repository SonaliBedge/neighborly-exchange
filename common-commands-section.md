## Common Commands

Quick reference for commands you'll use repeatedly during development.

### Daily Startup

```bash
# 1. Start Docker Desktop (if not already running)

# 2. Start SQL Server container
docker-compose up -d

# 3. Confirm it's running
docker ps

# 4. Run the API (separate terminal)
cd NeighborlyExchange.API
dotnet run

# 5. Run the frontend (separate terminal)
cd neighborly-exchange-ui
npm run dev
```

### Build & Verify

```bash
# Build the whole solution
dotnet build NeighborlyExchange.slnx

# Run all tests
dotnet test NeighborlyExchange.slnx
```

### Package Management

```bash
# Reinstall all NuGet packages from scratch
chmod +x install-packages.sh
./install-packages.sh

# Add a new package to a specific project
dotnet add <ProjectName> package <PackageName>

# Remove a package
dotnet remove <ProjectName> package <PackageName>
```

**Note:** whenever you add or remove a package manually via `dotnet add`/`dotnet remove`, update `install-packages.sh` to match — it should always reflect exactly what the project uses.

### Entity Framework Core Migrations

```bash
# Create a new migration after changing entity classes
dotnet ef migrations add <MigrationName> \
  --project NeighborlyExchange.Infrastructure \
  --startup-project NeighborlyExchange.API \
  --output-dir Migrations

# Apply pending migrations to the database
dotnet ef database update \
  --project NeighborlyExchange.Infrastructure \
  --startup-project NeighborlyExchange.API

# Undo the last migration (only if not yet applied to the database)
dotnet ef migrations remove \
  --project NeighborlyExchange.Infrastructure \
  --startup-project NeighborlyExchange.API
```

### Docker

```bash
# Start SQL Server container (background)
docker-compose up -d

# Stop containers (keeps data)
docker-compose down

# Stop containers AND delete all data (fresh start)
docker-compose down -v

# View SQL Server logs
docker logs neighborly-sqlserver

# List running containers
docker ps
```

### Git Workflow

```bash
# Check current status
git status

# Stage and commit
git add <file-or-.>
git commit -m "type: short description"
git push

# Untrack a file that should be gitignored but was already committed
git rm --cached <file-path>
```

### Editing Key Files

```bash
code Program.cs                                      # wherever it lives
code NeighborlyExchange.API/appsettings.Development.json   # local secrets (gitignored)
code install-packages.sh                              # package install script
code docker-compose.yml                                # SQL Server container config
```
