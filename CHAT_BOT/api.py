from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import List, Optional

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

app = FastAPI(title="RailSathi RAG API", docs_url="/docs" if os.getenv("ENABLE_DOCS") == "true" else None)

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
    pdf_paths: Optional[List[str]] = None
    reset: Optional[bool] = True


class QueryRequest(BaseModel):
    question: str


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/build_db")
async def build_db(req: BuildRequest):
    pdfs = req.pdf_paths or [str(DEFAULT_PDF_PATH)]
    try:
        vectorstore, chunk_count = build_vectorstore(pdfs, reset=req.reset)
        vectorstore.persist()
        return {"status": "ok", "location": str(PERSIST_DIR), "chunks": chunk_count}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/query")
async def query(req: QueryRequest):
    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question is required")
    if len(question) > 2000:
        raise HTTPException(status_code=400, detail="Question must be 2000 characters or fewer")

    try:
        vectorstore = ensure_vectorstore()
        retriever = make_retriever(vectorstore)
        llm = get_llm(DEFAULT_MODEL)
        answer, docs = answer_question(question, retriever, llm)
        sources = [getattr(d, "metadata", {}).get("source") for d in docs]
        return {"answer": answer, "sources": sources}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
