Simple full-stack stories app (frontend + backend).

Backend: Flask + SQLite in /backend
Frontend: Vite + React in /frontend

Docker
------
Build and run both services with docker-compose:

	docker compose build
	docker compose up

Frontend will be available on http://localhost:5173 and backend on http://localhost:4000 (proxied under /api by nginx).

See each folder for run instructions.
