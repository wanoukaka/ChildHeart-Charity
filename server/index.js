/**
 * 童心惠民 - 后端服务入口
 * 端口：3002（与茉莉工作室后端 3001 区分）
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3002;
const DB_PATH = path.join(__dirname, 'db', 'charity.db');

// ── 数据库初始化 ──
let db;
function initDB() {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
  db.exec(schema);
  console.log('✅ 童心惠民数据库加载成功');
}

// ── 中间件 ──
app.use(cors());
app.use(express.json());

// ── 路由 ──
const bookingsRouter = require('./routes/bookings');
const messagesRouter = require('./routes/messages');
const resourcesRouter = require('./routes/resources');

app.use('/api/bookings', bookingsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/resources', resourcesRouter);

app.get('/api/health', (req, res) => {
  res.json({ code: 0, msg: '童心惠民服务正常', time: new Date().toISOString() });
});

// ── 启动 ──
initDB();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 童心惠民服务已启动: http://0.0.0.0:${PORT}`);
});
