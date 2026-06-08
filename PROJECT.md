# MERN Chat App — Technical Documentation

## Overview

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js), extended with PostgreSQL for user management and an AI chatbot powered by HuggingFace. The application follows a microservices architecture with 4 backend services, an Nginx API gateway, and a React frontend.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Nginx (port 80)                           │
│                        API Gateway                              │
├──────────┬──────────┬──────────┬──────────┬────────────────────┤
│          │          │          │          │                    │
▼          ▼          ▼          ▼          ▼                    │
Auth     Messaging   File     Chatbot   Frontend                 │
:3001    :3002       :3003    :3004     :80                      │
│          │          │          │                               │
▼          ▼          ▼          ▼                               │
PostgreSQL MongoDB   MongoDB  MongoDB + Groq/HuggingFace API     │
                       +                                         │
                     MinIO                                        │
                   (S3 storage)                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Monitoring Stack                            │
├─────────────────────────────────────────────────────────────────┤
│  Promtail → Loki ──┐                                          │
│                     ├──→ Grafana (:3000)                       │
│  Prometheus (:9090)─┘                                          │
│    ↑ scrapes /metrics from all services                        │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | React 19, Vite, TailwindCSS, DaisyUI, Zustand |
| Backend     | Node.js, Express 5                            |
| Databases   | PostgreSQL 16 (auth), MongoDB 7 (messages/files) |
| Real-time   | Socket.io                                     |
| AI          | Groq API (llama-3.1-8b) / HuggingFace (fallback)  |
| Gateway     | Nginx                                         |
| Containers  | Docker, Docker Compose                        |
| Object Storage | MinIO (S3-compatible API)                  |
| Logging     | Winston (structured JSON)                     |
| Monitoring  | Prometheus, Grafana, Loki, Promtail           |

## Microservices

### 1. Auth Service (port 3001)
- User registration, login, logout
- JWT token generation (cookie-based)
- User listing for sidebar
- **Database:** PostgreSQL via Sequelize ORM

### 2. Messaging Service (port 3002)
- Send and receive messages
- Real-time delivery via Socket.io
- Online user presence tracking
- **Database:** MongoDB

### 3. File Service (port 3003)
- PDF file upload via multer → stored in MinIO (S3 API)
- File listing (metadata in MongoDB) and retrieval (binary from MinIO)
- **Database:** MongoDB (metadata) + MinIO S3 (file blobs)

### 4. Chatbot Service (port 3004)
- AI-powered message suggestions
- Reads conversation history for context
- Supports multiple AI providers (Groq, HuggingFace) via config
- **Database:** MongoDB (reads conversations)

## API Endpoints

### Auth Service

| Method | Endpoint           | Auth | Description                     |
|--------|-------------------|------|---------------------------------|
| POST   | `/api/auth/signup` | No   | Register a new user             |
| POST   | `/api/auth/login`  | No   | Login and receive JWT cookie    |
| POST   | `/api/auth/logout` | No   | Clear JWT cookie                |
| GET    | `/api/users`       | Yes  | Get all users (excluding self)  |

**POST /api/auth/signup** body:
```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "password": "password123",
  "confirmPassword": "password123",
  "gender": "male"
}
```

**POST /api/auth/login** body:
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

### Messaging Service

| Method | Endpoint                | Auth | Description                  |
|--------|------------------------|------|------------------------------|
| GET    | `/api/messages/:id`    | Yes  | Get messages with user `:id` |
| POST   | `/api/messages/send/:id` | Yes | Send message to user `:id`   |

**POST /api/messages/send/:id** body:
```json
{
  "message": "Hello, how are you?"
}
```

**Socket.io Events:**
- `connection` — client connects with `?userId=<id>`
- `getOnlineUsers` — broadcasts list of online user IDs
- `newMessage` — emits to receiver when a new message is sent
- `disconnect` — client disconnects

### File Service

