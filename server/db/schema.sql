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
