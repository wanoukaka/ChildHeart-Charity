/**
 * 童心惠民 · 随访追踪路由
 * routes/followup.js
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require('better-sqlite3');

function getDB() {
  return new Database(path.join(__dirname, '..', 'db', 'charity.db'));
}

// 获取随访计划列表
router.get('/', (req, res) => {
  const db = getDB();
  const { case_id, status } = req.query || {};
  let sql = `
    SELECT fp.*, c.child_name as case_child_name, c.case_no
    FROM followup_plans fp
    LEFT JOIN cases c ON fp.case_id = c.id
    WHERE 1=1
  `;
  const params = [];
  if (case_id) { sql += ' AND fp.case_id = ?'; params.push(case_id); }
  if (status) { sql += ' AND fp.status = ?'; params.push(status); }
  sql += ' ORDER BY fp.planned_date ASC LIMIT 200';
  const rows = db.prepare(sql).all(...params);
  db.close();
  res.json({ code: 0, data: rows });
});

// 获取单个随访计划
router.get('/:id', (req, res) => {
  const db = getDB();
  const row = db.prepare('SELECT * FROM followup_plans WHERE id=?').get(req.params.id);
  db.close();
  if (!row) return res.status(404).json({ code: 404, msg: '未找到' });
  res.json({ code: 0, data: row });
});

// 创建随访计划
router.post('/', (req, res) => {
  const db = getDB();
  const { case_id, planned_date, followup_type, notes } = req.body || {};
  if (!planned_date) return res.status(400).json({ code: -1, msg: '计划日期必填' });
  if (!case_id) return res.status(400).json({ code: -1, msg: '关联个案必填' });

  const info = db.prepare(`
    INSERT INTO followup_plans (case_id, planned_date, followup_type, status, notes)
    VALUES (?, ?, ?, 'pending', ?)
  `).run(case_id, planned_date, followup_type || '', notes || '');
  db.close();
  res.json({ code: 0, data: { id: info.lastInsertRowid }, msg: '随访计划已创建' });
});

// 更新随访计划
router.patch('/:id', (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const allowed = ['planned_date', 'followup_type', 'status', 'result', 'notes'];
  const fields = req.body || {};
  const updates = [], values = [];
  for (const key of allowed) {
    if (key in fields) { updates.push(`${key}=?`); values.push(fields[key]); }
  }
  if (!updates.length) return res.status(400).json({ code: -1, msg: '无有效字段' });
  updates.push('updated_at=CURRENT_TIMESTAMP');
  values.push(id);
  db.prepare(`UPDATE followup_plans SET ${updates.join(',')} WHERE id=?`).run(...values);
  db.close();
  res.json({ code: 0, msg: '已更新' });
});

// 删除随访计划
router.delete('/:id', (req, res) => {
  const db = getDB();
  db.prepare('DELETE FROM followup_plans WHERE id=?').run(req.params.id);
  db.close();
  res.json({ code: 0, msg: '已删除' });
});

module.exports = router;
