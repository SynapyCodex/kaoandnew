import React from 'react';
import { Ticket, Calendar, Heart, CloudRain, MessageCircleHeart, Smile, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, counts }) {
  const tabs = [
    {
      id: 'tickets',
      label: 'ตั๋วพิเศษ',
      sublabel: 'Tickets',
      icon: Ticket,
      badge: counts?.activeTickets || 0,
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'calendar',
      label: 'ปฏิทิน',
      sublabel: 'Calendar',
      icon: Calendar,
      badge: counts?.upcomingEvents || 0,
      badgeColor: 'bg-pink-500'
    },
    {
      id: 'favorites',
      label: 'สิ่งที่ชอบ',
      sublabel: 'Favorites',
      icon: Heart,
      badge: counts?.favorites || 0,
      badgeColor: 'bg-rose-400'
    },
    {
      id: 'sulks',
      label: 'จุดนอย',
      sublabel: 'Sulking',
      icon: CloudRain,
      badge: counts?.activeSulks || 0,
      badgeColor: 'bg-amber-500'
    },
    {
      id: 'vents',
      label: 'จุดระบายแฟน',
      sublabel: 'Vent Corner',
      icon: MessageCircleHeart,
      badge: counts?.activeVents || 0,
      badgeColor: 'bg-purple-600'
    },
    {
      id: 'status',
      label: 'สถานะแฟน',
      sublabel: 'Status',
      icon: Smile,
      badge: null
    }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-white/80 backdrop-blur-md p-2 rounded-3xl border border-purple-200/80 shadow-xs flex items-center justify-between gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 py-3 px-3 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-200 font-medium cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-300/50 scale-[1.02]'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-500'}`} />
                <span className="text-sm font-semibold tracking-wide">{tab.label}</span>
                
                {tab.badge !== null && tab.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive ? 'bg-white text-purple-700' : `${tab.badgeColor} text-white`
                    } shadow-2xs`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Dock Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-purple-200/80 px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl relative transition-all cursor-pointer ${
                  isActive ? 'text-purple-600 scale-105 font-bold' : 'text-slate-500 hover:text-purple-500'
                }`}
              >
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-purple-100 text-purple-700' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 leading-none">{tab.label}</span>
                
                {tab.badge !== null && tab.badge > 0 && (
                  <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center font-bold shadow-2xs">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