| Method | Endpoint                  | Auth | Description            |
|--------|--------------------------|------|------------------------|
| POST   | `/api/files/upload`      | Yes  | Upload a PDF file      |
| GET    | `/api/files`             | Yes  | List all files (metadata only) |
| GET    | `/api/files/:id`         | Yes  | Get file by ID (with data) |
| GET    | `/api/files/:id/download`| Yes  | Download file by ID    |

**POST /api/files/upload** — multipart/form-data with field `file` (PDF only).

### Chatbot Service

| Method | Endpoint    | Auth | Description                      |
|--------|------------|------|----------------------------------|
| POST   | `/chatbot` | Yes  | Generate AI reply suggestion     |

**POST /chatbot** body:
```json
{
  "text": "Suggest a casual reply",
  "otherUserId": "uuid-of-other-user"
}
```


## Project Structure

```
├── docker-compose.yml
├── nginx/
│   └── nginx.conf              # API gateway routing
├── monitoring/
│   ├── prometheus/prometheus.yml
│   ├── promtail/promtail-config.yml
│   └── grafana/
│       ├── provisioning/       # Auto-configured datasources + dashboard provider
│       └── dashboards/         # Pre-built Grafana dashboard JSON
├── frontend/
│   ├── Dockerfile              # Multi-stage build (Vite → Nginx)
│   ├── nginx.conf              # SPA routing
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── context/            # AuthContext, SocketContext
│   │   ├── hooks/              # Custom hooks (API calls)
│   │   ├── pages/              # Login, SignUp, Home, Files
│   │   ├── utils/              # apiFetch, extractTime
│   │   └── zustand/            # State management
│   └── package.json
├── services/
│   ├── auth/
│   │   ├── Dockerfile
│   │   ├── server.js
│   │   ├── controllers/        # auth, user controllers
│   │   ├── routes/             # auth, user routes
│   │   ├── middleware/         # JWT protectRoute, requestLogger, metrics
│   │   ├── models/             # Sequelize User model
│   │   ├── db/                 # Sequelize connection
│   │   └── utils/              # JWT token generation, Winston logger
│   ├── messaging/
│   │   ├── Dockerfile
│   │   ├── server.js
│   │   ├── controllers/        # message controller
│   │   ├── routes/             # message routes
│   │   ├── middleware/         # JWT protectRoute, requestLogger, metrics
│   │   ├── models/             # Conversation, Message models
│   │   ├── db/                 # MongoDB connection
│   │   ├── socket/             # Socket.io setup
│   │   └── utils/              # Winston logger
│   ├── file/
│   │   ├── Dockerfile
│   │   ├── server.js
│   │   ├── controllers/        # file controller (multer + S3)
│   │   ├── routes/             # file routes
│   │   ├── middleware/         # JWT protectRoute, requestLogger, metrics
│   │   ├── models/             # File model (metadata only)
│   │   ├── db/                 # MongoDB connection
│   │   └── utils/              # Winston logger, S3 client
│   └── chatbot/
│       ├── Dockerfile
│       ├── server.js
│       ├── controllers/        # chatbot controller (multi-provider AI)
│       ├── routes/             # chatbot routes
│       ├── middleware/         # JWT protectRoute, requestLogger, metrics
│       ├── models/             # Conversation, Message models
│       ├── db/                 # MongoDB connection
│       └── utils/              # Winston logger
├── .env.example
└── package.json                # Legacy monolith (kept for reference)
```

## Environment Setup

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- A Groq API token (free tier works) — https://console.groq.com/keys
- (Optional) A HuggingFace API token for fallback AI provider

### Environment Variables

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Required variables:

