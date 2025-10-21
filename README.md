# Fastreado app development

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/221118025-6715s-projects/v0-fastreado-app-development)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/HB0BBsOqrJE)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/221118025-6715s-projects/v0-fastreado-app-development](https://vercel.com/221118025-6715s-projects/v0-fastreado-app-development)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/HB0BBsOqrJE](https://v0.app/chat/projects/HB0BBsOqrJE)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Local development - MongoDB auth

This project contains a minimal API route for login using MongoDB Atlas and JWT.

1. Create a MongoDB Atlas cluster and obtain the connection string.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`.
3. Install the runtime dependencies:

```bash
pnpm add mongodb bcryptjs jsonwebtoken
```

4. Start the dev server:

```bash
pnpm dev
```

The login endpoint is available at `POST /api/auth/login` and expects `{ email, password }`.
