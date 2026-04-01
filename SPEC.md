# 童心惠民 - 儿童公益心理咨询平台 SPEC.md

## 1. 项目概述

**项目名称：** 童心惠民（ChildHeart Care）
**性质：** 公益儿童心理咨询平台
**目标用户：** 3-18岁儿童青少年、家长/监护人、学校社工、社区工作者
**核心使命：** 为困境儿童及家庭提供免费/低费用心理咨询服务，守护儿童心理健康

---

## 2. 设计规范

### 视觉风格
- **主色调：** 温暖阳光橙 `#FF9B42` + 柔和天空蓝 `#7EC8E3` + 童趣绿 `#7DC383`
- **字体：** 圆润友好（思源黑体/Noto Sans SC），标题活泼，正文清晰
- **风格：** 温暖治愈、童趣不幼稚、专业可信赖，**避免过度卡通化**（这是专业心理服务，不是游戏）
- **图标：** Lucide Icons（线条简洁，儿童友好）
- **插图：** 几何形状组合的抽象插画，不用真人/动漫头像

### 配色方案
```
--primary:     #FF9B42   // 温暖橙（主按钮、重点强调）
--secondary:   #7EC8E3   // 天空蓝（次要元素、背景）
--accent:      #7DC383   // 童趣绿（成功状态、活跃标识）
--soft-pink:   #FFB6C1   // 柔和粉（卡片高亮）
--soft-yellow: #FFF3CD   // 暖黄（提示背景）
--dark:        #2D3436   // 深色文字
--light:       #FAFAFA   // 浅背景
--white:       #FFFFFF
```

### 响应式
- 移动优先（WAP），桌面端适配（PC）
- 触控友好（按钮高度 ≥ 44px，间距充足）

---

## 3. 页面结构

### 页面清单
| 页面 | 文件 | 说明 |
|------|------|------|
| 首页 | `index.html` | 项目介绍 + 快速入口 + 援助热线 |
| 关于我们 | `about.html` | 项目背景、团队、合作伙伴 |
| 服务项目 | `services.html` | 4个核心服务模块 |
| 资源中心 | `resources.html` | 家长指南、儿童读物、公益视频 |
| 公益故事 | `stories.html` | 匿名案例（已获授权）|
| 在线预约 | `booking.html` | 预约咨询 + 监护人授权 |
| 联系我们 | `contact.html` | 热线电话、地址、在线留言 |
| 隐私保护 | `privacy.html` | 未成年人隐私保护声明 |
| 伦理声明 | `ethics.html` | 儿童心理咨询伦理规范 |

### 功能模块
1. **援助热线展示**（不需要后端，直接显示热线号码）
2. **预约咨询表单**（监护人信息 + 被监护人信息 + 问题简述 + 预约时间）
3. **留言板**（匿名/署名，保护隐私）
4. **资源下载**（PDF家长指南，无需登录）
5. **紧急求助入口**（显眼红色按钮，跳转至热线）

---

## 4. 后端 API 设计

### 技术选型
- 轻量后端（与主项目茉莉工作室共用 Server，可独立部署）
- SQLite 数据库
- Node.js + Express

### 数据库表

**表1：`bookings` 预约记录**
```sql
id, guardian_name, guardian_phone, child_name, child_age,
issue_type, issue_desc, preferred_date, status (pending/confirmed/cancelled),
created_at, updated_at
```

**表2：`messages` 留言记录**
```sql
id, name (可选匿名), contact (可选), content,
is_anonymous BOOLEAN, is_public BOOLEAN (是否公开显示),
created_at
```

**表3：`resources` 资源清单**
```sql
id, title, category, file_url, description, created_at
```

### API 端点
```
POST /api/bookings          提交预约
GET  /api/bookings/:phone   按手机号查询预约状态

POST /api/messages           提交留言
GET  /api/messages           获取公开留言列表（分页）

GET  /api/resources          获取资源列表
```

---

## 5. 儿童保护与伦理规范（重要！）

### 隐私保护
- 未成年人个人资料默认匿名化
- 所有咨询记录严格保密，未经监护人书面授权不披露
- 强制显示《未成年人隐私保护声明》
- 预约必须填写监护人信息，未成年人不得独立预约

### 安全机制
- 留言板内容需后台审核后才公开展示
- 敏感词过滤（涉暴力/自伤/自杀内容自动提醒管理员）
- 紧急情况一键拨打热线（不经过系统）

### 伦理声明页面必备内容
1. 咨询师资质公示
2. 保密例外条款（虐待、危及生命等情况）
3. 未成年人知情同意书（监护人签署）
4. 冲突利益声明
5. 投诉与申诉渠道

---

## 6. GitHub 仓库

- **仓库名：** `childheart-charity`
- **私有/公开：** 公开（NGO 透明原则）
- **LICENSE：** MIT（公益项目）
- **描述：** 童心惠民 - 儿童公益心理咨询平台

---

## 7. 目录结构

```
~/Desktop/ChildHeart Charity/
├── SPEC.md
├── index.html              // 首页
├── about.html
├── services.html
├── resources.html
├── stories.html
├── booking.html
├── contact.html
├── privacy.html
├── ethics.html
├── api-config.js            // 统一 API 配置
├── css/
│   └── style.css            // 主样式
├── js/
│   └── main.js              // 公共逻辑
├── images/                  // 插图、图标
└── server/
    ├── index.js
    ├── db/
    │   ├── schema.sql
    │   └── charity.db
    └── routes/
        ├── bookings.js
        ├── messages.js
        └── resources.js
```

---

## 8. 设计注意事项

**DO（要做）：**
- 温暖、治愈、专业、可信赖
- 紧急求助入口显眼（红色悬浮按钮）
- 家长和儿童双入口，界面分层清晰
- 隐私保护说明显眼，不埋没在底部
- 公益透明（机构信息、咨询师资质清晰公示）

**DON'T（避免）：**
- 过度卡通化（这是专业心理服务）
- 使用真实儿童照片（隐私保护）
- 任何娱乐化元素（游戏化、奖励积分等）
- 未经审核的案例展示

---

## 9. 参考项目

- UNICEF 儿童心理援助页面风格
- 北京青少年心理援助中心
- 儿童希望救助基金会官网
- 主项目茉莉心理咨询工作室 H5 设计风格（保持家族相似性）
