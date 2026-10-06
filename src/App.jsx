import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import HeaderBanner from './components/HeaderBanner';
import Navbar from './components/Navbar';
import TicketSection from './components/TicketSection';
import CalendarSection from './components/CalendarSection';
import FavoritesSection from './components/FavoritesSection';
import SulkSection from './components/SulkSection';
import VentSection from './components/VentSection';
import StatusSection from './components/StatusSection';

// Default initial state for offline/fallback
const defaultData = {
  settings: {
    anniversaryDate: '2024-05-22',
    anniversaryDay: 22,
    quote: 'ไม่ว่าจะวันไหนๆ ขอให้เรามีกันและกันเสมอ 💜'
  },
  users: {
    user1: {
      id: 'user1',
      name: 'เก้า',
      nickname: 'เก้า',
      avatar: '🐶',
      color: 'purple',
      mood: 'รักแฟนที่สุด',
      moodNote: 'แวะมาจุ๊บในนี้หน่อย คิดถึงจังเลย 💜',
      updatedAt: new Date().toISOString()
    },
    user2: {
      id: 'user2',
      name: 'นิว',
      nickname: 'นิว',
      avatar: '🐷',
      color: 'indigo',
      mood: 'อารมณ์ดี',
      moodNote: 'วันนี้อารมณ์ดีมาก รอกินของอร่อยเย็นนี้ 🧋✨',
      updatedAt: new Date().toISOString()
    }
  },
  tickets: [],
  calendar: [],
  favorites: [],
  sulks: [],
  vents: []
};

