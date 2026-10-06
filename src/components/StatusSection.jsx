import React, { useState } from 'react';
import { 
  Smile, Heart, Sparkles, Edit3, Save, Calendar, 
  MessageCircle, RefreshCw, Award, CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StatusSection({ 
  users, 
  currentUser, 
  settings, 
  onUpdateUser, 
  onUpdateSettings 
}) {
  const currentProfile = users[currentUser] || {};
  const otherUserKey = currentUser === 'user1' ? 'user2' : 'user1';
  const otherProfile = users[otherUserKey] || {};

  const [selectedMood, setSelectedMood] = useState(currentProfile.mood || 'รักแฟนที่สุด');
  const [moodNote, setMoodNote] = useState(currentProfile.moodNote || '');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nickname: currentProfile.nickname || '',
    avatar: currentProfile.avatar || (currentUser === 'user1' ? '🐶' : '🐷')
  });

  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    anniversaryDate: settings?.anniversaryDate || '2024-05-22',
    quote: settings?.quote || 'ไม่ว่าจะวันไหนๆ ขอให้เรามีกันและกันเสมอ 💜'
  });

  const moodOptions = [
    { label: 'อารมณ์ดี', emoji: '☀️', color: 'from-amber-400 to-yellow-500' },
    { label: 'รักแฟนที่สุด', emoji: '🥰', color: 'from-pink-500 to-rose-500' },
    { label: 'คิดถึงแฟนมาก', emoji: '💖', color: 'from-purple-500 to-pink-500' },
    { label: 'งอน', emoji: '🥺', color: 'from-pink-400 to-purple-400' },
    { label: 'ชิชิงอน', emoji: '😤', color: 'from-orange-400 to-amber-500' },
    { label: 'นอย', emoji: '🌧️', color: 'from-indigo-400 to-blue-500' },
    { label: 'โกรธ', emoji: '😡', color: 'from-rose-500 to-red-600' },
    { label: 'เสียใจ', emoji: '😢', color: 'from-sky-400 to-blue-500' },
    { label: 'อยากให้มาง้อ', emoji: '🥺👉👈', color: 'from-purple-500 to-fuchsia-500' },
    { label: 'อยากคุยกัน', emoji: '💬', color: 'from-violet-500 to-indigo-500' },
  ];

  const handleSaveMood = () => {
    onUpdateUser(currentUser, {
      mood: selectedMood,
      moodNote: moodNote
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#f472b6']
      });
    } catch (e) {}
  };

  const handleSaveProfile = () => {
    onUpdateUser(currentUser, {
      nickname: profileForm.nickname,
      avatar: profileForm.avatar
    });
    setIsEditingProfile(false);
  };

  const handleSaveSettings = () => {
    onUpdateSettings({
      anniversaryDate: settingsForm.anniversaryDate,
      quote: settingsForm.quote
    });
    setIsEditingSettings(false);
  };

  // Days together
  const getDaysTogether = () => {
    if (!settings?.anniversaryDate) return 0;
    const start = new Date(settings.anniversaryDate);
    const now = new Date();
    return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  };

  const daysTogether = getDaysTogether();

  const getMoodEmoji = (moodText) => {
    const item = moodOptions.find(m => m.label === moodText);
    return item ? item.emoji : '💭';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-purple-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-purple-100 text-purple-600 shadow-2xs">
            <Smile className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              สถานะแฟน & ความรู้สึกวันนี้ 💖
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              อัปเดตอารมณ์ของคุณให้อีกฝ่ายรู้ได้แบบเรียลไทม์ พร้อมติดตามวันครบรอบ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setProfileForm({
                nickname: currentProfile.nickname || '',
                avatar: currentProfile.avatar || (currentUser === 'user1' ? '🐶' : '🐷')
              });
              setIsEditingProfile(true);
            }}
            className="px-3.5 py-2 rounded-2xl bg-white border border-purple-200 text-purple-700 text-xs font-semibold hover:bg-purple-50 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>แก้ไขโปรไฟล์ {currentProfile.nickname}</span>
          </button>
        </div>
      </div>

      {/* DUAL STATUS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: User 1 */}
        <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50/50 rounded-3xl border-2 border-purple-300/80 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
            สถานะของ {currentProfile.nickname || 'เก้า'}
          </div>

          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <span className="text-4xl p-2 bg-white rounded-2xl border border-purple-200 shadow-xs">
                {currentProfile.avatar || (currentUser === 'user1' ? '🐶' : '🐷')}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {currentProfile.nickname || 'เก้า'}
                </h3>
                <span className="text-xs text-slate-400">
                  อัปเดตล่าสุด: {currentProfile.updatedAt ? new Date(currentProfile.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : 'ไม่นานมานี้'}
                </span>
              </div>
            </div>

            {/* Current Active Mood Display */}
            <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-2xs mb-4">
              <div className="text-xs font-bold text-slate-500 mb-1">
                สถานะปัจจุบันของ {currentProfile.nickname || 'เก้า'}:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getMoodEmoji(currentProfile.mood)}</span>
                <span className="text-base sm:text-lg font-extrabold text-purple-900">
                  {currentProfile.mood || 'รักแฟนที่สุด'}
                </span>
              </div>
              {currentProfile.moodNote && (
                <p className="text-xs text-slate-600 mt-2 p-2 bg-purple-50/60 rounded-xl italic">
                  "{currentProfile.moodNote}"
                </p>
              )}
            </div>
          </div>

          {/* Quick Mood Changer */}
          <div className="pt-4 border-t border-purple-200/60">
            <span className="text-xs font-bold text-purple-950 block mb-2">
              ⚡ อัปเดตสถานะของ {currentProfile.nickname || 'เก้า'} ตอนนี้:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-3">
              {moodOptions.map((opt) => {
                const isSelected = selectedMood === opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedMood(opt.label)}
                    className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs scale-105'
                        : 'bg-white text-slate-700 border-purple-100 hover:bg-purple-50'
                    }`}
                  >
                    <span className="text-lg">{opt.emoji}</span>
                    <span className="text-[10px] leading-tight text-center">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="เขียนข้อความสั้นๆ (ถ้ามี)..."
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
              <button
                onClick={handleSaveMood}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>บันทึกสถานะใหม่ 💕</span>
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: User 2 */}
        <div className="bg-gradient-to-br from-pink-50 via-white to-pink-50/50 rounded-3xl border-2 border-pink-300/80 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-[11px] font-bold">
            สถานะของ {otherProfile.nickname || 'นิว'} 💕
          </div>

          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <span className="text-4xl p-2 bg-white rounded-2xl border border-pink-200 shadow-xs">
                {otherProfile.avatar || (currentUser === 'user1' ? '🐷' : '🐶')}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {otherProfile.nickname || 'นิว'}
                </h3>
                <span className="text-xs text-slate-400">
                  อัปเดตล่าสุด: {otherProfile.updatedAt ? new Date(otherProfile.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : 'ไม่นานมานี้'}
                </span>
              </div>
            </div>

            {/* Other User's Mood Display */}
            <div className="bg-white rounded-2xl p-5 border border-pink-200 shadow-2xs mb-4">
              <div className="text-xs font-bold text-slate-500 mb-1">
                {otherProfile.nickname || 'นิว'} กำลังรู้สึก:
              </div>
              <div className="flex items-center gap-2.5 my-2">
                <span className="text-3xl animate-bounce">
                  {getMoodEmoji(otherProfile.mood)}
                </span>
                <span className="text-xl font-black text-pink-900">
                  {otherProfile.mood || 'อารมณ์ดี'}
                </span>
              </div>
              {otherProfile.moodNote ? (
                <p className="text-xs text-slate-600 mt-2 p-3 bg-pink-50/60 rounded-xl italic leading-relaxed">
                  "{otherProfile.moodNote}"
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-2 italic">
                  ยังไม่ได้พิมพ์โน้ตเพิ่มเติม
                </p>
              )}
            </div>
          </div>

          {/* Sweet Quick Actions */}
          <div className="pt-4 border-t border-pink-200/60 bg-pink-50/40 p-4 rounded-2xl">
            <span className="text-xs font-bold text-pink-950 block mb-2">
              💌 เมื่อเห็นสถานะของ {otherProfile.nickname || 'นิว'}:
            </span>
            <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <p>• ถ้า {otherProfile.nickname || 'นิว'} ง้อ/ชิชิงอน 👉 รีบโทรหาหรือส่งข้อความไปหาเลยนะ!</p>
              <p>• ถ้า {otherProfile.nickname || 'นิว'} อารมณ์ดี/รักแฟนที่สุด 👉 ชวนไปกินของอร่อยกัน</p>
            </div>
          </div>
        </div>

      </div>

      {/* LOVE MILESTONE & SETTINGS BANNER */}
      <div className="bg-white/80 rounded-3xl border border-purple-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-800 text-base">
              เส้นทางความรักของเราสองคน 💕
            </h3>
          </div>

          <button
            onClick={() => {
              setSettingsForm({
                anniversaryDate: settings?.anniversaryDate || '2024-05-22',
                quote: settings?.quote || 'ไม่ว่าจะวันไหนๆ ขอให้เรามีกันและกันเสมอ 💜'
              });
              setIsEditingSettings(true);
            }}
            className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>แก้ไขวันเริ่มคบ / คำคมประจำใจ</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            <span className="text-xs text-purple-700 font-semibold block mb-1">
              วันที่เริ่มคบกัน
            </span>
            <span className="text-base font-bold text-purple-950">
              {settings?.anniversaryDate || '2024-05-22'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100">
            <span className="text-xs text-pink-700 font-semibold block mb-1">
              เรารักกันมาแล้ว
            </span>
            <span className="text-2xl font-black text-pink-600">
              {daysTogether} วัน
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100">
            <span className="text-xs text-violet-700 font-semibold block mb-1">
              วันครบรอบประจำเดือน
            </span>
            <span className="text-base font-bold text-violet-950">
              ทุกวันที่ {settings?.anniversaryDay || 22} ของทุกเดือน 💖
            </span>
          </div>
        </div>

        {/* Quote */}
        {settings?.quote && (
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-100/50 to-pink-100/50 rounded-2xl text-center text-xs text-purple-900 font-medium italic">
            "{settings.quote}"
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                ✏️ แก้ไขโปรไฟล์ ({currentProfile.nickname || (currentUser === 'user1' ? 'เก้า' : 'นิว')})
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อเล่นที่แสดง
                </label>
                <input
                  type="text"
                  value={profileForm.nickname}
                  onChange={(e) => setProfileForm({ ...profileForm, nickname: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เลือกอิโมจิแทนตัว
                </label>
                <div className="grid grid-cols-5 gap-2 text-2xl p-2 bg-purple-50/50 rounded-2xl">
                  {['🐶', '🐷', '🐱', '🐰', '🐼', '🦊', '🐧', '🐥', '🦄', '🍓'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, avatar: em })}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        profileForm.avatar === em ? 'bg-purple-600 text-white border-purple-600 scale-110 shadow-xs' : 'bg-white border-slate-200'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md"
                >
                  บันทึกโปรไฟล์
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SETTINGS MODAL */}
      {isEditingSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                ⚙️ แก้ไขข้อมูลความรัก
              </h3>
              <button
                onClick={() => setIsEditingSettings(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  วันที่เริ่มคบกัน
                </label>
                <input
                  type="date"
                  value={settingsForm.anniversaryDate}
                  onChange={(e) => setSettingsForm({ ...settingsForm, anniversaryDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  คำคมหรือข้อความประจำใจ
                </label>
                <textarea
                  rows="3"
                  value={settingsForm.quote}
                  onChange={(e) => setSettingsForm({ ...settingsForm, quote: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSettings(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
