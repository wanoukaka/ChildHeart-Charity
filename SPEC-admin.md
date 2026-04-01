# 童心惠民 - 后台管理系统 SPEC.md

_更新于 2026-04-01_

---

## 1. 项目定位

**核心使命：** 为困境儿童及家庭提供公益心理咨询，同时积累可量化数据，支持参政议政提案。

**数据产出来源：**
- 预约咨询记录
- 量表测评数据（去标识化）
- 留言反馈
- 服务机构/学校合作记录

---

## 2. 后台功能模块

### 2.1 数据看板（Dashboard）

**核心指标（必须量化）：**

| 指标 | 说明 |
|------|------|
| 累计服务家庭数 | 从项目启动至今 |
| 本月新增预约 | 自动按月统计 |
| 各问题类型分布 | 焦虑/抑郁/ADHD/创伤/学业/其他 |
| 服务年龄段分布 | 3-6岁/7-12岁/13-15岁/16-18岁 |
| 性别分布 | 男/女/未填写 |
| 来源地域 | 按省/市统计（监护人手机号归属地） |
| 量表使用次数 | 每个量表的总使用量 |
| 高风险预警数 | CDI/Trauma量表高分区间的数量 |
| 咨询完成率 | 预约→实际完成的转化率 |
| 季度/年度趋势 | 折线图展示变化 |

**提案用数据卡片（直观好看）：**
- "已为 XX 个家庭提供公益心理咨询"
- "覆盖 XX 省 XX 市"
- "识别 XX 例高风险儿童，建议进一步干预"
- "XX% 家庭因经济困难无法承担市场价咨询，全额免费"

---

### 2.2 预约管理

| 功能 | 说明 |
|------|------|
| 预约列表 | 筛选：待确认/已确认/已完成/已取消/紧急 |
| 预约详情 | 监护人信息 + 孩子信息 + 问题描述 |
| 状态更新 | pending → confirmed → completed / cancelled |
| 紧急标记 | 有自伤/自杀关键词自动标红 |
| 预约来源统计 | 来自哪个渠道（社区/学校/热线/公益平台）|
| 一键拨打 | 点击直接调用电脑拨打监护人电话 |

---

### 2.3 个案登记（去标识化）

**原则：所有儿童信息匿名化存储，仅后台管理员可见**

| 字段 | 说明 |
|------|------|
| 个案编号 | 自动生成（CH-2026-XXXX）|
| 孩子性别 | 男/女 |
| 孩子年龄段 | 3-6/7-12/13-15/16-18 |
| 问题类型 | 多选：焦虑/抑郁/ADHD/创伤/学业/人际/其他 |
| 问题来源 | 自评/家长转介/学校转介/医生转介 |
| 咨询次数 | 累计次数 |
| 最近咨询日期 | 自动更新 |
| 当前状态 | 进行中/已结案/转介 |
| 风险等级 | 低/中/高（含量表分数依据）|

**去标识化处理：**
- 姓名 → 仅存储姓氏（如"王"）
- 电话 → 仅显示后4位
- 地址 → 仅记录省份
- 真实姓名、详细地址严格保密

---

### 2.4 量表数据管理（去标识化）

| 功能 | 说明 |
|------|------|
| 测评记录列表 | 量表类型 + 日期 + 孩子年龄段 + 监护人手机尾号 |
| 高风险预警列表 | CDI ≥ 中度 / Trauma ≥ 中度 的记录，自动红色标记 |
| 各量表使用统计 | 饼图/柱状图 |
| 典型案例摘录（用于提案）| 高风险案例脱敏后摘录，不含任何可识别信息 |
| 数据导出 | CSV（供统计分析） |

---

### 2.5 留言管理

| 功能 | 说明 |
|------|------|
| 待审核留言 | 自动过滤敏感词后，管理员审核 |
| 通过/不通过 | 一键操作 |
| 公开留言墙 | 展示在 contact.html（需审核后）|

---

### 2.6 报告生成（参政议政核心功能）

**报告命名格式：** `童心惠民_[项目名]_[YYYYMMDD].docx`
**按需导出，不受周期限制。**

**农工党参政议政标准报告体例：**