export default function App() {
  const [data, setData] = useState(defaultData);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('couple_app_user');
      if (saved === 'user1' || saved === 'user2') {
        return saved;
      }
    } catch (e) {
      console.warn('LocalStorage not accessible:', e);
    }
    return 'user1';
  });
  
  const [hasChosenDeviceUser, setHasChosenDeviceUser] = useState(() => {
    try {
      return Boolean(localStorage.getItem('couple_app_user'));
    } catch (e) {
      return true;
    }
  });

  const [activeTab, setActiveTab] = useState('tickets');
  const [loading, setLoading] = useState(true);

  // Set and persist current user per device
  const handleSetCurrentUser = (userId) => {
    setCurrentUser(userId);
    try {
      localStorage.setItem('couple_app_user', userId);
    } catch (e) {
      console.warn('Failed to save user to localStorage:', e);
    }
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      const res = await api.getAll();
      if (res) {
        setData(res);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Realtime subscription if Supabase is active
    const unsubscribe = api.subscribeToChanges((newData) => {
      if (newData) setData(newData);
    });

    // Auto-poll every 6 seconds as backup/polling
    const interval = setInterval(fetchData, 6000);
    return () => {
      clearInterval(interval);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // TICKETS HANDLERS
  const handleCreateTicket = async (ticketData) => {
    const newTicket = await api.createTicket(ticketData);
    if (newTicket) {
      setData(prev => ({
        ...prev,
        tickets: [newTicket, ...prev.tickets]
      }));
    }
  };

  const handleUpdateTicket = async (id, ticketData) => {
    const updated = await api.updateTicket(id, ticketData);
    if (updated) {
      setData(prev => ({
        ...prev,
        tickets: prev.tickets.map(t => t.id === id ? updated : t)
      }));
    }
  };

  const handleRedeemTicket = async (id, usedBy) => {
    const updated = await api.redeemTicket(id, usedBy);
    if (updated) {
      setData(prev => ({
        ...prev,
        tickets: prev.tickets.map(t => t.id === id ? updated : t)
      }));
    }
  };

  const handleDeleteTicket = async (id) => {
    await api.deleteTicket(id);
    setData(prev => ({
      ...prev,
      tickets: prev.tickets.filter(t => t.id !== id)
    }));
  };

  // CALENDAR HANDLERS
  const handleCreateEvent = async (eventData) => {
    const newEvent = await api.createEvent(eventData);
    if (newEvent) {
      setData(prev => ({
        ...prev,
        calendar: [...prev.calendar, newEvent]
      }));
    }
  };

  const handleDeleteEvent = async (id) => {
    await api.deleteEvent(id);
    setData(prev => ({
      ...prev,
      calendar: prev.calendar.filter(c => c.id !== id)
    }));
  };

  // FAVORITES HANDLERS
  const handleCreateFavorite = async (favData) => {
    const newFav = await api.createFavorite(favData);
    if (newFav) {
      setData(prev => ({
        ...prev,
        favorites: [newFav, ...prev.favorites]
      }));
    }
  };

  const handleDeleteFavorite = async (id) => {
    await api.deleteFavorite(id);
    setData(prev => ({
      ...prev,
      favorites: prev.favorites.filter(f => f.id !== id)
    }));
  };

  // SULK HANDLERS
  const handleCreateSulk = async (sulkData) => {
    const newSulk = await api.createSulk(sulkData);
    if (newSulk) {
      setData(prev => ({
        ...prev,
        sulks: [newSulk, ...prev.sulks]
      }));
    }
  };

  const handleUpdateSulk = async (id, updateData) => {
    const updated = await api.updateSulk(id, updateData);
    if (updated) {
      setData(prev => ({
        ...prev,
        sulks: prev.sulks.map(s => s.id === id ? updated : s)
      }));
    }
  };

  const handleHugSulk = async (id) => {
    const updated = await api.hugSulk(id);
    if (updated) {
      setData(prev => ({
        ...prev,
        sulks: prev.sulks.map(s => s.id === id ? updated : s)
      }));
    }
  };

  const handleAddSulkMessage = async (id, fromId, text) => {
    const updated = await api.addSulkMessage(id, fromId, text);
    if (updated) {
      setData(prev => ({
        ...prev,
        sulks: prev.sulks.map(s => s.id === id ? updated : s)
      }));
    }
  };

  const handleDeleteSulk = async (id) => {
    await api.deleteSulk(id);
    setData(prev => ({
      ...prev,
      sulks: prev.sulks.filter(s => s.id !== id)
    }));
  };

  // VENT HANDLERS
  const handleCreateVent = async (ventData) => {
    const newVent = await api.createVent(ventData);
    if (newVent) {
      setData(prev => ({
        ...prev,
        vents: [newVent, ...prev.vents]
      }));
    }
  };

  const handleAddVentMessage = async (id, fromId, text) => {
    const updated = await api.addVentMessage(id, fromId, text);
    if (updated) {
      setData(prev => ({
        ...prev,
        vents: prev.vents.map(v => v.id === id ? updated : v)
      }));
    }
  };

  const handleDeleteVent = async (id) => {
    await api.deleteVent(id);
    setData(prev => ({
      ...prev,
      vents: prev.vents.filter(v => v.id !== id)
    }));
  };

  // PROFILE & SETTINGS
  const handleUpdateUser = async (userId, userData) => {
    const updated = await api.updateUser(userId, userData);
    if (updated) {
      setData(prev => ({
        ...prev,
        users: {
          ...prev.users,
          [userId]: updated
        }
      }));
    }
  };

  const handleUpdateSettings = async (settingsData) => {
    const updated = await api.updateSettings(settingsData);
    if (updated) {
      setData(prev => ({
        ...prev,
        settings: updated
      }));
    }
  };

  // Badge counts
  const activeTicketsCount = (data.tickets || []).filter(t => t.status === 'active').length;
  const activeSulksCount = (data.sulks || []).filter(s => !s.isResolved).length;
  const activeVentsCount = (data.vents || []).length;
  
  // Calculate upcoming events in next 3 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEventsCount = (data.calendar || []).filter(c => {
    const d = new Date(c.date);
    d.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  }).length;

  return (
    <div className="min-h-screen bg-[#FAF7FD] flex flex-col pb-24 md:pb-12 text-slate-700">
      {/* Top Banner & User Switcher */}
      <HeaderBanner
        currentUser={currentUser}
        setCurrentUser={handleSetCurrentUser}
        users={data.users || {}}
        settings={data.settings}
        onRefresh={fetchData}
      />

      {/* First-time Device Owner Selector Modal */}
      {!hasChosenDeviceUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-purple-300 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl mx-auto shadow-inner animate-bounce">
              💕
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                ยินดีต้อนรับสู่พื้นที่ของเรา
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                เครื่องนี้เป็นของใครเอ่ย? ระบบจะจำตามเครื่องไว้ให้ รีเว็ปก็ไม่หลุดนะ!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleSetCurrentUser('user1');
                  setHasChosenDeviceUser(true);
                }}
                className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 flex flex-col items-center gap-1.5 transition-all transform hover:scale-105 cursor-pointer shadow-xs"
              >
                <span className="text-3xl">{data.users?.user1?.avatar || '🐶'}</span>
                <span className="font-bold text-sm text-purple-900">{data.users?.user1?.nickname || 'เก้า'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleSetCurrentUser('user2');
                  setHasChosenDeviceUser(true);
                }}
                className="p-4 rounded-2xl bg-pink-50 hover:bg-pink-100 border-2 border-pink-300 flex flex-col items-center gap-1.5 transition-all transform hover:scale-105 cursor-pointer shadow-xs"
              >
                <span className="text-3xl">{data.users?.user2?.avatar || '🐷'}</span>
                <span className="font-bold text-sm text-pink-900">{data.users?.user2?.nickname || 'นิว'}</span>
              </button>
            </div>

            <p className="text-[11px] text-purple-400">
              * สามารถกดเปลี่ยนสลับดูได้ตลอดเวลาที่แถบด้านบน
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          activeTickets: activeTicketsCount,
          upcomingEvents: upcomingEventsCount,
          favorites: (data.favorites || []).length,
          activeSulks: activeSulksCount,
          activeVents: activeVentsCount
        }}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-4 mt-6 flex-1">
        {activeTab === 'tickets' && (
          <TicketSection
            tickets={data.tickets || []}
            currentUser={currentUser}
            users={data.users || {}}
            onCreateTicket={handleCreateTicket}
            onUpdateTicket={handleUpdateTicket}
            onRedeemTicket={handleRedeemTicket}
            onDeleteTicket={handleDeleteTicket}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarSection
            events={data.calendar || []}
            currentUser={currentUser}
            users={data.users || {}}
            settings={data.settings}
            onCreateEvent={handleCreateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesSection
            favorites={data.favorites || []}
            currentUser={currentUser}
            users={data.users || {}}
            onCreateFavorite={handleCreateFavorite}
            onDeleteFavorite={handleDeleteFavorite}
          />
        )}

        {activeTab === 'sulks' && (
          <SulkSection
            sulks={data.sulks || []}
            currentUser={currentUser}
            users={data.users || {}}
            onCreateSulk={handleCreateSulk}
            onUpdateSulk={handleUpdateSulk}
            onHugSulk={handleHugSulk}
            onAddSulkMessage={handleAddSulkMessage}
            onDeleteSulk={handleDeleteSulk}
          />
        )}

        {activeTab === 'vents' && (
          <VentSection
            vents={data.vents || []}
            currentUser={currentUser}
            users={data.users || {}}
            onCreateVent={handleCreateVent}
            onAddVentMessage={handleAddVentMessage}
            onDeleteVent={handleDeleteVent}
          />
        )}

        {activeTab === 'status' && (
          <StatusSection
            users={data.users || {}}
            currentUser={currentUser}
            settings={data.settings}
            onUpdateUser={handleUpdateUser}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-purple-600/60 hidden md:block">
        พื้นที่แห่งความรักของ {data.users?.user1?.nickname || 'เก้า'} & {data.users?.user2?.nickname || 'นิว'} 💜 ทุกวันที่ 22 คือวันครบรอบของเรา
      </footer>
    </div>
  );
}
