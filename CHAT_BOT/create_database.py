from pathlib import Path

from rag_core.pdf import PERSIST_DIR, build_vectorstore


BASE_DIR = Path(__file__).resolve().parent

PDF_FILES = [
    BASE_DIR / "station_data.pdf",
    BASE_DIR / "2_Station_data.pdf",
]


def main() -> None:
    print("Building Chroma database...")
    print()

    for pdf in PDF_FILES:
        if not pdf.exists():
            raise FileNotFoundError(f"PDF not found: {pdf}")
        print(f"Adding: {pdf.name}")

    vectorstore, chunk_count = build_vectorstore(
        PDF_FILES,
        persist_dir=PERSIST_DIR,
        reset=True,
    )

    print()
    print("================================")
    print("Chroma database created!")
    print("================================")
    print(f"Database: {PERSIST_DIR}")
    print(f"PDFs indexed: {len(PDF_FILES)}")
    print(f"Chunks indexed: {chunk_count}")


if __name__ == "__main__":
    main()