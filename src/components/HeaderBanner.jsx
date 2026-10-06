import React from 'react';
import { Heart, Sparkles, RefreshCw, Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function HeaderBanner({ currentUser, setCurrentUser, users, settings, onRefresh, stats }) {
  const currentProfile = users[currentUser] || {};
  const otherUser = currentUser === 'user1' ? 'user2' : 'user1';
  const otherProfile = users[otherUser] || {};

  // Calculate days together
  const getDaysTogether = () => {
    if (!settings?.anniversaryDate) return 0;
    const start = new Date(settings.anniversaryDate);
    const now = new Date();
    const diff = now - start;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  // Calculate days until next 22nd
  const getDaysUntil22nd = () => {
    const now = new Date();
    const targetDay = settings?.anniversaryDay || 22;
    const currentDay = now.getDate();
    
    if (currentDay === targetDay) return 0; // Today is anniversary!
    
    let targetDate = new Date(now.getFullYear(), now.getMonth(), targetDay);
    if (currentDay > targetDay) {
      targetDate = new Date(now.getFullYear(), now.getMonth() + 1, targetDay);
    }
    const diff = targetDate - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysTogether = getDaysTogether();
  const daysUntilAnniversary = getDaysUntil22nd();

  return (
    <header className="w-full bg-gradient-to-r from-purple-100 via-purple-50 to-pink-50 border-b border-purple-200/60 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Couple identity & days counter */}
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="relative flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-md border-2 border-purple-300 flex items-center justify-center text-3xl sm:text-4xl animate-heart-float">
                {currentProfile.avatar || '🐰'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-xs shadow-xs">
                💖
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <h1 className="text-xl sm:text-2xl font-bold text-purple-950 flex items-center gap-2">
                  <span>{users?.user1?.nickname || 'เก้า'}</span>
                  <span className="text-pink-400 text-lg">❤️</span>
                  <span>{users?.user2?.nickname || 'นิว'}</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-200/70 text-purple-800 text-xs font-semibold flex items-center gap-1 shadow-2xs">
                  <Heart className="w-3 h-3 fill-purple-600 text-purple-600" />
                  คบกันมา {daysTogether} วัน
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-700/80 mt-0.5 italic flex items-center gap-1.5 justify-center sm:justify-start">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                {daysUntilAnniversary === 0 ? (
                  <span className="font-bold text-pink-600 animate-pulse">🎉 วันนี้วันครบรอบของเรา! (วันที่ 22) 🎉</span>
                ) : (
                  <span>อีก {daysUntilAnniversary} วัน จะถึงวันครบรอบ (ทุกวันที่ 22) 💕</span>
                )}
              </p>
            </div>
          </div>

          {/* User switcher & active status */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {/* User Switch toggle */}
            <div className="bg-white/90 backdrop-blur-xs p-1 rounded-2xl border border-purple-200 shadow-xs flex items-center gap-1">
              <span className="text-xs font-medium text-purple-900/60 px-2 hidden sm:inline">
                ฉันคือ:
              </span>
              <button
                type="button"
                onClick={() => setCurrentUser('user1')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentUser === 'user1'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-300'
                    : 'text-purple-700 hover:bg-purple-100/60'
                }`}
              >
                <span>{users?.user1?.avatar || '🐰'}</span>
                <span>{users?.user1?.nickname || 'เก้า'} (ฉัน)</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentUser('user2')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentUser === 'user2'
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-300'
                    : 'text-purple-700 hover:bg-pink-100/60'
                }`}
              >
                <span>{users?.user2?.avatar || '🐻'}</span>
                <span>{users?.user2?.nickname || 'นิว'} (แฟน)</span>
              </button>
            </div>

            {/* Quick refresh button */}
            <button
              type="button"
              onClick={onRefresh}
              title="รีเฟรชข้อมูล"
              className="p-2 rounded-xl bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 hover:rotate-180 transition-all duration-300 shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
