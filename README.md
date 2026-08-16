# SIH-2026-Team

RailSathi is a Streamlit + LangChain chatbot for SIH PS-17: enhancing navigation for railway station facilities and locations.

## Project structure

```text
SIH-2026-Team/
├── CHAT_BOT/
│   ├── app.py
│   ├── create_database.py
│   ├── main.py
│   ├── rag_core/ (package with pdf.py)
│   │   ├── __init__.py
│   │   └── pdf.py
│   ├── api.py (FastAPI backend skeleton)
│   └── station_data.pdf
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt
```

## Setup

```bash
git clone <your-github-repo-url>
cd SIH-2026-Team
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Add your Mistral API key in `.env` (or other provider keys later):

```env
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=mistral-small-latest
# Optional: switch providers later via AI_PROVIDER env var
# AI_PROVIDER=mistral  # default
# AI_PROVIDER=gemini   # example for future switch
```

Note: Do not commit `.env` to source control. If using Google Gemini later, set up GOOGLE_APPLICATION_CREDENTIALS pointing to a service account JSON file as required by Google's client libraries.

## Run the chatbot URL

```bash
streamlit run CHAT_BOT/app.py
```

Streamlit will show a local URL like:

```text
http://localhost:8501
```

Your backend teammate can clone the repo, run the same command, and use their own local Streamlit URL.

## Build the database from terminal

The web app can build the database from the sidebar. You can also prebuild it:

```bash
python CHAT_BOT/create_database.py
```

## Terminal chatbot

```bash
python CHAT_BOT/main.py
```

Type `0` to exit.

## GitHub notes

- Do not push `.env`; it contains your secret API key.
- `CHAT_BOT/chroma_db/` is ignored because it can be rebuilt from `station_data.pdf`.
- Keep `station_data.pdf` only if your team is allowed to share that PDF in the repository.
