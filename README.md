# StixShop — Equipment Rental Catalog

A full-stack equipment rental catalog application with a psychedelic-modern aesthetic, built with **Angular 18+** and **NestJS**.

---

## Tech Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Frontend  | Angular 18+ (Signals, standalone)     |
| Backend   | NestJS (Node.js)                      |
| ORM       | Prisma                                |
| Database  | PostgreSQL (Supabase)                 |
| Storage   | Supabase Storage (product images)     |
| Styling   | SCSS (Glassmorphism, gradients)       |
| Auth      | JWT (single-admin, env-variable based)|

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- A Supabase project (for PostgreSQL and Storage)

### 1. Clone & Install

```bash
git clone <repo-url>
cd stix-shop

# Backend
cd backend
npm install
cp .env.example .env   # Fill in your Supabase credentials

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env` with your Supabase credentials:

```env
DATABASE_URL="postgresql://postgres:PASSWORD@db.XXXXX.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:PASSWORD@db.XXXXX.supabase.co:5432/postgres"
JWT_SECRET="a-long-random-secret"
ADMIN_PASSWORD_HASH="<output from hash-password.js>"
SUPABASE_URL="https://XXXXX.supabase.co"
SUPABASE_KEY="your-anon-key"
```

### 3. Generate Admin Password Hash

```bash
# From the project root (uses the backend's bcrypt)
cd backend && node ../hash-password.js your-admin-password
```

Copy the output hash into `ADMIN_PASSWORD_HASH` in `.env`.

### 4. Generate JWT_SECRET

```bash
# Generate a cryptographically random 48-byte hex string — long enough to be secure.
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copy the output hash into `ADMIN_PASSWORD_HASH` in `.env`.

### 5. Run Prisma Migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Create Supabase Storage Bucket

In your Supabase dashboard, create a **public** storage bucket named `product-images`.

### 6. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run start:dev

# Terminal 2 — Frontend
cd frontend
npx ng serve --proxy-config proxy.conf.json
```

The frontend runs at `http://localhost:4200` and proxies `/api` requests to the backend on port `3000`.

---

## Admin Access

There is no visible login page. To access admin mode:

1. Scroll to the **footer** and click the faint `◈` icon.
2. Enter the admin password in the modal.
3. Once authenticated, you can add/edit/delete products, toggle visibility, and manage categories.
4. Click **"Logout Admin"** in the footer to exit admin mode.

---

## Deployment on Render

### Backend (Web Service)

1. **Build Command:** `cd backend && npm install && npx prisma generate && npm run build`
2. **Start Command:** `cd backend && npm run start:prod`
3. **Environment Variables:**
   - `DATABASE_URL` — Supabase pooled connection string
   - `DIRECT_URL` — Supabase direct connection string
   - `JWT_SECRET` — A strong random secret
   - `ADMIN_PASSWORD_HASH` — Generated with `hash-password.js`
   - `SUPABASE_URL` — Your Supabase project URL
   - `SUPABASE_KEY` — Your Supabase anon key
   - `CORS_ORIGIN` — Your frontend Render URL (e.g., `https://stixshop.onrender.com`)

### Frontend (Static Site)

1. **Build Command:** `cd frontend && npm install && npx ng build --configuration production`
2. **Publish Directory:** `frontend/dist/frontend/browser`
3. **Rewrite Rules:** Add a rewrite rule `/* → /index.html` (status 200) for Angular routing.
4. Update `frontend/src/environments/environment.prod.ts` with the backend Render URL.

---

## Project Structure

```
stix-shop/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── auth/          # JWT auth (login, guard, strategy)
│   │   ├── categories/    # Category CRUD
│   │   ├── products/      # Product CRUD with filtering
│   │   ├── upload/        # Image upload via Supabase Storage
│   │   ├── prisma/        # Prisma service
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # catalog, product-details, product-form, admin-modal, header, footer
│   │   │   ├── services/   # auth, product, category, upload
│   │   │   ├── interceptors/
│   │   │   └── models/
│   │   ├── environments/
│   │   └── styles.scss
│   └── proxy.conf.json
├── hash-password.js
├── .gitignore
└── README.md
```

---

## License

Private project.
