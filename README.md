# 🔍 Lost & Found — Campus Portal + Admin Panel

A campus lost-and-found system with a student-facing portal for reporting lost/found items and an admin panel for managing report resolution.

## ✨ Features

- **📝 Report lost or found items** — students submit reports with a type (`lost`/`found`), category, description, and image. Lost-item reports require an image; found-item reports auto-generate a handover note ("`<name>` submitted this item to the admin office").
- **🔢 Unique report codes** — auto-generated per year in the format `LST-2026-0001` (lost) / `FND-2026-0001` (found).
- **🗂️ Browse items** — public-style listing of all reports with pagination and filtering by `status` and `report_kind`.
- **🏷️ Category-based filtering** — 8 categories: electronics, documents, clothing, accessories, bags, books, keys, other.
- **🖼️ Image upload with fallback placeholders** — images uploaded via multipart form (JPEG/PNG/WEBP, max 5 MB, stored as UUID-named files). Reports without an image or with a broken image render a category icon placeholder ("No image available").
- **📋 My reports view** — students see only their own submissions.
- **🛡️ Admin dashboard** — report table with search (unique code / description / reporter name), tabs for All / Lost / Found / Pending / Resolved, pagination, and optimistic resolve actions.
- **✅ Report status management** — reports start as `pending` and can be marked `resolved` by an admin (records `resolved_at`).
- **👤 Student reporter identification** — admin table shows reporter name + roll number for every report.
- **🔐 Authentication & roles** — student signup/login and admin login via JWT (7-day expiry), with route-level guards for both student and admin areas.

## 📸 Screenshots

### Student Portal

| Student Login | Student Dashboard |
| ------------- | ----------------- |
| ![Student Login](assets/screenshots/Student_login.png) | ![Student Dashboard](assets/screenshots/Student_Dashboard.png) |

### Admin Panel

| Admin Login | Admin Dashboard |
| ----------- | --------------- |
| ![Admin Login](assets/screenshots/Admin_Login.png) | ![Admin Dashboard](assets/screenshots/Admin_Dashboard.png) |

## 🛠️ Tech Stack

| Layer     | Technology                                                                 |
| --------- | -------------------------------------------------------------------------- |
| Frontend  | React 19, Vite 8, React Router 7, Tailwind CSS 4, Axios, react-icons, jwt-decode, Oxlint (lint) |
| Backend   | Node.js / Express 5, MySQL 2 (mysql2), JWT (jsonwebtoken), bcrypt, Multer, dotenv, CORS |
| Database  | MySQL (schema in `backend/migrations/001_init.sql`)                        |

## 📁 Project Structure

```
lost_found/
├── backend/                 # Express API server
│   ├── server.js            # App entry — middleware, route mounting, static /uploads
│   ├── db.js                # MySQL connection pool
│   ├── .env.example         # Backend environment template
│   ├── routes/
│   │   ├── auth.js          # Signup / login
│   │   ├── reports.js       # Student report create / list / mine
│   │   └── adminReports.js  # Admin list + resolve
│   ├── middleware/
│   │   ├── auth.js          # JWT verification (Bearer token)
│   │   ├── requireAdmin.js  # Role check (admin only)
│   │   └── upload.js        # Multer image upload config
│   ├── migrations/
│   │   ├── 001_init.sql     # users + reports schema
│   │   └── seed_admins.js   # Seeds 2 default admin accounts
│   ├── utils/
│   │   └── jwt.js           # Token signing (7d expiry)
│   └── uploads/             # Uploaded images (gitignored)
└── frontend/                # React + Vite single-page app
    ├── vite.config.js       # Vite + React + Tailwind plugins
    ├── .env.example         # Frontend environment template
    └── src/
        ├── App.jsx          # Routes (student + admin, protected)
        ├── main.jsx         # React entry
        ├── pages/
        │   ├── student/     # Login, Signup, Dashboard, BrowseItems, MyReports
        │   └── admin/       # AdminLogin, AdminDashboard
        ├── components/
        │   ├── student/     # BrowseCard, ReportItemForm, Sidebar/Topbar, etc.
        │   ├── admin/       # ReportsTable, FilterTabs, ResolveDialog, Toast, etc.
        │   ├── common/      # ItemImage (fallback placeholders), UserMenu
        │   ├── layouts/     # StudentLayout
        │   └── ui/          # Reusable UI primitives
        ├── context/AuthContext.jsx  # Auth state + token persistence (localStorage)
        ├── services/reportService.js # Axios API calls
        ├── lib/api.js       # Axios instance + auth interceptor
        ├── hooks/           # usePublicReports, useMyReports, useAdminReports
        └── constants/reportCategories.js
```

