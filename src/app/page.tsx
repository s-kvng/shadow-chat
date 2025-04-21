/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [incomingMessages, setIncomingMessages] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Trigger scroll on new messages

  const handleSubmit = async (e: React.FormEvent) => {
    // TODO: handle submit
    e.preventDefault();
    if (!prompt.trim()) return;

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

      if (!response.body) return;
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      if (reader) setLoading(false);

      let incomingMessage = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setMessages((prevState) => [
            ...prevState,
            { role: "assistant", content: incomingMessage },
          ]);

          setIncomingMessages("");
          break;
        }

        if (value) {
          incomingMessage += value;
          setIncomingMessages(incomingMessage);
        }
      }

      // const result = await response.json();

      // const { thinking, response: finalResponse } = result;

      // Add assistant's thinking and final response as separate messages
      // if (thinking) {
      //   setMessages((prevMessages) => [
      //     ...prevMessages,
      //     { role: "assistant", content: `🤔 Thinking: ${thinking}` },
      //   ]);
      // }

      // if (finalResponse) {
      //   setMessages((prevMessages) => [
      //     ...prevMessages,
      //     { role: "assistant", content: `🗣️ ${finalResponse}` },
      //   ]);
      // }
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 fixed top-0 w-full z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg animate-pulse"></div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Shadow Clone
            </h1>
          </div>
          <div className="text-sm text-gray-400">AI Assistant</div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto pt-20 pb-24 px-4">
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-200">Welcome to Shadow Chat</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Ask me anything! I'm here to help with coding, problem-solving, and more.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} items-end space-x-2`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              
              <div
                className={`rounded-2xl p-4 max-w-[80%] shadow-lg ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700"
                    : "bg-gray-700/50 backdrop-blur-sm border border-gray-600"
                }`}
              >
                {message.role === "assistant" ? (
                  <Markdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      code: ({node, inline, className, children, ...props}) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline ? (
                          <pre className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-4 rounded-lg my-3 overflow-x-auto">
                            <code className={className} {...props}>{children}</code>
                          </pre>
                        ) : (
                          <code className="bg-gray-800/50 px-1.5 py-0.5 rounded-md text-sm" {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {message.content || "..."}
                  </Markdown>
                ) : (
                  <p className="text-white">{message.content}</p>
                )}
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {incomingMessages && (
            <div className="flex justify-start items-end space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center">
                <svg className="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="rounded-2xl p-4 max-w-[80%] bg-gray-700/50 backdrop-blur-sm border border-gray-600 shadow-lg">
                <Markdown
                  components={{
                    p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    code: ({node, inline, className, children, ...props}) => {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline ? (
                        <pre className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 p-4 rounded-lg my-3 overflow-x-auto">
                          <code className={className} {...props}>{children}</code>
                        </pre>
                      ) : (
                        <code className="bg-gray-800/50 px-1.5 py-0.5 rounded-md text-sm" {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {incomingMessages}
                </Markdown>
              </div>
            </div>
          )}

          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start items-end space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center animate-pulse">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
              <div className="rounded-2xl p-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600 shadow-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask anything..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl px-6 py-3 font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            >
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
