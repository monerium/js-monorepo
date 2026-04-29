# Monerium Customer App

This is a [Next.js](https://nextjs.org) application serving as the reference implementation for integrating with the `@monerium/sdk` v4. It demonstrates the "bring your own infrastructure" pattern, emphasizing server-side token management, Next.js App Router, and Server Actions.

## Getting Started

First, run the development server:

    pnpm dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

## Integration Reference

This application demonstrates how to properly integrate the new `@monerium/sdk`:

- **Server-First Approach:** Leveraging Next.js Server Actions (`app/actions/monerium.ts`) for fetching data.
- **Secure Token Management:** Managing authentication state via secure HTTP-only cookies instead of client-side state.
- **Custom Hooks:** Creating simple wrappers to call server actions cleanly from client components.

## Deployment

This project is deployed on Netlify.

Live URL: [monerium.netlify.app](https://monerium.netlify.app)

Check out the [Netlify Next.js deployment documentation](https://docs.netlify.com/frameworks/next-js/overview/) for more details on hosting Next.js applications on Netlify.