| Variable            | Description                          | Example                          |
|--------------------|--------------------------------------|----------------------------------|
| `JWT_SECRET`       | Secret for signing JWT tokens        | `mysupersecretkey123`            |
| `NODE_ENV`         | Environment mode                     | `development`                    |
| `GROQ_API_KEY`     | Groq API token                       | `gsk_xxxxxxxxxxxxx`              |
| `HF_TOKEN`         | HuggingFace API token (optional)     | `hf_xxxxxxxxxxxxx`               |
| `AI_PROVIDER`      | AI provider (`groq` or `huggingface`)| `groq`                           |
| `AI_MODEL`         | Model to use                         | `llama-3.1-8b-instant`           |
| `S3_ENDPOINT`      | MinIO S3 API endpoint                | `http://212.235.185.13:9000`     |
| `S3_ACCESS_KEY`    | MinIO access key                     | `user-14`                        |
| `S3_SECRET_KEY`    | MinIO secret key                     | `thestrongestvajePass14`         |
| `S3_BUCKET`        | MinIO bucket name                    | `user-14`                        |

## Deployment

### Docker Compose (Recommended)

Start all services with a single command:

```bash
docker compose up --build
```

This starts:
- PostgreSQL (port 5432)
- MongoDB (port 27017)
- Auth service (internal port 3001)
- Messaging service (internal port 3002)
- File service (internal port 3003)
- Chatbot service (internal port 3004)
- Frontend (internal port 80)
- Nginx gateway (exposed port 80)
- Prometheus (port 9090)
- Grafana (port 3000)
- Loki (port 3100)
- Promtail (internal)

**Access the application at: http://localhost**

Stop all services:
```bash
docker compose down
```

Stop and remove volumes (clears databases):
```bash
docker compose down -v
```

Rebuild a single service:
```bash
docker compose up --build <service-name>
```

### Local Development (without Docker)

#### Backend (legacy monolith mode)

```bash
# From project root
npm install
npm run server
```

The monolith backend runs on port 2100 (or `PORT` from `.env`).

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server runs on http://localhost:3000.

Set `VITE_API_BASE_URL=http://localhost:2100` in `frontend/.env` for local dev.

## Features

### User Authentication
- Account creation with username, password, and gender
- Auto-generated pixel-art avatar via DiceBear API
- JWT-based session management (stored in HTTP-only cookies)
- Protected routes (redirects unauthenticated users to login)

### Real-time Messaging
- 1-on-1 chat between registered users
- Real-time message delivery via Socket.io WebSockets
- Online presence indicator (green dot for online users)
- Conversation history persisted in MongoDB

### File Management
- PDF file upload stored in MinIO via S3 API
- File listing with metadata (name, size, date)
- File preview and download (streamed from MinIO)

### AI Chatbot Assistant
- Generates context-aware reply suggestions
- Reads conversation history to match tone and style
- Supports Groq (default, llama-3.1-8b) and HuggingFace providers
- Triggered by the sparkle icon in the message input

## Observability & Monitoring

### Architecture

All services emit structured JSON logs via Winston to stdout. The monitoring stack collects and visualizes this data:

```
Services (stdout JSON logs) → Docker → Promtail → Loki → Grafana
Services (/metrics endpoint) → Prometheus → Grafana
```

### Components

| Component | Role | Access |
|-----------|------|--------|
| **Winston** | Structured JSON logger in each service | — |
| **Promtail** | Scrapes Docker container logs via socket | Internal |
| **Loki** | Log aggregation and querying | http://localhost:3100 |
| **Prometheus** | Metrics collection (scrapes every 15s) | http://localhost:9090 |
| **Grafana** | Unified dashboard for logs + metrics | http://localhost:3000 |

### Grafana Access

- **URL:** http://localhost:3000
- **Default credentials:** admin / admin
- **Pre-built dashboard:** "Microservices Overview" (auto-provisioned)

### Dashboard Panels

1. **HTTP Request Rate** — requests/sec per service
2. **Request Duration p95** — 95th percentile latency per service
3. **Error Rate** — 5xx responses per service
4. **Memory Usage** — Node.js heap size per service
5. **HTTP Requests by Status Code** — breakdown across all services
6. **Service Logs** — live log stream from Loki

### Prometheus Metrics Exposed

