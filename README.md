# CareFlow – Clinic Appointments (Rails + React TS)

This project is a small clinic scheduling system with a Rails API and a React (TypeScript) frontend. It manages clients and their appointments, supports external syncing, and provides a polished clinic-themed UI with accessibility and usability improvements.

## Tech Stack

- Backend: Ruby on Rails 7.1 (API-only), PostgreSQL, Redis + Sidekiq, Puma
- Frontend: React 18 + TypeScript, Tailwind CSS, Axios, React Router

---

## Getting Started

### Prerequisites

- Ruby 3.2.3
- Node.js >= 16 and npm (or yarn)
- PostgreSQL
- Redis (for Sidekiq jobs)

### Backend (API)

1. Install dependencies

```sh
cd ruh-backend
gem install bundler
bundle install
```

2. Configure DB and run migrations

```sh
bin/rails db:prepare
```

3. Seed sample data (clients and appointments)

```sh
bin/rails db:seed
```

4. Start the API

```sh
bin/rails server   # http://localhost:3000
```

5. (Optional) Start background jobs

```sh
bundle exec sidekiq   # requires Redis (redis://localhost:6379)
```

### Frontend (React + TypeScript)

1. Install dependencies

```sh
cd ruh-frontend
npm install
```

2. Configure API base URL
   Create `ruh-frontend/.env` (dev example):

```
REACT_APP_API_BASE=http://localhost:3000/api
```

3. Start the app

```sh
npm start   # http://localhost:3000 (or prompts for 3001)
```

---

## Seed Data

The seed file (`ruh-backend/db/seeds.rb`) creates example clients and appointments so you can explore the UI immediately. Rerun seeds anytime after `db:reset`.

---

## Features Implemented

- Clients and Appointments CRUD (API on Rails, UI on React TS)
- Date & Time picker with clinic theme
  - Past dates disabled
  - Booked time slots disabled on the selected day
  - Server-side uniqueness validation ensures no double booking
- External sync service integration scaffold (with mock API)
- Pagination
  - Backend: simple pagination helpers and `{ data, meta }` envelope
  - Frontend: 10 per page for clients and appointments with controls
- Robust error handling and UX
  - Rails: structured `400/404/422` responses
  - Frontend: Axios instance + interceptors, toasts for user-friendly messages
- Polished UI/UX
  - Tailwind-based design, skeleton loaders, accessible modals and forms

---

## API Overview (dev)

- `GET /api/clients` – paginated list
- `GET /api/appointments` – paginated list (includes client info)
- `POST /api/appointments` – create (validates `scheduled_at` uniqueness)
- `PATCH /api/appointments/:id` – update
- `DELETE /api/appointments/:id` – cancel

Pagination params: `?page=1&per_page=10`. Responses are wrapped as `{ data: [...], meta: { page, per_page, total } }`.

---

## Environment Variables

- Frontend: `REACT_APP_API_BASE` – base URL for the Rails API (e.g., `http://localhost:3000/api`).
- Backend: standard Rails DB/Redis settings via environment or `config/database.yml`.

---

## Scripts

- Backend: `bin/rails db:prepare`, `bin/rails db:seed`, `bin/rails s`
- Frontend: `npm start`, `npm run build`

---

## License

MIT
