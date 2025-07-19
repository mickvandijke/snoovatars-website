# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 3 application for RCAX (Reddit Collectible Avatars Exchange) - a marketplace for Reddit Collectible Avatars. The project includes both web and mobile (iOS/Android) versions using Capacitor.

**Tech Stack:**
- Nuxt 3 (Vue.js SSR framework)
- TypeScript
- Tailwind CSS
- Capacitor (for mobile apps)
- Firebase (authentication/notifications)
- Ethereum/Web3 integration (ethers.js)
- Chart.js for data visualization

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on localhost:3001)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate

# Prepare Nuxt (runs automatically after install)
npm run postinstall
```

## Environment Setup

Create a `.env` file with:
```env
SITE_URL=http://localhost:3001
API_BASE_URL=https://api.snoovatars.com
POLYGON_RPC_URL=https://polygon-rpc.com
```

## Architecture

### Core Structure
- **SPA Mode**: `ssr: false` - Single Page Application
- **Mobile Support**: Capacitor integration for iOS/Android with native features
- **State Management**: Vue 3 Composition API with `useState` composables
- **Styling**: Tailwind CSS with custom dark theme colors

### Key Directories

**`/composables/`** - Vue composables for shared logic:
- `api/` - API client functions for backend integration
- `states.ts` - Global state management with reactive stores
- `ethereum.ts` - Web3/blockchain interaction utilities
- `helpers.ts` - General utility functions

**`/global/`** - Shared utilities and constants:
- `constants.ts` - Application constants
- `utils.ts` - Pure utility functions
- `marketplace.ts` - Marketplace configuration
- `generations.ts` - Reddit avatar generation data

**`/types/`** - TypeScript type definitions for all data models

**`/components/`** - Vue components organized by feature:
- `banners/` - Advertisement and promotional banners
- `pages/` - Page-specific components
- `icons/` - Icon components

**`/pages/`** - File-based routing with dynamic routes:
- `avatar/[[user]].vue` - Dynamic user avatar pages
- `stats/[[watchlist]].vue` - Statistics pages
- `verify/email/[code].vue` - Email verification

### State Management Pattern

Uses Vue 3 `useState` composables for global state:
- `useUser()` - Current user data
- `useToken()` - Authentication token
- `useCollections()` - NFT collection data
- `useSettings()` - User preferences
- `useAvatarList()` - Cached avatar data

### API Integration

All API calls go through composables in `/composables/api/` with consistent error handling and type safety. Base URL configured via runtime config.

### Mobile App Features

- Push notifications (FCM)
- Local notifications
- Native platform detection
- iOS/Android specific styling and behavior
- Capacitor plugins for native functionality

### Styling Conventions

- Dark theme with custom color palette
- Responsive design with mobile-first approach
- Tailwind utility classes with custom extensions
- Safe area handling for mobile devices