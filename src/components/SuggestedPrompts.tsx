import React, { useState } from 'react';
import { School, Sparkles, BookOpen, Globe2, Gift, HeartHandshake } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

type Category = 'all' | 'school' | 'christmas' | 'bible' | 'urdu';

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const prompts = [
    {
      category: 'school',
      icon: '🏫',
      title: 'Program Time & Schedule',
      query: 'What time does the Christmas School program run, and what is its address?',
      tag: 'School Info',
    },
    {
      category: 'school',
      icon: '👥',
      title: 'Staff & Students',
      query: 'Who are the Principal, Admin, Teacher, Host, and Students at Christmas School?',
      tag: 'Staff',
    },
    {
      category: 'christmas',
      icon: '🎮',
      title: 'Christmas Games for Kids',
      query: 'What are 4 fun, joyful Christmas games we can play at Christmas School?',
      tag: 'Games',
    },
    {
      category: 'christmas',
      icon: '⭐',
      title: 'The Christmas Story',
      query: 'Explain the Christmas story of Jesus’ birth from Luke 2 in simple, beautiful words for children.',
      tag: 'Christmas',
    },
    {
      category: 'bible',
      icon: '📖',
      title: 'John 3:16 Explanation',
      query: 'What is the message of John 3:16? Please provide the verse reference and a simple explanation.',
      tag: 'Bible Verse',
    },
    {
      category: 'bible',
      icon: '🕊️',
      title: 'Faith & Kindness',
      query: 'What does the Bible teach about being kind and loving our neighbors at Christmas time?',
      tag: 'Teachings',
    },
    {
      category: 'urdu',
      icon: '🇵🇰',
      title: 'کرسمس سکول کے بارے میں (Urdu)',
      query: 'کرسمس سکول کا پروگرام کس وقت شروع ہوتا ہے اور اس کے پرنسپل اور استاد کون ہیں؟',
      tag: 'اردو سکول',
      isUrdu: true,
    },
    {
      category: 'urdu',
      icon: '✨',
      title: 'یسوع مسیح کی ولادت کی کہانی (Urdu)',
      query: 'لوقا باب 2 سے یسوع مسیح کی پیدائش کی خوشخبری آسان اردو میں سنائیں۔',
      tag: 'اردو بائبل',
      isUrdu: true,
    },
  ];

  const filtered =
    activeCategory === 'all'
      ? prompts
      : prompts.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full space-y-3.5">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCategory === 'all'
              ? 'bg-red-700 text-white shadow-md shadow-red-900/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          All Topics
        </button>

        <button
          onClick={() => setActiveCategory('school')}
          className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCategory === 'school'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <School className="w-3.5 h-3.5 text-emerald-300" />
          Christmas School 🏫
        </button>

        <button
          onClick={() => setActiveCategory('christmas')}
          className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCategory === 'christmas'
              ? 'bg-red-700 text-white shadow-md shadow-red-900/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Gift className="w-3.5 h-3.5 text-amber-300" />
          Christmas & Activities 🎄
        </button>

        <button
          onClick={() => setActiveCategory('bible')}
          className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCategory === 'bible'
              ? 'bg-amber-700 text-white shadow-md shadow-amber-900/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
          Bible Help 📖
        </button>

        <button
          onClick={() => setActiveCategory('urdu')}
          className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeCategory === 'urdu'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5 text-emerald-300" />
          اردو بائبل و سکول 🇵🇰
        </button>
      </div>

      {/* Quick Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filtered.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.query)}
            className="group relative p-3.5 rounded-xl text-left bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/40 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xl">{item.icon}</span>
                <span
                  className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded ${
                    item.category === 'school'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                      : item.category === 'christmas'
                      ? 'bg-red-950 text-red-300 border border-red-800/60'
                      : item.category === 'urdu'
                      ? 'bg-teal-950 text-teal-300 border border-teal-800/60'
                      : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                  }`}
                >
                  {item.tag}
                </span>
              </div>
              <h4
                className={`text-xs font-semibold text-slate-200 group-hover:text-amber-200 transition-colors line-clamp-1 ${
                  item.isUrdu ? 'font-urdu text-sm' : ''
                }`}
              >
                {item.title}
              </h4>
              <p
                className={`text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed ${
                  item.isUrdu ? 'font-urdu text-xs text-slate-300' : ''
                }`}
              >
                "{item.query}"
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-emerald-400">
              <span>Ask in chat</span>
              <span>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
