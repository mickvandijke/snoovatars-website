## Setup

1. Clone the project.
2. Create a `.env` file with the following contents:
```env
SITE_URL: http://localhost:3001
API_BASE_URL: https://api.snoovatars.com
POLYGON_RPC_URL: https://polygon-rpc.com
```
3. Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.
