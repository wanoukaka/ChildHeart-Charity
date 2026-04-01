/**
 * 童心惠民 - API 配置
 * 统一管理前端 API 地址
 */
(function() {
  function getApiBase() {
    // 1. localStorage 手动配置优先
    var stored = localStorage.getItem('childheart_api');
    if (stored) return stored.replace(/\/$/, '');

    // 2. 线上环境（腾讯云部署后）
    if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      return 'https://api.childheart.cn';
    }

    // 3. 本地开发
    return 'http://localhost:3002';
  }

  window.API_BASE = getApiBase();
})();
