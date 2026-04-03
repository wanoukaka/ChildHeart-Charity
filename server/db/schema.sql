-- 童心惠民 数据库 schema

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guardian_name TEXT NOT NULL,
  guardian_phone TEXT NOT NULL,
  relation TEXT DEFAULT '',
  child_name TEXT NOT NULL,
  child_age TEXT NOT NULL,
  child_gender TEXT DEFAULT '',
  issue_type TEXT DEFAULT '',
  issue_desc TEXT DEFAULT '',
  preferred_date TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',  -- pending | confirmed | cancelled | completed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT DEFAULT '',
  contact TEXT DEFAULT '',
  content TEXT NOT NULL,
  is_anonymous INTEGER DEFAULT 0,
  is_public INTEGER DEFAULT 0,   -- 审核后才公开
  is_reviewed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 种子数据
INSERT INTO resources (title, category, file_url, description) VALUES
('儿童心理发展家长手册（0-18岁）', 'guide', '', '0-18岁各阶段心理发展特征、常见困扰及应对建议'),
('亲子沟通话术指南', 'guide', '', '常见场景沟通示范：孩子哭闹/不听话/不写作业/沉迷手机'),
('儿童心理危机识别指南', 'guide', '', '自伤、自杀风险信号，校园霸凌识别，创伤后应激反应'),
('儿童情绪卡使用说明', 'tool', '', '帮助3-12岁儿童识别和表达情绪的卡片工具介绍'),
('学校心理筛查工具包', 'school', '', '供学校老师使用的简易心理健康筛查问卷和使用指南');

-- ══════════════════════════════════════════════
-- 2026-04-02 新增表
-- ══════════════════════════════════════════════

-- 个案登记（去标识化）
CREATE TABLE IF NOT EXISTS cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_no TEXT UNIQUE NOT NULL,          -- 案号，如 TONGXIN-2026-0001
  guardian_name TEXT,                    -- 监护人姓名（仅存姓氏）
  guardian_phone TEXT,                    -- 电话仅存尾号4位
  child_name TEXT NOT NULL,               -- 儿童姓名
  child_gender TEXT DEFAULT '',
  child_age INTEGER DEFAULT 0,
  school TEXT DEFAULT '',
  grade TEXT DEFAULT '',
  issue_type TEXT DEFAULT '',             -- 问题类型（情绪/行为/学习/发展/其他）
  issue_desc TEXT DEFAULT '',
  source TEXT DEFAULT '其他',             -- 来源：网站/热线/学校/社区/其他
  risk_level TEXT DEFAULT '一般',         -- 一般/关注/重点（红色标记）
  first_visit_date TEXT,
  consultant_id TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',         -- pending/in_progress/completed/closed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 咨询记录
CREATE TABLE IF NOT EXISTS consult_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER NOT NULL,
  consult_date TEXT NOT NULL,
  duration INTEGER DEFAULT 50,           -- 分钟
  consultee_type TEXT DEFAULT '儿童',     -- 儿童/家长/教师
  consultee_name TEXT DEFAULT '',
  session_no INTEGER DEFAULT 1,
  chief_complaint TEXT DEFAULT '',
  mental_status TEXT DEFAULT '',          -- 精神状态
  assessment TEXT DEFAULT '',            -- 评估
  intervention TEXT DEFAULT '',           -- 干预
  reflection TEXT DEFAULT '',            -- 反思
  next_plan TEXT DEFAULT '',
  record_type TEXT DEFAULT '正式个案',    -- 正式个案/初访/随访
  attachments TEXT DEFAULT '[]',          -- JSON数组
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 量表记录（去标识化）
CREATE TABLE IF NOT EXISTS scale_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER NOT NULL,
  case_no TEXT NOT NULL,                 -- 关联案号（脱敏用）
  scale_name TEXT NOT NULL,               -- 量表名称
  scale_code TEXT NOT NULL,              -- 量表代码：SAS/SDS/SCL-90/MMPI/ADHD/PSQI等
  raw_score REAL,                        -- 原始分
  standard_score REAL,                    -- 标准分/T分
  severity_level TEXT DEFAULT '正常',     -- 正常/轻度/中度/重度（红色标记）
  scoring_date TEXT,
  assessor TEXT DEFAULT '',
  raw_data TEXT DEFAULT '{}',            -- 原始题目得分JSON（脱敏不存储）
  interpretation TEXT DEFAULT '',         -- 报告解读
  risk_warning INTEGER DEFAULT 0,        -- 1=有风险，0=无风险
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 报告记录
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_no TEXT UNIQUE NOT NULL,        -- 报告编号
  project_name TEXT NOT NULL,            -- 项目名称
  report_type TEXT DEFAULT '阶段性报告',  -- 类型：阶段性报告/总结报告/专项报告
  period_start TEXT,
  period_end TEXT,
  content TEXT DEFAULT '',               -- 报告正文
  status TEXT DEFAULT 'draft',           -- draft/final/submitted
  submitted_to TEXT DEFAULT '',          -- 报送单位
  submitted_at DATETIME,
  created_by TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 操作日志（审计）
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operator TEXT DEFAULT '',
  action TEXT NOT NULL,                  -- login/logout/create/update/delete/export
  module TEXT NOT NULL,                  -- bookings/cases/scales/reports等
  target_id TEXT DEFAULT '',              -- 操作对象ID
  target_desc TEXT DEFAULT '',           -- 操作描述
  ip_address TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
