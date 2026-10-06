// Dual-mode API service: Supabase Cloud Database + Local Express API fallback

import { supabase, isSupabaseConfigured, initialCoupleData } from './supabase';

const API_BASE = '/api';

// Cache for Supabase state
let memoryState = null;

export const api = {
  isCloud: isSupabaseConfigured,

  // Listen for real-time changes across devices
  subscribeToChanges(callback) {
    if (!isSupabaseConfigured || !supabase) return () => {};

    const channel = supabase
      .channel('couple_realtime_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'couple_store', filter: 'id=eq.app_data' },
        (payload) => {
          if (payload.new && payload.new.data) {
            memoryState = payload.new.data;
            callback(payload.new.data);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Helper to persist to Supabase
  async saveToSupabase(newData) {
    if (!isSupabaseConfigured || !supabase) return false;
    memoryState = newData;
    const { error } = await supabase
      .from('couple_store')
      .upsert({
        id: 'app_data',
        data: newData,
        updated_at: new Date().toISOString()
      });
    if (error) {
      console.error('Supabase write error:', error);
      return false;
    }
    return true;
  },

  async getAll() {
    // 1. If Supabase is configured, use Free Cloud Database
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('couple_store')
          .select('data')
          .eq('id', 'app_data')
          .single();

        if (error || !data || !data.data) {
          // Initialize row if first time
          await supabase.from('couple_store').upsert({
            id: 'app_data',
            data: initialCoupleData,
            updated_at: new Date().toISOString()
          });
          memoryState = initialCoupleData;
          return initialCoupleData;
        }

        memoryState = data.data;
        return data.data;
      } catch (err) {
        console.error('Failed to fetch from Supabase:', err);
      }
    }

    // 2. Otherwise fallback to local Express server
    try {
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) throw new Error('API fetch error');
      const data = await res.json();
      memoryState = data;
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using initial data:', err);
      return memoryState || initialCoupleData;
    }
  },

  // USERS & PROFILE
  async updateUser(id, data) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      const updated = {
        ...memoryState,
        users: {
          ...memoryState.users,
          [id]: {
            ...memoryState.users[id],
            ...data,
            updatedAt: new Date().toISOString()
          }
        }
      };
      await this.saveToSupabase(updated);
      return updated.users[id];
    }

    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateSettings(data) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      const updated = {
        ...memoryState,
        settings: {
          ...memoryState.settings,
          ...data
        }
      };
      await this.saveToSupabase(updated);
      return updated.settings;
    }

    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // TICKETS
  async createTicket(ticket) {
    const newTicket = {
      id: `t-${Date.now()}`,
      title: ticket.title || 'บัตรสิทธิพิเศษสำหรับแฟน 💜',
      description: ticket.description || '',
      createdBy: ticket.createdBy || 'user1',
      targetUser: ticket.targetUser || 'user2',
      isPermanent: !!ticket.isPermanent,
      expiresAt: ticket.isPermanent ? null : (ticket.expiresAt || null),
      status: 'active',
      usedAt: null,
      usedBy: null,
      themeColor: ticket.themeColor || 'purple',
      createdAt: new Date().toISOString(),
      history: [
        {
          action: 'created',
          by: ticket.createdBy || 'user1',
          time: new Date().toISOString(),
          note: `สร้างตั๋ว "${ticket.title}"`
        }
      ]
    };

    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      const updated = {
        ...memoryState,
        tickets: [newTicket, ...(memoryState.tickets || [])]
      };
      await this.saveToSupabase(updated);
      return newTicket;
    }

    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
    return await res.json();
  },

  async updateTicket(id, ticket) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      let updatedTicket = null;
      const tickets = (memoryState.tickets || []).map((t) => {
        if (t.id === id) {
          updatedTicket = {
            ...t,
            ...ticket,
            history: [
              ...(t.history || []),
              {
                action: 'edited',
                by: ticket.updatedBy || 'user',
                time: new Date().toISOString(),
                note: 'แก้ไขรายละเอียดตั๋ว'
              }
            ]
          };
          return updatedTicket;
        }
        return t;
      });

      await this.saveToSupabase({ ...memoryState, tickets });
      return updatedTicket;
    }

    const res = await fetch(`${API_BASE}/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
    return await res.json();
  },

  async redeemTicket(id, usedBy) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      let redeemedTicket = null;
      const tickets = (memoryState.tickets || []).map((t) => {
        if (t.id === id) {
          redeemedTicket = {
            ...t,
            status: 'used',
            usedAt: new Date().toISOString(),
            usedBy: usedBy || 'user',
            history: [
              ...(t.history || []),
              {
                action: 'used',
                by: usedBy || 'user',
                time: new Date().toISOString(),
                note: 'ฉีกตั๋วใช้งานแล้ว 💕'
              }
            ]
          };
          return redeemedTicket;
        }
        return t;
      });

      await this.saveToSupabase({ ...memoryState, tickets });
      return redeemedTicket;
    }

    const res = await fetch(`${API_BASE}/tickets/${id}/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usedBy })
    });
    return await res.json();
  },

  async deleteTicket(id) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      const tickets = (memoryState.tickets || []).filter((t) => t.id !== id);
      await this.saveToSupabase({ ...memoryState, tickets });
      return { success: true, id };
    }

    const res = await fetch(`${API_BASE}/tickets/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // CALENDAR
  async createEvent(event) {
    const newEvent = {
      id: `c-${Date.now()}`,
      title: event.title,
      date: event.date,
      time: event.time || '12:00',
      category: event.category || 'date',
      note: event.note || '',
      createdBy: event.createdBy || 'user1',
      remindBeforeDays: event.remindBeforeDays !== undefined ? Number(event.remindBeforeDays) : 1,
      isRecurring: !!event.isRecurring,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      const updated = {
        ...memoryState,
        calendar: [...(memoryState.calendar || []), newEvent]
      };
      await this.saveToSupabase(updated);
      return newEvent;
    }

    const res = await fetch(`${API_BASE}/calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    return await res.json();
  },

  async deleteEvent(id) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      const calendar = (memoryState.calendar || []).filter((c) => c.id !== id);
      await this.saveToSupabase({ ...memoryState, calendar });
      return { success: true, id };
    }

    const res = await fetch(`${API_BASE}/calendar/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // FAVORITES
  async createFavorite(fav) {
    const newItem = {
      id: `f-${Date.now()}`,
      belongsTo: fav.belongsTo || 'user1',
      category: fav.category || 'food',
      title: fav.title,
      detail: fav.detail || '',
      addedBy: fav.addedBy || 'user1',
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      const updated = {
        ...memoryState,
        favorites: [newItem, ...(memoryState.favorites || [])]
      };
      await this.saveToSupabase(updated);
      return newItem;
    }

    const res = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fav)
    });
    return await res.json();
  },

  async deleteFavorite(id) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      const favorites = (memoryState.favorites || []).filter((f) => f.id !== id);
      await this.saveToSupabase({ ...memoryState, favorites });
      return { success: true, id };
    }

    const res = await fetch(`${API_BASE}/favorites/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // SULKS
  async createSulk(sulk) {
    const newSulk = {
      id: `s-${Date.now()}`,
      authorId: sulk.authorId || 'user1',
      topic: sulk.topic,
      detail: sulk.detail || '',
      severity: sulk.severity || 3,
      isResolved: false,
      resolvedAt: null,
      hugs: 0,
      messages: [],
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      const updated = {
        ...memoryState,
        sulks: [newSulk, ...(memoryState.sulks || [])]
      };
      await this.saveToSupabase(updated);
      return newSulk;
    }

    const res = await fetch(`${API_BASE}/sulks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sulk)
    });
    return await res.json();
  },

  async updateSulk(id, data) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      let updatedSulk = null;
      const sulks = (memoryState.sulks || []).map((s) => {
        if (s.id === id) {
          updatedSulk = { ...s, ...data };
          return updatedSulk;
        }
        return s;
      });
      await this.saveToSupabase({ ...memoryState, sulks });
      return updatedSulk;
    }

    const res = await fetch(`${API_BASE}/sulks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async hugSulk(id) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      let updatedSulk = null;
      const sulks = (memoryState.sulks || []).map((s) => {
        if (s.id === id) {
          updatedSulk = { ...s, hugs: (s.hugs || 0) + 1 };
          return updatedSulk;
        }
        return s;
      });
      await this.saveToSupabase({ ...memoryState, sulks });
      return updatedSulk;
    }

    const res = await fetch(`${API_BASE}/sulks/${id}/hug`, {
      method: 'POST'
    });
    return await res.json();
  },

  async addSulkMessage(id, fromId, text) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      let updatedSulk = null;
      const sulks = (memoryState.sulks || []).map((s) => {
        if (s.id === id) {
          updatedSulk = {
            ...s,
            messages: [
              ...(s.messages || []),
              {
                id: `sm-${Date.now()}`,
                fromId: fromId || 'user2',
                text,
                createdAt: new Date().toISOString()
              }
            ]
          };
          return updatedSulk;
        }
        return s;
      });
      await this.saveToSupabase({ ...memoryState, sulks });
      return updatedSulk;
    }

    const res = await fetch(`${API_BASE}/sulks/${id}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromId, text })
    });
    return await res.json();
  },

  async deleteSulk(id) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      const sulks = (memoryState.sulks || []).filter((s) => s.id !== id);
      await this.saveToSupabase({ ...memoryState, sulks });
      return { success: true, id };
    }

    const res = await fetch(`${API_BASE}/sulks/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // VENTS
  async createVent(vent) {
    const newVent = {
      id: `v-${Date.now()}`,
      authorId: vent.authorId || 'user1',
      moodTag: vent.moodTag || 'งอน',
      detail: vent.detail || '',
      wantsToResolve: vent.wantsToResolve || '',
      status: 'open',
      messages: [],
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      const updated = {
        ...memoryState,
        vents: [newVent, ...(memoryState.vents || [])]
      };
      await this.saveToSupabase(updated);
      return newVent;
    }

    const res = await fetch(`${API_BASE}/vents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vent)
    });
    return await res.json();
  },

  async addVentMessage(id, fromId, text) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      let updatedVent = null;
      const vents = (memoryState.vents || []).map((v) => {
        if (v.id === id) {
          updatedVent = {
            ...v,
            status: 'hugged',
            messages: [
              ...(v.messages || []),
              {
                id: `vm-${Date.now()}`,
                fromId: fromId || 'user2',
                text,
                createdAt: new Date().toISOString()
              }
            ]
          };
          return updatedVent;
        }
        return v;
      });
      await this.saveToSupabase({ ...memoryState, vents });
      return updatedVent;
    }

    const res = await fetch(`${API_BASE}/vents/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromId, text })
    });
    return await res.json();
  },

  async deleteVent(id) {
    if (isSupabaseConfigured) {
      if (!memoryState) await this.getAll();
      const vents = (memoryState.vents || []).filter((v) => v.id !== id);
      await this.saveToSupabase({ ...memoryState, vents });
      return { success: true, id };
    }

    const res = await fetch(`${API_BASE}/vents/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  }
};
