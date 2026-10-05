import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Languages, X, Mic, MicOff } from 'lucide-react';
import { isUrduText } from '../utils/textHelper';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [showUrduSuggestions, setShowUrduSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [speechLang, setSpeechLang] = useState<'auto' | 'ur' | 'en'>('auto');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const isUrdu = isUrduText(text);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setMicSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setText((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${transcript}` : transcript;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (speechLang === 'ur' || isUrdu) {
          recognitionRef.current.lang = 'ur-PK';
        } else {
          recognitionRef.current.lang = 'en-US';
        }
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Error starting speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;

    onSendMessage(text.trim());
    setText('');

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickUrdu = (phrase: string) => {
    setText((prev) => (prev ? `${prev} ${phrase}` : phrase));
    setShowUrduSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const urduQuickPhrases = [
    { text: 'کرسمس مبارک ہو! 🎄', label: 'Merry Christmas' },
    { text: 'کرسمس سکول کا پروگرام کس وقت ہے؟', label: 'Program Time' },
    { text: 'پرنسپل اور استاد کون ہیں؟', label: 'Staff' },
    { text: 'لوقا 2 سے یسوع کی ولادت کی کہانی سنائیں', label: 'Luke 2 Story' },
    { text: 'مقدس یوحنا 3:16 کا حوالہ اور مفہوم بتائیں', label: 'John 3:16' },
    { text: 'کرسمس کے لیے بچوں کے کھیل بتائیں', label: 'Kids Games' },
  ];

  return (
    <div className="w-full relative space-y-2">
      {/* Quick Urdu helper popup */}
      {showUrduSuggestions && (
        <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-xl shadow-xl space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold border-b border-slate-800 pb-1.5">
            <span className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              فوری اردو جملے (Urdu Quick Phrases):
            </span>
            <button
              onClick={() => setShowUrduSuggestions(false)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
            {urduQuickPhrases.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickUrdu(phrase.text)}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-emerald-950 text-right font-urdu text-sm text-slate-200 hover:text-white border border-slate-700/60 hover:border-emerald-500/40 transition-colors flex justify-between items-center"
                dir="rtl"
              >
                <span>{phrase.text}</span>
                <span className="text-[10px] text-slate-400 font-sans mr-2">
                  ({phrase.label})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Box */}
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-end gap-2 bg-slate-900/90 border transition-all rounded-2xl p-2.5 shadow-2xl backdrop-blur-md ${
          isListening
            ? 'border-red-500 ring-2 ring-red-500/40'
            : 'border-emerald-500/30 focus-within:border-amber-400/80 focus-within:ring-2 focus-within:ring-amber-500/20'
        }`}
      >
        {/* Urdu Keyboard Helper Toggle */}
        <button
          type="button"
          onClick={() => setShowUrduSuggestions(!showUrduSuggestions)}
          className={`p-2 rounded-xl transition-colors flex items-center gap-1 text-xs shrink-0 ${
            showUrduSuggestions
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Urdu Phrases Helper"
        >
          <Languages className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline font-urdu text-xs">اردو</span>
        </button>

        {/* Microphone / Voice Input button */}
        {micSupported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-xl transition-all flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-600/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title={isListening ? 'Stop listening (Voice)' : 'Talk with Voice (English / Urdu)'}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4 text-amber-300" />
            )}
          </button>
        )}

        {/* Text Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            dir={isUrdu ? 'rtl' : 'ltr'}
            placeholder={
              isListening
                ? '🎙️ Listening... Speak now in English or Urdu...'
                : isUrdu
                ? 'کرسمس سکول، بائبل یا کرسمس کے بارے میں کچھ بھی پوچھیں...'
                : 'Ask about Christmas School, Christmas games, Bible, or Urdu Bible...'
            }
            className={`w-full bg-transparent text-slate-100 placeholder:text-slate-400 focus:outline-none resize-none px-2 py-1.5 leading-normal max-h-36 ${
              isUrdu ? 'font-urdu text-base' : 'text-sm'
            }`}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className={`shrink-0 p-2.5 rounded-xl flex items-center justify-center transition-all ${
            !text.trim() || isLoading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-900/40 hover:scale-105 active:scale-95'
          }`}
          title="Send message (Enter)"
        >
          {isLoading ? (
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      {/* Helpful Hint beneath input */}
      <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          {isListening ? (
            <span className="text-red-400 font-semibold flex items-center gap-1 animate-pulse">
              🔴 Mic Active • Speaking...
            </span>
          ) : (
            <>
              <span className="text-amber-400">🎄 Press Enter</span> to send • Shift+Enter for new line
            </>
          )}
        </span>
        <span className="hidden sm:inline text-slate-400">
          Type or 🎙️ Speak in English or اردو
        </span>
      </div>
    </div>
  );
};
