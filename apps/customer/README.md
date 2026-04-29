# Monerium Customer App

This is a [Next.js](https://nextjs.org) application serving as the reference implementation for integrating with the `@monerium/sdk` v4. It demonstrates the "bring your own infrastructure" pattern, emphasizing server-side token management, Next.js App Router, and Server Actions.

## Getting Started

1. Copy the environment variables template and fill in your credentials:

   ```bash
   cp .env.example .env.local
   ```

   _You can get a Client ID by creating an OAuth application at [sandbox.monerium.dev](https://sandbox.monerium.dev)._

2. Run the development server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:5001](http://localhost:5001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Integration Reference

This application demonstrates how to properly integrate the new `@monerium/sdk`. If you are a developer looking to integrate the SDK into your own application, these are the most important files to review:

- 🏗️ **`lib/sdk.ts`**: Shows how to initialize `MoneriumOAuthClient` securely on the server, passing a callback to read the `access_token` from an HTTP-only cookie.
- 🔐 **`app/actions/auth.ts`**: Contains Next.js Server Actions that demonstrate the PKCE OAuth flow (and SIWE flow), exchanging codes for tokens, and securely storing the bearer profile in an HTTP-only Next.js cookie.
- ⚡ **`app/actions/monerium.ts`**: Contains Next.js Server Actions that demonstrate how to use the server-side SDK client to fetch data (profiles, balances, orders) and handle API errors cleanly so secrets are never exposed to the browser.
- 🪝 **`hooks/monerium.ts`**: Demonstrates how to bridge the Server Actions to your Client Components using React Query (`@tanstack/react-query`) for smooth caching and loading states.

## Deployment

This project is deployed on Netlify.

Live URL: [monerium.netlify.app](https://monerium.netlify.app)

Check out the [Netlify Next.js deployment documentation](https://docs.netlify.com/frameworks/next-js/overview/) for more details on hosting Next.js applications on Netlify.
