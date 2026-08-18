from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import asyncio
from contextlib import asynccontextmanager

from rag_core.pdf import (
    DEFAULT_PDF_PATH,
    PERSIST_DIR,
    DEFAULT_MODEL,
    build_vectorstore,
    ensure_vectorstore,
    make_retriever,
    get_llm,
    answer_question,
)

load_dotenv()

vectorstore = None
index_status = "starting"
index_error = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global vectorstore, index_status, index_error

    print("Starting RailSathi chatbot...")

    try:
        # Load existing Chroma database.
        # If it doesn't exist, create it.
        vectorstore = await asyncio.to_thread(
            ensure_vectorstore,
            persist_dir=PERSIST_DIR,
            reset=False,
        )

        index_status = "ready"
        print("Chatbot vectorstore ready")

    except Exception as exc:
        index_error = str(exc)
        index_status = "failed"
        print(f"Chatbot index initialization failed: {exc}")

    yield


app = FastAPI(
    title="RailSathi RAG API",
    docs_url="/docs" if os.getenv("ENABLE_DOCS") == "true" else None,
    lifespan=lifespan,
)


# =========================
# CORS
# =========================

allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGIN", "*").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials="*" not in allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# REQUEST MODELS
# =========================

class BuildRequest(BaseModel):
    reset: bool = True


class QueryRequest(BaseModel):
    question: str


# =========================
# HEALTH CHECK
# =========================

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "index_status": index_status,
    }


# =========================
# BUILD DATABASE
# =========================

@app.post("/build_db")
async def build_db(req: BuildRequest):

    if os.getenv("BUILD_DB_ENABLED") != "true":
        raise HTTPException(
            status_code=403,
            detail="Database build endpoint is disabled",
        )

    try:
        vectorstore, chunk_count = build_vectorstore(
            [str(DEFAULT_PDF_PATH)],
            reset=req.reset,
        )

        vectorstore.persist()

        return {
            "status": "ok",
            "location": str(PERSIST_DIR),
            "chunks": chunk_count,
        }

    except Exception as exc:
        print(f"Database build failed: {exc}")

        raise HTTPException(
            status_code=500,
            detail="Database build failed",
        )


# =========================
# CHATBOT QUERY
# =========================

@app.post("/query")
async def query(req: QueryRequest):

    question = req.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question is required",
        )

    if len(question) > 2000:
        raise HTTPException(
            status_code=400,
            detail="Question must be 2000 characters or fewer",
        )

    # Vectorstore is still loading
    if index_status == "starting":
        raise HTTPException(
            status_code=503,
            detail="Chatbot is initializing. Please try again shortly.",
        )

    # Vectorstore failed
    if index_status == "failed":
        print(
            f"Chatbot index is unavailable: {index_error}"
        )

        raise HTTPException(
            status_code=503,
            detail="Chatbot initialization failed. Check service logs.",
        )

    try:

        # was: retriever = make_retriever(vectorstore)
        retriever = make_retriever(vectorstore)

        llm = get_llm(DEFAULT_MODEL)

        answer, docs = answer_question(
            question,
            retriever,
            llm,
        )

        sources = [
            getattr(doc, "metadata", {}).get("pdf_source")
            for doc in docs
        ]

        return {
            "answer": answer,
            "sources": sources,
        }

    except Exception as exc:

        print(
            f"Chatbot query failed: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to answer the question",
        )