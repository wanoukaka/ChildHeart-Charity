/**
 * 请求日志中间件
 * 记录所有API请求，便于调试和监控
 */
const dayjs = require('dayjs')
const fs = require('fs')
const path = require('path')

const LOG_FILE = path.join(__dirname, '..', 'request.log')

// 颜色代码
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
}

const levelColor = {
  INFO: colors.green,
  WARN: colors.yellow,
  ERROR: colors.red,
  DEBUG: colors.gray
}

function requestLogger(req, res, next) {
  const start = Date.now()
  const requestId = Math.random().toString(36).substring(2, 10)
  
  const logEntry = {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent') || 'unknown',
    time: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
  
  const originalSend = res.send
  res.send = function(body) {
    const duration = Date.now() - start
    const status = res.statusCode
    
    const level = status >= 500 ? 'ERROR' : 
                 status >= 400 ? 'WARN' : 
                 'INFO'
    
    const logLine = {
      ...logEntry,
      status,
      duration: `${duration}ms`,
      responseSize: body ? body.length : 0,
      level
    }
    
    const color = levelColor[level]
    console.log(
      `${color}[${level}]${colors.reset} ` +
      `${colors.cyan}${requestId}${colors.reset} ` +
      `${req.method} ${req.path} ` +
      `${status >= 400 ? colors.red : colors.green}${status}${colors.reset} ` +
      `${duration}ms ` +
      `${colors.gray}${req.ip}${colors.reset}`
    )
    
    try {
      const logLineStr = JSON.stringify(logLine) + '\n'
      fs.appendFileSync(LOG_FILE, logLineStr)
    } catch (e) {
      // 忽略文件写入错误
    }
    
    return originalSend.call(this, body)
  }
  
  next()
}

module.exports = { requestLogger }
