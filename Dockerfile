# -------------------------
# Stage 1: Build Angular Frontend
# -------------------------
  FROM node:20-alpine AS angular-build

  # Debug: Kiểm tra build context từ root
  WORKDIR /app
  RUN echo "=== BUILD CONTEXT ROOT ===" && ls -la /app 2>/dev/null || echo "Root /app is empty (expected)"
  
  # Đặt WORKDIR phù hợp với Render (chỉ còn ClientApp)
  WORKDIR /app/ClientApp
  
  # Debug: Kiểm tra thư mục trước khi COPY
  RUN echo "=== BEFORE COPY ===" && pwd && ls -la || echo "Directory does not exist yet"
  
  # Copy chỉ package.json & package-lock.json để tận dụng Docker cache
  COPY ClientApp/package*.json ./
  
  # Debug: Kiểm tra sau khi COPY package.json
  RUN echo "=== AFTER COPY package.json ===" && \
      pwd && \
      echo "--- Files in current directory ---" && \
      ls -la && \
      echo "--- Checking package.json ---" && \
      (test -f package.json && echo "✓ package.json EXISTS" && head -5 package.json || echo "✗ package.json NOT FOUND") && \
      (test -f package-lock.json && echo "✓ package-lock.json EXISTS" || echo "✗ package-lock.json NOT FOUND")
  
  # Cài dependencies
  RUN npm install --legacy-peer-deps
  
  # Copy toàn bộ source Angular
  COPY ClientApp/ ./
  
  # Debug: Kiểm tra sau khi COPY toàn bộ source
  RUN echo "=== AFTER COPY ALL SOURCE ===" && \
      pwd && \
      echo "--- Directory structure ---" && \
      ls -la && \
      echo "--- Checking key files ---" && \
      (test -f package.json && echo "✓ package.json" || echo "✗ package.json") && \
      (test -d src && echo "✓ src/ directory" || echo "✗ src/ directory") && \
      (test -f angular.json && echo "✓ angular.json" || echo "✗ angular.json")
  
# Build Angular
RUN npm run build

# Debug: Kiểm tra dist output path
RUN echo "=== CHECKING DIST OUTPUT ===" && \
    find /app/ClientApp/dist -type f -name "index.html" 2>/dev/null | head -1 && \
    echo "--- Dist structure ---" && \
    ls -la /app/ClientApp/dist/ 2>/dev/null || echo "dist/ not found" && \
    (test -d /app/ClientApp/dist/TTDVDTTNCXHClient && echo "✓ dist/TTDVDTTNCXHClient exists" || echo "✗ dist/TTDVDTTNCXHClient not found") && \
    (test -d /app/ClientApp/dist/TTDVDTTNCXHClient/browser && echo "✓ dist/TTDVDTTNCXHClient/browser exists" || echo "✗ dist/TTDVDTTNCXHClient/browser not found")
  
  # -------------------------
  # Stage 2: Build .NET Backend
  # -------------------------
  FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dotnet-build
  WORKDIR /app
  
  # Copy csproj & restore dependencies
  COPY *.csproj ./
  RUN dotnet restore
  
  # Copy toàn bộ source code backend
  COPY . ./
  
# Copy Angular build output vào wwwroot
# Angular 20+ output: dist/TTDVDTTNCXHClient/browser (project name trong angular.json)
COPY --from=angular-build /app/ClientApp/dist/TTDVDTTNCXHClient/browser ./wwwroot
  
  # Build & publish WebAPI
  RUN dotnet publish -c Release -o /app/publish
  
  # -------------------------
  # Stage 3: Runtime
  # -------------------------
  FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
  WORKDIR /app
  
  # Cài curl cho health check
  RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
  
  # Copy app đã publish
  COPY --from=dotnet-build /app/publish ./
  
  # Expose port Render yêu cầu
  EXPOSE 8080
  
  # Environment variables
  ENV ASPNETCORE_URLS=http://+:8080
  ENV ASPNETCORE_ENVIRONMENT=Production
  
  # Healthcheck
  HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1
  
  # Run app
  ENTRYPOINT ["dotnet", "TTDVDTTNCXH.dll"]