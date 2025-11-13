import React, { useState } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm your EdTech assistant! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: input,
      });

      const botReply = res.data.reply || "Sorry, I didn’t catch that.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);

    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops 😅 Something went wrong." },
      ]);
    }
  };

  return (
    <div>
      <button className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        <MessageCircle size={28} />
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-header">EdTech Chatbot 💬</div>

          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
