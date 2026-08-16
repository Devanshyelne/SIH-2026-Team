from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from rag_core.pdf import (
    DEFAULT_PDF_PATH,
    PERSIST_DIR,
    build_vectorstore,
    load_vectorstore,
    make_retriever,
    get_llm,
    DEFAULT_MODEL,
)

load_dotenv()

app = FastAPI(title="RailSathi RAG API")


class BuildRequest(BaseModel):
    pdf_paths: Optional[List[str]] = None
    reset: Optional[bool] = True


class QueryRequest(BaseModel):
    question: str


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
    try:
        vectorstore = load_vectorstore()
        retriever = make_retriever(vectorstore)
        llm = get_llm(DEFAULT_MODEL)
        answer, docs = llm_invoke_question(req.question, retriever, llm)
        sources = [getattr(d, "metadata", {}).get("source") for d in docs]
        return {"answer": answer, "sources": sources}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# Helper kept separate to make it easier for collaborators to replace with different LLMs
def llm_invoke_question(question: str, retriever, llm):
    # reuse the answer_question path from rag_core.pdf to keep behavior consistent
    from rag_core.pdf import answer_question

    return answer_question(question, retriever, llm)
