import React, { useState } from 'react';
import { Copy, Check, Volume2, VolumeX, Bot, User, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { isUrduText, formatTime, copyText } from '../utils/textHelper';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isUser = message.role === 'user';
  const isUrdu = message.isUrdu || isUrduText(message.content);

  const handleCopy = async () => {
    const success = await copyText(message.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content);

    // Pick appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (isUrdu) {
      const urduVoice = voices.find(
        (v) => v.lang.startsWith('ur') || v.lang.startsWith('ar') || v.name.toLowerCase().includes('urdu')
      );
      if (urduVoice) utterance.voice = urduVoice;
      utterance.lang = 'ur-PK';
    } else {
      const enVoice = voices.find(
        (v) => (v.lang.startsWith('en') && v.name.includes('Google') || v.name.includes('Natural'))
      );
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Simple formatting helper for text (bold, lists, verse callouts)
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Verse or quote callout starting with > or containing quotes
      if (line.trim().startsWith('>')) {
        return (
          <div
            key={idx}
            className="my-1.5 pl-3 border-l-2 border-amber-400 bg-amber-500/10 py-1 px-2 rounded-r text-amber-200 text-xs italic"
          >
            {line.replace(/^>\s*/, '')}
          </div>
        );
      }

      // List item
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().substring(2);
        return (
          <div key={idx} className="flex items-start gap-2 my-1">
            <span className="text-amber-400 text-xs mt-0.5">•</span>
            <div className="flex-1">{formatInline(itemText)}</div>
          </div>
        );
      }

      // Numbered item
      if (/^\d+\.\s/.test(line.trim())) {
        const match = line.trim().match(/^(\d+\.)\s*(.*)$/);
        if (match) {
          return (
            <div key={idx} className="flex items-start gap-2 my-1">
              <span className="text-emerald-400 text-xs font-bold">{match[1]}</span>
              <div className="flex-1">{formatInline(match[2])}</div>
            </div>
          );
        }
      }

      return (
        <p key={idx} className="my-1 leading-relaxed">
          {formatInline(line)}
        </p>
      );
    });
  };

  const formatInline = (text: string) => {
    // Process **bold** and *italic*
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-amber-200">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-slate-300">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`flex gap-3 px-2 sm:px-4 py-3 group ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <div className="relative shrink-0 flex items-start">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-emerald-800 p-0.5 shadow-md shadow-red-950/40">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-amber-300">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 text-xs">🎄</span>
        </div>
      )}

      <div
        className={`relative max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-lg transition-all ${
          isUser
            ? 'bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white rounded-tr-none border border-red-500/30'
            : 'bg-slate-900/90 text-slate-100 rounded-tl-none border border-emerald-500/20 backdrop-blur-sm'
        } ${isUrdu ? 'font-urdu text-base' : 'text-sm'}`}
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        {/* Header label for AI */}
        {!isUser && (
          <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Christmas School AI</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                School • Christmas • Bible
              </span>
            </div>
            {isUrdu && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-900/60 text-teal-200 border border-teal-500/40">
                اردو جواب
              </span>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="break-words">
          {renderFormattedText(message.content)}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-amber-400 animate-pulse rounded-sm align-middle" />
          )}
        </div>

        {/* Footer info & actions */}
        <div
          className={`flex items-center gap-2 mt-2 pt-1 text-[11px] ${
            isUser ? 'text-red-200 justify-end' : 'text-slate-400 justify-between'
          }`}
          dir="ltr"
        >
          <div className="flex items-center gap-1">
            <span>{formatTime(message.timestamp)}</span>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className={`p-1 rounded transition-colors ${
                isUser ? 'hover:bg-red-900/50' : 'hover:bg-slate-800'
              }`}
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {'speechSynthesis' in window && (
              <button
                onClick={handleSpeak}
                className={`p-1 rounded transition-colors ${
                  isUser ? 'hover:bg-red-900/50' : 'hover:bg-slate-800'
                } ${isSpeaking ? 'text-amber-400' : ''}`}
                title={isSpeaking ? 'Stop reading' : 'Read aloud'}
              >
                {isSpeaking ? (
                  <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {isUser && (
        <div className="relative shrink-0 flex items-start">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 shadow-md shadow-red-950/40">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-amber-200">
              <User className="w-5 h-5" />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 text-xs">⭐</span>
        </div>
      )}
    </div>
  );
};
