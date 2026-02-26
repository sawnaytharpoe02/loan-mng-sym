## Loan Management System (Monorepo)

This repository is a **loan management system** built as a TypeScript monorepo with a shared package, an Express + MongoDB backend, and a React + Vite frontend.

- **Backend** (`@loan-mng/backend`): REST API for authentication, borrowers, loans, repayments, interest rates, contracts, and transactions. Uses Express, Mongoose, Zod validation, DI (`tsyringe`), and AWS S3 for file storage.
- **Frontend** (`@loan-mng/frontend`): React SPA (Vite + TypeScript) with shadcn/ui, React Router, and TanStack Query. Provides dashboards and CRUD screens for borrowers, loans, repayments, transactions, interest-rate configuration, and contract generation.
- **Shared** (`@loan-mng/shared`): Shared TypeScript types/DTOs and loan calculation logic used by both backend and frontend to keep business rules consistent.

The project is designed so you can run both services locally with Node, or run them as separate Docker containers for a simple production-style deployment.


### Project structure

- **Root**
  - `package.json`: Monorepo workspace definition (`shared`, `backend`, `frontend`) and helper scripts for dev and Docker builds.
  - `README.md`: Project documentation
- **shared**
  - `@loan-mng/shared`: Common DTOs and utilities (e.g. loan calculation types and helpers) compiled to `dist/`.
- **backend**
  - `@loan-mng/backend`: Express + TypeScript API.
  - Modules include:
    - `auth`: user authentication and JWT issuing.
    - `borrower`: borrower records CRUD.
    - `loan`: loan creation, amortization/interest calculation, lifecycle updates.
    - `repayment`: repayment schedule and payment tracking.
    - `interest-rate`: configurable interest rate definitions.
    - `contract`: contract templates and generated contracts.
    - `transaction`: extra charges and financial transactions.
  - Uses MongoDB (via Mongoose) and AWS S3 for storage, plus Jest tests for calculator logic and integration tests.
- **frontend**
  - `@loan-mng/frontend`: React SPA (Vite) UI.
  - Key features:
    - Auth pages (`/login`, `/register`) and protected routes via `ProtectedRoute`.
    - Dashboard overview.
    - Management pages for borrowers, loans, repayments, transactions, interest rates, and contracts.
    - Contract generator and printable contract templates.
  - Uses shadcn/ui components, Tailwind-based styling, and React Query for API data.


### Prerequisites

- **Node.js 20+**
- **Docker**
- A **MongoDB** instance and **AWS S3** bucket for file storage.


### Environment configuration

Environment variables are loaded in the backend and frontend from `.env` files.

- **Backend**:
  - Create `backend/.env` from the template in `backend/.env.example` and adjust values.
- **Frontend**:
  - Create `frontend/.env` from the template in `frontend/.env.example` (only `VITE_API_URL` is required for the SPA).

### Running locally (without Docker)

From the repository root:

1. **Install dependencies** (monorepo):
   ```bash
   npm install
   ```

2. **Build shared package** (used by both backend and frontend):
   ```bash
   npm run build:shared
   ```

3. **Run backend in dev mode**:
   ```bash
   npm run dev:backend
   ```
   - Backend will start on the port configured in `backend/.env` (default `8080`).

4. **Run frontend in dev mode**:
   ```bash
   npm run dev:frontend
   ```
   - Vite dev server will start on `http://localhost:5173`.
   - Make sure `VITE_API_URL` in `frontend/.env` points to your backend, e.g. `http://localhost:8080/api`.


### Building Docker images

The root `package.json` already includes helper scripts for building the backend and frontend images:

```json
"scripts": {
  "docker:build:frontend": "docker build -t loan-mng-frontend:latest -f frontend/Dockerfile .",
  "docker:build:backend": "docker build -t loan-mng-backend:latest -f backend/Dockerfile ."
}
```

From the repository root, run:

```bash
npm run docker:build:backend
npm run docker:build:frontend
```

This will build:

- `loan-mng-backend:latest` – Node/Express API container.
- `loan-mng-frontend:latest` – Static SPA container serving the Vite-built frontend.


### Running with Docker

After building the images, you can run both services with plain `docker run` commands (no extra scripts required):

- **Backend container** (API on port `8080`):

```bash
docker run -d --name loan-backend-app -p 8080:8080 loan-mng-backend:latest
```

- **Frontend container** (SPA on port `5173`):

```bash
docker run -d --name loan-frontend-app -p 5173:5173 loan-mng-frontend:latest
```

Then open the app in your browser at:

- `http://localhost:5173` – frontend UI (React + Vite)
- `http://localhost:8080/api` – backend API base URL

If you change ports in your backend `.env`, update `VITE_API_URL` accordingly before rebuilding the frontend image.


### Shared types and loan calculation

The `@loan-mng/shared` workspace contains shared DTOs and utilities (e.g., loan creation/update types and interest/repayment helpers). Both backend and frontend import from this package so that:

- Validation schemas and types are consistent end-to-end.
- Core loan calculations (e.g. monthly payment, total with interest) are identical in API and UI.

Whenever you update shared types or logic, rebuild the shared package before rebuilding backend/frontend:

```bash
npm run build:shared
npm run build:backend
npm run build:frontend
```


### Testing

In the backend workspace (`cd backend`):

- **Run all tests**:
  ```bash
  npm test
  ```
- **Unit tests only** (e.g. loan calculator):
  ```bash
  npm run test:unit
  ```
- **Integration tests** (API endpoints using an in-memory MongoDB):
  ```bash
  npm run test:integration
  ```
