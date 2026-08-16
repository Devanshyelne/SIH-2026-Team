from rag_core.pdf import DEFAULT_PDF_PATH, PERSIST_DIR, build_vectorstore


def main() -> None:
    print(f"Building Chroma database from: {DEFAULT_PDF_PATH}")
    vectorstore, chunk_count = build_vectorstore([DEFAULT_PDF_PATH])
    vectorstore.persist()
    print(f"Database created at: {PERSIST_DIR}")
    print(f"Chunks indexed: {chunk_count}")


if __name__ == "__main__":
    main()
