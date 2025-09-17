Frontend (Vite + React)

Install and run:

1. cd frontend
2. npm install
3. npm run dev

By default the frontend expects the backend at http://localhost:4000. To change, set environment variable `VITE_API_URL` in a `.env` file at the frontend root.

Docker
------
Build and run with docker-compose from repo root:

  docker compose build frontend
  docker compose up frontend

When served by the included nginx container the backend is available under `/api`.
