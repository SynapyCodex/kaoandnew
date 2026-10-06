import React, { useState } from 'react';
import { 
  Heart, Plus, Trash2, Utensils, Coffee, AlertOctagon, Gift, 
  Sparkles, Filter, CheckCircle, Tag, Smile 
} from 'lucide-react';

export default function FavoritesSection({ 
  favorites, 
  currentUser, 
  users, 
  onCreateFavorite, 
  onDeleteFavorite 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    belongsTo: currentUser,
    category: 'food',
    title: '',
    detail: ''
  });

  const categories = [
    { id: 'all', label: 'ทั้งหมด', icon: Sparkles },
    { id: 'food', label: 'อาหารโปรด 🍣', icon: Utensils },
    { id: 'drinks', label: 'เครื่องดื่ม/ขนม 🧋', icon: Coffee },
    { id: 'dislike', label: 'สิ่งที่ไม่ชอบ/แพ้ 🚫', icon: AlertOctagon },
    { id: 'gift', label: 'ของขวัญที่อยากได้ 🎁', icon: Gift },
  ];

  const openAddModal = (forWhom = currentUser) => {
    setFormData({
      belongsTo: forWhom,
      category: 'food',
      title: '',
      detail: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onCreateFavorite({
      ...formData,
      addedBy: currentUser
    });
    setIsModalOpen(false);
  };

  const getFilteredItems = (userId) => {
    return favorites.filter(item => {
      const matchUser = item.belongsTo === userId;
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      return matchUser && matchCat;
    });
  };

  const user1Items = getFilteredItems('user1');
  const user2Items = getFilteredItems('user2');

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'food':
        return { label: 'อาหารโปรด 🍣', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'drinks':
        return { label: 'เครื่องดื่ม/ขนม 🧋', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'dislike':
        return { label: 'สิ่งที่ไม่ชอบ/แพ้ 🚫', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'gift':
        return { label: 'ของขวัญที่อยากได้ 🎁', bg: 'bg-pink-50 text-pink-700 border-pink-200' };
      default:
        return { label: 'ความชอบทั่วไป ✨', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
  };

  const renderFavoriteCard = (item) => {
    const badge = getCategoryBadge(item.category);
    const author = users[item.addedBy] || { nickname: item.addedBy, avatar: '👤' };
    const isSelfAdded = item.addedBy === item.belongsTo;

    return (
      <div
        key={item.id}
        className="p-4 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
              {badge.label}
            </span>
            <button
              onClick={() => onDeleteFavorite(item.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-all cursor-pointer"
              title="ลบรายการ"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <h4 className="text-sm font-bold text-slate-800 leading-snug">
            {item.title}
          </h4>

          {item.detail && (
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {item.detail}
            </p>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            {isSelfAdded ? (
              <span className="text-purple-600">✍️ จดด้วยตัวเอง</span>
            ) : (
              <span className="text-pink-600 font-medium">
                💖 จดโดยแฟน ({author.avatar} {author.nickname})
              </span>
            )}
          </span>
          <span className="text-[10px] font-mono">
            {new Date(item.createdAt).toLocaleDateString('th-TH')}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-purple-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-pink-100 text-pink-600 shadow-2xs">
            <Heart className="w-6 h-6 fill-pink-500 text-pink-500" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              ตารางสิ่งที่ชอบของสองเรา 💕
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              จดบันทึกของกิน ของโปรด สิ่งที่แพ้ หรือของขวัญที่อีกฝ่ายอยากได้ ช่วยจำใจใส่ใจกันเสมอ
            </p>
          </div>
        </div>

        <button
          onClick={() => openAddModal()}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>จดสิ่งที่ชอบเพิ่ม</span>
        </button>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white/80 text-slate-600 hover:bg-purple-50 border border-purple-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2-Column Comparison Tables (User 1 vs User 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* COLUMN 1: สิ่งที่ ฉัน (User 1) ชอบ */}
        <div className="bg-purple-50/40 rounded-3xl border-2 border-purple-200/90 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-200/80">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{users.user1?.avatar || '🐰'}</span>
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  สิ่งที่ {users.user1?.nickname || 'เก้า'} ชอบ
                </h3>
                <span className="text-[11px] text-purple-700">
                  ({user1Items.length} รายการที่บันทึกไว้)
                </span>
              </div>
            </div>

            <button
              onClick={() => openAddModal('user1')}
              className="p-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors cursor-pointer"
              title="เพิ่มรายการให้เก้า"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {user1Items.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                ยังไม่มีข้อมูลในหมวดหมู่นี้
              </div>
            ) : (
              user1Items.map(renderFavoriteCard)
            )}
          </div>
        </div>

        {/* COLUMN 2: สิ่งที่ แฟน (User 2) ชอบ */}
        <div className="bg-pink-50/40 rounded-3xl border-2 border-pink-200/90 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-pink-200/80">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{users.user2?.avatar || '🐻'}</span>
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  สิ่งที่ {users.user2?.nickname || 'นิว'} ชอบ
                </h3>
                <span className="text-[11px] text-pink-700">
                  ({user2Items.length} รายการที่บันทึกไว้)
                </span>
              </div>
            </div>

            <button
              onClick={() => openAddModal('user2')}
              className="p-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 transition-colors cursor-pointer"
              title="เพิ่มรายการให้นิว"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {user2Items.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                ยังไม่มีข้อมูลในหมวดหมู่นี้
              </div>
            ) : (
              user2Items.map(renderFavoriteCard)
            )}
          </div>
        </div>

      </div>

      {/* ADD FAVORITE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>💕 บันทึกสิ่งที่ชอบ</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Whose board? */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  จะจดลงกระดานของใคร
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, belongsTo: 'user1' })}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formData.belongsTo === 'user1'
                        ? 'bg-purple-100 border-purple-400 text-purple-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{users.user1?.avatar || '🐰'}</span>
                    <span>กระดาน {users.user1?.nickname || 'เก้า'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, belongsTo: 'user2' })}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formData.belongsTo === 'user2'
                        ? 'bg-pink-100 border-pink-400 text-pink-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{users.user2?.avatar || '🐻'}</span>
                    <span>กระดาน {users.user2?.nickname || 'นิว'}</span>
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  หมวดหมู่
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs bg-white"
                >
                  <option value="food">อาหารโปรด 🍣</option>
                  <option value="drinks">เครื่องดื่ม / ขนม 🧋</option>
                  <option value="dislike">สิ่งที่ไม่ชอบ / แพ้ 🚫</option>
                  <option value="gift">ของขวัญที่อยากได้ 🎁</option>
                  <option value="clothing">สไตล์ / อื่นๆ ✨</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  สิ่งที่ชอบ / หัวข้อ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ชานมไข่มุกหวาน 25%, แซลมอนดอง, ไม่ชอบผักชี"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  รายละเอียดเพิ่มเติม
                </label>
                <textarea
                  rows="3"
                  placeholder="เช่น ต้องเป็นร้านตรงข้ามคอนโด, ชอบแบบกรอบๆ..."
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
                  บันทึกสิ่งที่ชอบ 💕
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
