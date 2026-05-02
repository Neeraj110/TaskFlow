# Project Management App (Next.js + MongoDB)

This repository contains a Next.js (App Router) + TypeScript backend and starter scaffolding for a Project Management app with JWT authentication, RBAC, Mongoose models, and API routes.

Core features implemented in this scaffold:

- MongoDB connection helper
- Mongoose models: User, Project, ProjectMember, Task
- Auth API: signup, login, logout, me (JWT in httpOnly cookie)
- Projects and Tasks API with RBAC enforcement
- Zod validation for auth inputs
- Seed script to populate demo data

Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
npm install
# or yarn
```

3. Run seed script to create demo data:

```bash
node -r ts-node/register scripts/seed.ts
```

Notes

- This is the backend scaffold and core API surface. Frontend pages, shadcn UI, Redux store, and Tailwind layout will be added next.
- Use `MONGODB_URI` pointing to MongoDB Atlas for production.
- For Railway deployment, set environment variables `MONGODB_URI` and `JWT_SECRET` in the Railway project.
