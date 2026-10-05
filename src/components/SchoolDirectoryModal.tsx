import React from 'react';
import { X, School, Clock, MapPin, User, GraduationCap, Sparkles, MessageSquareHeart } from 'lucide-react';

interface SchoolDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const SchoolDirectoryModal: React.FC<SchoolDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-emerald-950 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Festive Header Garland */}
        <div className="bg-gradient-to-r from-red-900 via-emerald-900 to-red-900 px-6 py-4 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎄</span>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-amber-200 flex items-center gap-2">
                Christmas School Directory
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 border border-emerald-400/30">
                  Verified Facts
                </span>
              </h2>
              <p className="text-xs text-slate-300">Official information recognized by Christmas School AI 🤖</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800/60 text-slate-300 hover:text-white hover:bg-red-800/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Program Timing Highlight */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-300">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
                  Program Schedule
                </div>
                <div className="text-lg font-bold text-white">6:00 – 6:50 PM</div>
                <div className="text-xs text-slate-300">Daily Christmas School session timing</div>
              </div>
            </div>
            <button
              onClick={() => {
                onSelectPrompt('What activities happen during the 6:00 to 6:50 program at Christmas School?');
                onClose();
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 transition-colors flex items-center gap-1.5"
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
              Ask AI
            </button>
          </div>

          {/* Grid of School Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Leadership & Staff */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm border-b border-emerald-500/20 pb-2">
                <User className="w-4 h-4 text-emerald-400" />
                Staff & Leadership
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Principal:</span>
                  <span className="font-semibold text-slate-100">Elijah Victor</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Host:</span>
                  <span className="font-semibold text-slate-100">Elijah</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Admin:</span>
                  <span className="font-semibold text-slate-100">Anum</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Teacher:</span>
                  <span className="font-semibold text-slate-100">Aroush</span>
                </div>
              </div>
            </div>

            {/* Students & Classes */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-red-500/20 space-y-3">
              <div className="flex items-center gap-2 text-red-300 font-semibold text-sm border-b border-red-500/20 pb-2">
                <GraduationCap className="w-4 h-4 text-red-400" />
                Enrolled Students
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-700/40">
                  <span className="font-medium text-slate-200">Arnan</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-500/30">
                    Student
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-700/40">
                  <span className="font-medium text-slate-200">Eliab</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-500/30">
                    Student
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-700/40">
                  <span className="font-medium text-slate-200">Balaj</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-500/30">
                    Student
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 italic pt-1">
                  Christmas School provides dedicated biblical and festive learning for its students.
                </p>
              </div>
            </div>

            {/* Location & Address */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-emerald-500/20 space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm border-b border-emerald-500/20 pb-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Address & Campus Location
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">School Location:</span>
                  <span className="font-medium text-amber-200 text-sm">Punjab, HMC, Street Number 1</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Principal's House:</span>
                  <span className="font-medium text-amber-200 text-sm">Punjab, HMC, Street Number 1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick AI Prompt Suggestions */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick questions for the AI:
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Tell me about Christmas School staff and students.',
                'What is the address and program time for Christmas School?',
                'کرسمس سکول کے پرنسپل، استاد اور وقت کے بارے میں بتائیں (Urdu)',
                'Suggest festive Christmas games for Arnan, Eliab, and Balaj.',
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectPrompt(query);
                    onClose();
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900/60 text-slate-300 hover:text-white border border-slate-700 hover:border-emerald-500/40 transition-colors text-left"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
