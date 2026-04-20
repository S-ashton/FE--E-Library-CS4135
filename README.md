# E-Library (frontend)

Course project frontend for an **e-library**: browse books, borrow and return copies, see active and overdue loans, and view personalised recommendations. Staff can manage catalogue entries from a dedicated area.

## Stack

- **React** (Vite) with **TypeScript**
- **Redux Toolkit** for app state and API-driven slices
- **React Router** for protected routes and role-based areas
- **Axios** for HTTP, **Vitest** + Testing Library for tests

---

## Prerequisites

- **Node.js** v20 or later (check with `node -v`)
- **npm** v9 or later (bundled with Node — check with `npm -v`)
- The **backend API** must be running and reachable before you start the dev server

---

## Running locally (dev server)

### 1. Clone the repository

```bash
git clone <repo-url>
cd FE--E-Library-CS4135
```

### 2. Create the environment file

Create a file called `.env.development` in the project root:

```
VITE_API_BASE_URL=http://localhost:<backend-port>
```

Replace `http://localhost:<backend-port>` with the base URL of the running backend (e.g. `http://localhost:8080`). The app will throw an error at startup if this variable is missing.

> Do **not** include a trailing slash in the URL.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the dev server

```bash
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`). Open it in your browser.

---

## Other useful commands

| Command | Purpose |
|---|---|
| `npm run build` | Production build (output in `dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the codebase |
| `npm run test:run` | Run all tests once (no watch mode) |
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Open the Vitest browser UI |

---

## Running with Docker

If you prefer Docker over a local Node install:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=http://<backend-host>:<port> \
  -t e-library-fe .

docker run -p 3000:80 e-library-fe
```

The app will be available at `http://localhost:3000`. The `VITE_API_BASE_URL` build arg is baked into the bundle at build time, so it must point to a URL that is reachable from the **browser**, not just from inside the container.

---

## Project layout

```
src/app/
  components/   Shared UI and layout components
  pages/        Route-level page components
  store/        Redux slices and store configuration
  hooks/        Custom React hooks (data fetching, UI state)
  services/     Axios API client
  types/        TypeScript type definitions
  utils/        Pure helper functions
  router/       Route definitions and protected-route guards
  context/      React contexts (e.g. toast notifications)
```

This repository is the **browser client only**. All data is fetched from the separate backend API.
