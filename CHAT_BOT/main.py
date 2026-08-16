from dotenv import load_dotenv

from rag_core.pdf import DEFAULT_MODEL, answer_question, get_llm, load_vectorstore, make_retriever

load_dotenv()


def main() -> None:
    vectorstore = load_vectorstore()
    retriever = make_retriever(vectorstore)
    llm = get_llm(DEFAULT_MODEL)

    print("RailSathi RAG system ready")
    print("Ask station navigation questions. Type 0 to exit.\n")

    while True:
        query = input("You: ").strip()
        if query == "0":
            break
        if not query:
            continue

        try:
            answer, _ = answer_question(query, retriever, llm)
            print(f"\nAI: {answer}\n")
        except Exception as exc:
            print(f"\nError: {exc}\n")


if __name__ == "__main__":
    main()
