"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaTimes, FaMinus, FaPaperPlane } from "@/lib/icons";
import ChatMessage from "./ChatMessage";
import SuggestedQuestions from "./SuggestedQuestions";
import ChatIndicator from "./ChatIndicator";
import {
  trackChatbotOpen,
  trackChatbotClose,
  trackChatbotMinimize,
  trackChatbotMessage,
  trackChatbotSuggestedQuestion,
  trackChatbotError,
  trackChatbotConversation,
  trackChatbotClear
} from "@/lib/analytics";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AI_API_ENDPOINT = process.env.NEXT_PUBLIC_CHATBOT_API_URL || '';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm Niloy Kumar Barman's AI assistant. Ask me about his projects, skills, or experience!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationStartTime, setConversationStartTime] = useState<number>(Date.now());
  const [sessionId, setSessionId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Unique IDs for accessibility
  const chatTitleId = useId();
  const chatDescId = useId();
  const inputLabelId = useId();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      // Reset height to auto to get correct scrollHeight
      textarea.style.height = 'auto';
      // Set height to scrollHeight, max 96px (max-h-24 = 6rem = 96px)
      const newHeight = Math.min(textarea.scrollHeight, 96);
      textarea.style.height = `${newHeight}px`;
    }
  }, [inputMessage]);

  // Initialize or retrieve session ID from localStorage
  useEffect(() => {
    const getOrCreateSessionId = () => {
      let sid = localStorage.getItem('chatbot-session-id');
      if (!sid) {
        sid = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chatbot-session-id', sid);
      }
      return sid;
    };
    setSessionId(getOrCreateSessionId());
  }, []);

  // Send message to AI
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Track message sent
    trackChatbotMessage(messageText.trim(), messageText.trim().length);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      // Build conversation history (last 4 messages) with timestamps
      const conversationHistory = messages.slice(-4).map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }));

      const response = await fetch(AI_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText.trim(),
          conversationHistory,
          sessionId,
          metadata: {
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            pageUrl: window.location.href,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 429) {
          throw new Error(errorData.error || 'Too many requests. Please wait a minute.');
        }

        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(data.timestamp || new Date())
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: unknown) {
      console.error('Chatbot error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Sorry, I encountered an error. Please try again.';
      const errorType = err instanceof Error ? err.name : 'UnknownError';

      // Track error
      trackChatbotError(errorType, errorMessage);

      setError(errorMessage);

      // Add error message to chat
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      const chatErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${errMsg}. Please try again or contact Niloy Kumar Barman directly through the contact form.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, chatErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (question: string) => {
    // Track suggested question click
    trackChatbotSuggestedQuestion(question);
    sendMessage(question);
  };

  // Handle Enter key (without Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Clear conversation
  const clearConversation = () => {
    // Track conversation clear (exclude welcome message)
    const userMessagesCount = messages.filter(m => m.role === 'user').length;
    trackChatbotClear(userMessagesCount);

    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm Niloy Kumar Barman's AI assistant. Ask me about his projects, skills, or experience!",
      timestamp: new Date()
    }]);
    setError(null);

    // Reset conversation timer
    setConversationStartTime(Date.now());

    // Generate new session ID for fresh conversation
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatbot-session-id', newSessionId);
    setSessionId(newSessionId);
  };

  // Handle open/close/minimize with tracking
  const handleOpen = () => {
    setIsOpen(true);
    setConversationStartTime(Date.now());
    trackChatbotOpen();
  };

  const handleClose = () => {
    // Track conversation end with metrics
    const userMessagesCount = messages.filter(m => m.role === 'user').length;
    const durationSeconds = Math.floor((Date.now() - conversationStartTime) / 1000);

    if (userMessagesCount > 0) {
      trackChatbotConversation(userMessagesCount, durationSeconds);
    }

    trackChatbotClose();
    setIsOpen(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    trackChatbotMinimize();
  };

  // Handle Escape key to close chat
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, messages, conversationStartTime]);

  return (
    <>
      {/* Chat Indicator - Animated arrow and tooltip pointing to chat icon */}
      <ChatIndicator isVisible={!isOpen} />

      {/* Floating Button (when chat is closed) - Fixed position */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-secondary-default to-blue-500 text-primary shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all flex items-center justify-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]"
              aria-label="Open AI chatbot assistant"
            >
              <FaRobot className="text-2xl group-hover:scale-110 transition-transform" aria-hidden="true" />

              {/* Pulse animation ring */}
              <span className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Window - Responsive positioning */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={chatTitleId}
            aria-describedby={chatDescId}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed z-[9999] bg-gradient-to-br from-[#1a1a2e] via-[#16162a] to-[#0f0f1a] border border-purple-500/20 rounded-xl shadow-2xl shadow-purple-500/10 ${
              isMinimized
                ? 'bottom-6 right-6 w-80 h-14'
                : 'bottom-4 right-4 left-4 sm:left-auto sm:w-[400px] h-[85vh] sm:h-[600px] max-h-[700px]'
            } flex flex-col overflow-hidden`}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-purple-500/20 via-secondary-default/20 to-blue-500/20 border-b border-purple-500/20 p-3 sm:p-4 flex items-center justify-between backdrop-blur-sm">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500/30 to-secondary-default/30 rounded-lg">
                  <FaRobot className="text-purple-400 text-lg sm:text-xl" aria-hidden="true" />
                </div>
                <div>
                  <h3 id={chatTitleId} className="font-bold text-sm bg-gradient-to-r from-purple-400 to-secondary-default bg-clip-text text-transparent">Niloy Kumar Barman&apos;s AI Assistant</h3>
                  <p id={chatDescId} className="text-[10px] sm:text-xs text-white/60">Online - Ask about projects, skills, or experience</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Minimize button */}
                <button
                  onClick={handleMinimize}
                  className="hover:bg-white/10 p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label={isMinimized ? "Expand chat window" : "Minimize chat window"}
                >
                  <FaMinus className="text-sm" aria-hidden="true" />
                </button>

                {/* Close button */}
                <button
                  ref={closeButtonRef}
                  onClick={handleClose}
                  className="hover:bg-white/10 p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label="Close chatbot (Press Escape)"
                >
                  <FaTimes className="text-sm" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                  role="log"
                  aria-live="polite"
                  aria-label="Chat messages"
                >
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-white/60 text-sm" role="status" aria-label="Generating response">
                      <div className="flex gap-1" aria-hidden="true">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-secondary-default rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="bg-gradient-to-r from-purple-400 to-secondary-default bg-clip-text text-transparent">Thinking...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions (only show at start) */}
                {messages.length <= 1 && (
                  <SuggestedQuestions onSelect={handleSuggestedQuestion} />
                )}

                {/* Error Message */}
                {error && (
                  <div role="alert" className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="border-t border-purple-500/20 p-3 sm:p-4 bg-gradient-to-t from-purple-500/5 to-transparent">
                  <label htmlFor={inputLabelId} className="sr-only">
                    Type your message to the AI assistant
                  </label>
                  <div className="flex items-end gap-2">
                    <textarea
                      id={inputLabelId}
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about Niloy Kumar Barman's work..."
                      className="flex-1 bg-white/5 border border-purple-500/30 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus:border-purple-500/50 transition-all max-h-24 overflow-y-auto hide-scrollbar placeholder:text-white/40"
                      rows={1}
                      maxLength={500}
                      disabled={isLoading}
                      aria-describedby="chat-input-hint"
                    />

                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-gradient-to-br from-purple-500 via-secondary-default to-blue-500 text-primary p-2.5 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]"
                      aria-label="Send message"
                    >
                      <FaPaperPlane className="text-sm" aria-hidden="true" />
                    </button>
                  </div>

                  <div id="chat-input-hint" className="flex items-center justify-between mt-2 text-xs text-white/40">
                    <span>Press Enter to send</span>
                    <button
                      type="button"
                      onClick={clearConversation}
                      className="hover:text-purple-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
                      aria-label="Clear all chat messages"
                    >
                      Clear chat
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
