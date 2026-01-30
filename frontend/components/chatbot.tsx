"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { BACKEND_URL } from "@/lib/backend-url";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const { selectedLanguage } = useApp();

  // Translation helper function
  const translateText = async (
    text: string,
    targetLang: string
  ): Promise<string> => {
    if (!text || targetLang === "en") return text;
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage: targetLang }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.translatedText || text;
      }
    } catch (error) {
      console.error("Translation error:", error);
    }
    return text;
  };

  // Initialize or update welcome message based on language
  useEffect(() => {
    const initializeWelcomeMessage = async () => {
      const welcomeText = "Hi! I'm your STEMpower Ethiopia assistant. How can I help you learn about our programs, FabLabs, or STEM initiatives today?";
      
      // If no messages, initialize
      if (messages.length === 0) {
        if (selectedLanguage === "am") {
          const translated = await translateText(welcomeText, "am");
          setMessages([{
            id: "1",
            text: translated,
            sender: "bot",
            timestamp: new Date(),
          }]);
        } else {
          setMessages([{
            id: "1",
            text: welcomeText,
            sender: "bot",
            timestamp: new Date(),
          }]);
        }
      } else if (messages.length === 1 && messages[0].id === "1" && messages[0].sender === "bot") {
        // Update existing welcome message when language changes
        if (selectedLanguage === "am") {
          const translated = await translateText(welcomeText, "am");
          setMessages([{
            ...messages[0],
            text: translated,
          }]);
        } else {
          setMessages([{
            ...messages[0],
            text: welcomeText,
          }]);
        }
      }
    };
    
    // Initialize when chatbot opens or language changes
    if (isOpen) {
      initializeWelcomeMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedLanguage]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize chatbot session when opened
  useEffect(() => {
    if (isOpen && !sessionId && !isInitializing) {
      initializeSession();
    }
  }, [isOpen, sessionId, isInitializing]);

  const initializeSession = async () => {
    setIsInitializing(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/chatbot/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Chat with STEMpower Assistant",
        }),
      });

      if (response.ok) {
        const session = await response.json();
        setSessionId(session.id);
      } else {
        console.error("Failed to create chatbot session");
      }
    } catch (error) {
      console.error("Error initializing chatbot session:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatPanelRef.current &&
        !chatPanelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/chatbot/sessions/${sessionId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            language: selectedLanguage, // Send language preference to backend
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          // Find the assistant's reply (last message should be the assistant's response)
          const assistantMessage = data.messages.find(
            (msg: any) => msg.role === "assistant"
          );
          
          if (assistantMessage) {
            let botResponseText = assistantMessage.content;
            
            // Translate bot response if language is not English
            if (selectedLanguage === "am") {
              botResponseText = await translateText(botResponseText, "am");
            }
            
            const botMessage: Message = {
              id: assistantMessage.id?.toString() || (Date.now() + 1).toString(),
              text: botResponseText,
              sender: "bot",
              timestamp: new Date(assistantMessage.createdAt || Date.now()),
            };
            setMessages((prev) => [...prev, botMessage]);
          }
        }
      } else {
        // Handle error - show fallback message
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "I'm sorry, I encountered an error. Please try again or contact our support team.";
        if (selectedLanguage === "am") {
          errorMessage = await translateText(errorMessage, "am");
        }
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: errorMessage,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = "I'm having trouble connecting right now. Please try again in a moment.";
      if (selectedLanguage === "am") {
        errorMessage = await translateText(errorMessage, "am");
      }
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const [quickQuestions, setQuickQuestions] = useState<string[]>([
    "What programs do you offer?",
    "Tell me about FabLabs",
    "How can I get involved?",
    "Where are your centers located?",
  ]);
  const [translatedUI, setTranslatedUI] = useState<{
    assistantName: string;
    onlineStatus: string;
    quickQuestionsLabel: string;
  }>({
    assistantName: "STEMpower Assistant",
    onlineStatus: "Online now",
    quickQuestionsLabel: "Quick questions to get started:",
  });

  // Translate quick questions and UI text when language changes
  useEffect(() => {
    const translateUIElements = async () => {
      const baseQuestions = [
        "What programs do you offer?",
        "Tell me about FabLabs",
        "How can I get involved?",
        "Where are your centers located?",
      ];
      
      if (selectedLanguage === "am") {
        const [translatedQuestions, assistantName, onlineStatus, quickLabel] = await Promise.all([
          Promise.all(baseQuestions.map(q => translateText(q, "am"))),
          translateText("STEMpower Assistant", "am"),
          translateText("Online now", "am"),
          translateText("Quick questions to get started:", "am"),
        ]);
        setQuickQuestions(translatedQuestions);
        setTranslatedUI({
          assistantName,
          onlineStatus,
          quickQuestionsLabel: quickLabel,
        });
      } else {
        setQuickQuestions(baseQuestions);
        setTranslatedUI({
          assistantName: "STEMpower Assistant",
          onlineStatus: "Online now",
          quickQuestionsLabel: "Quick questions to get started:",
        });
      }
    };
    translateUIElements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#367375]/90 hover:to-[#24C3BC]/90"
          aria-label="Open chat"
        >
          <MessageCircle className="h-7 w-7 text-white animate-pulse" />
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          ref={chatPanelRef}
          className="fixed bottom-13 right-6 w-[380px] max-h-[calc(100vh-6rem)] h-[calc(100vh-6rem)] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-gray-200 animate-in slide-in-from-bottom-4 duration-300 max-[480px]:w-[calc(100vw-2rem)] max-[480px]:max-h-[calc(100vh-5rem)] max-[480px]:h-[calc(100vh-6rem)] max-[480px]:bottom-13 max-[480px]:right-4"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-[#367375] to-[#24C3BC] p-3 flex items-center justify-between shadow-lg shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  {translatedUI.assistantName}
                </h3>
                <p className="text-white/90 text-sm flex items-center gap-1">
                  <span className="h-2 w-2 bg-green-300 rounded-full animate-pulse" />
                  {translatedUI.onlineStatus}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-9 w-9 text-white hover:bg-white/20 rounded-full transition-all hover:rotate-90 duration-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area - Increased padding and improved scrolling */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-linear-to-b from-gray-50 to-white min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-md ${
                    message.sender === "user"
                      ? "bg-linear-to-r from-[#367375] to-[#24C3BC] text-white rounded-br-sm"
                      : "bg-white border-2 border-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</div>
                  <p
                    className={`text-xs mt-1.5 ${
                      message.sender === "user"
                        ? "text-white/80"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString(
                      selectedLanguage === "am" ? "am-ET" : "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white border-2 border-gray-100 rounded-2xl rounded-bl-sm px-5 py-4 shadow-md">
                  <div className="flex gap-1.5">
                    <div
                      className="w-2.5 h-2.5 bg-[#24C3BC] rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2.5 h-2.5 bg-[#24C3BC] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2.5 h-2.5 bg-[#24C3BC] rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Questions - Improved styling and layout */}
            {messages.length === 1 && !isTyping && (
              <div className="space-y-3 pt-2">
                <p className="text-sm font-medium text-gray-600 text-center">
                  {translatedUI.quickQuestionsLabel}
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-sm p-3.5 rounded-xl border-2 border-gray-200 bg-white hover:bg-linear-to-r hover:from-[#367375]/10 hover:to-[#24C3BC]/10 hover:border-[#24C3BC] transition-all text-left font-medium text-gray-700 hover:text-[#367375] shadow-sm hover:shadow-md"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Enhanced input design and spacing */}
          <div className="p-5 bg-white border-t-2 border-gray-100 shadow-lg shrink-0">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  selectedLanguage === "am"
                    ? "መልእክት ይጻፉ..."
                    : "Type your message..."
                }
                className="flex-1 px-5 py-3.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#24C3BC] focus:border-transparent text-sm bg-gray-50 placeholder:text-gray-400 transition-all"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="h-[52px] w-[52px] rounded-xl bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#367375]/90 hover:to-[#24C3BC]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg disabled:hover:scale-100"
              >
                <Send className="h-5 w-5 text-white" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3 font-medium">
              {selectedLanguage === "am"
                ? "ስለ STEMpower Ethiopia ይጠይቁ"
                : "Ask about STEMpower Ethiopia"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
