/**
 * 童心惠民 · 统一 API 调用封装
 * 所有 admin 页面通过此模块访问后端
 */

const API_BASE = '/api';

// 检查登录状态
function checkAuth() {
  if (!sessionStorage.getItem('admin_logged_in')) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// 通用 fetch 封装
async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || `请求失败 (${res.status})`);
    }

    return data;
  } catch (err) {
    console.error(`API Error [${path}]:`, err);
    throw err;
  }
}

// GET
async function apiGet(path) {
  return apiFetch(path);
}

// POST
async function apiPost(path, body) {
  return apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// PATCH
async function apiPatch(path, body) {
  return apiFetch(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// DELETE
async function apiDelete(path) {
  return apiFetch(path, { method: 'DELETE' });
}

// Toast 提示
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 格式化日期时间
function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${formatDate(dateStr)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// 获取当前年月字符串
function getCurrentYearMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