## 🚀 Setup

### Prerequisites

- Node.js (tested with Vite 8 / Express 5)
- MySQL server

### Backend

```bash
cd backend
npm install
cp .env.example .env     # then fill in real values
```

Required environment variables (`backend/.env`):

| Variable      | Purpose                            |
| ------------- | ---------------------------------- |
| `PORT`        | Backend API port (default 3000)    |
| `DB_HOST`     | MySQL host                         |
| `DB_USER`     | MySQL user                         |
| `DB_PASSWORD` | MySQL password                     |
| `DB_NAME`     | Database name                      |
| `DB_PORT`     | MySQL port                         |
| `JWT_SECRET`  | Secret for signing JWT tokens      |

Initialize the database and run:

```bash
mysql -u <user> -p <db_name> < migrations/001_init.sql
node migrations/seed_admins.js   # optional: creates 2 default admin accounts
npm start                        # starts server on PORT
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env     # then set the API URL
```

Required environment variables (`frontend/.env`):

| Variable       | Purpose                                  |
| -------------- | ---------------------------------------- |
| `VITE_API_URL` | Base URL of the backend API (no trailing slash), e.g. `http://localhost:5000` |

Run:

```bash
npm run dev        # starts Vite dev server
npm run build      # production build
npm run lint       # oxlint
```

## 🌐 API Overview

All endpoints return JSON. Report routes require a `Bearer` JWT; admin routes additionally require the `admin` role.

| Method | Endpoint                              | Auth  | Description                                 |
| ------ | ------------------------------------- | ----- | ------------------------------------------- |
| POST   | `/api/auth/signup`                    | —     | Create student account (name, roll_no, email, password) |
| POST   | `/api/auth/login`                     | —     | Login with email + password, returns JWT    |
| GET    | `/api/health`                         | —     | DB connectivity check                       |
| POST   | `/api/reports`                        | JWT   | Create report (multipart, image field `image`) |
| GET    | `/api/reports`                        | JWT   | List reports — `status`, `report_kind`, `limit`, `offset` |
| GET    | `/api/reports/mine`                   | JWT   | Reports created by the current student      |
| GET    | `/api/admin/reports`                  | JWT+admin | List all reports — `status`, `report_kind`, `search`, `limit`, `offset` |
| PATCH  | `/api/admin/reports/:id/resolve`      | JWT+admin | Mark a report as `resolved`                 |

## ⚠️ Known Limitations / Notes

- **Local image storage** — uploaded images are stored on disk in `backend/uploads/` and served statically at `/uploads`. They are not pushed to any cloud/object storage; the folder is gitignored, so backups/deploys must handle it separately.
- **Auth token in localStorage** — JWT is persisted in `localStorage` and attached by an axios interceptor. No refresh-token mechanism.
- **No password reset** — signup/login only; no email verification or password recovery flow.
- **CORS whitelist** — hardcoded to `http://localhost:5173` and `http://localhost:5174` in `server.js`; add your own origins for other environments.
- **Default admin seeding** — `seed_admins.js` ships with default credentials (`admin1@campus.edu` / `admin2@campus.edu`, password `Admin@123`). **Change these before any real deployment.**
- **No automated tests** — the backend `npm test` is a placeholder; the frontend has no test runner configured.

## 🔜 TODO

- Deployment steps (no Docker/deploy config present).
- Cloud storage for images.
- Email/password reset flows.
- Automated test suites.

## 📄 License

TODO — MIT (to be confirmed).