Each service exposes `/metrics` internally with:
- `http_requests_total` — counter with labels: method, route, status_code, service
- `http_request_duration_seconds` — histogram with same labels
- Default Node.js metrics (heap, CPU, event loop, GC) prefixed by service name

### Log Format

All services output structured JSON:
```json
{"level":"info","message":"Request completed","method":"GET","url":"/api/users","status":200,"duration_ms":12,"service":"auth","timestamp":"2025-05-25T10:00:00.000Z"}
```

### Useful Queries

**Prometheus (http://localhost:9090):**
- `up` — check all services are reporting
- `rate(http_requests_total[5m])` — request rate
- `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` — p95 latency

**Loki (via Grafana Explore):**
- `{service="auth"}` — all auth service logs
- `{service="messaging"} |= "error"` — messaging errors
- `{service=~"auth|messaging|file|chatbot"} | json | level="error"` — all errors across services

### Configuration Files

```
monitoring/
├── prometheus/prometheus.yml          # Scrape targets
├── promtail/promtail-config.yml       # Docker log discovery
└── grafana/
    ├── provisioning/
    │   ├── datasources/datasources.yml  # Auto-configures Prometheus + Loki
    │   └── dashboards/dashboards.yml    # File-based dashboard provisioning
    └── dashboards/
        └── services-overview.json       # Pre-built dashboard
```

## Nginx Routing Table

| Path             | Proxied To        | Notes                    |
|------------------|-------------------|--------------------------|
| `/api/auth/*`    | auth:3001         | Authentication endpoints |
| `/api/users/*`   | auth:3001         | User listing             |
| `/api/messages/*`| messaging:3002    | Chat messages            |
| `/socket.io/*`   | messaging:3002    | WebSocket upgrade        |
| `/api/files/*`   | file:3003         | File upload/download     |
| `/chatbot`       | chatbot:3004      | AI suggestions           |
| `/*`             | frontend:80       | React SPA (catch-all)    |

## Database Schema

### PostgreSQL (Auth Service)

**Users table:**
| Column     | Type   | Constraints       |
|-----------|--------|-------------------|
| id        | UUID   | Primary key       |
| fullName  | STRING | Not null          |
| username  | STRING | Not null, unique  |
| password  | STRING | Not null (hashed) |
| gender    | STRING | Not null          |
| profilePic| STRING | Default ""        |
| createdAt | DATE   | Auto              |
| updatedAt | DATE   | Auto              |

### MongoDB (Messaging Service)

**Messages collection:**
```json
{
  "senderId": "string (UUID)",
  "receiverId": "string (UUID)",
  "message": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Conversations collection:**
```json
{
  "participants": ["UUID", "UUID"],
  "messages": ["ObjectId ref → Message"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### MongoDB (File Service)

**Files collection (metadata only):**
```json
{
  "filename": "string",
  "mimetype": "string (application/pdf)",
  "s3Key": "string (UUID-filename, references object in MinIO)",
  "uploadDate": "timestamp"
}
```

## Object Storage (MinIO / S3)

File binary data is stored in a MinIO instance using the S3-compatible API. MongoDB only stores metadata and the S3 object key.

### Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `S3_ENDPOINT` | MinIO S3 API endpoint | `http://212.235.185.13:9000` |
| `S3_ACCESS_KEY` | MinIO access key | `user-14` |
| `S3_SECRET_KEY` | MinIO secret key | `thestrongestvajePass14` |
| `S3_BUCKET` | Bucket name for file storage | `user-14` |
| `S3_REGION` | S3 region (required by SDK) | `us-east-1` |

### How it works

1. **Upload:** File is received by multer (in-memory) → uploaded to MinIO via `PutObjectCommand` → metadata + S3 key saved in MongoDB
2. **Retrieve:** Metadata fetched from MongoDB → file binary streamed from MinIO via `GetObjectCommand`
3. **Startup check:** The service verifies bucket access on startup and logs a warning if unavailable

### MinIO Web Console

- **URL:** http://212.235.185.13:9001
- **Credentials:** user-14 / thestrongestvajePass14
