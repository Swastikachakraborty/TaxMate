import { useState, useCallback, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

export interface Msg {
  id: number;
  role: "user" | "ai";
  text: string;
  tools?: string[];
  streaming?: boolean;
}

export function useAgentChat(uid: string, profileReady: boolean, showOnboarding: boolean) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [chatError, setChatError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;
    setChatError("");

    if (!profileReady) {
      if (showOnboarding) {
        setChatError("Please complete your profile setup first — fill in the form above.");
      } else {
        setChatError("Profile is still loading, please wait a moment…");
      }
      return;
    }

    const userMsg: Msg = { id: Date.now(), role: "user", text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    const aiId = Date.now() + 1;
    setMessages(prev => [...prev, { id: aiId, role: "ai", text: "", streaming: true }]);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(`${BASE}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: uid, message: text.trim() }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail ?? "Failed to reach AI");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      let toolsCalled: string[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "content") {
              fullText += event.content;
              setMessages(prev =>
                prev.map(m => m.id === aiId ? { ...m, text: fullText, streaming: true } : m)
              );
            } else if (event.type === "tool_call") {
              toolsCalled = [...toolsCalled, event.content];
              setMessages(prev =>
                prev.map(m => m.id === aiId ? { ...m, tools: toolsCalled } : m)
              );
              // Invalidate queries when tools are called
              queryClient.invalidateQueries({ queryKey: ["income", uid] });
              queryClient.invalidateQueries({ queryKey: ["tax", uid] });
              queryClient.invalidateQueries({ queryKey: ["deadlines", uid] });
            } else if (event.type === "done") {
              setMessages(prev =>
                prev.map(m => m.id === aiId
                  ? { ...m, text: fullText || "Done.", streaming: false, tools: event.tools_called }
                  : m)
              );
            } else if (event.type === "error") {
              throw new Error(event.content);
            }
          } catch { /* ignore parse errors */ }
        }
      }

      setMessages(prev => prev.map(m => m.id === aiId ? { ...m, streaming: false } : m));
    } catch (e: any) {
      if (e.name === "AbortError") return;
      const msg = e.message ?? "";
      const isNetworkError = msg === "Failed to fetch" || msg.includes("NetworkError") || msg.includes("fetch");
      const is404 = msg.toLowerCase().includes("not found");
      
      const friendlyError = is404
        ? "Profile not found — please complete your onboarding profile first."
        : isNetworkError
        ? "Cannot reach the backend server. Is it running on port 8000?"
        : msg || "Could not reach the AI agent";
        
      setChatError(friendlyError);
      setMessages(prev => prev.map(m =>
        m.id === aiId
          ? { ...m, text: is404
              ? "It looks like your profile hasn't been set up yet. Please fill in the onboarding form to get started!"
              : "I could not connect to the backend server. Please make sure it is running on port 8000.",
            streaming: false }
          : m
      ));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [streaming, uid, profileReady, showOnboarding, queryClient]);

  const abortStream = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  return {
    messages,
    setMessages,
    input,
    setInput,
    streaming,
    setStreaming,
    chatError,
    setChatError,
    sendMessage,
    abortStream
  };
}
