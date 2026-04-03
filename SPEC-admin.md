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

## 8. 增强模块（参考 NGO + 儿童青少年咨询平台新增）

### 8.1 危机干预模块 ⚠️

**儿童青少年咨询最高优先级模块，参考学校心理危机干预体系。**

| 功能 | 说明 |
|------|------|
| 关键词实时预警 | 提交预约/留言时自动扫描：自伤/自杀/他伤/虐待等敏感词，即时标红 |
| 危机分级 | 🔴紧急（已有行为）/🟡关注（有想法无行为）/🟢常规 |
| 危机响应流程 | 自动通知管理员 + 生成危机记录 + 启动应急预案 |
| 快速转介 | 一键联系当地精神卫生中心/儿童医院急诊 |
| 危机档案 | 记录危机发生时间、表现、干预措施、转介去向 |

**关键词库示例：**
```
自伤类：割腕/不想活/活着没意思/想死/结束生命
自杀类：跳楼/吃药/上吊/不想活了
他伤类：想杀人/想报复/想打
虐待类：被打/被烫/被关/性侵
```

---

### 8.2 志愿者管理 🧑‍🤝‍🧑（NGO 特色）

**公益机构核心资产，记录每位志愿者的服务轨迹。**

| 功能 | 说明 |
|------|------|
| 志愿者档案 | 姓名/联系方式/资质/可服务时间/擅长领域 |
| 培训记录 | 参加培训名称/日期/考核结果 |
| 服务记录 | 绑定个案/服务时长/服务类型（陪玩/倾听/援助等）|
| 工时统计 | 自动累计每位志愿者总工时 |
| 荣誉墙 | 季度之星/年度优秀志愿者（可脱敏展示在前台）|
| 调度安排 | 志愿者排班与个案需求匹配 |

---

### 8.3 家校联动 📋

**儿童青少年咨询必须联动学校和家庭。**

| 功能 | 说明 |
|------|------|
| 学校信息 | 绑定个案所在学校（仅存区/不存具体校名）|
| 班主任联系 | 记录联系情况（去标识化）|
| 家长沟通记录 | 记录每次家长沟通的时间/内容摘要/建议 |
| 家长学堂 | 推送适合家长观看的文章/视频（可集成到前台）|
| 家庭作业 | 咨询师布置的家庭任务，家长在线反馈完成情况 |
| 学校回访 | 阶段性向学校反馈（需家长授权）|

---

### 8.4 随访追踪 🔄

**参考医院随访系统，咨询结束后持续跟踪。**

| 功能 | 说明 |
|------|------|
| 随访计划 | 个案结案时自动生成随访计划（1周/1月/3月/半年）|
| 随访记录 | 家长/孩子自主填写或咨询师主动跟进 |
| 状态评估 | 量表复查 + 主诉变化 |
| 复发预警 | 随访评分下降自动提醒 |
| 长期追踪档案 | 可追溯个案结案后最长2年的状态变化 |

---

### 8.5 年度/学期对比分析 📊

**学校合作项目核心功能，支撑提案数据说服力。**

| 功能 | 说明 |
|------|------|
| 学期对比 | 本学期 vs 上学期，问题类型分布变化 |
| 问题类型趋势 | 焦虑/抑郁/ADHD/校园霸凌等占比趋势（折线图）|
| 预警率变化 | 高风险识别率同比/环比 |
| 服务覆盖率 | 学校总人数 vs 实际接受服务人数 |
| 效果评估 | 咨询前后量表分数对比（配对数据） |

---

### 8.6 公益项目活动管理 🎯

**记录每次公益活动，支撑民政/政协数据申报。**

| 功能 | 说明 |
|------|------|
| 活动档案 | 名称/日期/地点/参与人数/服务类型 |
| 活动类型 | 心理健康讲座/团辅/筛查/家长课堂/志愿者培训 |
| 效果收集 | 活动后满意度评分 + 留言反馈 |
| 数据汇总 | 自动统计年度/季度活动总数和服务人次 |
| 媒体报道 | 关联新闻链接，用于公益项目申报 |

---

### 8.7 咨询师督导 📝

**保障咨询质量，专业成长留档。**

| 功能 | 说明 |
|------|------|
| 督导记录 | 每次督导的主题/结论/待跟进事项 |
| 疑难个案讨论 | 记录团队讨论过程（保密）|
| 继续教育学分 | 记录咨询师参加培训/督导/学习的学分 |
| 胜任力评估 | 定期自评 + 主管评估 |

---

### 8.8 多角色权限体系 👥

**参考学校心理平台的多角色设计。**

| 角色 | 权限范围 |
|------|---------|
| 管理员 | 全部功能 + 账号管理 + 数据导出 |
| 主咨询师 | 分配个案 + 咨询记录 + 报告生成 |
| 咨询师 | 本人个案 + 本人记录 |
| 志愿者 | 志愿者工时记录 + 查看分配给自己的个案 |
| 学校联络员 | 查看本校个案预约状态 + 简单沟通记录 |
| 数据观察员（政府/政协）| 仅看去标识化统计报告，无个案详情 |

---

### 8.9 自动预警触发器 🚨

**超越一般 NGO 后台的核心竞争力。**

| 触发条件 | 预警内容 | 响应方式 |
|---------|---------|---------|
| 量表高风险 | CDI/SDQ/任何量表超阈值 | Dashboard 弹窗 + 管理员通知 |
| 预约含敏感词 | 自伤/自杀/虐待等关键词 | 紧急标记 + 立即提醒 |
| 随访评分下降 | 连续两次随访评分走低 | 建议安排复诊 |
| 预约后48h未确认 | 未联系到家长 | 提醒跟进 |
| 个案超10次无结案 | 长期未结案预警 | 建议督导或转介 |

---

## 9. 新增数据库表

```sql
-- 志愿者
CREATE TABLE volunteers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  skill TEXT DEFAULT '',
  avail_hours TEXT DEFAULT '',
  service_count INTEGER DEFAULT 0,
  total_hours REAL DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 志愿者服务记录
CREATE TABLE volunteer_services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  volunteer_id INTEGER REFERENCES volunteers(id),
  case_id INTEGER REFERENCES cases(id),
  service_date TEXT,
  service_hours REAL DEFAULT 0,
  service_type TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 危机记录
CREATE TABLE crisis_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER REFERENCES cases(id),
  crisis_level TEXT NOT NULL,  -- urgent/attention/normal
  trigger_keyword TEXT DEFAULT '',
  description TEXT DEFAULT '',
  response TEXT DEFAULT '',
  referred_to TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 随访计划
CREATE TABLE followup_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER REFERENCES cases(id),
  planned_date TEXT NOT NULL,
  followup_type TEXT DEFAULT 'routine',  -- routine/relapse/review
  status TEXT DEFAULT 'pending',        -- pending/done/skipped
  result TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 活动记录
CREATE TABLE activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  activity_type TEXT DEFAULT '',  -- lecture/group/screening/training
  held_date TEXT,
  location TEXT DEFAULT '',
  participant_count INTEGER DEFAULT 0,
  satisfaction_score REAL,
  notes TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 家长沟通记录
CREATE TABLE family_communications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER REFERENCES cases(id),
  comm_date TEXT NOT NULL,
  comm_type TEXT DEFAULT '家长',  -- 家长/教师/其他
  summary TEXT DEFAULT '',
  advice TEXT DEFAULT '',
  next_followup TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

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
