/**
 * 童心惠民 - 个案登记路由
 * routes/cases.js
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require('better-sqlite3');

function getDB() {
  return new Database(path.join(__dirname, '..', 'db', 'charity.db'));
}

function genCaseNo(db) {
  const year = new Date().getFullYear();
  const row = db.prepare("SELECT COUNT(*) as c FROM cases WHERE case_no LIKE ?").get(`TONGXIN-${year}-%`);
  const seq = (row.c + 1).toString().padStart(4, '0');
  return `TONGXIN-${year}-${seq}`;
}

function auditLog(db, operator, action, module, target_id, target_desc) {
  try {
    db.prepare(`INSERT INTO audit_log (operator,action,module,target_id,target_desc) VALUES (?,?,?,?,?)`)
      .run(operator, action, module, target_id, target_desc);
  } catch (e) { /* ignore */ }
}

// 获取个案列表
router.get('/', (req, res) => {
  const db = getDB();
  const { status, risk_level, source, keyword } = req.query || {};
  let sql = `SELECT * FROM cases WHERE 1=1`;
  const params = [];
  if (status) { sql += ' AND status=?'; params.push(status); }
  if (risk_level) { sql += ' AND risk_level=?'; params.push(risk_level); }
  if (source) { sql += ' AND source=?'; params.push(source); }
  if (keyword) { sql += ' AND (child_name LIKE ? OR guardian_name LIKE ? OR case_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
  sql += ' ORDER BY created_at DESC LIMIT 200';
  const rows = db.prepare(sql).all(...params);
  db.close();
  res.json({ code: 0, data: rows });
});

// 获取单个个案
router.get('/:id', (req, res) => {
  const db = getDB();
  const row = db.prepare('SELECT * FROM cases WHERE id=?').get(req.params.id);
  db.close();
  if (!row) return res.status(404).json({ code: 404, message: '个案不存在' });
  res.json({ code: 0, data: row });
});

// 新增个案
router.post('/', (req, res) => {
  const db = getDB();
  const { guardian_name, guardian_phone, child_name, child_gender, child_age, school, grade, issue_type, issue_desc, source, risk_level, first_visit_date, consultant_id } = req.body || {};
  if (!child_name) return res.status(400).json({ code: -1, message: '儿童姓名必填' });
  const case_no = genCaseNo(db);
  const info = db.prepare(`INSERT INTO cases (case_no,guardian_name,guardian_phone,child_name,child_gender,child_age,school,grade,issue_type,issue_desc,source,risk_level,first_visit_date,consultant_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(case_no, guardian_name||'', guardian_phone||'', child_name, child_gender||'', child_age||0, school||'', grade||'', issue_type||'', issue_desc||'', source||'其他', risk_level||'一般', first_visit_date||null, consultant_id||'');
  auditLog(db, consultant_id||'system', 'create', 'cases', case_no, `新建个案: ${child_name}`);
  db.close();
  res.json({ code: 0, data: { id: info.lastInsertRowid, case_no } });
});

// 更新个案
router.patch('/:id', (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const allowed = ['guardian_name','guardian_phone','child_name','child_gender','child_age','school','grade','issue_type','issue_desc','source','risk_level','first_visit_date','consultant_id','status'];
  const fields = req.body || {};
  const updates = [], values = [];
  for (const key of allowed) {
    if (key in fields) { updates.push(`${key}=?`); values.push(fields[key]); }
  }
  if (!updates.length) return res.status(400).json({ code: -1, message: '无有效字段' });
  updates.push('updated_at=CURRENT_TIMESTAMP');
  values.push(id);
  db.prepare(`UPDATE cases SET ${updates.join(',')} WHERE id=?`).run(...values);
  auditLog(db, fields.operator||'system', 'update', 'cases', id, `更新个案 ID:${id}`);
  db.close();
  res.json({ code: 0 });
});

// 删除个案
router.delete('/:id', (req, res) => {
  const db = getDB();
  db.prepare('DELETE FROM cases WHERE id=?').run(req.params.id);
  auditLog(db, req.body?.operator||'system', 'delete', 'cases', req.params.id, `删除个案 ID:${req.params.id}`);
  db.close();
  res.json({ code: 0 });
});

module.exports = router;
