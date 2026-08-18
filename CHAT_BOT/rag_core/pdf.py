
import os
import re
import shutil
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI, MistralAIEmbeddings


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_PDF_PATH = BASE_DIR.parent / "station_data.pdf"

# Keep these names compatible with the existing project.
# Put the two supplied PDFs in CHAT_BOT/ with these names, or change these
# two paths to the names you use.
PDF_PATHS = [
    BASE_DIR.parent / "station_data.pdf",
    BASE_DIR.parent / "2_Station_data.pdf",
]

PERSIST_DIR = BASE_DIR.parent / "chroma_db"

DEFAULT_MODEL = os.getenv("MISTRAL_MODEL", "mistral-small-latest")


SYSTEM_PROMPT = """You are RailSathi, a railway-station navigation assistant.

Use ONLY the supplied station-data context.

The context comes from a verified question-answer corpus. The user's
wording does NOT have to exactly match a stored question. If the retrieved
question describes the same intent, same station location/facility, or the
same route under different wording, use its verified answer.

Important:
- Do not require exact wording.
- Treat paraphrases as equivalent when their meaning is the same.
- Understand natural English, simple Hindi/Hinglish, and common station
  vocabulary.
- Examples of equivalent wording include:
  toilet/washroom/restroom, ATM/cash machine, FOB/foot over bridge/
  foot overbridge/overbridge, booking office/ticket counter/booking counter.
- Preserve exact station names, route steps, directions, and distances from
  the retrieved data.
- Do not combine two different routes.
- Do not invent a route, facility, distance, platform, or station location.
- If the user asks a generic facility question and the context contains a
  general facility record, prefer that general verified answer.
- If the user specifies a starting point and destination, prefer a route
  record matching that pair.
- If the supplied data does not support the answer, say:
  "I could not find the answer in the station data."

Answer naturally and directly. Never mention retrieval, embeddings, BM25,
MMR, query expansion, context chunks, scores, or internal processing.
"""


PROMPT = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        (
            "human",
            """Verified station data:
{context}

User question:
{question}
""",
        ),
    ]
)


def require_api_key() -> None:
    if not os.getenv("MISTRAL_API_KEY"):
        raise RuntimeError(
            "MISTRAL_API_KEY is missing. Add it to .env or export it."
        )


def get_embeddings() -> MistralAIEmbeddings:
    require_api_key()
    return MistralAIEmbeddings(
        model="mistral-embed",
        max_retries=5,
        timeout=120,
    )


def get_llm(model_name: str = DEFAULT_MODEL) -> ChatMistralAI:
    require_api_key()
    return ChatMistralAI(
        model=model_name,
        temperature=0.1,
    )


def index_exists(persist_dir: Path = PERSIST_DIR) -> bool:
    return persist_dir.exists() and any(persist_dir.iterdir())


# ---------------------------------------------------------------------------
# PDF PARSING
# ---------------------------------------------------------------------------

def load_pdf_text(path: Path) -> str:
    """Extract all PDF text while preserving the Question/Answer structure."""
    import fitz

    pdf = fitz.open(path)
    try:
        return "\n".join(page.get_text("text") for page in pdf)
    finally:
        pdf.close()


