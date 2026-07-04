const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Database = require('better-sqlite3');
const path = require('path');

const SECRET = process.env.JWT_SECRET || 'dnd-secret-change-in-prod';
const SALT_ROUNDS = 10;
const PORT = process.env.PORT || 3001;

const db = new Database(path.join(__dirname, 'dnd.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    verified INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE INDEX IF NOT EXISTS idx_characters_user ON characters(user_id);
`);

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(header.slice(7), SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
}

function isEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }

// ── Auth routes ──────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!isEmail(email)) return res.json({ success: false, message: 'Некорректный email' });
  if (!password || password.length < 6) return res.json({ success: false, message: 'Пароль минимум 6 символов' });
  if (password !== confirmPassword) return res.json({ success: false, message: 'Пароли не совпадают' });
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return res.json({ success: false, message: 'Email уже зарегистрирован' });
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const id = uuidv4();
  db.prepare('INSERT INTO users (id, email, password) VALUES (?, ?, ?)').run(id, email, hash);
  const token = jwt.sign({ id, email }, SECRET, { expiresIn: '30d' });
  res.json({ success: true, message: 'Регистрация завершена', token });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!isEmail(email)) return res.json({ success: false, message: 'Некорректный email' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.json({ success: false, message: 'Неверный email или пароль' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ success: false, message: 'Неверный email или пароль' });
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '30d' });
  res.json({ success: true, message: 'Вход выполнен', token });
});

app.post('/api/auth/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.json({ success: false, message: 'User not found' });
  res.json({ success: true, user });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!isEmail(email)) return res.json({ success: false, message: 'Некорректный email' });
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  // Всегда OK, даже если email не найден (security through obscurity)
  res.json({ success: true, message: 'Если email зарегистрирован, код отправлен' });
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!newPassword || newPassword.length < 6) return res.json({ success: false, message: 'Пароль минимум 6 символов' });
  if (newPassword !== confirmPassword) return res.json({ success: false, message: 'Пароли не совпадают' });
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (user) {
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash, user.id);
  }
  res.json({ success: true, message: 'Пароль изменён' });
});

// ── Character CRUD ───────────────────────────────────────

app.get('/api/characters', auth, (req, res) => {
  const rows = db.prepare('SELECT data FROM characters WHERE user_id = ?').all(req.user.id);
  res.json({ characters: rows.map(r => JSON.parse(r.data)) });
});

app.post('/api/characters', auth, (req, res) => {
  const char = req.body;
  if (!char.id) char.id = uuidv4();
  char.createdAt = char.createdAt || Date.now();
  char.updatedAt = Date.now();
  const exists = db.prepare('SELECT id FROM characters WHERE id = ?').get(char.id);
  if (exists) {
    db.prepare('UPDATE characters SET data = ?, updated_at = datetime(\'now\') WHERE id = ? AND user_id = ?').run(JSON.stringify(char), char.id, req.user.id);
  } else {
    db.prepare('INSERT INTO characters (id, user_id, data) VALUES (?, ?, ?)').run(char.id, req.user.id, JSON.stringify(char));
  }
  res.json({ character: char });
});

app.put('/api/characters/:id', auth, (req, res) => {
  const char = { ...req.body, id: req.params.id, updatedAt: Date.now() };
  const result = db.prepare('UPDATE characters SET data = ?, updated_at = datetime(\'now\') WHERE id = ? AND user_id = ?').run(JSON.stringify(char), req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ character: char });
});

app.delete('/api/characters/:id', auth, (req, res) => {
  db.prepare('DELETE FROM characters WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