```
┌─────────────────────────────────────────┐
│  【封面】（后台自动生成）                 │
│  项目名称：童心惠民 · [项目名]           │
│  报告日期：[YYYY年MM月DD日]             │
│  报送单位：济南市中茉莉心理咨询工作室     │
└─────────────────────────────────────────┘

一、基本情况
  1.1 项目背景
      [简述项目发起缘由、服务宗旨、覆盖范围]

  1.2 实施情况
      - 累计服务家庭：XX 个
      - 本期服务家庭：XX 个
      - 完成咨询人次：XX 次
      - 覆盖地域：XX 省 XX 市

二、调研数据
  2.1 服务人群画像（去标识化）
      - 性别：男 XX%、女 XX%
      - 年龄分布：3-6岁 XX%、7-12岁 XX%、13-15岁 XX%、16-18岁 XX%
      - 问题类型：焦虑 XX%、抑郁 XX%、ADHD XX%、创伤 XX%、学业 XX%、其他 XX%

  2.2 高风险预警统计
      - 本期识别高风险儿童：XX 例（占总服务XX%）
      - 已建议专业干预：XX 例
      - 持续跟踪中：XX 例

  2.3 资源使用情况
      - 量表使用总量：XX 次
      - 各量表使用分布：[列表]
      - 家长指南访问量：XX 次

三、典型案例（已脱敏，已获授权）
  [选取2-3个典型案例，描述问题表现、干预过程、干预效果
   姓名→化名为"小明/小红"、学校→"某学校"、地址→"某省某市"、
   家庭情况→模糊化为"双职工家庭/农村家庭"等]

四、问题分析
  4.1 当前困境
      [基于数据分析，当前儿童心理健康领域存在的主要问题]

  4.2 原因剖析
      [从政策/社会/家庭/学校等维度分析原因]

五、对策建议（政协/民盟提案核心）
  5.1 政策层面建议
      [1.2.3. 具体政策建议]
  5.2 服务体系建议
      [如何完善儿童心理援助网络]
  5.3 资源保障建议
      [资金/人力/场地等保障建议]

六、下一步计划
  [下一阶段工作目标和服务计划]

七、附件
  - 附件1：数据明细表（去标识化）
  - 附件2：量表使用统计
```

**导出格式：** Word 文档（.docx），符合参政议政标准格式，可直接报送

---

### 2.7 咨询师管理

| 功能 | 说明 |
|------|------|
| 咨询师列表 | 姓名（代号）/ 资质 / 累计咨询次数 |
| 督导记录 | 每次督导的主题和结论（保密）|
| 在线状态 | 在线/离线 |

---

### 2.8 系统设置

| 功能 | 说明 |
|------|------|
| 机构信息 | 机构名称/地址/联系方式（影响报告头部）|
| 热线电话 | 12355 等 |
| 紧急联系人 | 备份联系方式 |
| 账号管理 | 管理员账号 / 咨询师账号 |

---

## 3. 数据库设计（SQLite）

**存储策略：本地服务器存储，不上云。报告导出时自动生成双版本。**

### 表结构