def parse_question_answer_records(
    full_text: str,
    pdf_source: str,
) -> list[Document]:
    """
    Parse the supplied PDFs as Q&A datasets.

    The two PDFs use IDs such as:
      general_001
      route_1_1
      route_1_1_var_97
      route_1_1_dest_10
      exp_1_1

    We deliberately parse every Question/Answer pair rather than chunking
    PDF pages. This is critical because the PDFs contain thousands of
    paraphrases, and each paraphrase should become an independent semantic
    retrieval example.
    """
    lines = full_text.splitlines()

    id_pattern = re.compile(r"^(?:general_|route_|exp_)[A-Za-z0-9_]+$")

    current_id: str | None = None
    state = "outside"
    question_lines: list[str] = []
    answer_lines: list[str] = []

    records: list[Document] = []

    def clean(lines_: list[str]) -> str:
        # PDF line wrapping should not change the semantic sentence.
        return re.sub(r"\s+", " ", " ".join(lines_)).strip()

    def flush() -> None:
        nonlocal current_id, state, question_lines, answer_lines

        if not question_lines or not answer_lines:
            question_lines = []
            answer_lines = []
            state = "outside"
            return

        question = clean(question_lines)
        answer = clean(answer_lines)

        if question and answer:
            record_type = (
                "general"
                if current_id and current_id.startswith("general_")
                else "route"
                if current_id and current_id.startswith("route_")
                else "expanded"
            )

            route_key = current_id or ""
            if route_key.startswith("route_"):
                # route_121_1_var_106 -> route_121_1
                route_key = re.sub(
                    r"_var_\d+$|_dest_\d+$",
                    "",
                    route_key,
                )
            elif route_key.startswith("exp_"):
                # exp_756_10 -> exp_756
                route_key = re.sub(r"_\d+$", "", route_key)

            # Chroma embeds page_content. Keep it focused on the QUESTION
            # so semantic similarity is driven by what the user asked.
            # The verified answer is kept in metadata and reconstructed
            # when retrieved.
            metadata = {
                "record_id": current_id or "",
                "record_type": record_type,
                "route_key": route_key,
                "question": question,
                "answer": answer,
                "pdf_source": pdf_source,
            }

            records.append(
                Document(
                    page_content=question,
                    metadata=metadata,
                )
            )

        question_lines = []
        answer_lines = []
        state = "outside"

    for raw_line in lines:
        line = raw_line.strip()

        if id_pattern.fullmatch(line):
            # A new record starts. Finish the previous Q&A first.
            flush()
            current_id = line
            state = "waiting_question"
            continue

        if line.startswith("Question:"):
            # Some PDF pages can contain a Question without a clean ID
            # immediately before it. Still preserve the Q&A.
            question_lines = [line[len("Question:"):].strip()]
            answer_lines = []
            state = "question"
            continue

        if line.startswith("Answer:"):
            answer_lines = [line[len("Answer:"):].strip()]
            state = "answer"
            continue

        if state == "question":
            question_lines.append(line)
        elif state == "answer":
            answer_lines.append(line)

    flush()
    return records


def load_pdf_documents(
    pdf_paths: list[str | Path],
) -> list[Document]:
    documents: list[Document] = []

    for raw_path in pdf_paths:
        path = Path(raw_path)
        if not path.exists():
            raise FileNotFoundError(f"PDF file not found: {path}")

        print(f"Loading PDF: {path.name}")
        text = load_pdf_text(path)

        parsed = parse_question_answer_records(
            text,
            path.name,
        )

        print(f"  Q&A records parsed: {len(parsed)}")
        documents.extend(parsed)

    return documents


def _record_key(doc: Document) -> tuple[str, str]:
    return (
        str(doc.metadata.get("question", "")).strip().lower(),
        str(doc.metadata.get("answer", "")).strip().lower(),
    )


def deduplicate_records(
    docs: list[Document],
) -> list[Document]:
    """
    Remove exact duplicate Question+Answer pairs only.

    Do NOT collapse different paraphrases. Those paraphrases are valuable
    training/retrieval examples for the exact problem the user wants solved.
    """
    seen: set[tuple[str, str]] = set()
    result: list[Document] = []

    for doc in docs:
        key = _record_key(doc)
        if key in seen:
            continue
        seen.add(key)
        result.append(doc)

    return result


# ---------------------------------------------------------------------------
# VECTOR DATABASE
# ---------------------------------------------------------------------------

