import React from 'react';
import { useMess } from '../../context/MessContext';
import { ColorTheme } from '../../types';
import {
  Palette,
  Sun,
  Moon,
  MousePointer,
  Sparkles,
  Check,
  X,
  Layers,
  Eye,
  Zap,
} from 'lucide-react';

export const ThemeModal: React.FC = () => {
  const {
    isThemeModalOpen,
    setIsThemeModalOpen,
    darkMode,
    setDarkMode,
    colorTheme,
    setColorTheme,
    customCursorEnabled,
    setCustomCursorEnabled,
  } = useMess();

  if (!isThemeModalOpen) return null;

  const themesList: {
    id: ColorTheme;
    name: string;
    description: string;
    primaryBg: string;
    accentBg: string;
    gradient: string;
    border: string;
  }[] = [
    {
      id: 'emerald',
      name: 'Emerald Shield',
      description: 'Classic Shield Mess theme with vibrant emerald & teal accents',
      primaryBg: 'bg-emerald-600',
      accentBg: 'bg-teal-500',
      gradient: 'from-emerald-600 to-teal-500',
      border: 'border-emerald-500',
    },
    {
      id: 'sapphire',
      name: 'Sapphire Navy',
      description: 'Royal navy blue with electric blue highlights',
      primaryBg: 'bg-blue-600',
      accentBg: 'bg-cyan-500',
      gradient: 'from-blue-600 to-cyan-500',
      border: 'border-blue-500',
    },
    {
      id: 'amber',
      name: 'Amber Gold',
      description: 'Warm golden honey with energetic orange accents',
      primaryBg: 'bg-amber-600',
      accentBg: 'bg-orange-500',
      gradient: 'from-amber-600 to-orange-500',
      border: 'border-amber-500',
    },
    {
      id: 'rose',
      name: 'Rose Crimson',
      description: 'Ruby rose pink with vibrant coral tones',
      primaryBg: 'bg-rose-600',
      accentBg: 'bg-pink-500',
      gradient: 'from-rose-600 to-pink-500',
      border: 'border-rose-500',
    },
    {
      id: 'cyber',
      name: 'Cyber Neon',
      description: 'Futuristic cyan with bright mint neon glows',
      primaryBg: 'bg-cyan-600',
      accentBg: 'bg-emerald-400',
      gradient: 'from-cyan-600 to-emerald-400',
      border: 'border-cyan-500',
    },
    {
      id: 'obsidian',
      name: 'Obsidian Gold',
      description: 'High-contrast luxury charcoal with electric lime-gold highlights',
      primaryBg: 'bg-lime-600',
      accentBg: 'bg-emerald-500',
      gradient: 'from-lime-600 to-emerald-500',
      border: 'border-lime-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                <span>Visual Themes & Effects</span>
                <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                  Customization
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize color palettes, hover shine effects, and smooth custom cursor
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Light / Dark Mode & Custom Cursor Switches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Dark / Light Toggle */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Appearance Mode</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {darkMode ? 'Dark Atmosphere' : 'Light Canvas'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 transition cursor-pointer flex items-center gap-1.5"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{darkMode ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          {/* Custom Cursor Toggle */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MousePointer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Custom Cursor</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {customCursorEnabled ? 'Smooth Ring Active' : 'Native Browser Cursor'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCustomCursorEnabled(!customCursorEnabled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                customCursorEnabled
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>{customCursorEnabled ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>
        </div>

        {/* 2. Color Theme Presets */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Select Color Palette Theme</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {themesList.map((t) => {
              const isSelected = colorTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setColorTheme(t.id)}
                  className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer group hover-lift ${
                    isSelected
                      ? `bg-slate-100 dark:bg-slate-800/90 ${t.border} ring-2 ring-emerald-500/40 shadow-md`
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/70 hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${t.gradient} shadow-xs`} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</span>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                    {t.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Live Interactive Hover Effects Preview */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-500" />
              <span>Hover Effects & Animation Showcase</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Hover cards below to test</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Hover Shine Effect */}
            <div className="hover-shine hover-lift p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs group cursor-pointer">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Hover Shine</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Diagonal shimmer sweep across card on hover
              </p>
            </div>

            {/* Hover Border Glow */}
            <div className="hover-border-glow hover-lift p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs group cursor-pointer">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Glowing Border</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Soft neon radial halo overlay
              </p>
            </div>

            {/* Hover Underline Accent */}
            <div className="hover-lift p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs group cursor-pointer">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span className="hover-underline-accent">3D Spring Lift</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Micro-elevation & underline expansion
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
