# 童心惠民 - NGO部署文档

> 更新时间：2026-04-06
> 版本：v1.0
> 定位：公益心理咨询 + 参政议政数据支撑平台

---

## 一、项目概述

**项目名称**：童心惠民
**类型**：NGO/公益组织服务平台
**服务对象**：政府/政协/民盟（参政议政）+ 公益心理咨询
**技术栈**：Node.js + Express + SQLite + HTML5
**端口**：3002

---

## 二、特殊说明

### 数据安全原则
- **去标识化优先**：所有敏感数据必须脱敏处理
- **隐私保护**：原始数据不上云，只存放去标识化数据
- **报告导向**：数据用于参政议政报告，可量化展示

### 数据分类存储
```
/db/ident/     → 去标识化数据（供报告使用，可上云）
/db/full/       → 全量原始数据（严格保密，不上云）
```

---

## 三、服务器要求

### 推荐配置
- CPU：2核
- 内存：4GB
- 硬盘：100GB SSD
- 带宽：5Mbps

### 云服务商
- 与茉莉工作室共用腾讯云服务器
- 或独立部署

---

## 四、环境配置

### 1. 安装 Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### 2. 安装 PM2

```bash
npm install -g pm2
pm2 -v
```

### 3. 安装 Nginx

```bash
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 五、项目部署

### 1. 上传代码

```bash
cd /var/www/
git clone https://github.com/wanoukaka/ChildHeart-Charity.git
cd ChildHeart-Charity
```

### 2. 安装依赖

```bash
cd server
npm install
```

### 3. 初始化数据库

```bash
# 创建数据库目录
mkdir -p ../db/ident
mkdir -p ../db/full

# 初始化去标识化数据库
npm run init-db
```

### 4. 启动服务

```bash
pm2 start server/index.js --name childheart
pm2 save
pm2 startup
```

### 5. Nginx 配置

```nginx
# /etc/nginx/sites-available/childheart
server {
    listen 80;
    server_name childheart.cn www.childheart.cn;

    location / {
        root /var/www/ChildHeart-Charity/public;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /admin {
        alias /var/www/ChildHeart-Charity/admin;
        try_files $uri $uri/ /admin/index.html;
        allow 10.0.0.0/8;
        allow 172.16.0.0/12;
        allow 192.168.0.0/16;
        deny all;
    }
}
```

---

## 六、数据去标识化说明

### 去标识化规则

| 数据类型 | 处理方式 |
|---------|---------|
| 姓名 | 仅存姓氏（例：王） |
| 电话 | 仅存尾号4位（例：****1234） |
| 身份证 | 完全脱敏（不存储） |
| 地址 | 仅存区县（例：济南市历下区） |
| 案例编号 | 随机UUID |
| 咨询记录 | 匿名化处理 |

### 数据流向
```
来访者原始数据
    ↓
去标识化处理（姓名、联系方式等脱敏）
    ↓
存入 /db/ident/（可上云，供报告使用）
    ↓
原始数据（加密）
    ↓
存入 /db/full/（本地存储，严格保密）
```

---

## 七、参政议政报告体例

### 标准格式（农工党）

```
【封面】
项目名称 | 日期 | 报送单位

一、基本情况
  - 项目背景
  - 实施情况

二、调研数据
  - 服务人群画像（去标识化）
  - 问题类型分布
  - 典型案例（已脱敏）

三、问题分析
  - 当前困境
  - 原因剖析

四、对策建议
  - 具体政策建议（1.2.3.）
  - 预期效果

五、下一步计划
```

### 报告生成流程
1. 在管理后台选择「生成报告」
2. 选择时间范围和项目
3. 系统自动脱敏处理数据
4. 生成 Word 文档
5. 下载后人工审核

---

## 八、隐私保护说明

### 敏感数据处理

| 敏感级别 | 处理方式 |
|---------|---------|
| 🔴 最高 | 案例详情、咨询内容 | 仅本地存储，不上云 |
| 🟠 高 | 姓名、电话、地址 | 完全脱敏后存储 |
| 🟡 中 | 年龄、职业、学历 | 区间化处理 |
| 🟢 低 | 咨询类型、时长 | 统计聚合 |

### 访问控制
- 管理后台仅内网访问
- 报告导出需二次确认
- 操作日志全程记录

---

## 九、功能模块

### 已完成功能

| 模块 | 功能 | 状态 |
|------|------|------|
| Dashboard | 数据看板 | ✅ |
| 预约管理 | 来访者预约 | ✅ |
| 个案登记 | 去标识化登记 | ✅ |
| 量表管理 | 心理测评数据 | ✅ |
| 随访追踪 | 随访计划管理 | ✅ |
| 志愿者管理 | 服务工时记录 | ✅ |
| 家校联动 | 沟通记录 | ✅ |
| Word报告 | 参政议政体例 | ✅ |
| 咨询师管理 | 团队管理 | ✅ |

### 数据看板指标

| 指标 | 说明 |
|------|------|
| 服务人次 | 去标识化统计 |
| 问题类型分布 | 饼图展示 |
| 典型案例 | 已脱敏案例 |
| 政策建议 | 量化数据支撑 |

---

## 十、运维监控

### PM2 命令
```bash
pm2 list                  # 查看进程
pm2 logs childheart       # 查看日志
pm2 restart childheart   # 重启
pm2 monit                 # 监控
```

### 备份策略
```bash
# 每日凌晨备份去标识化数据
0 3 * * * tar -czf /backup/childheart_ident_$(date +\%Y\%m\%d).tar.gz /var/www/ChildHeart-Charity/db/ident/

# 每周备份原始数据（本地）
0 4 * * 0 tar -czf /backup/childheart_full_$(date +\%Y\%m\%d).tar.gz /var/www/ChildHeart-Charity/db/full/
```

---

## 十一、GitHub 仓库

| 仓库 | 地址 | 用途 |
|------|------|------|
| ChildHeart-Charity | github.com/wanoukaka/ChildHeart-Charity | 主项目代码 |
| OpenClaw-Workspace | github.com/wanoukaka/OpenClaw-Workspace | 工作区备份 |

---

*本文档由玩偶卡卡整理 | 最后更新：2026-04-06*
