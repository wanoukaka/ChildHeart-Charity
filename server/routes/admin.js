/**
 * 童心惠民 · 管理员 API 路由
 * 路径：/api/admin/*
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '..', 'db', 'charity.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// 敏感词库
const CRISIS_KEYWORDS = ['自伤', '自杀', '想死', '割腕', '不想活', '跳楼', '吃药', '上吊', '虐待', '性侵', '被打', '被烫', '被关', '想杀人', '想报复'];

// ─────────────────────────────────────────
// 统计接口
// ─────────────────────────────────────────

// 预约统计数据
router.get('/stats/bookings', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    res.json({ code: 0, data: rows });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

// 个案统计数据
router.get('/stats/cases', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM cases ORDER BY created_at DESC').all();
    res.json({ code: 0, data: rows });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

// ─────────────────────────────────────────
// 预约管理
// ─────────────────────────────────────────

// 获取预约列表（支持筛选）
router.get('/bookings', (req, res) => {
  try {
    const { status, source } = req.query;
    let sql = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];
    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (source) { sql += ' AND source = ?'; params.push(source); }
    sql += ' ORDER BY created_at DESC LIMIT 100';

    const rows = db.prepare(sql).all(...params);
    res.json({ code: 0, data: rows });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

// 获取单个预约
router.get('/bookings/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!row) return res.json({ code: 404, msg: '未找到' });
    res.json({ code: 0, data: row });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

// 更新预约状态
router.patch('/bookings/:id', (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!valid.includes(status)) {
      return res.json({ code: 400, msg: '无效状态' });
    }
    db.prepare('UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.params.id);
    res.json({ code: 0, msg: '状态已更新' });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

// 创建预约（后台手动添加）
router.post('/bookings', (req, res) => {
  try {
    const { guardian_name, guardian_phone, child_name, child_age, child_gender, issue_type, issue_desc, preferred_date, source } = req.body;

    if (!guardian_name || !guardian_phone || !child_name || !child_age) {
      return res.json({ code: 400, msg: '必填字段不能为空' });
    }

    const issueFull = issue_desc || '';
    const hasCrisis = CRISIS_KEYWORDS.some(k => issueFull.includes(k));

    const stmt = db.prepare(`
      INSERT INTO bookings (guardian_name, guardian_phone, child_name, child_age, child_gender, issue_type, issue_desc, preferred_date, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(guardian_name, guardian_phone, child_name, child_age, child_gender || '', issue_type || '', issue_desc || '', preferred_date || '', source || '网站');

    if (hasCrisis) {
      db.prepare(`INSERT INTO crisis_logs (booking_id, crisis_level, trigger_keyword, description) VALUES (?, 'urgent', ?, ?)`)
        .run(result.lastInsertRowid, CRISIS_KEYWORDS.find(k => issueFull.includes(k)) || '', issueFull);
    }

    res.json({ code: 0, msg: '预约创建成功', data: { id: result.lastInsertRowid } });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

// ─────────────────────────────────────────
// 个案管理
// ─────────────────────────────────────────

// 生成案号
function generateCaseNo() {
  const year = new Date().getFullYear();
  const count = db.prepare("SELECT COUNT(*) as c FROM cases WHERE case_no LIKE ?").get(`TONGXIN-${year}-%`);
  const seq = String((count?.c || 0) + 1).padStart(4, '0');
  return `TONGXIN-${year}-${seq}`;
}

// 获取个案列表
router.get('/cases', (req, res) => {
  try {
    const { status, risk_level } = req.query;
    let sql = 'SELECT * FROM cases WHERE 1=1';
    const params = [];
    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (risk_level) { sql += ' AND risk_level = ?'; params.push(risk_level); }
    sql += ' ORDER BY created_at DESC LIMIT 100';

    const rows = db.prepare(sql).all(...params);
    // 去标识化处理
    const sanitized = rows.map(r => ({
      ...r,
      guardian_name: r.guardian_name ? r.guardian_name.charAt(0) + '某' : '',
      guardian_phone: r.guardian_phone ? '****' + r.guardian_phone.slice(-4) : '',
      child_name: r.child_name ? r.child_name.charAt(0) + '某' : '',
    }));
    res.json({ code: 0, data: sanitized });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

// 获取单个个案
router.get('/cases/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id);
    if (!row) return res.json({ code: 404, msg: '未找到' });
    // 去标识化
    row.guardian_name = row.guardian_name ? row.guardian_name.charAt(0) + '某' : '';
    row.guardian_phone = row.guardian_phone ? '****' + row.guardian_phone.slice(-4) : '';
    row.child_name = row.child_name ? row.child_name.charAt(0) + '某' : '';
    res.json({ code: 0, data: row });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

// 创建个案
router.post('/cases', (req, res) => {
  try {
    const { guardian_name, guardian_phone, child_name, child_gender, child_age, child_age_group,
            issue_type, issue_desc, source, risk_level, school, grade } = req.body;

    if (!child_name || !child_age) {
      return res.json({ code: 400, msg: '必填字段不能为空' });
    }

    const case_no = generateCaseNo();
    // 只存姓氏
    const nameCode = guardian_name ? guardian_name.charAt(0) : '';
    const phoneTail = guardian_phone ? guardian_phone.slice(-4) : '';

    const stmt = db.prepare(`
      INSERT INTO cases (case_no, guardian_name, guardian_phone, child_name, child_gender,
        child_age, child_age_group, issue_type, issue_desc, source, risk_level, school, grade)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(case_no, nameCode, phoneTail, child_name, child_gender || '',
      child_age, child_age_group || '', issue_type || '', issue_desc || '',
      source || '其他', risk_level || '一般', school || '', grade || '');

    res.json({ code: 0, msg: '个案创建成功', data: { id: result.lastInsertRowid, case_no } });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

// 更新个案
router.patch('/cases/:id', (req, res) => {
  try {
    const { status, risk_level, issue_type, issue_desc } = req.body;
    const fields = [];
    const params = [];
    if (status !== undefined) { fields.push('status = ?'); params.push(status); }
    if (risk_level !== undefined) { fields.push('risk_level = ?'); params.push(risk_level); }
    if (issue_type !== undefined) { fields.push('issue_type = ?'); params.push(issue_type); }
    if (issue_desc !== undefined) { fields.push('issue_desc = ?'); params.push(issue_desc); }

    if (!fields.length) return res.json({ code: 400, msg: '无更新字段' });

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    db.prepare(`UPDATE cases SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    res.json({ code: 0, msg: '已更新' });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

// ─────────────────────────────────────────
// 危机干预
// ─────────────────────────────────────────

// 获取危机记录
router.get('/crisis', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT cl.*, b.guardian_name, b.child_name as child_name_raw, b.guardian_phone
      FROM crisis_logs cl
      LEFT JOIN bookings b ON cl.booking_id = b.id
      ORDER BY cl.created_at DESC
    `).all();
    // 去标识化
    const sanitized = rows.map(r => ({
      ...r,
      guardian_name: r.guardian_name ? r.guardian_name.charAt(0) + '某' : '',
      child_name: r.child_name_raw ? r.child_name_raw.charAt(0) + '某' : '',
      guardian_phone: r.guardian_phone ? '****' + r.guardian_phone.slice(-4) : '',
    }));
    res.json({ code: 0, data: sanitized });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

// 创建危机记录
router.post('/crisis', (req, res) => {
  try {
    const { case_id, booking_id, crisis_level, trigger_keyword, description } = req.body;
    if (!crisis_level) return res.json({ code: 400, msg: '危机等级必填' });

    db.prepare(`INSERT INTO crisis_logs (case_id, booking_id, crisis_level, trigger_keyword, description) VALUES (?, ?, ?, ?, ?)`)
      .run(case_id || null, booking_id || null, crisis_level, trigger_keyword || '', description || '');

    res.json({ code: 0, msg: '危机记录已创建' });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

// 更新危机记录
router.patch('/crisis/:id', (req, res) => {
  try {
    const { response, referred_to, crisis_level } = req.body;
    const fields = [];
    const params = [];
    if (crisis_level !== undefined) { fields.push('crisis_level = ?'); params.push(crisis_level); }
    if (response !== undefined) { fields.push('response = ?'); params.push(response); }
    if (referred_to !== undefined) { fields.push('referred_to = ?'); params.push(referred_to); }
    if (!fields.length) return res.json({ code: 400, msg: '无更新字段' });
    params.push(req.params.id);
    db.prepare(`UPDATE crisis_logs SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    res.json({ code: 0, msg: '已更新' });
  } catch (err) {
    res.json({ code: 500, msg: err.message });
  }
});

module.exports = router;
