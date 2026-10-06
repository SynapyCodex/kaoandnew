import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, 
  Bell, Clock, Heart, Briefcase, Coffee, Pill, Sparkles, Trash2, AlertCircle 
} from 'lucide-react';

export default function CalendarSection({ 
  events, 
  currentUser, 
  users, 
  settings, 
  onCreateEvent, 
  onDeleteEvent 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    category: 'date',
    note: '',
    remindBeforeDays: 2
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Thai month names
  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  // Days in month calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const openAddModal = (dateStr) => {
    setFormData({
      title: '',
      date: dateStr || new Date().toISOString().split('T')[0],
      time: '12:00',
      category: 'date',
      note: '',
      remindBeforeDays: 2
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onCreateEvent({
      ...formData,
      createdBy: currentUser
    });
    setIsModalOpen(false);
  };

  // Get events for a specific day string (YYYY-MM-DD)
  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);

    // If day is 22, add the monthly recurring anniversary if not already listed
    if (day === 22) {
      const hasAnniversary = dayEvents.some(e => e.category === 'anniversary');
      if (!hasAnniversary) {
        dayEvents.unshift({
          id: `anniversary-${dateStr}`,
          title: 'วันครบรอบของเรา 💕 (ทุกวันที่ 22)',
          date: dateStr,
          time: '00:00',
          category: 'anniversary',
          note: 'วันครบรอบสุดพิเศษของเราในทุกๆ เดือน',
          isSystem: true
        });
      }
    }

    return dayEvents;
  };

  // Upcoming reminders calculation (events within next 3 days or today)
  const getUpcomingAlerts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alerts = [];

    // Check each event
    events.forEach(e => {
      const eventDate = new Date(e.date);
      eventDate.setHours(0, 0, 0, 0);
      const diffTime = eventDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= (e.remindBeforeDays ?? 3)) {
        alerts.push({
          ...e,
          diffDays
        });
      }
    });

    // Also check the 22nd anniversary for this month or next
    const targetDay = 22;
    let next22 = new Date(today.getFullYear(), today.getMonth(), targetDay);
    if (today.getDate() > targetDay) {
      next22 = new Date(today.getFullYear(), today.getMonth() + 1, targetDay);
    }
    const diff22 = Math.ceil((next22 - today) / (1000 * 60 * 60 * 24));
    if (diff22 >= 0 && diff22 <= 3) {
      alerts.unshift({
        id: 'upcoming-anniversary',
        title: 'วันครบรอบของเรา 💕 (วันที่ 22)',
        date: next22.toISOString().split('T')[0],
        category: 'anniversary',
        note: 'เตรียมฉลองและมอบความรักให้แฟนนะ!',
        diffDays: diff22
      });
    }

    return alerts.sort((a, b) => a.diffDays - b.diffDays);
  };

  const upcomingAlerts = getUpcomingAlerts();

  // Category styles
  const getCategoryStyle = (cat) => {
    switch (cat) {
      case 'anniversary':
        return { bg: 'bg-pink-100 text-pink-700 border-pink-300', dot: 'bg-pink-500', icon: Heart };
      case 'work':
        return { bg: 'bg-indigo-100 text-indigo-700 border-indigo-300', dot: 'bg-indigo-500', icon: Briefcase };
      case 'health':
        return { bg: 'bg-emerald-100 text-emerald-700 border-emerald-300', dot: 'bg-emerald-500', icon: Pill };
      case 'date':
      default:
        return { bg: 'bg-purple-100 text-purple-700 border-purple-300', dot: 'bg-purple-500', icon: Coffee };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-purple-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-purple-100 text-purple-600 shadow-2xs">
            <CalendarIcon className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              ปฏิทินคนรัก & แจ้งเตือนวันสำคัญ 📅
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              จดโน้ต วันสำคัญ วันส่งงาน และนัดเดท พร้อมระบบเตือนทั้งเราและแฟน
            </p>
          </div>
        </div>

        <button
          onClick={() => openAddModal()}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มวันสำคัญ / โน้ต</span>
        </button>
      </div>

      {/* UPCOMING REMINDERS BANNER */}
      {upcomingAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-purple-50 to-pink-50 border-2 border-amber-200/90 rounded-3xl p-4 sm:p-5 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-700 animate-bounce">
              <Bell className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-800">
              ⏰ แจ้งเตือนวันสำคัญที่ใกล้จะถึง (เตือนทั้งคู่ช่วยกันดู)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {upcomingAlerts.map((alert, idx) => {
              const catStyle = getCategoryStyle(alert.category);
              const Icon = catStyle.icon;

              return (
                <div
                  key={alert.id || idx}
                  className="bg-white/95 rounded-2xl p-3 border border-amber-200/80 shadow-2xs flex items-start gap-2.5"
                >
                  <span className={`p-2 rounded-xl ${catStyle.bg} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {alert.title}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        alert.diffDays === 0
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {alert.diffDays === 0 ? 'วันนี้แล้ว!' : `อีก ${alert.diffDays} วัน`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      📅 {alert.date} {alert.time ? `(${alert.time} น.)` : ''}
                    </p>
                    {alert.note && (
                      <p className="text-[11px] text-purple-600 mt-1 italic truncate">
                        "{alert.note}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CALENDAR MAIN CARD */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-purple-200/80 shadow-xs p-4 sm:p-6">
        {/* Month Navigator Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-2xl font-bold text-slate-800">
              {monthNames[month]} {year + 543}
            </h3>
            <span className="text-xs font-medium text-slate-400">({monthNames[month]} {year})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-all cursor-pointer"
            >
              วันนี้
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 border border-slate-200 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 border border-slate-200 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-500 mb-2">
          {['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'].map((dayName, idx) => (
            <div key={idx} className={`py-2 ${idx === 0 ? 'text-rose-500' : idx === 6 ? 'text-purple-600' : ''}`}>
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Previous month trailing days */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => {
            const prevDay = prevMonthDays - firstDayIndex + idx + 1;
            return (
              <div
                key={`prev-${idx}`}
                className="min-h-[75px] sm:min-h-[105px] p-1.5 rounded-2xl bg-slate-50/50 border border-transparent opacity-40 text-slate-400 text-xs"
              >
                <span>{prevDay}</span>
              </div>
            );
          })}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNumber = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
            const dayEvents = getEventsForDay(dayNumber);
            const isToday =
              new Date().getFullYear() === year &&
              new Date().getMonth() === month &&
              new Date().getDate() === dayNumber;
            const isAnniversaryDay = dayNumber === 22;

            return (
              <div
                key={`curr-${dayNumber}`}
                onClick={() => openAddModal(dateStr)}
                className={`min-h-[85px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isAnniversaryDay
                    ? 'bg-gradient-to-b from-pink-50 to-purple-50/80 border-pink-300 ring-2 ring-pink-200/60 shadow-xs'
                    : isToday
                    ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-200 shadow-xs'
                    : 'bg-white hover:bg-purple-50/40 border-slate-100 hover:border-purple-200 shadow-2xs'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs sm:text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-purple-600 text-white'
                        : isAnniversaryDay
                        ? 'bg-pink-500 text-white'
                        : 'text-slate-700'
                    }`}
                  >
                    {dayNumber}
                  </span>

                  {isAnniversaryDay && (
                    <span className="text-xs sm:text-sm animate-heart-float" title="วันครบรอบของเรา 💕">
                      💖
                    </span>
                  )}
                </div>

                {/* Day Events preview */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev) => {
                    const style = getCategoryStyle(ev.category);
                    return (
                      <div
                        key={ev.id}
                        className={`px-1.5 py-0.5 rounded-lg text-[10px] font-semibold truncate border ${style.bg} flex items-center gap-1`}
                        title={`${ev.title} ${ev.time ? `(${ev.time})` : ''} - ${ev.note || ''}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
                        <span className="truncate">{ev.title}</span>
                      </div>
                    );
                  })}

                  {dayEvents.length > 2 && (
                    <span className="text-[9px] text-purple-600 font-bold block text-center">
                      +{dayEvents.length - 2} เพิ่มเติม
                    </span>
                  )}
                </div>

                {/* Hover Add indicator */}
                <div className="text-[10px] text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity text-right">
                  + เพิ่ม
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ALL SCHEDULED EVENTS LIST (for easy deletion & review) */}
      <div className="bg-white/80 rounded-3xl border border-purple-200 p-5 shadow-xs">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span>📋 รายการวันสำคัญและโน้ตทั้งหมด ({events.length})</span>
        </h3>

        {events.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">ยังไม่มีรายการบันทึก คลิกที่วันในปฏิทินเพื่อเพิ่มได้เลย</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {events.map((ev) => {
              const style = getCategoryStyle(ev.category);
              const author = users[ev.createdBy] || { nickname: ev.createdBy, avatar: '👤' };

              return (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-purple-100 flex items-start justify-between gap-3 hover:bg-purple-50/50 transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${style.bg}`}>
                        {ev.category === 'anniversary' ? 'วันครบรอบ' : ev.category === 'work' ? 'ส่งงาน/เรียน' : ev.category === 'health' ? 'สุขภาพ' : 'นัดเดท'}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{ev.date} {ev.time && `(${ev.time} น.)`}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800">{ev.title}</h4>
                    {ev.note && <p className="text-xs text-slate-500">{ev.note}</p>}
                    <span className="text-[10px] text-purple-600 block">
                      บันทึกโดย: {author.avatar} {author.nickname} • เตือนล่วงหน้า {ev.remindBeforeDays} วัน
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteEvent(ev.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                    title="ลบรายการ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>📅 เพิ่มวันสำคัญ / โน้ตให้แฟน</span>
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
                  หัวข้อ / ชื่อกิจกรรม *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น มีส่งงานโปรเจกต์, เดทกินชาบู, วันเกิดแฟน"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    วันที่ *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    เวลา
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  หมวดหมู่
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'date', label: '☕ เดท' },
                    { id: 'work', label: '💻 งาน/เรียน' },
                    { id: 'anniversary', label: '💕 ครบรอบ' },
                    { id: 'health', label: '💊 สุขภาพ' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`py-2 px-1 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                        formData.category === cat.id
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reminder days */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ระบบแจ้งเตือนล่วงหน้า (เตือนทั้งคู่)
                </label>
                <select
                  value={formData.remindBeforeDays}
                  onChange={(e) => setFormData({ ...formData, remindBeforeDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs bg-white"
                >
                  <option value={0}>เตือนในวันนั้นเลย</option>
                  <option value={1}>เตือนล่วงหน้า 1 วัน</option>
                  <option value={2}>เตือนล่วงหน้า 2 วัน</option>
                  <option value={3}>เตือนล่วงหน้า 3 วัน</option>
                  <option value={7}>เตือนล่วงหน้า 1 สัปดาห์</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  โน้ตข้อความ / รายละเอียด
                </label>
                <textarea
                  rows="2"
                  placeholder="เขียนโน้ตให้กำลังใจหรือรายละเอียดสถานที่..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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
                  บันทึกลงปฏิทิน 💕
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