```sql
-- 个案主表
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_no TEXT UNIQUE NOT NULL,      -- CH-2026-0001
  child_gender TEXT,                  -- 男/女
  child_age_group TEXT,               -- 3-6/7-12/13-15/16-18
  issue_types TEXT,                   -- JSON: ["焦虑","抑郁"]
  issue_source TEXT,                  -- 自评/学校/家长
  risk_level TEXT DEFAULT '低',       -- 低/中/高
  consult_count INTEGER DEFAULT 0,
  last_consult_date TEXT,
  status TEXT DEFAULT '进行中',      -- 进行中/已结案/转介
  guardian_name_code TEXT,            -- 仅姓氏（如"王"）
  guardian_phone_tail TEXT,           -- 仅后4位
  province TEXT,                      -- 仅省份
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 咨询记录
CREATE TABLE consult_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER REFERENCES cases(id),
  consult_date TEXT NOT NULL,
  consult_type TEXT,                 -- 首次访谈/跟进/评估
  duration INTEGER,                   -- 分钟
  main_topic TEXT,
  outcome TEXT,
  next_plan TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 量表测评记录（去标识化）
CREATE TABLE scale_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER REFERENCES cases(id),
  scale_type TEXT NOT NULL,          -- mht/sdq/cdi/tas/adhd/trauma
  total_score INTEGER NOT NULL,
  risk_level TEXT,                   -- 低/中/高
  guardian_phone_tail TEXT,          -- 后4位（查重用）
  child_age_group TEXT,
  test_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 预约记录（增强）
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guardian_name TEXT NOT NULL,
  guardian_phone TEXT NOT NULL,
  child_name_code TEXT,              -- 仅姓氏
  child_age TEXT NOT NULL,
  child_gender TEXT,
  issue_type TEXT,
  issue_desc TEXT,
  preferred_date TEXT,
  source TEXT DEFAULT '网站',        -- 网站/热线/学校/社区
  status TEXT DEFAULT 'pending',
  case_id INTEGER REFERENCES cases(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 留言记录
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  contact TEXT,
  content TEXT NOT NULL,
  is_anonymous INTEGER DEFAULT 0,
  is_public INTEGER DEFAULT 0,
  is_reviewed INTEGER DEFAULT 0,
  review_result TEXT,                -- 通过/不通过
  reviewed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 报告记录
CREATE TABLE reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  period TEXT,                        -- 2026Q1/2026年度
  period_start TEXT,
  period_end TEXT,
  content TEXT,                       -- JSON格式
  file_path TEXT,                     -- 导出文件路径
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 操作日志
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operator TEXT,
  action TEXT,
  target TEXT,
  detail TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. 技术选型

| 项目 | 选型 | 说明 |
|------|------|------|
| 后端 | Node.js + Express | 与茉莉工作室统一 |
| 数据库 | SQLite | 轻量，迁移方便 |
| ORM | better-sqlite3 | 已装，性能好 |
| 后台前端 | HTML + Vanilla JS | 轻量快速，不需要打包 |
| 报告生成 | docx-templates | 生成 Word 文档 |
| 图表 | Chart.js | 轻量，支持饼图/折线图/柱状图 |
| 部署 | 腾讯云 + pm2 | 与茉莉工作室共用服务器 |

---

## 5. 目录结构

```
~/Desktop/ChildHeart Charity/
├── admin/                    # 后台管理
│   ├── index.html            # 登录页
│   ├── dashboard.html         # 数据看板
│   ├── bookings.html          # 预约管理
│   ├── cases.html             # 个案管理
│   ├── scales.html            # 量表数据
│   ├── messages.html          # 留言审核
│   ├── reports.html           # 报告生成
│   ├── consultants.html        # 咨询师管理
│   ├── css/
│   │   └── admin.css         # 后台专用样式
│   └── js/
│       ├── api.js             # 统一 API 调用
│       ├── dashboard.js
│       ├── bookings.js
│       ├── cases.js
│       └── reports.js
├── server/
│   ├── index.js              # 已有
│   ├── db/
│   │   ├── schema.sql       # 主数据库 schema
│   │   └── charity.db        # 主数据库（本地存储，不上云）
│   ├── reports/
│   │   ├── full/            # 【原版报告】含完整信息，内部存档
│   │   │   └── 童心惠民_[项目名]_[日期]_原版.docx
│   │   └── ident/           # 【去标识化报告】供政协/民盟提案使用
│   │       └── 童心惠民_[项目名]_[日期]_提案版.docx
│   ├── routes/
│   │   ├── bookings.js       # 已有
│   │   ├── messages.js        # 已有
│   │   ├── resources.js      # 已有
│   │   ├── cases.js          # 新增
│   │   ├── scales.js         # 新增
│   │   ├── reports.js        # 新增
│   │   └── auth.js           # 新增（登录认证）
│   └── middleware/
│       └── auth.js           # 管理员认证中间件
├── SPEC.md                    # 本文档
```

---

## 6. 优先级

**第一期（MVP，最核心）：**
1. Dashboard 数据看板（最直观，提案必用）
2. 增强 schema（加入 cases/scale_records 表）
3. 预约管理完善（加 case_id 关联）
4. 报告生成（Word 导出）

**第二期：**
5. 个案管理
6. 量表数据管理
7. 留言审核

**第三期：**
8. 咨询师管理
9. 操作日志
10. 多账号权限

---

## 7. 重要原则

1. **单库本地存储**（核心原则）
   - 数据库仅存储在本地服务器，不上云
   - 全量原始信息均在本地，保障隐私安全

2. **报告双版本导出**（按需）
   - `reports/full/` 原版报告 → 含完整个案信息，内部存档备用
   - `reports/ident/` 去标识化报告 → 供政协/民盟提案使用
   - 两版报告同时生成，一键导出，互不干扰

3. **去标识化规则**（报告层面）
   - 姓名 → 仅姓氏（如"王"）
   - 电话 → 仅尾号4位
   - 地址 → 仅省份
   - 学校 → "某学校" / "某市某区"
   - 家庭情况 → 模糊化（如"双职工家庭"/"农村家庭"）

4. **隐私优先**：数据库本地存储，不上云，不给第三方

5. **提案导向**：每一个数据字段设计时都考虑"能否支撑政协/民盟提案"

6. **可量化**：所有描述尽可能数字化（XX%，XX次，XX人）

7. **报告按需导出**：不受月度/季度限制，每个报告含日期，可随时生成
