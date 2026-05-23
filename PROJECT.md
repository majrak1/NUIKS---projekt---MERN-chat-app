# MERN Chat App — Technical Documentation

## Overview

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js), extended with PostgreSQL for user management and an AI chatbot powered by HuggingFace. The application follows a microservices architecture with 4 backend services, an Nginx API gateway, and a React frontend.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Nginx (port 80)                         │
│                      API Gateway                            │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│          │          │          │          │                 │
▼          ▼          ▼          ▼          ▼                 │
Auth     Messaging   File     Chatbot   Frontend              │
:3001    :3002       :3003    :3004     :80                   │
│          │          │          │                            │
▼          ▼          ▼          ▼                            │
PostgreSQL MongoDB   MongoDB  MongoDB + HuggingFace API       │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | React 19, Vite, TailwindCSS, DaisyUI, Zustand |
| Backend     | Node.js, Express 5                            |
| Databases   | PostgreSQL 16 (auth), MongoDB 7 (messages/files) |
| Real-time   | Socket.io                                     |
| AI          | HuggingFace Inference API (Phi-3-mini-4k-instruct) |
| Gateway     | Nginx                                         |
| Containers  | Docker, Docker Compose                        |

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
- PDF file upload (multer, in-memory storage)
- File listing and retrieval
- **Database:** MongoDB

### 4. Chatbot Service (port 3004)
- AI-powered message suggestions
- Reads conversation history for context
- Uses HuggingFace Inference API
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
│   │   ├── middleware/         # JWT protectRoute
│   │   ├── models/             # Sequelize User model
│   │   ├── db/                 # Sequelize connection
│   │   └── utils/              # JWT token generation
│   ├── messaging/
│   │   ├── Dockerfile
│   │   ├── server.js
│   │   ├── controllers/        # message controller
│   │   ├── routes/             # message routes
│   │   ├── middleware/         # JWT protectRoute
│   │   ├── models/             # Conversation, Message models
│   │   ├── db/                 # MongoDB connection
│   │   └── socket/             # Socket.io setup
│   ├── file/
│   │   ├── Dockerfile
│   │   ├── server.js
│   │   ├── controllers/        # file controller (multer)
│   │   ├── routes/             # file routes
│   │   ├── middleware/         # JWT protectRoute
│   │   ├── models/             # File model
│   │   └── db/                 # MongoDB connection
│   └── chatbot/
│       ├── Dockerfile
│       ├── server.js
│       ├── controllers/        # chatbot controller
│       ├── routes/             # chatbot routes
│       ├── middleware/         # JWT protectRoute
│       ├── models/             # Conversation, Message models
│       └── db/                 # MongoDB connection
├── .env.example
└── package.json                # Legacy monolith (kept for reference)
```

## Environment Setup

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- A HuggingFace API token (free tier works)
- A Grok API token (free tier works)

### Environment Variables

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Required variables:

| Variable            | Description                          | Example                          |
|--------------------|--------------------------------------|----------------------------------|
| `PORT`             | Running port                         | 2000                             |
| `MONGO_DB_URI`     | MongoDB connection string            | `mongodb://mongodb:27017/chatapp`|
| `JWT_SECRET`       | Secret for signing JWT tokens        | `mysupersecretkey123`            |
| `NODE_ENV`         | Environment mode                     | `development`                    |
| `GROQ_API_KEY`     | Grok API token                       | `gsk_xxxxxxxxxxxxx`              |
| `HF_TOKEN`         | HuggingFace API token                | `hf_xxxxxxxxxxxxx`               |
| `POSTGRES_DB`      | PostgreSQL database name             | `chatapp_auth`                   |
| `POSTGRES_USER`    | PostgreSQL username                  | `postgres`                       |
| `POSTGRES_PASSWORD`| PostgreSQL password                  | `postgres`                       |

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
- PDF file upload with drag-and-drop support
- File listing with metadata (name, size, date)
- File preview and download

### AI Chatbot Assistant
- Generates context-aware reply suggestions
- Reads conversation history to match tone and style
- Powered by Microsoft Phi-3-mini-4k-instruct via HuggingFace
- Triggered by the sparkle icon in the message input

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

**Files collection:**
```json
{
  "filename": "string",
  "mimetype": "string (application/pdf)",
  "data": "Buffer (binary)",
  "uploadDate": "timestamp"
}
```
