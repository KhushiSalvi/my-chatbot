import express from "express";
import cors from "cors";
import axios from "axios";

console.log("🔥 Running server.js from:", import.meta.url);

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------
//   OPENROUTER CONFIG
// -----------------------
const API_KEY = "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";   // <--- put your key here

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// -----------------------
//   CHAT ROUTE
// -----------------------
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Message missing" });
  }

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "meta-llama/llama-3.1-8b-instruct", // free & available
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "EdTech Chatbot",
        },
      }
    );

    const botReply = response.data.choices?.[0]?.message?.content || "Error in response.";
    res.json({ reply: botReply });

  } catch (error) {
    console.error("OpenRouter Error FULL:", error.response?.data || error.message);
    res.json({ error: "Failed to connect to OpenRouter API" });
  }
});

// -----------------------
//   START SERVER
// -----------------------
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
