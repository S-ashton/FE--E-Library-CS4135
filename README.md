# E-Library (frontend)

Course project frontend for an **e-library**: browse books, borrow and return copies, see active and overdue loans, and view personalised recommendations. Staff can manage catalogue entries from a dedicated area.

## Stack

- **React** (Vite) with **TypeScript**
- **Redux Toolkit** for app state and API-driven slices
- **React Router** for protected routes and role-based areas
- **Axios** for HTTP, **Vitest** + Testing Library for tests

## Run locally

1. Create `.env.development` in the repo root and set:

   `VITE_API_BASE_URL=<your backend base URL>`  
   (The app throws at startup if this is missing.)

2. Install and start:

   ```bash
   npm install
   npm run dev
   ```

Other useful commands: `npm run build`, `npm run lint`, `npm run test:run`.

## Layout

Application code lives under `src/app/` (pages, components, store, hooks, services, types). The UI talks to a **separate backend**; this repository is the browser client only.
