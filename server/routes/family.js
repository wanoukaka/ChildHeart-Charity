/**
 * 童心惠民 · 家校联动路由
 * routes/family.js
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require('better-sqlite3');

function getDB() {
  return new Database(path.join(__dirname, '..', 'db', 'charity.db'));
}

// 获取家校沟通记录列表
router.get('/', (req, res) => {
  const db = getDB();
  const { case_id } = req.query || {};
  let sql = `
    SELECT fc.*, c.child_name as case_child_name, c.case_no
    FROM family_communications fc
    LEFT JOIN cases c ON fc.case_id = c.id
    WHERE 1=1
  `;
  const params = [];
  if (case_id) { sql += ' AND fc.case_id = ?'; params.push(case_id); }
  sql += ' ORDER BY fc.comm_date DESC LIMIT 200';
  const rows = db.prepare(sql).all(...params);
  db.close();
  res.json({ code: 0, data: rows });
});

// 获取单个沟通记录
router.get('/:id', (req, res) => {
  const db = getDB();
  const row = db.prepare('SELECT * FROM family_communications WHERE id=?').get(req.params.id);
  db.close();
  if (!row) return res.status(404).json({ code: 404, msg: '未找到' });
  res.json({ code: 0, data: row });
});

// 创建家校沟通记录
router.post('/', (req, res) => {
  const db = getDB();
  const { case_id, comm_date, comm_type, summary, advice, next_followup } = req.body || {};
  if (!comm_date) return res.status(400).json({ code: -1, msg: '沟通日期必填' });
  if (!case_id) return res.status(400).json({ code: -1, msg: '关联个案必填' });

  const info = db.prepare(`
    INSERT INTO family_communications (case_id, comm_date, comm_type, summary, advice, next_followup)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(case_id, comm_date, comm_type || '', summary || '', advice || '', next_followup || '');
  db.close();
  res.json({ code: 0, data: { id: info.lastInsertRowid }, msg: '沟通记录已添加' });
});

// 更新家校沟通记录
router.patch('/:id', (req, res) => {
  const db = getDB();
  const allowed = ['comm_date', 'comm_type', 'summary', 'advice', 'next_followup'];
  const fields = req.body || {};
  const updates = [], values = [];
  for (const key of allowed) {
    if (key in fields) { updates.push(`${key}=?`); values.push(fields[key]); }
  }
  if (!updates.length) return res.status(400).json({ code: -1, msg: '无有效字段' });
  updates.push('updated_at=CURRENT_TIMESTAMP');
  values.push(req.params.id);
  db.prepare(`UPDATE family_communications SET ${updates.join(',')} WHERE id=?`).run(...values);
  db.close();
  res.json({ code: 0, msg: '已更新' });
});

// 删除记录
router.delete('/:id', (req, res) => {
  const db = getDB();
  db.prepare('DELETE FROM family_communications WHERE id=?').run(req.params.id);
  db.close();
  res.json({ code: 0, msg: '已删除' });
});

module.exports = router;
