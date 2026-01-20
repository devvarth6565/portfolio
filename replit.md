# replit.md

## Overview

This is a Windows XP-themed portfolio application that simulates a classic desktop environment. The project recreates the iconic "Luna" visual style from Windows XP Service Pack 3, featuring draggable windows, a taskbar with start button, desktop icons, and a media player component. Users can interact with desktop icons to open windows displaying project information and video content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled using Vite
- **Styling**: Tailwind CSS with custom Windows XP "Luna" theme variables defined in CSS
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: React useState hooks for window management, TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for window transitions
- **Drag Functionality**: react-draggable for window movement

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ESM modules
- **API Pattern**: REST endpoints defined in `shared/routes.ts` with Zod validation
- **Development**: Vite dev server with HMR proxied through Express

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines the `projects` table
- **Migrations**: Drizzle Kit with `db:push` command for schema sync

### Project Structure
```
client/           # React frontend
  src/
    components/   # React components (XPWindow, Taskbar, MediaPlayer, etc.)
    components/ui/# shadcn/ui components
    pages/        # Route pages (Home, not-found)
    hooks/        # Custom React hooks
    lib/          # Utility functions and query client
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database operations
  db.ts           # Database connection
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema
  routes.ts       # API route definitions with Zod schemas
```

### Key Design Decisions
1. **Monorepo Structure**: Client and server share TypeScript types through the `shared/` directory, ensuring type safety across the stack
2. **Window Management**: Custom hook pattern manages multiple draggable windows with z-index layering and minimize/maximize states
3. **Skeuomorphic Design**: CSS variables and gradients replicate authentic Windows XP Luna theme aesthetics
4. **Asset Integration**: Static assets (wallpaper.jpg, startup.mp3, resume.pdf) served from the public folder

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **react-draggable**: Window drag-and-drop functionality
- **framer-motion**: Animation library for transitions
- **date-fns**: Date formatting utilities
- **Radix UI**: Accessible primitive components (dialog, dropdown, tabs, etc.)

### Build Tools
- **Vite**: Frontend bundler with React plugin
- **esbuild**: Server bundling for production
- **TypeScript**: Type checking across the entire codebase

### Replit Integrations
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- **connect-pg-simple**: PostgreSQL session storage (available but may not be active)