const askChatbot = async (req, res) => {
    try {
        const { question } = req.body;

        if (typeof question !== "string" || !question.trim()) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        const chatbotUrl = (process.env.CHATBOT_URL || "http://127.0.0.1:8001")
            .replace(/\/$/, "");
        const configuredTimeout = Number(process.env.CHATBOT_TIMEOUT_MS);
        const timeout = Number.isFinite(configuredTimeout) && configuredTimeout > 0
            ? configuredTimeout
            : 15000;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        let response;
        try {
            response = await fetch(`${chatbotUrl}/query`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question: question.trim() }),
                signal: controller.signal
            });
        } finally {
            clearTimeout(timeoutId);
        }

        if (!response.ok) {
            const errorText = await response.text();

            return res.status(response.status).json({
                message: "Chatbot request failed",
                error: errorText
            });
        }

        const data = await response.json();

        res.status(200).json(data);

    } catch (error) {
        console.error("Chatbot error:", error.message);

        res.status(error.name === "AbortError" ? 504 : 502).json({
            message: error.name === "AbortError"
                ? "Chatbot request timed out"
                : "Could not connect to chatbot"
        });
    }
};

module.exports = {
    askChatbot
};
