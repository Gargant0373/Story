Python Flask backend (SQLite)

Install and run locally:

1. python -m venv .venv
2. source .venv/bin/activate
3. pip install -r requirements.txt
4. python app.py

Docker (recommended):

From the repo root:

  docker compose build
  docker compose up

The backend will be available on http://localhost:4000 and is proxied by the frontend nginx under /api.
Python backend (Flask + SQLite)

Install and run:

1. python -m venv .venv
2. source .venv/bin/activate
3. pip install -r requirements.txt
4. python app.py

The server listens on http://localhost:4000 and exposes:
- GET /stories
- POST /stories { name, story }
