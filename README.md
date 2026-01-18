# ClaimPoint — Smart Lost & Found Management System

[➡️ Project Overview & System Workflow (Full Details)](./README_PROJECT_OVERVIEW.md)

ClaimPoint is a full-stack lost & found system with **role-based dashboards** (Admin / Staff / User) and **local AI-powered claim verification**. Staff can post found items (with hidden verification details), users can submit claims, and the backend assigns a **match percentage** using a local embedding model.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js (ESM) + Express 5
- **DB:** PostgreSQL + Drizzle ORM
- **Auth:** JWT stored in **HTTP-only cookie** (`token`)
- **AI Matching:** `@huggingface/transformers` (local embeddings + cosine similarity)
- **Email:** Nodemailer (OTP verification + claim status updates)
- **Images:** Cloudinary

## What This Repo Contains

- Users can register and verify email via OTP
- Users can create lost reports
- Staff can create and manage found items (public + hidden details)
- Users can claim found items; backend computes and stores a local AI match score
- Staff can approve/reject/collect claims; users get email status updates
- Admin can manage staff accounts and activate/deactivate users

## Project Structure (Matches Repo)

```
claimpoint-smart-lost-found/
├── CONTRIBUTING.md
├── LICENSE
├── package.json
├── README.md
├── client/
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       ├── components/
│       │   ├── ClaimDetailsModal.jsx
│       │   ├── Footer.jsx
│       │   ├── ItemCard.jsx
│       │   ├── itemDetailsModal.jsx
│       │   ├── LostReportDetailsModal.jsx
│       │   ├── Navbar.jsx
│       │   ├── StaffClaimDetailsModal.jsx
│       │   ├── StaffLostReportDetailsModal.jsx
│       │   └── modal/
│       │       ├── LoginModal.jsx
│       │       └── RegisterModal.jsx
│       ├── context/
│       │   └── auth.context.jsx
│       ├── lib/
│       │   └── api.js
│       ├── pages/
│       │   ├── AboutPage.jsx
│       │   ├── AddFoundItemPage.jsx
│       │   ├── AddLostItemReportPage.jsx
│       │   ├── AddStaffPage.jsx
│       │   ├── BrowseFoundItems.jsx
│       │   ├── ChangePasswordPage.jsx
│       │   ├── ClaimDetailsPage.jsx
│       │   ├── ClaimItemPage.jsx
│       │   ├── ContactPage.jsx
│       │   ├── HomePage.jsx
│       │   ├── HowItWorks.jsx
│       │   ├── index.js
│       │   ├── LoginPage.jsx
│       │   ├── ManageClaimsPage.jsx
│       │   ├── ManageItemsPage.jsx
│       │   ├── ManageLostReportsPage.jsx
│       │   ├── ManageStaffsPage.jsx
│       │   ├── ManageUsersPage.jsx
│       │   ├── MyDashboardPage.jsx
│       │   ├── MyProfilePage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── UpdateItemPage.jsx
│       │   ├── UpdateProfilePage.jsx
│       │   ├── UpdateReportPage.jsx
│       │   ├── UpdateStaffPage.jsx
│       │   └── VerificationPage.jsx
│       └── services/
│           └── api.js
└── server/
    ├── docker-compose.yml
    ├── drizzle.config.js
    ├── index.js
    ├── package.json
    ├── config/
    │   └── cloudinary.js
    ├── scripts/
    │   └── seed-admin.js
    ├── services/
    │   ├── email.js
    │   └── localMatcher.js
    └── src/
        ├── index.js
        ├── controllers/
        │   ├── admin.controller.js
        │   ├── auth.controller.js
        │   ├── item.controller.js
        │   ├── staff.controller.js
        │   └── user.controller.js
        ├── middlewares/
        │   ├── auth.middleware.js
        │   ├── optionalAuth.middleware.js
        │   └── roleAuth.middleware.js
        ├── models/
        │   ├── index.js
        │   ├── item.model.js
        │   └── user.model.js
        ├── routes/
        │   ├── admin.routes.js
        │   ├── auth.routes.js
        │   ├── item.routes.js
        │   ├── staff.routes.js
        │   └── user.routes.js
        └── utils/
            ├── cron.js
            └── emailTemplates.js
```

## Quick Start (Dev)

### Prerequisites

- Node.js 18+
- Docker + Docker Compose (recommended)
- PostgreSQL 14+ (15 recommended) if you don’t use Docker

### 1) Install dependencies

```bash
git clone https://github.com/YeaishTurj/claimpoint-smart-lost-found
cd claimpoint-smart-lost-found
npm run setup
```

If you want a single command that also starts Postgres (Docker), creates tables, seeds admin, and starts dev servers, jump to **One Command (Docker)** below.

### 2) Environment variables

#### Server env

```bash
cp server/.env.example server/.env
```

Server uses these env vars (see `server/.env.example`):

- `NODE_ENV` (development/production)
- `PORT` (default 5000)
- `DATABASE_URL` (PostgreSQL connection string)
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT` (used by `server/docker-compose.yml` if you run Postgres via Docker)
- `JWT_SECRET` (signing secret)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FULLNAME`, `ADMIN_PHONE` (used by seed)
- `STAFF_DEFAULT_PASSWORD` (default password for newly created staff)

