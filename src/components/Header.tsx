import React from 'react';
import { PlusCircle, Trash2, School, Snowflake, Volume2, VolumeX, Bell, BellOff } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeaderProps {
  onNewChat: () => void;
  onClearChat: () => void;
  onOpenDirectory: () => void;
  snowEnabled: boolean;
  onToggleSnow: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  messageCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewChat,
  onClearChat,
  onOpenDirectory,
  snowEnabled,
  onToggleSnow,
  autoSpeak,
  onToggleAutoSpeak,
  soundEnabled,
  onToggleSound,
  messageCount,
}) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.2 },
      colors: ['#ef4444', '#10b981', '#fbbf24', '#ffffff'],
    });
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-emerald-500/20 bg-slate-950/85 backdrop-blur-md">
      {/* Festive decorative top stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-amber-400 to-emerald-600" />

      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand / Title: "Christmas School AI 🎄🤖" */}
        <div className="flex items-center gap-2.5">
          <div
            onClick={triggerConfetti}
            className="cursor-pointer relative p-2 rounded-xl bg-gradient-to-br from-red-600 via-emerald-800 to-amber-700 shadow-md shadow-emerald-950/50 hover:scale-105 transition-transform"
            title="Click for Christmas Sparkles!"
          >
            <span className="text-xl">🎄</span>
            <span className="absolute -bottom-1 -right-1 text-xs">🤖</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-bold font-festive tracking-wide text-slate-100 flex items-center gap-1.5">
                <span>Christmas School AI</span>
                <span className="text-base">🎄🤖</span>
              </h1>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Chat
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-amber-300">
                <span>⏰</span>
                <span>Program: 6:00–6:50 PM</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="hidden sm:inline">Punjab, HMC, St #1</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Auto-Speak / Voice Chat Toggle */}
          <button
            onClick={onToggleAutoSpeak}
            className={`px-2 py-1.5 rounded-xl text-xs font-medium transition-all border flex items-center gap-1 ${
              autoSpeak
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20 ring-1 ring-amber-400/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title={autoSpeak ? 'Voice Chat Active: AI speaks replies aloud' : 'Enable Voice Chat (Read aloud AI replies)'}
          >
            {autoSpeak ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden md:inline">Voice On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Voice Off</span>
              </>
            )}
          </button>

          {/* Sound Chimes Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-xl text-xs font-medium transition-colors border flex items-center gap-1 ${
              soundEnabled
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Holiday Chimes Enabled' : 'Holiday Chimes Muted'}
          >
            {soundEnabled ? (
              <Bell className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <BellOff className="w-3.5 h-3.5" />
            )}
          </button>

          {/* School Directory Button */}
          <button
            onClick={onOpenDirectory}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/30 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            title="View Christmas School verified info"
          >
            <School className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">School Info</span>
          </button>

          {/* Snow toggle */}
          <button
            onClick={onToggleSnow}
            className={`p-1.5 rounded-xl text-xs font-medium transition-colors border flex items-center gap-1 ${
              snowEnabled
                ? 'bg-blue-950/80 text-cyan-200 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title={snowEnabled ? 'Pause snowfall' : 'Start snowfall'}
          >
            <Snowflake className={`w-3.5 h-3.5 ${snowEnabled ? 'text-cyan-300 animate-spin-slow' : ''}`} />
          </button>

          {/* New Chat */}
          <button
            onClick={onNewChat}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            title="Start a new chat session"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* Clear Chat */}
          {messageCount > 1 && (
            <button
              onClick={onClearChat}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-500/40 text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Clear all chat messages"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