def build_vectorstore(
    pdf_paths: list[str | Path],
    chunk_size: int = 1500,
    chunk_overlap: int = 100,
    persist_dir: Path = PERSIST_DIR,
    reset: bool = True,
) -> tuple[Chroma, int]:
    """
    Build a question-centric Chroma index.

    chunk_size/chunk_overlap are retained for compatibility with the old
    function signature. Q&A records are NOT split by character length because
    splitting would destroy the Question -> Answer relationship.
    """
    del chunk_size, chunk_overlap

    print()
    print("================================")
    print("Building RailSathi Q&A index")
    print("================================")

    docs = load_pdf_documents(pdf_paths)
    docs = deduplicate_records(docs)

    print(f"Unique Q&A records indexed: {len(docs)}")

    if reset and persist_dir.exists():
        print("Removing old Chroma database...")
        shutil.rmtree(persist_dir)

    embeddings = get_embeddings()

    vectorstore = Chroma(
        collection_name="railsathi_station_qa",
        persist_directory=str(persist_dir),
        embedding_function=embeddings,
    )

    # Mistral embedding requests are batched conservatively.
    batch_size = 32

    for start in range(0, len(docs), batch_size):
        end = min(start + batch_size, len(docs))
        print(f"Embedding records {start + 1}-{end} of {len(docs)}...")

        vectorstore.add_documents(docs[start:end])

    print("================================")
    print("RailSathi index ready")
    print("================================")

    return vectorstore, len(docs)


def load_vectorstore(
    persist_dir: Path = PERSIST_DIR,
) -> Chroma:
    if not index_exists(persist_dir):
        raise FileNotFoundError(
            f"No Chroma database found at {persist_dir}. "
            "Run create_database.py first."
        )

    return Chroma(
        collection_name="railsathi_station_qa",
        persist_directory=str(persist_dir),
        embedding_function=get_embeddings(),
    )


def ensure_vectorstore(
    pdf_paths: list[str | Path] | None = None,
    persist_dir: Path = PERSIST_DIR,
    reset: bool = True,
) -> Chroma:
    if not index_exists(persist_dir):
        targets = pdf_paths or PDF_PATHS
        vectorstore, _ = build_vectorstore(
            targets,
            persist_dir=persist_dir,
            reset=reset,
        )
        return vectorstore

    return load_vectorstore(persist_dir)


# ---------------------------------------------------------------------------
# QUERY NORMALIZATION / SYNONYMS
# ---------------------------------------------------------------------------

STATION_SYNONYMS: dict[str, list[str]] = {
    "toilet": ["washroom", "restroom"],
    "washroom": ["toilet", "restroom"],
    "restroom": ["toilet", "washroom"],

    "fob": [
        "foot over bridge",
        "foot overbridge",
        "overbridge",
        "over bridge",
    ],
    "foot over bridge": [
        "fob",
        "foot overbridge",
        "overbridge",
    ],
    "foot overbridge": [
        "fob",
        "foot over bridge",
        "overbridge",
    ],
    "overbridge": [
        "foot over bridge",
        "foot overbridge",
        "fob",
    ],
    "over bridge": [
        "foot over bridge",
        "foot overbridge",
        "fob",
    ],

    "atm": ["cash machine"],
    "cash machine": ["atm"],

    "ticket": [
        "booking office",
        "ticket counter",
        "booking counter",
    ],
    "booking": [
        "booking office",
        "ticket counter",
        "booking counter",
    ],
    "ticket counter": [
        "booking office",
        "booking counter",
    ],
    "booking counter": [
        "booking office",
        "ticket counter",
    ],

    "exit": ["exit gate"],
    "entrance": ["entrance gate", "main entrance gate"],

    "help": ["help clinic", "first aid", "medical"],
    "clinic": ["help clinic", "first aid", "medical"],
    "sick": ["help clinic", "first aid", "medical"],
    "bimar": ["help clinic", "first aid", "medical"],
    "madad": ["help clinic", "first aid", "medical"],
    "medical": ["help clinic", "first aid", "medical"],
    "first aid": ["help clinic", "medical"],
}


