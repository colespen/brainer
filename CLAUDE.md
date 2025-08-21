 # CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Brainer" - a memory game built to help improve focus, retention of geometric configurations, and visual memory recall. The project consists of a React TypeScript frontend and an Express TypeScript backend with PostgreSQL database for storing high scores.

**Live URL:** https://brainer-client.vercel.app/

## Architecture

### Frontend (`/client`)
- **Tech Stack:** React 19 + TypeScript + Vite + Redux Toolkit + React Three Fiber
- **State Management:** Redux with two main slices:
  - `gameBoardSlice`: Core game state (grid size, flipped cards, rounds, scores, settings)
  - `roundDataSlice`: Round-specific data and statistics
- **Key Components:**
  - `GameMain`: Main container component orchestrating the game
  - `GameBoard3D`: Renders 3D memory cube grid using React Three Fiber
  - `GameCard3D`: Individual 3D cube components with hover animations
  - `DashboardTop`/`DashboardSide`: Game stats and controls
  - `Settings`: Game configuration (grid size, rounds)
- **Custom Hooks:** Extensive use of custom hooks for game logic (`useBoardUpdate`, `useGenerateCardData`, `usePostGameResult`, etc.)

### Backend (`/server`)
- **Tech Stack:** Express + TypeScript + PostgreSQL + CORS
- **Database:** PostgreSQL with connection pooling
- **API Endpoints:**
  - `GET /api/highscores`: Fetch high scores
  - `POST /api/gameresults`: Submit game results
- **Database Setup:** Auto-creates tables on startup via `createTables()`

## Development Commands

### Client Development
```bash
cd client
npm install
npm run dev          # Start dev server
npm run build        # Build for production (runs tsc + vite build)
npm run lint         # ESLint check
npm run preview      # Preview production build
```

### Server Development
```bash
cd server
npm install
npm run dev          # Start with nodemon + ts-node
npm run build        # Install deps + compile TypeScript + copy SQL files
npm run start        # Build and run production
npm run prod         # Run pre-built production bundle
```

## Key Development Notes

- **Monorepo Structure:** Client and server are separate packages with their own `package.json` files
- **3D Graphics:** Professional React Three Fiber rendering with preserved color scheme:
  - Face colors: `#000128` (default), `#0006ea` (target), `#d5007d` (wrong/missed), `#00e9ff` (win)
  - Border effects: Post-processing outline system with `#585aa9` (default), `#9294ff` (hover)
  - Interactive states: hover scaling (1.08x), emissive lighting on hover, subtle mouse-following camera movement
  - Professional rendering: No tone mapping (preserves colors), SRGB color space, PCF soft shadows
  - Anti-aliasing: SMAA post-processing + 4x multisampling, eliminates line aliasing completely
  - Post-processing: Professional outline effects using @react-three/postprocessing with SMAA
  - Lighting: minimal ambient + directional lighting optimized for memory game visibility
  - Materials: PBR with low roughness/metalness, subtle environment reflections
  - Cubes: proper 0.9x0.9x0.9 dimensions with shader-based outline system
- **State Management:** Game logic heavily relies on Redux state transitions - understand the slice actions before modifying game behavior
- **Database:** Server expects PostgreSQL connection details via environment variables
- **CORS:** Server configured for specific client origin via `HOST_CLIENT` env var
- **Build Process:** Client uses Vite bundler; server compiles TypeScript and copies SQL seed files to build directory
- **Dev Tools:** Server uses nodemon for hot reload, client uses Vite's fast HMR

## Testing

Currently no test suite is implemented despite Jest being mentioned in the README. The `npm run test` commands are placeholder.