/**
 * 预约路由
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, '..', 'db', 'charity.db'));

// 提交预约
router.post('/', (req, res) => {
  const { guardian_name, guardian_phone, relation, child_name, child_age, child_gender, issue_type, issue_desc, preferred_date } = req.body;

  if (!guardian_name || !guardian_phone || !child_name || !child_age) {
    return res.json({ code: 400, msg: '必填字段不能为空' });
  }
  if (!/^1\d{10}$/.test(guardian_phone)) {
    return res.json({ code: 400, msg: '手机号格式不正确' });
  }

  const stmt = db.prepare(`
    INSERT INTO bookings (guardian_name, guardian_phone, relation, child_name, child_age, child_gender, issue_type, issue_desc, preferred_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(guardian_name, guardian_phone, relation || '', child_name, child_age, child_gender || '', issue_type || '', issue_desc || '', preferred_date || '');

  res.json({ code: 0, msg: '预约成功', data: { id: result.lastInsertRowid } });
});

// 按手机号查询预约
router.get('/:phone', (req, res) => {
  const { phone } = req.params;
  const rows = db.prepare('SELECT * FROM bookings WHERE guardian_phone = ? ORDER BY created_at DESC').all(phone);
  res.json({ code: 0, data: rows });
});

// 查询所有预约（后台）
router.get('/', (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM bookings ORDER BY created_at DESC LIMIT 50';
  if (status) {
    sql = 'SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC LIMIT 50';
    const rows = db.prepare(sql).all(status);
    return res.json({ code: 0, data: rows });
  }
  const rows = db.prepare(sql).all();
  res.json({ code: 0, data: rows });
});

// 更新预约状态
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending','confirmed','cancelled','completed'].includes(status)) {
    return res.json({ code: 400, msg: '无效状态' });
  }
  db.prepare('UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
  res.json({ code: 0, msg: '状态已更新' });
});

module.exports = router;