#### Client env

```bash
cp client/.env.example client/.env
```

Client env vars (see `client/.env.example`):

- `VITE_API_BASE_URL` (default `http://localhost:5000`)
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

### 3) Database setup

Run PostgreSQL locally or via Docker.

Option A — quick Docker container:

```bash
docker run --name claimpoint-postgres \
  -e POSTGRES_DB=claimpoint_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=something_secure \
  -p 5432:5432 \
  -d postgres:15
```

Option B — using the included Compose file:

- `server/docker-compose.yml` expects `DB_NAME`, `DB_USER`, `DB_PASSWORD` (and optional `DB_PORT`).
- Put them in `server/.env` (recommended) or export them in your shell.

```bash
cd server
docker compose up -d
```

Then apply schema + seed admin:

```bash
cd server
npm run db:push
npm run seed
```

### One Command (Docker)

After you create `server/.env` and `client/.env`, you can run:

```bash
npm run bootstrap:docker
```

This will install dependencies, start Postgres via Docker Compose, run `db:push`, run the seed script, and then start the dev servers.

### Running on a fresh PC (Docker) — step by step

1. Install (one time): Git + Node.js 18+ + Docker + Docker Compose

2. Clone:

```bash
git clone https://github.com/YeaishTurj/claimpoint-smart-lost-found
cd claimpoint-smart-lost-found
```

3. Put your original env files in place:

- Place your client env as `client/.env` (if you have `client.env`, rename it to `.env`)
- Place your server env as `server/.env` (if you have `server.env`, rename it to `.env`)

4. Run the project:

```bash
npm run bootstrap:docker
```

5. Open:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

If Docker fails with a permissions error, fix Docker permissions (recommended) instead of running npm with sudo.

### 4) Start the app

From repo root:

```bash
npm run dev
```

URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Default Admin + Staff Password

- Admin is created by the seed script using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `server/.env`.
- New staff accounts created by Admin use `STAFF_DEFAULT_PASSWORD` from `server/.env`.

## Authentication Notes (Important)

- Backend stores the JWT in an **HTTP-only cookie** named `token`.
- Frontend API calls must send cookies (`withCredentials: true`).
- CORS is configured in the server for `http://localhost:5173` (update `server/index.js` for production).

## API Routes (Actual)

Base URL: `http://localhost:5000/api`

### Auth — `/auth`

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout` (requires cookie auth)
- `GET /api/auth/verify-email?code=XXXXXX&email=user@example.com`
- `GET /api/auth/resend-verification-code?email=user@example.com`
- `GET /api/auth/profile` (requires cookie auth)
- `PATCH /api/auth/profile` (requires cookie auth)
- `PUT /api/auth/change-password` (requires cookie auth)

### Public/Optional Auth — `/items`

- `GET /api/items/found-items` (public; staff/admin see full rows, public sees only safe columns)
- `GET /api/items/found-items/:id`

### User (USER role) — `/user`

- `POST /api/user/lost-reports`
- `GET /api/user/lost-reports`
- `GET /api/user/lost-reports/:id`
- `PATCH /api/user/lost-reports/:id`
- `DELETE /api/user/lost-reports/:id`
- `POST /api/user/claims/:id` (submit a claim for found item `:id`)
- `GET /api/user/claims`
- `GET /api/user/claims/:id`
- `DELETE /api/user/claims/:id`

### Staff (STAFF role) — `/staff`

- `POST /api/staff/found-items`
- `PATCH /api/staff/found-items/:itemId`
- `DELETE /api/staff/found-items/:itemId`
- `GET /api/staff/claims`
- `GET /api/staff/claims/:claimId`
- `PATCH /api/staff/claims/:claimId` (update claim status; sends email)
- `GET /api/staff/lost-reports`
- `GET /api/staff/lost-reports/:reportId`

### Admin (ADMIN role) — `/admin`

- `POST /api/admin/staffs`
- `PATCH /api/admin/staffs/:staffId`
- `GET /api/admin/staffs`
- `GET /api/admin/staffs/:staffId`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:userId/deactivate`
- `PATCH /api/admin/users/:userId/activate`

## Local AI Matching (How It Works)

Claim verification is done locally during claim submission:

- When a user calls `POST /api/user/claims/:id`, the backend loads the found item’s `hidden_details` from DB.
- The matcher (`server/services/localMatcher.js`) embeds both texts using:
  - task: `feature-extraction`
  - model: `Xenova/all-MiniLM-L6-v2`
- It computes cosine similarity and stores the result as `match_percentage` on the claim.

This is **local inference** (no external API calls).

## Background Jobs

- A cron job runs hourly to remove expired pending registrations from `usersPendingTable` (older than 24 hours).

## Development Commands (Actual)

```bash
# Root
npm run setup          # install root + server + client deps
npm run dev            # start server + client (concurrently)
npm run dev:server     # start only backend
npm run dev:client     # start only frontend

# Server
cd server
npm run dev            # nodemon index.js
npm run db:push        # drizzle-kit push
npm run db:studio      # drizzle-kit studio
npm run seed           # seed admin user

# Client
cd client
npm run dev
npm run build
npm run lint
npm run preview
```

## License

MIT — see [LICENSE](LICENSE).
