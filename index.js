import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const aiMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Could not get reply." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-4 flex flex-col min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">
          Vishal AI
        </h1>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.role === "user"
                  ? "bg-indigo-100 self-end text-right"
                  : "bg-gray-200 self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="bg-gray-200 p-3 rounded-xl w-fit animate-pulse">
              Vishal AI is typing...
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
