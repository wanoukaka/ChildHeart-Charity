#!/bin/bash
# ChildHeart Charity - 腾讯云一键部署脚本
# 执行方式：bash deploy.sh

set -e

echo "=========================================="
echo "童心惠民公益平台 - 腾讯云部署脚本"
echo "=========================================="

# ── 配置 ────────────────────────────────────────────────
APP_NAME="childheart"
APP_DIR="/var/www/childheart"
PORT=3002

# ── 系统依赖 ────────────────────────────────────────────
echo "[1/5] 检查系统依赖..."
which nginx > /dev/null || echo "⚠️ 请安装 nginx: apt install nginx"
which pm2 > /dev/null || echo "⚠️ 请安装 PM2: npm install -g pm2"

# ── 目录创建 ────────────────────────────────────────────
echo "[2/5] 创建目录..."
sudo mkdir -p $APP_DIR
sudo mkdir -p $APP_DIR/db

# ── 代码拉取 ────────────────────────────────────────────
echo "[3/5] 拉取代码..."
if [ -d "$APP_DIR/.git" ]; then
    cd $APP_DIR && git pull
else
    git clone https://github.com/wanoukaka/ChildHeart-Charity.git $APP_DIR
fi

# ── PM2 启动后端 ───────────────────────────────────────
echo "[4/5] 启动后端服务..."
cd $APP_DIR/server
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start ecosystem.config.cjs --name $APP_NAME
pm2 save

# ── Nginx 配置 ──────────────────────────────────────────
echo "[5/5] 配置 Nginx..."
sudo cp $APP_DIR/server/deploy/nginx.conf /etc/nginx/sites-available/childheart.conf
sudo ln -sf /etc/nginx/sites-available/childheart.conf /etc/nginx/sites-enabled/childheart.conf
sudo nginx -t && sudo nginx -s reload

echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo "前端访问：http://<服务器IP>/"
echo "后端API：http://<服务器IP>/api/"
echo ""
echo "管理命令："
echo "  pm2 logs $APP_NAME     # 查看后端日志"
echo "  pm2 restart $APP_NAME   # 重启后端"
