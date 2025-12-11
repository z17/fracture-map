# Injury Map

[![Build](https://github.com/z17/fracture-map/actions/workflows/build.yml/badge.svg)](https://github.com/z17/fracture-map/actions/workflows/build.yml)

Mark your injuries on an interactive skeleton and share with friends.

🔗 **[injury-map.fun](https://injury-map.fun/)**

## Requirements

- Node.js 22+
- MongoDB

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
```

## Development

```bash
# Terminal 1: Frontend (Vite)
npm run dev

# Terminal 2: Backend (Express)
npm run dev:server
```

Frontend: http://localhost:5173  
API: http://localhost:3001

## Production

```bash
npm run build
npm start
```

App runs on http://localhost:3001
