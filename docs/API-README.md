# 童心惠民 - API 文档

> 版本: 1.0.0 | 更新: 2026-04-05 | 共42个端点

---

## 快速开始

### Base URL

```
开发环境: http://localhost:3002
公网: https://your-serveo-url
```

---

## 端点总览

| 模块 | 端点数 | 路由 |
|------|--------|------|
| 预约 | 5 | /api/bookings |
| 咨询个案 | 6 | /api/cases |
| 随访 | 4 | /api/admin/followup |
| 志愿者 | 4 | /api/admin/volunteers |
| 家庭 | 4 | /api/admin/family |
| 留言 | 3 | /api/messages |
| 资源 | 2 | /api/resources |
| 管理 | 14 | /api/admin |
| **总计** | **42** | |

---

## 响应格式

### 成功

```json
{
  "code": 0,
  "data": { ... }
}
```

### 错误

| code | 含义 |
|------|------|
| -1 | 通用错误 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 健康检查

```bash
curl http://localhost:3002/api/health
```

---

## 预约管理 `/api/bookings`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/bookings | 获取预约列表 |
| GET | /api/bookings/:id | 获取预约详情 |
| POST | /api/bookings | 创建预约 |
| PATCH | /api/bookings/:id | 更新预约 |
| DELETE | /api/bookings/:id | 删除预约 |

### 预约状态

| 状态 | 含义 |
|------|------|
| pending | 待确认 |
| confirmed | 已确认 |
| completed | 已完成 |
| cancelled | 已取消 |

---

## 个案管理 `/api/cases`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/cases | 获取个案列表 |
| GET | /api/cases/:id | 获取个案详情 |
| POST | /api/cases | 创建个案 |
| PATCH | /api/cases/:id | 更新个案 |
| DELETE | /api/cases/:id | 删除个案 |
| GET | /api/cases/stats | 获取统计数据 |

---

## 随访管理 `/api/admin/followup`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/admin/followup | 获取随访列表 |
| GET | /api/admin/followup/:id | 获取随访详情 |
| POST | /api/admin/followup | 创建随访 |
| PATCH | /api/admin/followup/:id | 更新随访 |

---

## 志愿者管理 `/api/admin/volunteers`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/admin/volunteers | 获取志愿者列表 |
| GET | /api/admin/volunteers/:id | 获取志愿者详情 |
| POST | /api/admin/volunteers | 添加志愿者 |
| PATCH | /api/admin/volunteers/:id | 更新志愿者信息 |

---

## 家庭管理 `/api/admin/family`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/admin/family | 获取家庭列表 |
| GET | /api/admin/family/:id | 获取家庭详情 |
| POST | /api/admin/family | 创建家庭档案 |
| PATCH | /api/admin/family/:id | 更新家庭信息 |

---

## 留言管理 `/api/messages`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/messages | 获取留言列表 |
| POST | /api/messages | 提交留言 |
| PATCH | /api/messages/:id | 回复/处理留言 |

---

## 资源管理 `/api/resources`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/resources | 获取资源列表 |
| POST | /api/resources | 上传资源 |

---

## 管理后台 `/api/admin`

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/admin/dashboard | 仪表盘数据 |
| GET | /api/admin/stats | 统计数据 |
| POST | /api/admin/login | 管理员登录 |
| GET | /api/admin/users | 用户列表 |
| GET | /api/admin/settings | 系统设置 |
| PATCH | /api/admin/settings | 更新设置 |
| ... | ... | ... |

---

## 去标识化原则

所有报告和导出数据遵循以下原则：
- 姓名：仅存姓氏
- 电话：仅存尾号4位
- 地址：仅存区县级别
- 完整数据：严格保密，不上云

---

_本文档由玩偶卡卡自动生成 🐻_
