"use client";

import { useState } from "react";
import Markdown from "react-markdown";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // TODO: handle submit
    e.preventDefault();

    setLoading(true);
    setPrompt("");

    // update messages history with the user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: prompt },
    ]);

    // fetch the response from the server
    try {
      const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();

      const { thinking, response: finalResponse } = result;

      // Add assistant's thinking and final response as separate messages
      if (thinking) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: `🤔 Thinking: ${thinking}` },
        ]);
      }

      if (finalResponse) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: `🗣️ ${finalResponse}` },
        ]);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "⚠️ Error occurred while fetching response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className=" bg-gray-400 rounded-xl h-[400px] max-h-[400px] w-[650px] max-w-[650px] p-5 text-black text-lg overflow-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 mb-2 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-2 max-w-[90%] break-words ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : message.content.includes("🤔")  // crude check for thinking
      ? "bg-yellow-100 text-gray-700 italic text-sm"
      : "bg-gray-300 text-black"
                }`}
              >
                {message.role === "assistant" ? 
                  <Markdown>{message.content}</Markdown> : (
                  <span>{message.content}</span>) }
              </div>
            </div>
          ))}
        </div>
        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="rounded-lg p-2 bg-gray-300 text-black">
              Loading...
            </div>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Chat with Shadow"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-gray-600 rounded-lg p-2 w-[400px] max-w-[400px] text-white text-lg"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-4 py-2 text-lg"
            disabled={loading}
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
