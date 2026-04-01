/**
 * 留言路由
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, '..', 'db', 'charity.db'));

// 敏感词过滤（简单版）
const sensitiveWords = ['自杀', '自残', '去死', 'kill', 'die'];
function hasSensitiveContent(text) {
  return sensitiveWords.some(w => text.includes(w));
}

// 提交留言
router.post('/', (req, res) => {
  const { name, contact, content, is_anonymous } = req.body;
  if (!content || content.trim().length < 5) {
    return res.json({ code: 400, msg: '留言内容不能少于5个字' });
  }
  if (content.length > 500) {
    return res.json({ code: 400, msg: '留言内容不能超过500字' });
  }

  const hasSensitive = hasSensitiveContent(content);
  const stmt = db.prepare(`
    INSERT INTO messages (name, contact, content, is_anonymous, is_public, is_reviewed)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  // 敏感内容自动审核不通过并通知管理员
  const result = stmt.run(
    is_anonymous ? '匿名' : (name || '匿名'),
    contact || '',
    content,
    is_anonymous ? 1 : 0,
    hasSensitive ? 0 : 0,  // 敏感内容默认不公开
    hasSensitive ? 1 : 0   // 标记已审核
  );

  if (hasSensitive) {
    console.log(`⚠️ 敏感词留言已提交（待审核）：ID=${result.lastInsertRowid}`);
  }

  res.json({ code: 0, msg: hasSensitive ? '您的留言已提交，内容需审核后展示' : '留言成功', data: { id: result.lastInsertRowid } });
});

// 获取已公开留言
router.get('/', (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const rows = db.prepare('SELECT * FROM messages WHERE is_public = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?').all(parseInt(limit), offset);
  const total = db.prepare('SELECT COUNT(*) as n FROM messages WHERE is_public = 1').get().n;
  res.json({ code: 0, data: rows, total });
});

module.exports = router;
