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


async def prepare_vectorstore() -> None:
    global vectorstore, index_status, index_error

    try:
        vectorstore = await asyncio.to_thread(ensure_vectorstore)
        index_status = "ready"
    except Exception as exc:
        index_error = str(exc)
        index_status = "failed"
        print(f"Chatbot index initialization failed: {exc}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(prepare_vectorstore())
    yield


app = FastAPI(
    title="RailSathi RAG API",
    docs_url="/docs" if os.getenv("ENABLE_DOCS") == "true" else None,
    lifespan=lifespan,
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGIN", "*").split(",")
    if origin.strip()
]

# Allow your frontend (React/Vite/etc.) to call this API during dev.
# Replace "*" with your actual frontend origin(s) before deploying.
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials="*" not in allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BuildRequest(BaseModel):
    reset: bool = True


class QueryRequest(BaseModel):
    question: str


@app.get("/health")
async def health():
    return {"status": "ok", "index_status": index_status}


@app.post("/build_db")
async def build_db(req: BuildRequest):
    if os.getenv("BUILD_DB_ENABLED") != "true":
        raise HTTPException(status_code=403, detail="Database build endpoint is disabled")

    try:
        vectorstore, chunk_count = build_vectorstore([str(DEFAULT_PDF_PATH)], reset=req.reset)
        vectorstore.persist()
        return {"status": "ok", "location": str(PERSIST_DIR), "chunks": chunk_count}
    except Exception as exc:
        print(f"Database build failed: {exc}")
        raise HTTPException(status_code=500, detail="Database build failed")


@app.post("/query")
async def query(req: QueryRequest):
    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question is required")
    if len(question) > 2000:
        raise HTTPException(status_code=400, detail="Question must be 2000 characters or fewer")

    if index_status == "starting":
        raise HTTPException(
            status_code=503,
            detail="Chatbot is initializing. Retry in one minute.",
        )
    if index_status == "failed":
        print(f"Chatbot index is unavailable: {index_error}")
        raise HTTPException(status_code=503, detail="Chatbot initialization failed. Check service logs.")

    try:
        retriever = make_retriever(vectorstore)
        llm = get_llm(DEFAULT_MODEL)
        answer, docs = answer_question(question, retriever, llm)
        sources = [getattr(d, "metadata", {}).get("source") for d in docs]
        return {"answer": answer, "sources": sources}
    except Exception as exc:
        print(f"Chatbot query failed: {exc}")
        raise HTTPException(status_code=500, detail="Unable to answer the question")
