import React, { useState } from 'react';
import { 
  CloudRain, Plus, Heart, HeartCrack, CheckCircle2, MessageCircle, 
  Trash2, Edit3, Send, Sparkles, Smile, ShieldAlert 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SulkSection({ 
  sulks, 
  currentUser, 
  users, 
  onCreateSulk, 
  onUpdateSulk, 
  onHugSulk, 
  onAddSulkMessage, 
  onDeleteSulk 
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'resolved'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSulk, setEditingSulk] = useState(null);
  const [messageInputs, setMessageInputs] = useState({});

  const [formData, setFormData] = useState({
    topic: '',
    detail: '',
    severity: 3
  });

  const openCreateModal = () => {
    setEditingSulk(null);
    setFormData({ topic: '', detail: '', severity: 3 });
    setIsModalOpen(true);
  };

  const openEditModal = (sulk) => {
    setEditingSulk(sulk);
    setFormData({
      topic: sulk.topic,
      detail: sulk.detail,
      severity: sulk.severity || 3
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.topic.trim()) return;

    if (editingSulk) {
      onUpdateSulk(editingSulk.id, formData);
    } else {
      onCreateSulk({
        ...formData,
        authorId: currentUser
      });
    }
    setIsModalOpen(false);
  };

  const handleResolve = (sulk) => {
    onUpdateSulk(sulk.id, {
      isResolved: !sulk.isResolved,
      resolvedAt: !sulk.isResolved ? new Date().toISOString() : null
    });

    if (!sulk.isResolved) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ec4899', '#a855f7', '#fb7185']
        });
      } catch (err) {}
    }
  };

  const handleSendMessage = (sulkId) => {
    const text = messageInputs[sulkId];
    if (!text || !text.trim()) return;

    onAddSulkMessage(sulkId, currentUser, text.trim());
    setMessageInputs({ ...messageInputs, [sulkId]: '' });
  };

  const filteredSulks = sulks.filter(s => {
    if (filter === 'active') return !s.isResolved;
    if (filter === 'resolved') return s.isResolved;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-purple-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 shadow-2xs">
            <CloudRain className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              จุดนอย (พื้นที่บอกความในใจเบาๆ) 🌧️
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              วันนี้นอยอะไรแฟน เขียนบอกไว้ได้เลย เมื่อเคลียร์ใจหายแล้วก็กด "หายแล้วนะ" หรือลบ/แก้ไขได้
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>โพสต์เรื่องที่นอย 🥺</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-200/60 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            filter === 'all' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          ทั้งหมด ({sulks.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            filter === 'active' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          กำลังนอยอยู่ ({sulks.filter(s => !s.isResolved).length})
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            filter === 'resolved' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          หายแล้ว / ดีกันแล้ว 🥰 ({sulks.filter(s => s.isResolved).length})
        </button>
      </div>

      {/* Sulks Feed */}
      {filteredSulks.length === 0 ? (
        <div className="text-center py-12 bg-white/60 rounded-3xl border border-dashed border-purple-200">
          <Smile className="w-12 h-12 text-purple-300 mx-auto mb-2" />
          <p className="text-slate-500 font-medium">ไม่มีเรื่องนอยในตอนนี้เลย รักกันดีมากๆ 🥰</p>
          <p className="text-xs text-slate-400 mt-1">ถ้านอยอะไรก็แวะมาสะกิดบอกกันได้เสมอนะ</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSulks.map((sulk) => {
            const author = users[sulk.authorId] || { nickname: sulk.authorId, avatar: '👤' };
            const isMe = sulk.authorId === currentUser;

            return (
              <div
                key={sulk.id}
                className={`p-5 rounded-3xl border-2 transition-all ${
                  sulk.isResolved
                    ? 'bg-purple-50/50 border-purple-200/60 opacity-85'
                    : 'bg-white border-amber-200 shadow-sm'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{author.avatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm sm:text-base">
                          {author.nickname}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(sulk.createdAt).toLocaleString('th-TH')}
                        </span>
                      </div>

                      {/* Severity level */}
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] text-slate-500">ระดับความนอย:</span>
                        <div className="flex text-xs text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < sulk.severity ? 'text-amber-500' : 'text-slate-200'}>
                              💔
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Resolve button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolve(sulk)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        sulk.isResolved
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-emerald-100 hover:text-emerald-700'
                      }`}
                    >
                      {sulk.isResolved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>หายแล้วนะ 🥰</span>
                        </>
                      ) : (
                        <>
                          <CloudRain className="w-3.5 h-3.5" />
                          <span>คลิกถ้าหายแล้ว 💕</span>
                        </>
                      )}
                    </button>

                    {/* Edit & Delete for author */}
                    {isMe && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(sulk)}
                          className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                          title="แก้ไข"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteSulk(sulk.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50"
                          title="ลบโพสต์"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
                  {sulk.topic}
                </h3>
                {sulk.detail && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 whitespace-pre-line">
                    {sulk.detail}
                  </p>
                )}

                {/* Hug counter & Actions */}
                <div className="pt-3 border-t border-purple-100/70 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => onHugSulk(sulk.id)}
                    className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all transform active:scale-95"
                  >
                    <span>🫂 ส่งกอดให้</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-pink-200 text-pink-800 font-bold text-[10px]">
                      {sulk.hugs || 0}
                    </span>
                  </button>

                  <span className="text-[11px] text-slate-400">
                    {sulk.messages?.length || 0} ข้อความตอบกลับ
                  </span>
                </div>

                {/* Messages list (Comments thread) */}
                {sulk.messages && sulk.messages.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-purple-50">
                    {sulk.messages.map((msg) => {
                      const msgUser = users[msg.fromId] || { nickname: msg.fromId, avatar: '👤' };
                      return (
                        <div key={msg.id} className="p-2.5 rounded-2xl bg-purple-50/70 text-xs flex items-start gap-2">
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

                {/* Quick send reply input */}
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="เขียนข้อความง้อแฟน / ให้กำลังใจตรงนี้..."
                    value={messageInputs[sulk.id] || ''}
                    onChange={(e) => setMessageInputs({ ...messageInputs, [sulk.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(sulk.id)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-purple-400 text-xs"
                  />
                  <button
                    onClick={() => handleSendMessage(sulk.id)}
                    className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
                    title="ส่งข้อความง้อ"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT SULK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>{editingSulk ? '✏️ แก้ไขเรื่องที่นอย' : '🌧️ วันนี้นอยอะไรแฟน'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  หัวข้อเรื่องที่นอย *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น เมื่อวานตอบแชทช้า, ไม่พาไปกินของอร่อย..."
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ระดับความนอย
                </label>
                <div className="flex items-center gap-3 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, severity: lvl })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formData.severity === lvl
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : 'bg-white text-slate-500 hover:bg-amber-100'
                      }`}
                    >
                      {lvl} 💔
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เล่ารายละเอียดเพิ่มเติม
                </label>
                <textarea
                  rows="3"
                  placeholder="เล่าความรู้สึกให้ฟังหน่อยนะ แฟนจะได้เข้าใจและรู้ว่าต้องปรับตรงไหน..."
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl border border-purple-200 text-xs resize-none"
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
                  {editingSulk ? 'บันทึกการแก้ไข' : 'โพสต์บอกแฟน 💕'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
