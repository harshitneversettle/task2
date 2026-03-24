### Live : https://task2-1-d4o6.onrender.com
### Demo : [Watch Demo](https://www.loom.com/share/4ec6659ccb9046558120dcb6a1f16633)

# Task2 — Full-Stack Auth & Posts API

A full-stack application featuring a **JWT-authenticated REST API** (Express + Prisma + PostgreSQL) paired with a **React (Vite)** frontend that acts as an interactive API explorer/test client.

---

## 📁 Project Structure

```
task2/
├── backend/          # Express + TypeScript REST API
│   ├── prisma/       # Prisma schema & migrations
│   └── src/
│       ├── controllers/   # Request handlers (auth, users, posts)
│       ├── middlewares/   # JWT auth, admin guard, rate limiter
│       ├── routers/       # Express route definitions
│       ├── helpers/       # Utility / helper functions
│       ├── types/         # Custom TypeScript types
│       ├── db.ts          # Prisma client instance
│       └── server.ts      # Express app entry point
├── frontend/         # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/    # One component per API endpoint
│       └── App.tsx        # Navigation & screen switcher
└── swagger.yml       # OpenAPI 3.0 full API documentation
```

---

## 🛠️ Tech Stack

| Layer      | Technology                                                    |
|------------|---------------------------------------------------------------|
| Runtime    | Node.js                                                       |
| Language   | TypeScript (both frontend and backend)                        |
| Backend    | Express v5, Prisma ORM, PostgreSQL (Neon)                     |
| Auth       | JWT — dual-token strategy (access token + refresh token cookie)|
| Security   | bcrypt, express-rate-limit, DOMPurify, CORS                   |
| Frontend   | React 19, Vite, Tailwind CSS v4, Axios                        |
| Package Mgr| pnpm                                                          |
| API Docs   | OpenAPI 3.0 (swagger.yml)                                     |

---

## 🔐 Authentication Flow

This project implements a **dual-token JWT strategy**:

1. **Register** → creates a new user (hashed password via bcrypt)
2. **Login** → returns a short-lived **access token** (JSON body) + sets a **refresh token** as an `HttpOnly` cookie
3. **Protected routes** → verified via the `Authorization: Bearer <accessToken>` header
4. **Refresh** → the client sends the cookie; the server rotates and re-issues both tokens
5. **Logout** → clears the refresh token from the DB and expires the cookie

---

## 🗄️ Database Schema

```prisma
enum Role { User Admin }

model Users {
  id           Int      @id @default(autoincrement())
  name         String
  email        String   @unique
  password     String
  role         Role     @default(User)
  refreshToken String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  posts        Posts[]
}

model Posts {
  id          Int    @id @default(autoincrement())
  title       String
  description String
  userId      Int
  users       Users  @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 🌐 API Endpoints

Full specification is available in [`swagger.yml`](./swagger.yml).

### Auth

| Method | Route       | Description                           | Auth Required |
|--------|-------------|---------------------------------------|---------------|
| POST   | `/register` | Register a new user                   | No            |
| POST   | `/login`    | Login — returns access + refresh token| No            |
| POST   | `/refresh`  | Rotate tokens via cookie              | Cookie        |
| POST   | `/logout`   | Clear refresh token                   | Bearer        |

### Users

| Method | Route         | Description                  | Auth Required |
|--------|---------------|------------------------------|---------------|
| GET    | `/users/me`   | Get current user's profile   | Bearer        |
| GET    | `/users`      | List all users               | Bearer + Admin|
| DELETE | `/users/:id`  | Delete a user by ID          | Bearer + Admin|

### Posts

| Method | Route         | Description                       | Auth Required |
|--------|---------------|-----------------------------------|---------------|
| POST   | `/posts`      | Create a new post                 | Bearer        |
| GET    | `/posts`      | Get all posts of logged-in user   | Bearer        |
| DELETE | `/posts/:id`  | Delete a post by ID               | Bearer        |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm (`npm install -g pnpm`)
- A PostgreSQL database (e.g. [Neon](https://neon.tech))

---

### Backend Setup

```bash
cd backend

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env   # then fill in your values
```

Create a `.env` file in `backend/` with the following variables:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
ACCESS_SECRET=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret
REFRESH_EXPIRY=7d
```

```bash
# Run Prisma migrations
pnpm exec prisma migrate deploy

# Start development server
pnpm dev
```

The backend will start on **http://localhost:3001**.

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

The frontend will start on **http://localhost:5173**.

---

## 🖥️ Frontend — API Explorer

The React frontend is a **tabbed API testing interface**. Each tab corresponds to one API endpoint, allowing you to:

- Register and log in as a regular user or admin
- Refresh or revoke tokens
- View your profile or list all users (admin)
- Create, list, and delete posts
- Delete users (admin)

The current access token is stored in `localStorage` and shown (truncated) in the top navbar.

---

## 🛡️ Middleware

| Middleware      | File                     | Purpose                                       |
|-----------------|--------------------------|-----------------------------------------------|
| `auth`          | `middlewares/auth.ts`    | Validates Bearer JWT on protected routes      |
| `isAdmin`       | `middlewares/isAdmin.ts` | Restricts access to Admin-role users only     |
| `rateLimiter`   | `middlewares/rateLimiter.ts` | Prevents API abuse via express-rate-limit |

---

## 📄 API Documentation

A full **OpenAPI 3.0** spec is provided at the root of the repository:

```
swagger.yml
```

You can explore it interactively by pasting the contents into [editor.swagger.io](https://editor.swagger.io) or running a local Swagger UI.

---

## 📝 Notes

- Passwords are hashed with **bcrypt** before storage — plain-text passwords are never persisted.
- The refresh token is stored in the `Users` table and validated on each `/refresh` call, enabling **server-side token revocation**.
- CORS is configured to allow only `http://localhost:5173` in development.
- Rate limiting is applied globally to prevent brute-force attacks.
- Post deletion is restricted to the **owner** of the post; user deletion is admin-only.
