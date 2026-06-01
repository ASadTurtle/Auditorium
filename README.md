# Auditorium - _by Ahmed El-Sayed_

## Project Overview

Auditorium is a service that allows multiple players to enjoy TTRPGs online through an immersive chat interface. Users can interact with NPCs and each other, facilitated by a hosting GameMaster in control of their NPCs on the other end of the chat.

## Features

- v0.1: **IN-DEVELOPMENT**
  - Websocket Manager
  - Session Manager
  - Player Hosting/Joining
  - Chat MVP implementation
- v0.2: _Coming Soon_
  - Chat MVP UI
  - Server host/join interface
  - Player/DM Roles
- v0.3: _Coming Soon_
  - Character Image integration
  - UI redesign
- v0.4: _Coming Soon_
  - Interface theme selection (sci-fi, gothic, fantasy, etc.)
- v0.5: _Coming Soon_
  - Character sheet modular integration

## Architecture

_Note information below is a placeholder and subject to change during development._

### React Client

- UI Components
- State Store
- Socket Client

`WebSocket + REST`

### Node Backend

- API Layer
- Socket Gateway
- Session Manager
- Game Engine
- Event Dispatcher
- Persistence Layer

### PostgreSQL DB

## Tech Stack

### Frontend

- React
- TypeScript
- Shadcn
- Vite
- Zustand

### Backend

- Node.js
- Express
- Socket.IO

### Database

- PostgreSQL
- Prisma

### DevOps

- Docker
- GitHub Actions

## Repository Structure

```text
apps/
  api/      Express and Socket.IO backend
  web/      React, TypeScript, Vite, Shadcn-ready frontend
packages/
  db/       Prisma schema and shared Prisma client
```

## Setup Instructions

### Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env
```

### Database

```bash
docker compose up -d
npm run db:generate
npm run db:migrate
```

### Development

```bash
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:4000
- API health check: http://localhost:4000/health
