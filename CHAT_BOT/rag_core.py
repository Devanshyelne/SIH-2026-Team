import os
import re
import shutil
from pathlib import Path

from dotenv import load_dotenv
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI, MistralAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_PDF_PATH = BASE_DIR / "station_data.pdf"
PERSIST_DIR = BASE_DIR / "chroma_db"
DEFAULT_MODEL = os.getenv("MISTRAL_MODEL", "mistral-small-latest")

SYSTEM_PROMPT = """You are RailSathi, a helpful railway station navigation assistant.

Answer only from the provided context. Give clear, short directions for station
facilities, platforms, counters, exits, and nearby locations. If route steps are
available, present them in order.

If the answer is not present in the context, say:
"I could not find the answer in the station data."
"""

PROMPT = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        (
            "human",
            """Context:
{context}

Question:
{question}
""",
        ),
    ]
)


def require_api_key() -> None:
    if not os.getenv("MISTRAL_API_KEY"):
        raise RuntimeError(
            "MISTRAL_API_KEY is missing. Add it to a .env file or export it before running."
        )


def get_embeddings() -> MistralAIEmbeddings:
    require_api_key()
    return MistralAIEmbeddings()


def get_llm(model_name: str = DEFAULT_MODEL) -> ChatMistralAI:
    require_api_key()
    return ChatMistralAI(model=model_name, temperature=0.1)


def index_exists(persist_dir: Path = PERSIST_DIR) -> bool:
    return persist_dir.exists() and any(persist_dir.iterdir())


def split_station_entries(full_text: str) -> list[str]:
    parts = re.split(r"(?=Doc\s*#\d+\s*[—-])", full_text)
    parts = [part.strip() for part in parts if part.strip()]
    return parts if len(parts) > 1 else [full_text]


def load_pdf_documents(pdf_paths: list[Path]) -> list[Document]:
    docs: list[Document] = []
    for path in pdf_paths:
        loader = PyMuPDFLoader(str(path))
        docs.extend(loader.load())
    return docs


def chunk_documents(
    docs: list[Document],
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
) -> list[Document]:
    full_text = "\n".join(doc.page_content for doc in docs)
    station_entries = split_station_entries(full_text)

    if len(station_entries) > 1:
        return [
            Document(page_content=entry, metadata={"source": f"station-entry-{idx}"})
            for idx, entry in enumerate(station_entries, start=1)
        ]

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    return splitter.split_documents(docs)


def build_vectorstore(
    pdf_paths: list[str | Path],
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
    persist_dir: Path = PERSIST_DIR,
    reset: bool = True,
) -> tuple[Chroma, int]:
    paths = [Path(path) for path in pdf_paths]
    missing = [str(path) for path in paths if not path.exists()]
    if missing:
        raise FileNotFoundError(f"PDF file not found: {', '.join(missing)}")

    docs = load_pdf_documents(paths)
    chunks = chunk_documents(docs, chunk_size=chunk_size, chunk_overlap=chunk_overlap)

    if reset and persist_dir.exists():
        shutil.rmtree(persist_dir)

    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=get_embeddings(),
        persist_directory=str(persist_dir),
    )
    return vectorstore, len(chunks)


def load_vectorstore(persist_dir: Path = PERSIST_DIR) -> Chroma:
    if not index_exists(persist_dir):
        raise FileNotFoundError(
            f"No Chroma database found at {persist_dir}. Run create_database.py first."
        )
    return Chroma(persist_directory=str(persist_dir), embedding_function=get_embeddings())


def make_retriever(
    vectorstore: Chroma,
    search_type: str = "mmr",
    k: int = 4,
    fetch_k: int = 12,
    lambda_mult: float = 0.45,
):
    search_kwargs = {"k": k}
    if search_type == "mmr":
        search_kwargs.update({"fetch_k": max(fetch_k, k), "lambda_mult": lambda_mult})
    return vectorstore.as_retriever(search_type=search_type, search_kwargs=search_kwargs)


def answer_question(
    question: str,
    retriever,
    llm: ChatMistralAI,
) -> tuple[str, list[Document]]:
    docs = retriever.invoke(question)
    context = "\n\n".join(doc.page_content for doc in docs)
    final_prompt = PROMPT.invoke({"context": context, "question": question})
    response = llm.invoke(final_prompt)
    return response.content, docs
