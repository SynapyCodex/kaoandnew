import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, 'data', 'db.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Helper to read DB
const readDB = () => {
  try {
    if (!fs.existsSync(dbFilePath)) {
      return null;
    }
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return null;
  }
};

// Helper to write DB
const writeDB = (data) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing DB:', error);
    return false;
  }
};

// GET ALL DATA
app.get('/api/all', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database read failed' });
  res.json(db);
});

// USERS & PROFILE
app.get('/api/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

app.patch('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  if (!db.users[id]) return res.status(404).json({ error: 'User not found' });

  db.users[id] = {
    ...db.users[id],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  writeDB(db);
  res.json(db.users[id]);
});

// SETTINGS (Anniversary date etc.)
app.patch('/api/settings', (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json(db.settings);
});

// TICKETS
app.get('/api/tickets', (req, res) => {
  const db = readDB();
  res.json(db.tickets || []);
});

app.post('/api/tickets', (req, res) => {
  const db = readDB();
  const { title, description, createdBy, targetUser, isPermanent, expiresAt, themeColor } = req.body;

  const newTicket = {
    id: `t-${Date.now()}`,
    title: title || 'บัตรสิทธิพิเศษสำหรับแฟน 💜',
    description: description || '',
    createdBy: createdBy || 'user1',
    targetUser: targetUser || 'user2',
    isPermanent: !!isPermanent,
    expiresAt: isPermanent ? null : (expiresAt || null),
    status: 'active',
    usedAt: null,
    usedBy: null,
    themeColor: themeColor || 'purple',
    createdAt: new Date().toISOString(),
    history: [
      {
        action: 'created',
        by: createdBy || 'user1',
        time: new Date().toISOString(),
        note: `สร้างตั๋ว "${title}"`
      }
    ]
  };

  db.tickets.unshift(newTicket);
  writeDB(db);
  res.status(201).json(newTicket);
});

app.patch('/api/tickets/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.tickets.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Ticket not found' });

  const existing = db.tickets[index];
  const updatedTicket = {
    ...existing,
    ...req.body,
    history: [
      ...(existing.history || []),
      {
        action: 'edited',
        by: req.body.updatedBy || 'user',
        time: new Date().toISOString(),
        note: `แก้ไขรายละเอียดตั๋ว`
      }
    ]
  };

  db.tickets[index] = updatedTicket;
  writeDB(db);
  res.json(updatedTicket);
});

app.post('/api/tickets/:id/redeem', (req, res) => {
  const { id } = req.params;
  const { usedBy } = req.body;
  const db = readDB();
  const ticket = db.tickets.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  if (ticket.status === 'used') return res.status(400).json({ error: 'Ticket already used' });

  ticket.status = 'used';
  ticket.usedAt = new Date().toISOString();
  ticket.usedBy = usedBy || 'user';
  ticket.history = ticket.history || [];
  ticket.history.push({
    action: 'used',
    by: ticket.usedBy,
    time: ticket.usedAt,
    note: `ฉีกตั๋วใช้งานแล้ว 💕`
  });

  writeDB(db);
  res.json(ticket);
});

app.delete('/api/tickets/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.tickets = db.tickets.filter(t => t.id !== id);
  writeDB(db);
  res.json({ success: true, id });
});

// CALENDAR
app.get('/api/calendar', (req, res) => {
  const db = readDB();
  res.json(db.calendar || []);
});

app.post('/api/calendar', (req, res) => {
  const db = readDB();
  const { title, date, time, category, note, createdBy, remindBeforeDays, isRecurring } = req.body;

  const newEvent = {
    id: `c-${Date.now()}`,
    title,
    date,
    time: time || '12:00',
    category: category || 'date',
    note: note || '',
    createdBy: createdBy || 'user1',
    remindBeforeDays: remindBeforeDays !== undefined ? Number(remindBeforeDays) : 1,
    isRecurring: !!isRecurring,
    createdAt: new Date().toISOString()
  };

  db.calendar.push(newEvent);
  writeDB(db);
  res.status(201).json(newEvent);
});

app.patch('/api/calendar/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.calendar.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Event not found' });

  db.calendar[index] = { ...db.calendar[index], ...req.body };
  writeDB(db);
  res.json(db.calendar[index]);
});

app.delete('/api/calendar/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.calendar = db.calendar.filter(c => c.id !== id);
  writeDB(db);
  res.json({ success: true, id });
});

// FAVORITES
app.get('/api/favorites', (req, res) => {
  const db = readDB();
  res.json(db.favorites || []);
});

