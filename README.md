# Auditorium — _by Ahmed El-Sayed_
## Project Overview
Auditorium is a service that allows multiple players to enjoy TTRPG's online through an immersive chat interface. Users can interact with NPC's and eachother, facilitated by a hosting 'GameMaster' in control of their NPC's on the other end of the chat.

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
_Note information below is a placeholder and subject to change during development_
### React Client
- UI Components
- State Store
- Socket Client

--(WebSocket + REST)-->
### Node Backend
- API Layer
- Socket Gateway
- Session Manager
- Game Engine
- Event Dispatcher
- Persistence Layer

--->
### PostgreSQL DB

## Tech Stack
### Frontend
- React
- Typescript
- Shadcn
- Vite
- Zustan

### Backend
- Node.js
- Express
- Socket.IO

### Database
- PostgreSQL
- Prisma

### Devops
- Docker
- Github Actions

## Setup Instructions
_TODO_