def normalize_question(text: str) -> str:
    text = text.lower()
    text = text.replace("-", " ")
    text = re.sub(r"[^a-z0-9\s/]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def synonym_expand(question: str) -> list[str]:
    """
    Generate a small number of deterministic alternatives.

    These are only extra retrieval attempts. The original question is always
    searched first. No result is shown to the user.
    """
    q = normalize_question(question)
    rewrites: list[str] = []

    for term in sorted(STATION_SYNONYMS, key=len, reverse=True):
        pattern = rf"(?<!\w){re.escape(term)}(?!\w)"

        if not re.search(pattern, q):
            continue

        for replacement in STATION_SYNONYMS[term]:
            if re.search(
                rf"(?<!\w){re.escape(replacement)}(?!\w)",
                q,
            ):
                continue

            rewritten = re.sub(
                pattern,
                replacement,
                q,
            )

            if rewritten != q:
                rewrites.append(rewritten)

    return list(dict.fromkeys(rewrites))[:6]


def expand_query_with_llm(
    question: str,
    llm: ChatMistralAI,
) -> list[str]:
    """
    Best-effort semantic paraphrasing.

    The PDFs already contain thousands of paraphrases, so this is only a
    fallback. It never replaces the original question.
    """
    prompt = (
        "Create up to 2 short alternative phrasings of this railway "
        "station navigation question. Preserve every location, platform "
        "number, facility, source, destination, and direction. Do not add "
        "new facts. Return only the alternatives, one per line.\n\n"
        f"Question: {question}"
    )

    try:
        response = llm.invoke(prompt)
        lines = [
            re.sub(r"^[\-\*\d\.\)\s]+", "", line).strip()
            for line in response.content.splitlines()
            if line.strip()
        ]
        return list(dict.fromkeys(lines))[:2]
    except Exception:
        return []


# ---------------------------------------------------------------------------
# HYBRID RETRIEVER
# ---------------------------------------------------------------------------

class StationHybridRetriever:
    """
    Semantic + lexical retriever designed specifically for the two supplied
    Q&A PDFs.

    Why NOT MMR?
    The PDFs intentionally contain many paraphrases of the same route.
    MMR tries to make results diverse, which can push the best matching
    paraphrases away from the top. Similarity search + BM25 is better here.
    """

    def __init__(
        self,
        vectorstore: Chroma,
        docs: list[Document],
        vector_k: int = 14,
        bm25_k: int = 14,
    ):
        self.vectorstore = vectorstore
        self.docs = docs
        self.vector_k = vector_k
        self.bm25_k = bm25_k

        self.bm25 = BM25Retriever.from_documents(
            docs
        )
        self.bm25.k = bm25_k

    def _rrf(
        self,
        ranked_lists: list[list[Document]],
        weights: list[float],
        rrf_k: int = 60,
    ) -> list[Document]:
        scores: dict[str, float] = {}
        objects: dict[str, Document] = {}

        for weight, ranked in zip(weights, ranked_lists):
            for rank, doc in enumerate(ranked, start=1):
                key = (
                    str(doc.metadata.get("record_id", ""))
                    + "|"
                    + str(doc.metadata.get("question", ""))
                )
                objects[key] = doc
                scores[key] = scores.get(key, 0.0) + (
                    weight / (rrf_k + rank)
                )

        ordered = sorted(
            objects,
            key=lambda key: scores[key],
            reverse=True,
        )

        return [objects[key] for key in ordered]

    def invoke(self, query: str) -> list[Document]:
        # Semantic similarity over QUESTION text.
        try:
            vector_results = (
                self.vectorstore.similarity_search(
                    query,
                    k=self.vector_k,
                )
            )
        except Exception:
            vector_results = []

        # BM25 over QUESTION text.
        try:
            bm25_results = self.bm25.invoke(query)
        except Exception:
            bm25_results = []

        return self._rrf(
            [vector_results, bm25_results],
            [0.65, 0.35],
        )[:18]


def _load_index_docs(vectorstore: Chroma) -> list[Document]:
    raw = vectorstore.get(
        include=["documents", "metadatas"]
    )

    docs: list[Document] = []

    for question, meta in zip(
        raw.get("documents", []),
        raw.get("metadatas", []),
    ):
        metadata = meta or {}

        # The current database stores the question in page_content and
        # answer in metadata. Keep this backward-compatible with older
        # databases where the whole Q&A was stored in page_content.
        q = str(metadata.get("question") or question or "").strip()
        a = str(metadata.get("answer") or "").strip()

        if not q:
            continue

        docs.append(
            Document(
                page_content=q,
                metadata={
                    **metadata,
                    "question": q,
                    "answer": a,
                },
            )
        )

    return docs


def make_retriever(
    vectorstore: Chroma,
    search_type: str = "similarity",
    k: int = 14,
    fetch_k: int = 30,
    lambda_mult: float = 0.0,
):
    """
    Keep the original function signature so main.py does not need changes.

    The old MMR retriever is intentionally replaced because this corpus is
    made of many paraphrases. We want the nearest semantic questions, not
    diverse but less-relevant questions.
    """
    del search_type, fetch_k, lambda_mult

    docs = _load_index_docs(vectorstore)

    return StationHybridRetriever(
        vectorstore=vectorstore,
        docs=docs,
        vector_k=k,
        bm25_k=k,
    )


# ---------------------------------------------------------------------------
# RETRIEVAL QUALITY / ROUTE CONSISTENCY
# ---------------------------------------------------------------------------

STOP_WORDS = {
    "where", "is", "the", "a", "an", "to", "from", "how", "do", "i",
    "can", "could", "please", "me", "get", "go", "reach", "find", "near",
    "my", "at", "in", "on", "for", "what", "which", "way", "tell",
    "give", "route", "directions", "direction", "distance", "far",
    "how", "many", "there", "want", "need", "show", "take",
}


def content_tokens(text: str) -> set[str]:
    tokens = re.findall(r"[a-z0-9]+", normalize_question(text))
    return {
        token
        for token in tokens
        if token not in STOP_WORDS and len(token) > 1
    }


def query_entity_tokens(question: str) -> set[str]:
    """
    Keep important station entities and numbers.

    This prevents a semantically similar but wrong route such as
    ATM -> Platform 1 from beating ATM -> FOB 5 when the destination
    is clearly FOB 5.
    """
    tokens = content_tokens(question)
    return tokens


def rerank_results(
    question: str,
    docs: list[Document],
) -> list[Document]:
    """
    Lightweight deterministic reranking on top of semantic + BM25 retrieval.

    Exact station entities/numbers in the user's question get a strong
    preference. Generic words do not.
    """
    q_tokens = query_entity_tokens(question)
    normalized_q = normalize_question(question)

    def score(doc: Document) -> tuple[float, int]:
        candidate_q = str(
            doc.metadata.get("question")
            or doc.page_content
            or ""
        )
        candidate_tokens = content_tokens(candidate_q)

        overlap = len(q_tokens & candidate_tokens)

        # Bonus when distinctive entities occur as exact phrases.
        phrase_bonus = 0.0

        important_phrases = [
            "foot over bridge",
            "foot overbridge",
            "booking office",
            "ticket counter",
            "exit gate",
            "main entrance gate",
            "side gate",
            "help clinic",
            "cash machine",
        ]

        for phrase in important_phrases:
            if phrase in normalized_q and phrase in normalize_question(candidate_q):
                phrase_bonus += 1.5

        # Number match matters a lot for Platform 1/6, FOB 5, etc.
        q_numbers = set(re.findall(r"\b\d+(?:/\d+)?\b", normalized_q))
        c_numbers = set(re.findall(r"\b\d+(?:/\d+)?\b", normalize_question(candidate_q)))
        number_bonus = 2.5 * len(q_numbers & c_numbers)

        record_type = str(doc.metadata.get("record_type", ""))

        # Generic questions should prefer general_ records from the PDF.
        generic_facility = (
            not any(
                marker in normalized_q
                for marker in (
                    "from ", "starting", "i am at", "reach ",
                    "route", "directions", "how do i", "how can i",
                )
            )
        )

        general_bonus = 2.5 if generic_facility and record_type == "general" else 0.0

        # Route questions should prefer route/expanded records.
        route_bonus = (
            1.5
            if not generic_facility and record_type in {"route", "expanded"}
            else 0.0
        )

        return (
            overlap * 1.0
            + phrase_bonus
            + number_bonus
            + general_bonus
            + route_bonus,
            overlap,
        )

    return sorted(
        docs,
        key=score,
        reverse=True,
    )


def _to_answer_document(doc: Document) -> Document:
    question = str(
        doc.metadata.get("question")
        or doc.page_content
        or ""
    ).strip()

    answer = str(
        doc.metadata.get("answer")
        or ""
    ).strip()

    if not answer:
        # Backward compatibility for an older Chroma database.
        content = doc.page_content.strip()
        match = re.search(
            r"Question:\s*(.*?)\s*Answer:\s*(.*)$",
            content,
            re.S | re.I,
        )
        if match:
            question = match.group(1).strip()
            answer = match.group(2).strip()
        else:
            answer = content

    return Document(
        page_content=(
            f"Question: {question}\n"
            f"Verified Answer: {answer}"
        ),
        metadata=doc.metadata,
    )


def _dedupe_by_answer(
    docs: list[Document],
    limit: int = 8,
) -> list[Document]:
    seen: set[str] = set()
    result: list[Document] = []

    for doc in docs:
        answer = str(
            doc.metadata.get("answer")
            or doc.page_content
        ).strip()

        key = normalize_question(answer)

        if not key or key in seen:
            continue

        seen.add(key)
        result.append(doc)

        if len(result) >= limit:
            break

    return result


# ---------------------------------------------------------------------------
# ANSWERING
# ---------------------------------------------------------------------------

def answer_question(
    question: str,
    retriever: StationHybridRetriever,
    llm: ChatMistralAI,
) -> tuple[str, list[Document]]:
    """
    Main RAG pipeline.

    User sees ONLY the final answer. All query expansion and retrieval
    happens silently.
    """
    original = question.strip()

    if not original:
        return "Please ask a station navigation question.", []

    queries = [original]

    # Deterministic station vocabulary alternatives.
    queries.extend(synonym_expand(original))

    # The PDFs already contain many paraphrases. Only use the LLM to create
    # two additional semantic phrasings, not as the primary source.
    if len(queries) < 4:
        queries.extend(
            expand_query_with_llm(
                original,
                llm,
            )
        )

    queries = list(
        dict.fromkeys(
            q.strip()
            for q in queries
            if q and q.strip()
        )
    )[:8]

    all_docs: list[Document] = []

    for query in queries:
        try:
            all_docs.extend(
                retriever.invoke(query)
            )
        except Exception:
            continue

    if not all_docs:
        return "I could not find the answer in the station data.", []

    # Remove exact duplicate records, then use entity-aware reranking.
    unique: dict[str, Document] = {}

    for doc in all_docs:
        rid = str(doc.metadata.get("record_id", ""))
        q = str(doc.metadata.get("question", doc.page_content))
        key = rid + "|" + q

        if key not in unique:
            unique[key] = doc

    ranked = rerank_results(
        original,
        list(unique.values()),
    )

    # The first few results may be paraphrases of the exact same route.
    # Keep one verified answer per route/answer so Mistral gets a clean,
    # non-conflicting context.
    selected = _dedupe_by_answer(
        ranked,
        limit=8,
    )

    if not selected:
        return "I could not find the answer in the station data.", []

    answer_docs = [
        _to_answer_document(doc)
        for doc in selected
    ]

    context = "\n\n---\n\n".join(
        doc.page_content
        for doc in answer_docs
    )

    # Do not let a huge context make the model mix unrelated routes.
    context = context[:14000]

    final_prompt = PROMPT.invoke(
        {
            "context": context,
            "question": original,
        }
    )

    try:
        response = llm.invoke(final_prompt)
        answer = str(response.content).strip()
    except Exception:
        # If generation fails, return the best verified answer instead of
        # inventing anything.
        answer = str(
            selected[0].metadata.get("answer")
            or selected[0].page_content
        ).strip()

    return answer, answer_docs


__all__ = [
    "DEFAULT_PDF_PATH",
    "PDF_PATHS",
    "PERSIST_DIR",
    "get_embeddings",
    "get_llm",
    "build_vectorstore",
    "load_vectorstore",
    "ensure_vectorstore",
    "make_retriever",
    "answer_question",
    "synonym_expand",
    "expand_query_with_llm",
]