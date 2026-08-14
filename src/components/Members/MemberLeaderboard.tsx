import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Shield,
  ShoppingBag,
  Zap,
  TrendingUp,
  Share2,
  CheckCircle2,
  Star,
  Users,
  Search,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';
import { LeaderboardEntry } from '../../types';

interface MemberLeaderboardProps {
  compact?: boolean;
}

export const MemberLeaderboard: React.FC<MemberLeaderboardProps> = ({ compact = false }) => {
  const {
    leaderboardEntries,
    currentPeriod,
    messProfile,
    setIsLeaderboardModalOpen,
  } = useMess();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
  const [copiedShareText, setCopiedShareText] = useState(false);

  const filteredEntries = leaderboardEntries.filter((e) =>
    e.member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.member.roomNo && e.member.roomNo.includes(searchQuery))
  );

  const top3 = leaderboardEntries.slice(0, 3);

  const generateWhatsAppShareText = () => {
    let msg = `🏆 *${messProfile.name || 'The Shield Bachelors Mess'} — Contribution Leaderboard*\n`;
    msg += `📅 Month: *${currentPeriod.label}*\n\n`;
    leaderboardEntries.slice(0, 5).forEach((e) => {
      const medalIcon = e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : e.rank === 3 ? '🥉' : '🎖️';
      msg += `${medalIcon} *Rank #${e.rank}: ${e.member.name}* (${e.score} pts)\n`;
      msg += `   • Deposited: ৳${e.totalDeposited.toLocaleString()} | Meals: ${e.totalMeals} | Bazar Trips: ${e.bazarCount}\n`;
      msg += `   • Status: ${e.netBalance >= 0 ? `Credit +৳${e.netBalance}` : `Due -৳${Math.abs(e.netBalance)}`}\n\n`;
    });
    msg += `🌟 Keep up the great discipline & cooperation!`;
    return msg;
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppShareText();
    navigator.clipboard.writeText(text);
    setCopiedShareText(true);
    setTimeout(() => setCopiedShareText(false), 2500);

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 text-white p-3.5 rounded-xl border border-amber-900/30 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Mess Leaderboard</div>
              <div className="text-[10px] text-amber-300/80">Top Contributor: {leaderboardEntries[0]?.member.name || 'N/A'}</div>
            </div>
          </div>
          <button
            onClick={() => setIsLeaderboardModalOpen(true)}
            className="text-[11px] font-semibold text-amber-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            <span>Rankings</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Top 3 Quick Badges */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          {top3.map((entry, idx) => (
            <div
              key={entry.member.id}
              className="flex-1 bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 text-center"
            >
              <div className="text-xs">{idx === 0 ? '👑' : idx === 1 ? '🥈' : '🥉'}</div>
              <div className="text-[11px] font-bold text-slate-200 truncate mt-0.5">{entry.member.name.split(' ')[0]}</div>
              <div className="text-[10px] text-amber-400 font-bold">{entry.score} pts</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-5 p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-white flex items-center justify-center shadow-md">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Member Contribution Leaderboard</span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                {currentPeriod.label}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gamified ranking celebrating on-time deposits, bazaar duty participation, and dining consistency
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShareText ? 'Copied Bulletin!' : 'Share Rankings'}</span>
          </button>
        </div>
      </div>

      {/* Podium Display for Top 3 */}
      {top3.length >= 3 && (
        <div className="pt-2 pb-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-xl mx-auto">
            {/* Rank 2 - Silver (Left) */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2 flex flex-col items-center">
                <span className="text-2xl mb-1">🥈</span>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-400 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-sm sm:text-base shadow-sm">
                  {top3[1]?.member.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="bg-slate-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full absolute -bottom-1.5">
                  #2
                </span>
              </div>
              <div className="w-full bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700/80 rounded-t-2xl p-2.5 sm:p-3 text-center border-t-2 border-slate-400 h-28 sm:h-32 flex flex-col justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {top3[1]?.member.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Room {top3[1]?.member.roomNo || 'N/A'}
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">
                  {top3[1]?.score} <span className="text-[10px] font-medium text-slate-400">pts</span>
                </div>
              </div>
            </div>

            {/* Rank 1 - Gold (Center, Elevated) */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2 flex flex-col items-center">
                <Crown className="w-7 h-7 text-amber-500 animate-bounce mb-0.5" />
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-3 border-amber-500 flex items-center justify-center font-black text-amber-950 text-base sm:text-lg shadow-lg">
                  {top3[0]?.member.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="bg-amber-500 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full absolute -bottom-1.5 shadow-xs">
                  👑 #1 MVP
                </span>
              </div>
              <div className="w-full bg-gradient-to-t from-amber-100 to-amber-50 dark:from-amber-950/80 dark:to-amber-900/40 rounded-t-2xl p-2.5 sm:p-3 text-center border-t-3 border-amber-500 h-36 sm:h-40 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-100 truncate">
                    {top3[0]?.member.name}
                  </div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold">
                    Room {top3[0]?.member.roomNo || 'N/A'}
                  </div>
                </div>
                <div className="text-sm sm:text-base font-black text-amber-700 dark:text-amber-300">
                  {top3[0]?.score} <span className="text-[10px] font-bold text-amber-500">pts</span>
                </div>
              </div>
            </div>

            {/* Rank 3 - Bronze (Right) */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2 flex flex-col items-center">
                <span className="text-2xl mb-1">🥉</span>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-900/20 dark:bg-amber-900/40 border-2 border-amber-700/60 flex items-center justify-center font-bold text-amber-800 dark:text-amber-200 text-sm sm:text-base shadow-sm">
                  {top3[2]?.member.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="bg-amber-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full absolute -bottom-1.5">
                  #3
                </span>
              </div>
              <div className="w-full bg-gradient-to-t from-orange-100 to-orange-50 dark:from-orange-950/60 dark:to-orange-900/30 rounded-t-2xl p-2.5 sm:p-3 text-center border-t-2 border-amber-700/60 h-24 sm:h-28 flex flex-col justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {top3[2]?.member.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Room {top3[2]?.member.roomNo || 'N/A'}
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-black text-amber-800 dark:text-amber-200">
                  {top3[2]?.score} <span className="text-[10px] font-medium text-slate-400">pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search member by name or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Showing <strong>{filteredEntries.length}</strong> active boarders
        </div>
      </div>

      {/* Complete Rankings List */}
      <div className="space-y-2.5">
        {filteredEntries.map((entry) => (
          <div
            key={entry.member.id}
            onClick={() => setSelectedEntry(selectedEntry?.member.id === entry.member.id ? null : entry)}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              entry.rank === 1
                ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 shadow-xs'
                : entry.rank <= 3
                ? 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              {/* Rank & Avatar */}
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    entry.rank === 1
                      ? 'bg-amber-500 text-slate-950'
                      : entry.rank === 2
                      ? 'bg-slate-400 text-white'
                      : entry.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {entry.rank}
                </span>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {entry.member.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      (Room {entry.member.roomNo || 'N/A'})
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                    {entry.badges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700"
                        title={badge.desc}
                      >
                        <span>{badge.icon}</span>
                        <span>{badge.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Score & Quick Stats */}
              <div className="text-right shrink-0">
                <div className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400">
                  {entry.score} <span className="text-[10px] font-bold text-slate-400">pts</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  ৳{entry.totalDeposited.toLocaleString()} deposited • {entry.totalMeals} meals
                </div>
              </div>
            </div>

            {/* Expandable Score Breakdown */}
            {selectedEntry?.member.id === entry.member.id && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs animate-in fade-in duration-150">
                <div className="bg-slate-100 dark:bg-slate-800/80 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Deposit Velocity</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">
                    ৳{entry.totalDeposited.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/80 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Bazaar Runs</div>
                  <div className="font-bold text-amber-600 dark:text-amber-400">
                    {entry.bazarCount} trips
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/80 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Meal Regularity</div>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">
                    {entry.totalMeals} meals
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/80 p-2 rounded-lg">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Credit Health</div>
                  <div className={`font-bold ${entry.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {entry.netBalance >= 0 ? `+৳${entry.netBalance}` : `-৳${Math.abs(entry.netBalance)}`}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rules Info Footer */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong>How are points calculated?</strong> Points are awarded based on deposit amount (1.5 pts / ৳100), meals logged (2.5 pts / meal), bazaar shopping duty (+35 pts / trip), 45-meal benchmark bonus (+50 pts), and positive credit buffer balance (+40 pts).
        </p>
      </div>
    </div>
  );
};
