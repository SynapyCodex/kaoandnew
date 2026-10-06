import React, { useState } from 'react';
import { 
  MessageCircleHeart, Plus, Heart, Trash2, Send, Sparkles, 
  HelpCircle, ShieldAlert, CheckCircle2 
} from 'lucide-react';

export default function VentSection({ 
  vents, 
  currentUser, 
  users, 
  onCreateVent, 
  onAddVentMessage, 
  onDeleteVent 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmotionFilter, setSelectedEmotionFilter] = useState('all');
  const [messageInputs, setMessageInputs] = useState({});

  const emotionList = [
    { id: 'งอน', emoji: '🥺', label: 'งอน', bg: 'bg-pink-100 text-pink-700 border-pink-300' },
    { id: 'โกรธ', emoji: '😡', label: 'โกรธ', bg: 'bg-rose-100 text-rose-700 border-rose-300' },
    { id: 'นอย', emoji: '🌧️', label: 'นอย', bg: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
    { id: 'เสียใจ', emoji: '😢', label: 'เสียใจ', bg: 'bg-sky-100 text-sky-700 border-sky-300' },
    { id: 'อยากให้มาง้อ', emoji: '🥺👉👈', label: 'อยากให้มาง้อ', bg: 'bg-purple-100 text-purple-700 border-purple-300' },
    { id: 'อยากคุยกัน', emoji: '💬', label: 'อยากคุยกัน', bg: 'bg-violet-100 text-violet-700 border-violet-300' },
    { id: 'ชิชิงอน', emoji: '😤', label: 'ชิชิงอน (งอนเบาๆ)', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
  ];

  const [formData, setFormData] = useState({
    moodTag: 'งอน',
    detail: '',
    wantsToResolve: ''
  });

  const openCreateModal = () => {
    setFormData({
      moodTag: 'งอน',
      detail: '',
      wantsToResolve: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.detail.trim()) return;

    onCreateVent({
      ...formData,
      authorId: currentUser
    });
    setIsModalOpen(false);
  };

  const handleSendMessage = (ventId) => {
    const text = messageInputs[ventId];
    if (!text || !text.trim()) return;

    onAddVentMessage(ventId, currentUser, text.trim());
    setMessageInputs({ ...messageInputs, [ventId]: '' });
  };

  const filteredVents = vents.filter(v => {
    if (selectedEmotionFilter === 'all') return true;
    return v.moodTag === selectedEmotionFilter;
  });

  const getEmotionMeta = (moodTag) => {
    return emotionList.find(e => e.id === moodTag) || {
      id: moodTag,
      emoji: '💭',
      label: moodTag,
      bg: 'bg-purple-100 text-purple-700 border-purple-300'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-purple-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-purple-100 text-purple-700 shadow-2xs">
            <MessageCircleHeart className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              จุดระบายแฟน (บอกความรู้สึกให้แฟนรู้) 🥺
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              เลือกอารมณ์ความรู้สึก พร้อมบอกวิธีง้อที่อยากให้แฟนทำ เพื่อให้เข้าใจกันมากขึ้น
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>ระบายความรู้สึก... 💌</span>
        </button>
      </div>

      {/* Emotion Quick Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedEmotionFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedEmotionFilter === 'all'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white/80 text-slate-600 hover:bg-purple-50 border border-purple-100'
          }`}
        >
          ทั้งหมด ({vents.length})
        </button>

        {emotionList.map((emo) => {
          const isActive = selectedEmotionFilter === emo.id;
          const count = vents.filter(v => v.moodTag === emo.id).length;
          return (
            <button
              key={emo.id}
              onClick={() => setSelectedEmotionFilter(emo.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white/80 text-slate-600 hover:bg-purple-50 border border-purple-100'
              }`}
            >
              <span>{emo.emoji}</span>
              <span>{emo.label}</span>
              {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Vent Posts List */}
      {filteredVents.length === 0 ? (
        <div className="text-center py-12 bg-white/60 rounded-3xl border border-dashed border-purple-200">
          <MessageCircleHeart className="w-12 h-12 text-purple-300 mx-auto mb-2" />
          <p className="text-slate-500 font-medium">ยังไม่มีโพสต์ระบายความรู้สึกในหมวดนี้</p>
          <p className="text-xs text-slate-400 mt-1">รู้สึกอะไรอยู่บอกแฟนได้เลยนะ แฟนพร้อมรับฟังเสมอ 💜</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVents.map((vent) => {
            const author = users[vent.authorId] || { nickname: vent.authorId, avatar: '👤' };
            const emo = getEmotionMeta(vent.moodTag);
            const isMe = vent.authorId === currentUser;

            return (
              <div
                key={vent.id}
                className="p-5 rounded-3xl bg-white border-2 border-purple-200/90 shadow-xs space-y-3"
              >
                {/* Header: Author + Emotion Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{author.avatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm sm:text-base">
                          {author.nickname}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(vent.createdAt).toLocaleString('th-TH')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Big Cute Mood Pill */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-2xs ${emo.bg}`}>
                      <span className="text-sm">{emo.emoji}</span>
                      <span>{emo.label}</span>
                    </span>

                    {/* Delete for author */}
                    {isMe && (
                      <button
                        onClick={() => onDeleteVent(vent.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="ลบโพสต์"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Vent Detail */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-purple-50/40 p-3.5 rounded-2xl border border-purple-100/70 whitespace-pre-line">
                  {vent.detail}
                </div>

                {/* Wants to resolve box */}
                {vent.wantsToResolve && (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/80 flex items-start gap-2.5">
                    <span className="text-lg shrink-0">🎯</span>
                    <div className="text-xs">
                      <span className="font-bold text-pink-900 block mb-0.5">
                        สิ่งที่อยากให้ทำ / วิธีง้อ:
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {vent.wantsToResolve}
                      </p>
                    </div>
                  </div>
                )}

                {/* Partner comment thread */}
                <div className="pt-2 border-t border-purple-100/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-purple-400" />
                      {vent.messages?.length || 0} ข้อความตอบกลับ
                    </span>
                  </div>

                  {vent.messages && vent.messages.length > 0 && (
                    <div className="space-y-2">
                      {vent.messages.map((msg) => {
                        const msgUser = users[msg.fromId] || { nickname: msg.fromId, avatar: '👤' };
                        return (
                          <div key={msg.id} className="p-2.5 rounded-2xl bg-purple-50 text-xs flex items-start gap-2">
                            <span className="text-base">{msgUser.avatar}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-purple-900">{msgUser.nickname}</span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(msg.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-700 mt-0.5">{msg.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Send reply */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="พิมพ์ข้อความง้อ / ปรับความเข้าใจตรงนี้..."
                      value={messageInputs[vent.id] || ''}
                      onChange={(e) => setMessageInputs({ ...messageInputs, [vent.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(vent.id)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-purple-400 text-xs"
                    />
                    <button
                      onClick={() => handleSendMessage(vent.id)}
                      className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
                      title="ส่งข้อความ"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE VENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>🥺 ระบายความรู้สึกให้แฟนรู้</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Emotion Tag */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  เลือกความรู้สึกตอนนี้ *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {emotionList.map((emo) => (
                    <button
                      key={emo.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, moodTag: emo.id })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                        formData.moodTag === emo.id
                          ? `${emo.bg} ring-2 ring-purple-400 font-bold scale-[1.02]`
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-purple-50'
                      }`}
                    >
                      <span className="text-base">{emo.emoji}</span>
                      <span>{emo.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เรื่องที่อยากระบาย / เกิดอะไรขึ้น *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="เขียนระบายสิ่งที่อยู่ในใจออกมาได้เลยนะ..."
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  อยากให้ทำแบบไหน / อยากให้ง้อแบบไหน
                </label>
                <textarea
                  rows="2"
                  placeholder="เช่น อยากให้โทรหาแล้วคุยหวานๆ, อยากให้กอดแน่นๆ, ชวนไปกินไอติม..."
                  value={formData.wantsToResolve}
                  onChange={(e) => setFormData({ ...formData, wantsToResolve: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md"
                >
                  โพสต์บันทึก 💕
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