app.post('/api/favorites', (req, res) => {
  const db = readDB();
  const { belongsTo, category, title, detail, addedBy } = req.body;

  const newItem = {
    id: `f-${Date.now()}`,
    belongsTo: belongsTo || 'user1',
    category: category || 'food',
    title,
    detail: detail || '',
    addedBy: addedBy || 'user1',
    createdAt: new Date().toISOString()
  };

  db.favorites.unshift(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

app.patch('/api/favorites/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.favorites.findIndex(f => f.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  db.favorites[index] = { ...db.favorites[index], ...req.body };
  writeDB(db);
  res.json(db.favorites[index]);
});

app.delete('/api/favorites/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.favorites = db.favorites.filter(f => f.id !== id);
  writeDB(db);
  res.json({ success: true, id });
});

// SULKS (จุดนอย)
app.get('/api/sulks', (req, res) => {
  const db = readDB();
  res.json(db.sulks || []);
});

app.post('/api/sulks', (req, res) => {
  const db = readDB();
  const { authorId, topic, detail, severity } = req.body;

  const newSulk = {
    id: `s-${Date.now()}`,
    authorId: authorId || 'user1',
    topic,
    detail: detail || '',
    severity: severity || 3,
    isResolved: false,
    resolvedAt: null,
    hugs: 0,
    messages: [],
    createdAt: new Date().toISOString()
  };

  db.sulks.unshift(newSulk);
  writeDB(db);
  res.status(201).json(newSulk);
});

app.patch('/api/sulks/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.sulks.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Sulk not found' });

  db.sulks[index] = { ...db.sulks[index], ...req.body };
  writeDB(db);
  res.json(db.sulks[index]);
});

app.post('/api/sulks/:id/hug', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const sulk = db.sulks.find(s => s.id === id);
  if (!sulk) return res.status(404).json({ error: 'Sulk not found' });

  sulk.hugs = (sulk.hugs || 0) + 1;
  writeDB(db);
  res.json(sulk);
});

app.post('/api/sulks/:id/message', (req, res) => {
  const { id } = req.params;
  const { fromId, text } = req.body;
  const db = readDB();
  const sulk = db.sulks.find(s => s.id === id);
  if (!sulk) return res.status(404).json({ error: 'Sulk not found' });

  sulk.messages = sulk.messages || [];
  sulk.messages.push({
    id: `sm-${Date.now()}`,
    fromId: fromId || 'user2',
    text,
    createdAt: new Date().toISOString()
  });

  writeDB(db);
  res.json(sulk);
});

app.delete('/api/sulks/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.sulks = db.sulks.filter(s => s.id !== id);
  writeDB(db);
  res.json({ success: true, id });
});

// VENTS (จุดระบายแฟน)
app.get('/api/vents', (req, res) => {
  const db = readDB();
  res.json(db.vents || []);
});

app.post('/api/vents', (req, res) => {
  const db = readDB();
  const { authorId, moodTag, detail, wantsToResolve } = req.body;

  const newVent = {
    id: `v-${Date.now()}`,
    authorId: authorId || 'user1',
    moodTag: moodTag || 'งอน',
    detail: detail || '',
    wantsToResolve: wantsToResolve || '',
    status: 'open',
    messages: [],
    createdAt: new Date().toISOString()
  };

  db.vents.unshift(newVent);
  writeDB(db);
  res.status(201).json(newVent);
});

app.patch('/api/vents/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.vents.findIndex(v => v.id === id);
  if (index === -1) return res.status(404).json({ error: 'Vent not found' });

  db.vents[index] = { ...db.vents[index], ...req.body };
  writeDB(db);
  res.json(db.vents[index]);
});

app.post('/api/vents/:id/message', (req, res) => {
  const { id } = req.params;
  const { fromId, text } = req.body;
  const db = readDB();
  const vent = db.vents.find(v => v.id === id);
  if (!vent) return res.status(404).json({ error: 'Vent not found' });

  vent.messages = vent.messages || [];
  vent.messages.push({
    id: `vm-${Date.now()}`,
    fromId: fromId || 'user2',
    text,
    createdAt: new Date().toISOString()
  });
  vent.status = 'hugged';

  writeDB(db);
  res.json(vent);
});

app.delete('/api/vents/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.vents = db.vents.filter(v => v.id !== id);
  writeDB(db);
  res.json({ success: true, id });
});

// Serve static frontend in production
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Express 5 compatible SPA fallback middleware
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// START SERVER
app.listen(PORT, () => {
  console.log(`✨ Couple API Server is running on http://localhost:${PORT}`);
});

