import React, { useState } from 'react';
import { 
  Ticket, Plus, CheckCircle2, History, Edit3, Trash2, Calendar, 
  Sparkles, Heart, AlertCircle, Scissors, Tag, Clock, ArrowRight, ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TicketSection({ 
  tickets, 
  currentUser, 
  users, 
  onCreateTicket, 
  onUpdateTicket, 
  onRedeemTicket, 
  onDeleteTicket 
}) {
  const [activeSubTab, setActiveSubTab] = useState('active'); // 'active' | 'used' | 'history'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [tearingTicketId, setTearingTicketId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetUser: currentUser === 'user1' ? 'user2' : 'user1',
    isPermanent: true,
    expiresAt: '',
    themeColor: 'purple'
  });

  const activeTickets = tickets.filter(t => t.status === 'active');
  const usedTickets = tickets.filter(t => t.status === 'used');

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      targetUser: currentUser === 'user1' ? 'user2' : 'user1',
      isPermanent: true,
      expiresAt: '',
      themeColor: 'purple'
    });
    setEditingTicket(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description,
      targetUser: ticket.targetUser,
      isPermanent: ticket.isPermanent,
      expiresAt: ticket.expiresAt || '',
      themeColor: ticket.themeColor || 'purple'
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveTicket = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTicket) {
      onUpdateTicket(editingTicket.id, {
        ...formData,
        updatedBy: currentUser
      });
    } else {
      onCreateTicket({
        ...formData,
        createdBy: currentUser
      });
    }
    setIsCreateModalOpen(false);
    setEditingTicket(null);
  };

  // Handle Tear & Redeem animation
  const handleRedeem = (ticketId) => {
    setTearingTicketId(ticketId);
    
    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#c084fc', '#f472b6', '#ffd1dc']
      });
    } catch (e) {
      console.log('confetti error:', e);
    }

    setTimeout(() => {
      onRedeemTicket(ticketId, currentUser);
      setTearingTicketId(null);
      // Auto switch to used tab after 1 second so user sees it
      setTimeout(() => {
        setActiveSubTab('used');
      }, 300);
    }, 850);
  };

  // Color theme mapper
  const getColorStyles = (theme = 'purple', isUsed = false) => {
    if (isUsed) {
      return {
        bg: 'bg-stone-50 border-stone-300',
        stubBg: 'bg-stone-100',
        badge: 'bg-stone-200 text-stone-600',
        accentText: 'text-stone-500',
        lineColor: 'border-stone-300'
      };
    }
    switch (theme) {
      case 'pink':
        return {
          bg: 'bg-gradient-to-br from-pink-50 to-rose-50/70 border-pink-200',
          stubBg: 'bg-pink-100/60',
          badge: 'bg-pink-100 text-pink-700',
          accentText: 'text-pink-600',
          lineColor: 'border-pink-300'
        };
      case 'lavender':
        return {
          bg: 'bg-gradient-to-br from-violet-50 to-indigo-50/70 border-violet-200',
          stubBg: 'bg-violet-100/60',
          badge: 'bg-violet-100 text-violet-700',
          accentText: 'text-violet-600',
          lineColor: 'border-violet-300'
        };
      case 'peach':
        return {
          bg: 'bg-gradient-to-br from-amber-50 to-orange-50/70 border-amber-200',
          stubBg: 'bg-amber-100/60',
          badge: 'bg-amber-100 text-amber-700',
          accentText: 'text-amber-600',
          lineColor: 'border-amber-300'
        };
      case 'purple':
      default:
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50/60 border-purple-200',
          stubBg: 'bg-purple-100/60',
          badge: 'bg-purple-100 text-purple-700',
          accentText: 'text-purple-600',
          lineColor: 'border-purple-300'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtab Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-purple-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-purple-100 text-purple-600">
              <Ticket className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                ตั๋วสิทธิพิเศษ 🎟️
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                คูปองน่ารักๆ มอบให้กันใช้สิทธิ์ตามใจ สามารถกดฉีกใช้งานได้จริง!
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-purple-300/40 hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>สร้างตั๋วใหม่</span>
        </button>
      </div>

      {/* Sub Tabs: Active / Used / History */}
      <div className="flex items-center gap-2 border-b border-purple-200/60 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('active')}
          className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'active'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>ตั๋วพร้อมใช้ ({activeTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('used')}
          className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'used'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>ฉีกตั๋วใช้งานแล้ว ({usedTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'history'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>ประวัติ & การแก้ไข ({tickets.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: Active Tickets */}
      {activeSubTab === 'active' && (
        <div className="space-y-4">
          {activeTickets.length === 0 ? (
            <div className="text-center py-12 bg-white/60 rounded-3xl border border-dashed border-purple-200">
              <Ticket className="w-12 h-12 text-purple-300 mx-auto mb-2" />
              <p className="text-slate-500 font-medium">ยังไม่มีตั๋วพร้อมใช้งานเลย</p>
              <p className="text-xs text-slate-400 mt-1">กด "สร้างตั๋วใหม่" เพื่อมอบสิทธิ์พิเศษให้แฟนได้เลยนะ!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {activeTickets.map((ticket) => {
                const isTearing = tearingTicketId === ticket.id;
                const style = getColorStyles(ticket.themeColor, false);
                const creator = users[ticket.createdBy] || { nickname: ticket.createdBy, avatar: '👤' };
                const receiver = users[ticket.targetUser] || { nickname: ticket.targetUser, avatar: '👤' };
                const isForMe = ticket.targetUser === currentUser;

                return (
                  <div
                    key={ticket.id}
                    className={`relative rounded-3xl border-2 ${style.bg} shadow-md overflow-hidden transition-all duration-300 ${
                      isTearing ? 'scale-95' : 'hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    {/* Cinema ticket punch holes (circular notches at perforation line) */}
                    <div className="absolute top-0 right-[28%] -translate-y-1/2 w-7 h-7 rounded-full bg-[#FAF7FD] border-b-2 border-purple-200 z-10" />
                    <div className="absolute bottom-0 right-[28%] translate-y-1/2 w-7 h-7 rounded-full bg-[#FAF7FD] border-t-2 border-purple-200 z-10" />

                    <div className="flex h-full">
                      {/* Left: Main Ticket Voucher (72%) */}
                      <div className={`flex-1 p-5 pr-6 ${isTearing ? 'animate-tear-left' : ''}`}>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${style.badge} flex items-center gap-1`}>
                            <Tag className="w-3 h-3" />
                            {ticket.isPermanent ? 'บัตรถาวร ♾️' : `หมดอายุ: ${ticket.expiresAt}`}
                          </span>

                          <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-purple-100">
                            <span>จาก: {creator.avatar} {creator.nickname}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span>ให้: {receiver.avatar} {receiver.nickname}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 leading-snug">
                          {ticket.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                          {ticket.description || 'สามารถใช้บัตรนี้กับแฟนได้ทันทีตามเงื่อนไขที่ตกลงกันไว้ 💕'}
                        </p>

                        <div className="mt-4 pt-3 border-t border-purple-200/50 flex items-center justify-between text-xs text-slate-400">
                          <span className="font-mono tracking-widest text-[10px] text-purple-400">
                            #{ticket.id.toUpperCase()}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(ticket)}
                              className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                              title="แก้ไขตั๋ว"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteTicket(ticket.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                              title="ลบตั๋ว"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Perforated Tear Line */}
                      <div className={`w-0 border-r-2 border-dashed ${style.lineColor} relative`} />

                      {/* Right: Tear Stub (28%) */}
                      <div className={`w-[28%] ${style.stubBg} p-3 flex flex-col items-center justify-between text-center relative ${
                        isTearing ? 'animate-tear-right' : ''
                      }`}>
                        <div className="w-full text-center">
                          <span className="text-[10px] font-bold text-purple-800/60 uppercase tracking-widest block">
                            COUPON
                          </span>
                          <span className="text-xl my-1 block">🎟️</span>
                        </div>

                        {/* Interactive Tear Button */}
                        <div className="w-full">
                          <button
                            onClick={() => handleRedeem(ticket.id)}
                            disabled={isTearing}
                            className={`w-full py-2 px-1 rounded-xl text-xs font-bold transition-all shadow-xs flex flex-col items-center justify-center gap-1 cursor-pointer ${
                              isForMe
                                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-300 animate-pulse'
                                : 'bg-white hover:bg-purple-100 text-purple-700 border border-purple-300'
                            }`}
                          >
                            <Scissors className="w-3.5 h-3.5 rotate-90" />
                            <span className="text-[11px] leading-tight">
                              {isTearing ? 'กำลังฉีก...' : 'ฉีกตั๋วใช้!'}
                            </span>
                          </button>
                          {isForMe && (
                            <span className="text-[9px] text-purple-600 font-medium block mt-1">
                              (ตั๋วของคุณ)
                            </span>
                          )}
                        </div>

                        {/* Barcode representation */}
                        <div className="w-full flex justify-center gap-[2px] opacity-40 h-3 items-end">
                          <div className="w-[2px] h-full bg-slate-800" />
                          <div className="w-[1px] h-2 bg-slate-800" />
                          <div className="w-[3px] h-full bg-slate-800" />
                          <div className="w-[1px] h-1.5 bg-slate-800" />
                          <div className="w-[2px] h-full bg-slate-800" />
                          <div className="w-[1px] h-2.5 bg-slate-800" />
                          <div className="w-[2px] h-full bg-slate-800" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: Used Tickets (Torn & Stamped) */}
      {activeSubTab === 'used' && (
        <div className="space-y-4">
          {usedTickets.length === 0 ? (
            <div className="text-center py-12 bg-white/60 rounded-3xl border border-dashed border-stone-200">
              <Scissors className="w-12 h-12 text-stone-300 mx-auto mb-2" />
              <p className="text-slate-500 font-medium">ยังไม่มีตั๋วที่ถูกใช้งาน</p>
              <p className="text-xs text-slate-400 mt-1">เมื่อมีการฉีกตั๋วใช้งานแล้วจะมาแสดงความทรงจำที่นี่!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {usedTickets.map((ticket) => {
                const creator = users[ticket.createdBy] || { nickname: ticket.createdBy, avatar: '👤' };
                const usedByUser = users[ticket.usedBy] || { nickname: ticket.usedBy || 'แฟน', avatar: '👤' };
                const usedDate = ticket.usedAt ? new Date(ticket.usedAt).toLocaleString('th-TH') : '';

                return (
                  <div
                    key={ticket.id}
                    className="relative rounded-3xl border-2 border-stone-300 bg-stone-100/70 p-5 shadow-xs overflow-hidden opacity-90"
                  >
                    {/* Big red/purple ink stamp: USED / ฉีกใช้งานแล้ว */}
                    <div className="absolute right-8 top-6 -rotate-12 border-3 border-rose-500/80 rounded-2xl px-4 py-1 text-rose-500/80 font-black tracking-widest text-sm uppercase shadow-xs pointer-events-none z-10 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>USED / ฉีกใช้งานแล้ว</span>
                    </div>

                    <div className="pr-20">
                      <div className="flex items-center gap-2 mb-2 text-xs text-stone-500">
                        <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-semibold text-[11px]">
                          ฉีกตั๋วแล้ว
                        </span>
                        <span>โดย {usedByUser.avatar} {usedByUser.nickname}</span>
                      </div>

                      <h3 className="text-lg font-bold text-stone-700 line-through decoration-rose-400">
                        {ticket.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-500 mt-2">
                        {ticket.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          ใช้งานเมื่อ: {usedDate}
                        </span>

                        <button
                          onClick={() => onDeleteTicket(ticket.id)}
                          className="p-1 text-stone-400 hover:text-rose-500 transition-colors"
                          title="ลบประวัติตั๋ว"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: History & Edit Log */}
      {activeSubTab === 'history' && (
        <div className="bg-white/80 rounded-3xl border border-purple-200 p-5 shadow-xs">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-purple-600" />
            <span>ประวัติความเคลื่อนไหวของตั๋วทั้งหมด</span>
          </h3>

          <div className="divide-y divide-purple-100">
            {tickets.map((ticket) => {
              const creator = users[ticket.createdBy] || { nickname: ticket.createdBy, avatar: '👤' };
              const receiver = users[ticket.targetUser] || { nickname: ticket.targetUser, avatar: '👤' };

              return (
                <div key={ticket.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${ticket.status === 'active' ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                      <span className="font-bold text-slate-800 text-sm sm:text-base">{ticket.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        ticket.status === 'active' ? 'bg-purple-100 text-purple-700' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {ticket.status === 'active' ? 'พร้อมใช้' : 'ถูกฉีกใช้งานแล้ว'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(ticket)}
                        className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>แก้ไข</span>
                      </button>
                      <button
                        onClick={() => onDeleteTicket(ticket.id)}
                        className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>ลบ</span>
                      </button>
                    </div>
                  </div>

                  {/* History timeline logs */}
                  <div className="space-y-1.5 pl-5 border-l-2 border-purple-200 mt-2 text-xs text-slate-500">
                    {(ticket.history || []).map((h, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-purple-400">
                          {new Date(h.time).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">{h.note || h.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-purple-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span>{editingTicket ? '✏️ แก้ไขตั๋วสิทธิพิเศษ' : '✨ สร้างตั๋วใหม่สำหรับแฟน'}</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อตั๋วสิทธิพิเศษ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น บัตรตามใจ 1 วัน, บัตรนวดหลัง 30 นาที, บัตรห้ามโกรธ 1 ครั้ง"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  รายละเอียด / เงื่อนไข
                </label>
                <textarea
                  rows="3"
                  placeholder="เขียนเงื่อนไขน่ารักๆ เช่น สั่งให้พาไปกินชาบูได้ 1 มื้อ, ห้ามบ่นแม้แต่คำเดียว..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm resize-none"
                />
              </div>

              {/* Target User */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  มอบตั๋วนี้ให้ใคร
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, targetUser: 'user2' })}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formData.targetUser === 'user2'
                        ? 'bg-pink-100 border-pink-400 text-pink-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{users.user2?.avatar || '🐷'}</span>
                    <span>ให้ {users.user2?.nickname || 'นิว'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, targetUser: 'user1' })}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formData.targetUser === 'user1'
                        ? 'bg-purple-100 border-purple-400 text-purple-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{users.user1?.avatar || '🐶'}</span>
                    <span>ให้ {users.user1?.nickname || 'เก้า'}</span>
                  </button>
                </div>
              </div>

              {/* Expiration Settings */}
              <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    ประเภทบัตร
                  </span>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPermanent}
                      onChange={(e) => setFormData({ ...formData, isPermanent: e.target.checked })}
                      className="w-4 h-4 accent-purple-600 rounded"
                    />
                    <span className="text-xs font-semibold text-purple-900">บัตรถาวร (ไม่มีวันหมดอายุ ♾️)</span>
                  </label>
                </div>

                {!formData.isPermanent && (
                  <div>
                    <label className="block text-[11px] font-semibold text-purple-800 mb-1">
                      เลือกวันหมดอายุ
                    </label>
                    <input
                      type="date"
                      required={!formData.isPermanent}
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs text-slate-700"
                    />
                  </div>
                )}
              </div>

              {/* Theme Color */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  เลือกโทนสีตั๋ว
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'purple', name: 'ม่วงพาสเทล', bg: 'bg-purple-200 border-purple-400' },
                    { id: 'pink', name: 'ชมพูหวาน', bg: 'bg-pink-200 border-pink-400' },
                    { id: 'lavender', name: 'ลาเวนเดอร์', bg: 'bg-violet-200 border-violet-400' },
                    { id: 'peach', name: 'ส้มพีช', bg: 'bg-amber-200 border-amber-400' }
                  ].map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, themeColor: color.id })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        formData.themeColor === color.id
                          ? `${color.bg} font-bold ring-2 ring-purple-400`
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${color.bg}`} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-600 font-semibold text-sm hover:bg-slate-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:from-purple-700 hover:to-indigo-700"
                >
                  {editingTicket ? 'บันทึกการแก้ไข' : 'สร้างตั๋วพิเศษ 💕'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
