#!/bin/bash
set -e   # stop immediately if any command fails

echo "Installing Infrastructure packages..."
dotnet add NeighborlyExchange.Infrastructure package Microsoft.EntityFrameworkCore
dotnet add NeighborlyExchange.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer
dotnet add NeighborlyExchange.Infrastructure package Microsoft.EntityFrameworkCore.Design

echo "Installing API packages..."
dotnet add NeighborlyExchange.API package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add NeighborlyExchange.API package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add NeighborlyExchange.API package Microsoft.AspNetCore.SignalR
dotnet add NeighborlyExchange.API package Swashbuckle.AspNetCore
dotnet add NeighborlyExchange.API package Azure.Storage.Blobs
dotnet add NeighborlyExchange.API package Azure.Extensions.AspNetCore.Configuration.Secrets
dotnet add NeighborlyExchange.API package Microsoft.ApplicationInsights.AspNetCore

echo "Installing utility packages..."
dotnet add NeighborlyExchange.API package FluentValidation.AspNetCore

echo "All packages installed. Running build to verify..."
dotnet build NeighborlyExchange.slnx

echo "Done."