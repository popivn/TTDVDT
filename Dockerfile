# -------------------------
# Stage 1: Build .NET Backend
# -------------------------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dotnet-build
WORKDIR /app

# Copy csproj & restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy chỉ những file cần thiết cho .NET build
COPY Controllers/ ./Controllers/
COPY Data/ ./Data/
COPY DTOs/ ./DTOs/
COPY Models/ ./Models/
COPY Repositories/ ./Repositories/
COPY Services/ ./Services/
COPY Migrations/ ./Migrations/
COPY Program.cs ./
COPY appsettings*.json ./

# Copy Angular build output đã build sẵn ở local
COPY wwwroot/ ./wwwroot/

# Build & publish
RUN dotnet publish -c Release -o /app/publish

# -------------------------
# Stage 2: Runtime
# -------------------------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Install curl for health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy published app
COPY --from=dotnet-build /app/publish ./

# Expose port
EXPOSE 8080

# Environment
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Run
ENTRYPOINT ["dotnet", "TTDVDTTNCXH.dll"]
