const askChatbot = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        const chatbotUrl =
            process.env.CHATBOT_URL || "http://127.0.0.1:8001";

        const response = await fetch(`${chatbotUrl}/query`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

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

        res.status(500).json({
            message: "Could not connect to chatbot",
            error: error.message
        });
    }
};

module.exports = {
    askChatbot
};