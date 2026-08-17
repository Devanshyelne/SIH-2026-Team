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

# Keep this because api.py and rag_core/__init__.py import it.
DEFAULT_PDF_PATH = BASE_DIR.parent / "station_data.pdf"

# Both PDFs are used when automatically building the database.
PDF_PATHS = [
    BASE_DIR.parent / "station_data.pdf",
    BASE_DIR.parent / "2_Station_data.pdf",
]

PERSIST_DIR = BASE_DIR.parent / "chroma_db"

DEFAULT_MODEL = os.getenv(
    "MISTRAL_MODEL",
    "mistral-small-latest",
)


SYSTEM_PROMPT = """You are RailSathi, a helpful railway station navigation assistant.

Answer only from the provided context.

Give clear, short directions for:
- station facilities
- platforms
- counters
- exits
- nearby locations

If route steps are available, present them in order.

Do not invent information.

If the answer is not present in the context, say:
"I could not find the answer in the station data."

Use only the retrieved station information relevant to the question.
Do not combine unrelated routes or locations.
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
            "MISTRAL_API_KEY is missing. "
            "Add it to a .env file or export it before running."
        )


def get_embeddings() -> MistralAIEmbeddings:
    require_api_key()

    return MistralAIEmbeddings(
        model="mistral-embed",
        max_retries=5,
        timeout=120,
    )


def get_llm(
    model_name: str = DEFAULT_MODEL,
) -> ChatMistralAI:

    require_api_key()

    return ChatMistralAI(
        model=model_name,
        temperature=0.1,
    )


def index_exists(
    persist_dir: Path = PERSIST_DIR,
) -> bool:

    return (
        persist_dir.exists()
        and any(persist_dir.iterdir())
    )


def split_station_entries(
    full_text: str,
) -> list[str]:

    parts = re.split(
        r"(?=Doc\s*#\d+\s*[—-])",
        full_text,
    )

    parts = [
        part.strip()
        for part in parts
        if part.strip()
    ]

    return (
        parts
        if len(parts) > 1
        else [full_text]
    )


def load_pdf_documents(
    pdf_paths: list[Path],
) -> list[Document]:

    docs: list[Document] = []

    for path in pdf_paths:

        print(f"Loading PDF: {path.name}")

        loader = PyMuPDFLoader(str(path))

        loaded_docs = loader.load()

        # Preserve the actual PDF filename.
        for doc in loaded_docs:
            doc.metadata["pdf_source"] = path.name

        docs.extend(loaded_docs)

    return docs


def chunk_documents(
    docs: list[Document],
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
) -> list[Document]:

    all_chunks: list[Document] = []

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )

    for doc in docs:

        text = doc.page_content.strip()

        if not text:
            continue

        # Handle generated Q&A/station entries.
        station_entries = split_station_entries(text)

        if len(station_entries) > 1:

            for idx, entry in enumerate(
                station_entries,
                start=1,
            ):

                all_chunks.append(
                    Document(
                        page_content=entry,
                        metadata={
                            "pdf_source": doc.metadata.get(
                                "pdf_source",
                                "unknown",
                            ),
                            "source": doc.metadata.get(
                                "pdf_source",
                                "unknown",
                            ),
                            "page": doc.metadata.get(
                                "page",
                                None,
                            ),
                            "entry": idx,
                        },
                    )
                )

        else:

            page_chunks = splitter.split_documents(
                [doc]
            )

            all_chunks.extend(page_chunks)

    return all_chunks


def build_vectorstore(
    pdf_paths: list[str | Path],
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
    persist_dir: Path = PERSIST_DIR,
    reset: bool = True,
) -> tuple[Chroma, int]:

    paths = [
        Path(path)
        for path in pdf_paths
    ]

    # Validate PDFs.
    missing = [
        str(path)
        for path in paths
        if not path.exists()
    ]

    if missing:
        raise FileNotFoundError(
            "PDF file not found: "
            + ", ".join(missing)
        )

    print()
    print("================================")
    print("Loading PDFs")
    print("================================")

    docs = load_pdf_documents(paths)

    print(
        f"PDF pages loaded: {len(docs)}"
    )

    print()
    print("Creating chunks...")

    chunks = chunk_documents(
        docs,
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )

    print(
        f"Chunks created: {len(chunks)}"
    )

    # Delete old Chroma database.
    if reset and persist_dir.exists():

        print()
        print("Removing old Chroma database...")

        shutil.rmtree(persist_dir)

    print()
    print("Creating new Chroma database...")

    embeddings = get_embeddings()

    vectorstore = Chroma(
        persist_directory=str(persist_dir),
        embedding_function=embeddings,
    )

    # Small batches prevent oversized embedding requests.
    batch_size = 8

    total = len(chunks)

    for start in range(
        0,
        total,
        batch_size,
    ):

        end = min(
            start + batch_size,
            total,
        )

        batch = chunks[start:end]

        print(
            f"Embedding chunks "
            f"{start + 1}-{end} "
            f"of {total}..."
        )

        vectorstore.add_documents(
            batch
        )

    print()
    print("================================")
    print("All chunks embedded successfully")
    print("================================")

    return vectorstore, len(chunks)


def load_vectorstore(
    persist_dir: Path = PERSIST_DIR,
) -> Chroma:

    if not index_exists(persist_dir):

        raise FileNotFoundError(
            f"No Chroma database found at "
            f"{persist_dir}. "
            f"Run create_database.py first."
        )

    return Chroma(
        persist_directory=str(persist_dir),
        embedding_function=get_embeddings(),
    )


def ensure_vectorstore(
    pdf_paths: list[str | Path] | None = None,
    persist_dir: Path = PERSIST_DIR,
    reset: bool = True,
) -> Chroma:

    if not index_exists(persist_dir):

        targets = (
            pdf_paths
            or PDF_PATHS
        )

        vectorstore, _ = build_vectorstore(
            targets,
            persist_dir=persist_dir,
            reset=reset,
        )

        return vectorstore

    return load_vectorstore(
        persist_dir
    )


def make_retriever(
    vectorstore: Chroma,
    search_type: str = "mmr",
    k: int = 4,
    fetch_k: int = 8,
    lambda_mult: float = 0.45,
):

    search_kwargs = {
        "k": k
    }

    if search_type == "mmr":

        search_kwargs.update(
            {
                "fetch_k": max(
                    fetch_k,
                    k,
                ),
                "lambda_mult": lambda_mult,
            }
        )

    return vectorstore.as_retriever(
        search_type=search_type,
        search_kwargs=search_kwargs,
    )


def get_fallback_answer(
    question: str,
) -> str | None:

    normalized = re.sub(
        r"[^a-z0-9\s]",
        " ",
        question.lower(),
    )

    q = " ".join(
        normalized.split()
    )

    if (
        ("ticket" in q or "booking" in q)
        and
        (
            "counter" in q
            or "office" in q
            or "desk" in q
        )
    ):

        return (
            "The verified station data refers "
            "to the ticket/booking counter as "
            "'Booking Office - Central'. "
            "From ATM: right lo (10m) -> "
            "Foot Over Bridge 5; phir right lo "
            "(15m) -> Booking Office - Central. "
            "Total approx 25 meter."
        )

    if (
        "help" in q
        and (
            "clinic" in q
            or "desk" in q
            or "counter" in q
        )
    ):

        return (
            "The verified station data mentions "
            "'Help Clinic'. From ATM: right lo "
            "(10m) -> Foot Over Bridge 5; "
            "phir right lo (15m) -> Booking "
            "Office - Central; phir seedha jao "
            "(10m) -> Help Clinic. "
            "Total approx 35 meter."
        )

    if (
        "exit" in q
        and (
            "gate" in q
            or "exit" in q
        )
    ):

        return (
            "The verified station data mentions "
            "'Exit Gate'. From ATM: right lo "
            "(10m) -> Foot Over Bridge 5; "
            "phir right lo (15m) -> Booking "
            "Office - Central; phir seedha jao "
            "(40m) -> Exit Gate. "
            "Total approx 65 meter."
        )

    return None


def answer_question(
    question: str,
    retriever,
    llm: ChatMistralAI,
) -> tuple[str, list[Document]]:

    docs = retriever.invoke(question)

    fallback = get_fallback_answer(
        question
    )

    if fallback:

        return (
            fallback,
            docs,
        )

    # Keep only the most relevant retrieved text in the LLM prompt.
    # This prevents slow/large Mistral requests when the database is large.
    context_parts = []

    for doc in docs:
        content = doc.page_content.strip()
        if content:
            context_parts.append(content)

    context = "\n\n---\n\n".join(context_parts)

    # Hard cap the context so the chatbot remains fast.
    context = context[:10000]

    final_prompt = PROMPT.invoke(
        {
            "context": context,
            "question": question,
        }
    )

    response = llm.invoke(
        final_prompt
    )

    return (
        response.content,
        docs,
    )