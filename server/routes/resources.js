/**
 * 资源路由
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, '..', 'db', 'charity.db'));

// 获取资源列表
router.get('/', (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM resources ORDER BY created_at DESC';
  let rows;
  if (category) {
    sql = 'SELECT * FROM resources WHERE category = ? ORDER BY created_at DESC';
    rows = db.prepare(sql).all(category);
  } else {
    rows = db.prepare(sql).all();
  }
  res.json({ code: 0, data: rows });
});

module.exports = router;
