# RailSathi

RailSathi provides Dadar station navigation, crowd predictions, and a retrieval-augmented chatbot.

## Services

- `Frontend/`: Vite + React static web interface.
- `backend/`: Express API backed by MySQL and the chatbot API.
- `CHAT_BOT/`: FastAPI + Mistral RAG chatbot.
- `Crowd-Model-System/`: Flask crowd-prediction API.

## Production deployment

Each API service has a Dockerfile. Copy the environment template, then use your deployment platform's secret manager to supply the real values:

```bash
cp .env.example .env
docker compose up --build -d
```

The frontend forwards same-origin `/api/*` requests to the backend container. This makes registration, login, and session restoration work without a browser CORS configuration in Docker. For a separately deployed static frontend, set `VITE_API_URL` at build time to the backend's public URL and set `CORS_ORIGIN` on the backend to the frontend's exact public URL.

Before exposing the chatbot, build its persistent search index once:

```bash
docker compose run --rm chatbot python create_database.py
```

The services listen on port `8080` (frontend), `5000` (backend), `8001` (chatbot), and `5001` (crowd model). The MySQL database is intentionally external: create it from `dadar_station_navigation_REBUILT.sql` and set the `DB_*` values before deploying.

For production, set `CORS_ORIGIN` to the exact deployed frontend URL and store `MISTRAL_API_KEY` only as a secret. Never commit `.env`. The supplied SQL initializes the `station_navigation` database; set `DB_SSL=true` if your database provider requires TLS. The `/build_db` API is disabled by default; use the one-time command above or explicitly set `BUILD_DB_ENABLED=true` for controlled rebuilds.

## Local development

```bash
cd Frontend && npm ci && npm run dev
cd backend && npm ci && npm run dev
cd CHAT_BOT && python -m venv .venv && .venv/Scripts/pip install -r requirements.txt
cd Crowd-Model-System && python -m venv .venv && .venv/Scripts/pip install -r requirements.txt
```

For authentication, create `backend/.env` (or a root `.env` when using Docker Compose) with at least `MONGODB_URI` and a long random `JWT_SECRET`. Start the backend on port 5000 and the frontend on port 5173; Vite forwards `/api` to the backend automatically. Use `Frontend/.env.example` only when the frontend and backend have separate public domains.

Run the chatbot locally with `uvicorn api:app --host 0.0.0.0 --port 8001` from `CHAT_BOT`, and the crowd API with `flask --app app run --port 5001` from `Crowd-Model-System`.
