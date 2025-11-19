# Docker Deployment Guide

Hướng dẫn deploy ứng dụng TTDVDTTNCXH bằng Docker.

## Yêu cầu

- Docker Engine 20.10+
- Docker Compose 2.0+

## Cấu trúc Docker

### Dockerfile
Multi-stage build:
1. **Stage 1**: Build Angular frontend
2. **Stage 2**: Build .NET backend và copy Angular build vào wwwroot
3. **Stage 3**: Runtime image với ASP.NET Core

### docker-compose.yml
Orchestrates:
- MySQL 8.0 database
- .NET API với Angular frontend

## Cách sử dụng

### 1. Build và chạy với Docker Compose

```bash
# Build và chạy tất cả services
docker-compose up -d --build

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

### 2. Chỉ chạy Database (cho development)

```bash
# Chạy chỉ MySQL
docker-compose -f docker-compose.dev.yml up -d mysql

# Kết nối database
# Host: localhost:3306
# User: appuser
# Password: apppassword
# Database: ttdvdttncxh
```

### 3. Build Docker image riêng

```bash
# Build image
docker build -t ttdvdttncxh:latest .

# Chạy container
docker run -d -p 8080:8080 \
  -e ConnectionStrings__DefaultConnection="server=host.docker.internal;port=3306;database=ttdvdttncxh;user=root;password=;" \
  --name ttdvdttncxh-api \
  ttdvdttncxh:latest
```

## Migrations

Sau khi database đã sẵn sàng, chạy migrations:

```bash
# Vào container
docker exec -it ttdvdttncxh-api bash

# Chạy migrations
dotnet ef database update
```

Hoặc chạy từ host:

```bash
docker exec -it ttdvdttncxh-api dotnet ef database update
```

## Truy cập ứng dụng

- **API**: http://localhost:8080
- **Frontend**: http://localhost:8080 (served từ API)
- **MySQL**: localhost:3306

## Environment Variables

Có thể override connection string qua environment variables:

```bash
docker-compose up -d -e ConnectionStrings__DefaultConnection="your-connection-string"
```

## Troubleshooting

### Kiểm tra logs
```bash
docker-compose logs api
docker-compose logs mysql
```

### Kiểm tra health
```bash
docker ps
curl http://localhost:8080/health
```

### Rebuild từ đầu
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Production Deployment

1. Cập nhật passwords trong `docker-compose.yml`
2. Sử dụng secrets management cho production
3. Cấu hình reverse proxy (nginx) nếu cần
4. Setup SSL/TLS certificates
5. Backup database định kỳ

