/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { SuggestedPrompts } from './components/SuggestedPrompts';
import { SchoolDirectoryModal } from './components/SchoolDirectoryModal';
import { SnowEffect } from './components/SnowEffect';
import { Message } from './types';
import { Sparkles, School, BookOpen, Gift, Globe2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_WELCOME_MESSAGE: Message = {
  id: 'welcome-msg',
  role: 'model',
  content: `### Welcome to Christmas School AI! 🎄🤖

I am your friendly, cheerful assistant for **Christmas School**. Everything you need is right here in this one chat:

- 🏫 **Christmas School Info:** Ask about our staff (Principal Elijah Victor, Host Elijah, Admin Anum, Teacher Aroush), students (Arnan, Eliab, and Balaj), location, or daily program timing (**6:00–6:50 PM**).
- 🎄 **Christmas Cheer & Activities:** Festive games, Christmas traditions, and joyful school activities.
- 📖 **Bible Assistance:** Bible stories (Nativity, Gospels, parables), Christian teachings on kindness and faith, and verse references with clear explanations.
- 🇵🇰 **اردو بائبل اور سکول:** آپ مجھ سے اردو میں بائبل کی کہانیاں، تعلیمات، آیات کے حوالے یا کرسمس سکول کے متعلق سوالات پوچھ سکتے ہیں!

How can I help you today? Feel free to ask a question below or choose a suggested topic! ✨`,
  timestamp: Date.now(),
  isUrdu: false,
};

const STORAGE_KEY = 'christmas_school_ai_messages_v2';

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved messages:', e);
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [snowEnabled, setSnowEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Save conversation in session
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not save messages to sessionStorage:', e);
    }
  }, [messages]);

  // Scroll to bottom on new messages
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isLoading]);

  // Send message handler with streaming support
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    const tempBotMessageId = `model-${Date.now()}`;
    const initialBotMessage: Message = {
      id: tempBotMessageId,
      role: 'model',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, initialBotMessage]);
    setIsLoading(true);

    try {
      // Send chat request to backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      // Check if response is streaming SSE
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream') && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const dataPayload = trimmed.slice(6);
              if (dataPayload === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(dataPayload);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === tempBotMessageId
                        ? { ...msg, content: accumulatedText }
                        : msg
                    )
                  );
                } else if (parsed.error) {
                  accumulatedText = `🎄 Notice: ${parsed.error}`;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === tempBotMessageId
                        ? { ...msg, content: accumulatedText, error: true }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // Non-JSON line, continue
              }
            }
          }
        }

        // Finalize streaming
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempBotMessageId
              ? {
                  ...msg,
                  content: accumulatedText || 'Joy to the World! 🎄 How else can I help you?',
                  isStreaming: false,
                }
              : msg
          )
        );
      } else {
        // Fallback non-streaming response
        const data = await response.json();
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempBotMessageId
              ? {
                  ...msg,
                  content: data.text || 'Joy to the World! 🎄 How else can I help you?',
                  isStreaming: false,
                }
              : msg
          )
        );
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempBotMessageId
            ? {
                ...msg,
                content:
                  '🎄 Christmas School AI is temporarily unable to connect to the server. Please check your connection and try again!',
                isStreaming: false,
                error: true,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.1 },
      colors: ['#ef4444', '#10b981', '#fbbf24'],
    });
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleClearChat = () => {
    handleNewChat();
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-[#071f16] to-slate-950 text-slate-100 font-sans">
      {/* Snowfall background */}
      <SnowEffect enabled={snowEnabled} />

      {/* Header with "Christmas School AI 🎄🤖" */}
      <Header
        onNewChat={handleNewChat}
        onClearChat={handleClearChat}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        snowEnabled={snowEnabled}
        onToggleSnow={() => setSnowEnabled(!snowEnabled)}
        messageCount={messages.length}
      />

      {/* Main Chat Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 flex flex-col justify-between relative z-20">
        {/* Messages Feed */}
        <div className="flex-1 space-y-3 pb-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* AI Typing / Loading Indicator */}
          {isLoading && messages[messages.length - 1]?.content === '' && (
            <div className="flex items-center gap-3 px-4 py-3 animate-in fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-emerald-700 p-0.5 shadow-md">
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl rounded-tl-none bg-slate-900/90 border border-emerald-500/20 text-xs text-slate-300 shadow-md">
                <span className="text-amber-300 font-medium">Christmas School AI is thinking</span>
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          {/* If only welcome message is present, show Suggested Prompts directly */}
          {messages.length === 1 && (
            <div className="pt-2 pb-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Explore Topics & Quick Starters:</span>
              </div>
              <SuggestedPrompts onSelectPrompt={handleSendMessage} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar area */}
        <div className="sticky bottom-2 z-30 pt-2">
          {/* Quick topics bar when there are ongoing messages */}
          {messages.length > 1 && (
            <div className="mb-2 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar py-1">
              <button
                onClick={() => setIsDirectoryOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/30 whitespace-nowrap flex items-center gap-1"
              >
                <School className="w-3 h-3 text-emerald-400" />
                School Directory (6:00–6:50 PM)
              </button>
              <button
                onClick={() => handleSendMessage('What is the schedule for Christmas School from 6:00 to 6:50?')}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap"
              >
                ⏰ Program Timing
              </button>
              <button
                onClick={() => handleSendMessage('Who is Principal Elijah Victor and Teacher Aroush?')}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap"
              >
                👥 Staff & Students
              </button>
              <button
                onClick={() => handleSendMessage('Explain the Christmas story from Luke 2 with key Bible verses.')}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap"
              >
                📖 Nativity Story
              </button>
              <button
                onClick={() => handleSendMessage('مقدس یوحنا 3:16 کا حوالہ اور سادہ مفہوم بتائیں (Urdu)')}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-teal-300 font-urdu border border-teal-800/60 whitespace-nowrap"
              >
                🇵🇰 اردو بائبل
              </button>
            </div>
          )}

          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>

      {/* School Directory Modal */}
      <SchoolDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        onSelectPrompt={handleSendMessage}
      />
    </div>
  );
}
