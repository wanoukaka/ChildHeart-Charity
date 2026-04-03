/**
 * 童心惠民 · 志愿者管理路由
 * routes/volunteers.js
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require('better-sqlite3');

function getDB() {
  return new Database(path.join(__dirname, '..', 'db', 'charity.db'));
}

// 获取志愿者列表
router.get('/', (req, res) => {
  const db = getDB();
  const { status, keyword } = req.query || {};
  let sql = 'SELECT * FROM volunteers WHERE 1=1';
  const params = [];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (keyword) { sql += ' AND (name LIKE ? OR phone LIKE ? OR skill LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
  sql += ' ORDER BY created_at DESC LIMIT 200';
  const rows = db.prepare(sql).all(...params);
  db.close();
  res.json({ code: 0, data: rows });
});

// 获取单个志愿者
router.get('/:id', (req, res) => {
  const db = getDB();
  const vol = db.prepare('SELECT * FROM volunteers WHERE id=?').get(req.params.id);
  if (!vol) { db.close(); return res.status(404).json({ code: 404, msg: '未找到' }); }
  // 服务记录
  const services = db.prepare(`
    SELECT vs.*, c.child_name as case_child_name, c.case_no
    FROM volunteer_services vs
    LEFT JOIN cases c ON vs.case_id = c.id
    WHERE vs.volunteer_id=?
    ORDER BY vs.service_date DESC LIMIT 100
  `).all(req.params.id);
  db.close();
  res.json({ code: 0, data: { ...vol, services } });
});

// 创建志愿者
router.post('/', (req, res) => {
  const db = getDB();
  const { name, phone, skill, avail_hours } = req.body || {};
  if (!name) return res.status(400).json({ code: -1, msg: '姓名必填' });
  const info = db.prepare(`
    INSERT INTO volunteers (name, phone, skill, avail_hours, status, service_count, total_hours)
    VALUES (?, ?, ?, ?, 'active', 0, 0)
  `).run(name, phone || '', skill || '', avail_hours || '');
  db.close();
  res.json({ code: 0, data: { id: info.lastInsertRowid }, msg: '志愿者已添加' });
});

// 更新志愿者
router.patch('/:id', (req, res) => {
  const db = getDB();
  const allowed = ['name', 'phone', 'skill', 'avail_hours', 'status'];
  const fields = req.body || {};
  const updates = [], values = [];
  for (const key of allowed) {
    if (key in fields) { updates.push(`${key}=?`); values.push(fields[key]); }
  }
  if (!updates.length) return res.status(400).json({ code: -1, msg: '无有效字段' });
  updates.push('updated_at=CURRENT_TIMESTAMP');
  values.push(req.params.id);
  db.prepare(`UPDATE volunteers SET ${updates.join(',')} WHERE id=?`).run(...values);
  db.close();
  res.json({ code: 0, msg: '已更新' });
});

// 删除志愿者
router.delete('/:id', (req, res) => {
  const db = getDB();
  db.prepare('DELETE FROM volunteers WHERE id=?').run(req.params.id);
  db.close();
  res.json({ code: 0, msg: '已删除' });
});

// ── 志愿服务记录 ──
// 添加工时记录
router.post('/:id/services', (req, res) => {
  const db = getDB();
  const { case_id, service_date, service_hours, service_type, notes } = req.body || {};
  if (!service_date || !service_hours) return res.status(400).json({ code: -1, msg: '服务日期和时长必填' });

  const info = db.prepare(`
    INSERT INTO volunteer_services (volunteer_id, case_id, service_date, service_hours, service_type, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.params.id, case_id || null, service_date, service_hours, service_type || '', notes || '');

  // 更新志愿者累计时长
  db.prepare(`
    UPDATE volunteers SET
      total_hours = total_hours + ?,
      service_count = service_count + 1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(service_hours, req.params.id);

  db.close();
  res.json({ code: 0, data: { id: info.lastInsertRowid }, msg: '服务记录已添加' });
});

// 获取志愿者的服务记录
router.get('/:id/services', (req, res) => {
  const db = getDB();
  const rows = db.prepare(`
    SELECT vs.*, c.child_name as case_child_name, c.case_no
    FROM volunteer_services vs
    LEFT JOIN cases c ON vs.case_id = c.id
    WHERE vs.volunteer_id=?
    ORDER BY vs.service_date DESC LIMIT 100
  `).all(req.params.id);
  db.close();
  res.json({ code: 0, data: rows });
});

module.exports = router;
