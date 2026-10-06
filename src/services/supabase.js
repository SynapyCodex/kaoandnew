import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial default state if DB is empty
export const initialCoupleData = {
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
  tickets: [
    {
      id: 't-1',
      title: 'บัตรตามใจ 1 วัน ✨',
      description: 'ใช้สิทธิ์สั่งให้แฟนทำอะไรก็ได้ 1 วันเต็มๆ ห้ามขัดใจแม้แต่เรื่องเดียว!',
      createdBy: 'user1',
      targetUser: 'user2',
      isPermanent: false,
      expiresAt: '2026-12-31',
      status: 'active',
      usedAt: null,
      usedBy: null,
      themeColor: 'purple',
      createdAt: '2026-10-01T10:00:00.000Z',
      history: [
        {
          action: 'created',
          by: 'user1',
          time: '2026-10-01T10:00:00.000Z',
          note: 'สร้างตั๋วบัตรตามใจ 1 วัน มอบให้ นิว'
        }
      ]
    },
    {
      id: 't-2',
      title: 'บัตรห้ามโกรธ / ห้ามงอน 1 ครั้ง 🥺',
      description: 'เมื่อยื่นบัตรนี้ แฟนต้องยิ้มให้อภัยทันที กอด 1 ที แล้วหายงอนนะ!',
      createdBy: 'user2',
      targetUser: 'user1',
      isPermanent: true,
      expiresAt: null,
      status: 'active',
      usedAt: null,
      usedBy: null,
      themeColor: 'pink',
      createdAt: '2026-10-02T14:30:00.000Z',
      history: [
        {
          action: 'created',
          by: 'user2',
          time: '2026-10-02T14:30:00.000Z',
          note: 'สร้างตั๋วบัตรห้ามโกรธ มอบให้ เก้า (บัตรถาวร)'
        }
      ]
    }
  ],
  calendar: [
    {
      id: 'c-1',
      title: 'วันครบรอบของเราสองคน 💕 (ทุกวันที่ 22)',
      date: '2026-10-22',
      time: '00:00',
      category: 'anniversary',
      note: 'วันครบรอบสุดพิเศษของเราทุกเดือน ไปฉลองหรือกินของอร่อยกันนะ!',
      createdBy: 'system',
      remindBeforeDays: 3,
      isRecurring: true
    }
  ],
  favorites: [
    {
      id: 'f-1',
      belongsTo: 'user1',
      category: 'food',
      title: 'แซลมอนดองซีอิ๊วเกาหลี 🍣',
      detail: 'ชอบกินคู่กับสาหร่ายและข้าวญี่ปุ่นร้อนๆ',
      addedBy: 'user2',
      createdAt: '2026-09-20T12:00:00.000Z'
    },
    {
      id: 'f-2',
      belongsTo: 'user2',
      category: 'dessert',
      title: 'บิงซูสตรอว์เบอร์รี & ชาไทยหวานน้อย 🍓🧋',
      detail: 'ชอบกินของหวานผลไม้สดชื่นๆ',
      addedBy: 'user1',
      createdAt: '2026-09-21T09:15:00.000Z'
    }
  ],
  sulks: [],
  vents: []
};
