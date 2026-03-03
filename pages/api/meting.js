const cache = new Map();
const pendingRequests = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24小时
const cacheStats = { hits: 0, misses: 0, retries: 0, rateLimited: 0 };

// 速率限制配置
const RATE_LIMIT_CONFIG = {
  // 基于IP的请求限制
  ip: {
    windowMs: 60 * 1000, // 1分钟窗口
    maxRequests: 60,     // 每分钟最多60个请求
    burstLimit: 10,      // 突发请求限制
  },
  // 基于上游API的限制
  upstream: {
    windowMs: 60 * 1000,  // 1分钟窗口
    maxRequests: 30,      // 每分钟最多30个上游请求
    retryAfterMs: 1000,   // 超出限制后重试间隔
  }
};

// 速率限制存储
const rateLimits = {
  ipLimits: new Map(),    // IP -> {count, resetTime, burstCount}
  upstreamLimits: {       // 上游API限制
    count: 0,
    resetTime: Date.now() + RATE_LIMIT_CONFIG.upstream.windowMs,
    isLimited: false,
  }
};

// 重试配置
const RETRY_CONFIG = {
  maxRetries: 3,           // 最大重试次数
  baseDelay: 1000,         // 基础延迟1秒
  maxDelay: 10000,         // 最大延迟10秒
  backoffFactor: 2,        // 指数退避因子
  retryableErrors: [       // 可重试的错误类型
    'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND',
    'ECONNREFUSED', 'EAI_AGAIN', 'AbortError'
  ],
  retryableStatusCodes: [  // 可重试的HTTP状态码
    408, 429, 500, 502, 503, 504
  ]
};

// 监控日志样式（新增重试和速率限制相关样式）
const LogStyle = {
  // 样式
    reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  
  // 背景色
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
  
  // 图标
  icon: {
    music: '🎵',
    success: '✅',
    error: '❌',
    cache: '💾',
    network: '🌐',
    time: '⏱️',
    blog: '📝',
    island: '🏝️',
    stats: '📊',
    retry: '🔄',
    rateLimit: '🚦',
    warning: '⚠️'
  }
};

// 监控日志函数（新增类型）
function logMonitor(type, message, data = {}) {
  const timestamp = new Date().toLocaleTimeString('zh-CN', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });
  
  const icons = LogStyle.icon;
  const c = LogStyle;
  
  switch(type) {
    case 'request':
      console.log(
        `${c.bgMagenta}${c.white}${c.bright} RHZ 博客 ${c.reset} ` +
        `${c.bgCyan}${c.white}${c.bright} 灵动岛播放器 ${c.reset} ` +
        `${c.blue}${icons.music} 请求: ${message}${c.reset}`
      );
      if (data.userAgent) {
        console.log(`  ${c.gray}用户代理: ${data.userAgent.substring(0, 50)}...${c.reset}`);
      }
      if (data.clientIP) {
        console.log(`  ${c.gray}客户端IP: ${data.clientIP}${c.reset}`);
      }
      break;
      
    case 'cache-hit':
      console.log(
        `  ${c.green}${icons.cache} 缓存命中: ${message}${c.reset} ` +
        `${c.dim}[命中率: ${data.hitRate}%]${c.reset}`
      );
      break;
      
    case 'cache-miss':
      console.log(
        `  ${c.yellow}${icons.network} 上游请求: ${message}${c.reset}`
      );
      break;
      
    case 'response':
      console.log(
        `${c.green}${icons.success} 返回: ${message}${c.reset} ` +
        `${c.cyan}${icons.time} ${data.duration}ms ` +
        `${c.magenta}${icons.stats} 歌曲: ${data.trackCount}首` +
        `${c.reset}`
      );
      break;
      
    case 'error':
      console.log(
        `${c.red}${icons.error} 错误: ${message}${c.reset}`
      );
      if (data.details) {
        console.log(`  ${c.dim}${data.details}${c.reset}`);
      }
      break;
      
    // 新增日志类型
    case 'retry':
      console.log(
        `  ${c.yellow}${icons.retry} 重试: ${message}${c.reset} ` +
        `${c.dim}[尝试: ${data.attempt}/${RETRY_CONFIG.maxRetries}]` +
        `${data.delay ? ` 延迟: ${data.delay}ms` : ''}${c.reset}`
      );
      break;
      
    case 'rate-limit':
      console.log(
        `${c.bgYellow}${c.black}${icons.rateLimit} 速率限制: ${message}${c.reset} ` +
        `${c.dim}[IP: ${data.ip || '未知'}] [限制: ${data.limit}/${data.window}s]${c.reset}`
      );
      break;
      
    case 'warning':
      console.log(
        `${c.yellow}${icons.warning} 警告: ${message}${c.reset}`
      );
      break;
      
    case 'stats':
      console.log(
        `\n${c.bright}${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`
      );
      console.log(
        `${c.bright}${icons.blog} RHZ 博客 - 灵动岛播放器插件 ${c.reset}`
      );
      console.log(
        `${c.dim}内存缓存: ${c.bright}${data.cacheSize} 条目 ` +
        `${c.dim}| 命中率: ${c.bright}${data.hitRate}% ` +
        `${c.dim}| 命中: ${c.green}${data.hits}${c.reset} ` +
        `${c.dim}| 未命中: ${c.yellow}${data.misses}${c.reset}`
      );
      console.log(
        `${c.dim}重试次数: ${c.yellow}${data.retries}${c.reset} ` +
        `${c.dim}| 限流次数: ${c.magenta}${data.rateLimited}${c.reset}`
      );
      if (data.pending) {
        console.log(`${c.dim}进行中请求: ${c.bright}${data.pending}${c.reset}`);
      }
      console.log(
        `${c.dim}${icons.time} 运行时间: ${c.bright}${data.uptime}${c.reset}`
      );
      
      // 显示速率限制状态
      const now = Date.now();
      const ipLimitCount = rateLimits.ipLimits.size;
      const upstreamRemaining = Math.max(0, RATE_LIMIT_CONFIG.upstream.maxRequests - rateLimits.upstreamLimits.count);
      const upstreamResetIn = Math.ceil((rateLimits.upstreamLimits.resetTime - now) / 1000);
      
      console.log(
        `${c.dim}IP限制: ${c.bright}${ipLimitCount} 个IP ` +
        `${c.dim}| 上游剩余: ${upstreamRemaining} 请求 ` +
        `${c.dim}| 重置: ${upstreamResetIn}s` +
        `${c.reset}`
      );
      
      console.log(
        `${c.bright}${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}\n`
      );
      break;
  }
}

// 检查IP速率限制
function checkIPRateLimit(ip) {
  const now = Date.now();
  const config = RATE_LIMIT_CONFIG.ip;
  let limit = rateLimits.ipLimits.get(ip);
  
  // 清理过期的记录
  if (limit && now > limit.resetTime) {
    rateLimits.ipLimits.delete(ip);
    limit = null;
  }
  
  if (!limit) {
    // 新IP，初始化限制
    limit = {
      count: 1,
      resetTime: now + config.windowMs,
      burstCount: config.burstLimit,
      firstRequestTime: now
    };
    rateLimits.ipLimits.set(ip, limit);
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs };
  }
  
  // 检查突发限制
  if (now - limit.firstRequestTime < 1000 && limit.count > config.burstLimit) {
    cacheStats.rateLimited++;
    return { 
      allowed: false, 
      remaining: 0, 
      resetIn: Math.ceil((limit.resetTime - now) / 1000),
      reason: '突发请求限制'
    };
  }
  
  // 检查常规限制
  if (limit.count >= config.maxRequests) {
    cacheStats.rateLimited++;
    return { 
      allowed: false, 
      remaining: 0, 
      resetIn: Math.ceil((limit.resetTime - now) / 1000),
      reason: '请求频率限制'
    };
  }
  
  limit.count++;
  return { 
    allowed: true, 
    remaining: config.maxRequests - limit.count,
    resetIn: Math.ceil((limit.resetTime - now) / 1000)
  };
}

// 检查上游API速率限制
function checkUpstreamRateLimit() {
  const now = Date.now();
  const config = RATE_LIMIT_CONFIG.upstream;
  const limit = rateLimits.upstreamLimits;
  
  // 重置计数器
  if (now > limit.resetTime) {
    limit.count = 0;
    limit.resetTime = now + config.windowMs;
    limit.isLimited = false;
  }
  
  // 检查是否被限制
  if (limit.isLimited) {
    const retryAfter = Math.ceil((limit.resetTime - now) / 1000);
    if (retryAfter > 0) {
      return { 
        allowed: false, 
        remaining: 0,
        retryAfter: Math.max(config.retryAfterMs, retryAfter * 1000)
      };
    } else {
      limit.isLimited = false;
    }
  }
  
  // 检查请求计数
  if (limit.count >= config.maxRequests) {
    limit.isLimited = true;
    cacheStats.rateLimited++;
    return { 
      allowed: false, 
      remaining: 0,
      retryAfter: config.retryAfterMs
    };
  }
  
  limit.count++;
  return { 
    allowed: true, 
    remaining: config.maxRequests - limit.count
  };
}

// 指数退避延迟计算
function calculateRetryDelay(attempt) {
  const delay = Math.min(
    RETRY_CONFIG.maxDelay,
    RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffFactor, attempt - 1)
  );
  return delay + Math.random() * 1000; // 添加随机抖动避免惊群
}

// 判断错误是否可重试
function isRetryableError(error, statusCode) {
  // 检查错误类型
  if (error && RETRY_CONFIG.retryableErrors.includes(error.name || error.code)) {
    return true;
  }
  
  // 检查HTTP状态码
  if (statusCode && RETRY_CONFIG.retryableStatusCodes.includes(statusCode)) {
    return true;
  }
  
  // 特定错误消息匹配
  if (error && error.message) {
    const errorMsg = error.message.toLowerCase();
    if (errorMsg.includes('timeout') || 
        errorMsg.includes('network') || 
        errorMsg.includes('socket') ||
        errorMsg.includes('连接') ||
        errorMsg.includes('超时')) {
      return true;
    }
  }
  
  return false;
}

// 带重试和速率限制的fetchTrack函数
async function fetchTrack(id, level, type, startTime, attempt = 1) {
  const cacheKey = `${id}_${level}_${type}`;
  const upstream = new URL('https://metings.qjqq.cn/Song_V1');
  upstream.searchParams.set('url', id);
  upstream.searchParams.set('level', String(level));
  upstream.searchParams.set('type', String(type));
  
  // 检查上游速率限制
  const upstreamLimit = checkUpstreamRateLimit();
  if (!upstreamLimit.allowed) {
    logMonitor('rate-limit', '上游API限制中', {
      reason: '达到上游请求限制',
      retryAfter: upstreamLimit.retryAfter
    });
    await new Promise(resolve => setTimeout(resolve, upstreamLimit.retryAfter));
    return fetchTrack(id, level, type, startTime, attempt); // 递归重试
  }
  
  const controller = new AbortController();
  const timeout = Math.min(10000, 2000 * attempt); // 重试时增加超时时间
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(upstream.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const fetchTime = Date.now() - startTime;
    
    if (!response.ok) {
      // 检查是否可重试
      if (attempt < RETRY_CONFIG.maxRetries && isRetryableError(null, response.status)) {
        const delay = calculateRetryDelay(attempt);
        cacheStats.retries++;
        logMonitor('retry', `HTTP ${response.status}: ${id}`, {
          attempt,
          delay,
          nextAttempt: attempt + 1
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchTrack(id, level, type, startTime, attempt + 1);
      }
      
      logMonitor('error', `上游请求失败`, { 
        details: `ID: ${id} | 状态码: ${response.status} | 耗时: ${fetchTime}ms | 尝试: ${attempt}`
      });
      return null;
    }
    
    const payload = await response.json();
    const d = payload?.data;
    if (!d?.url) {
      // 无效数据，检查是否重试
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = calculateRetryDelay(attempt);
        cacheStats.retries++;
        logMonitor('retry', `无效响应数据: ${id}`, {
          attempt,
          delay,
          nextAttempt: attempt + 1
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchTrack(id, level, type, startTime, attempt + 1);
      }
      
      logMonitor('error', `无效响应数据`, { 
        details: `ID: ${id} | 耗时: ${fetchTime}ms | 尝试: ${attempt}`
      });
      return null;
    }
    
    if (attempt > 1) {
      logMonitor('retry', `重试成功: ${d.name || id}`, {
        attempt: attempt - 1,
        totalAttempts: attempt
      });
    }
    
    logMonitor('cache-miss', `获取成功: ${d.name || id}`, { 
      duration: fetchTime,
      attempt
    });
    
    return {
      name: d.name || d.al_name || id,
      artist: d.ar_name || '',
      url: typeof d.url === 'string' ? d.url.replace(/^http:\/\//, 'https://') : d.url,
      cover: d.pic || '',
      lrc: d.lyric || '',
      meta: {
        attemptCount: attempt,
        fetchedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const errorType = error.name === 'AbortError' ? '超时' : '网络错误';
    const fetchTime = Date.now() - startTime;
    
    // 检查是否可重试
    if (attempt < RETRY_CONFIG.maxRetries && isRetryableError(error)) {
      const delay = calculateRetryDelay(attempt);
      cacheStats.retries++;
      logMonitor('retry', `${errorType}: ${id}`, {
        attempt,
        delay,
        nextAttempt: attempt + 1,
        error: error.message
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchTrack(id, level, type, startTime, attempt + 1);
    }
    
    logMonitor('error', `${errorType}: ${id}`, { 
      details: `${error.message} | 耗时: ${fetchTime}ms | 尝试: ${attempt}次`
    });
    return null;
  }
}

// 定期清理过期IP限制记录
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [ip, limit] of rateLimits.ipLimits.entries()) {
    if (now > limit.resetTime + 60000) { // 过期1分钟后清理
      rateLimits.ipLimits.delete(ip);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    logMonitor('warning', `清理了 ${cleaned} 个过期的IP限制记录`);
  }
}, 5 * 60 * 1000); // 每5分钟清理一次

// 启动时显示统计
function showStartupStats() {
  setTimeout(() => {
    const totalRequests = cacheStats.hits + cacheStats.misses;
    const hitRate = totalRequests > 0 
      ? ((cacheStats.hits / totalRequests) * 100).toFixed(1)
      : 0;
    
    logMonitor('stats', '插件已启动', {
      cacheSize: cache.size,
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      retries: cacheStats.retries,
      rateLimited: cacheStats.rateLimited,
      hitRate: hitRate,
      pending: pendingRequests.size,
      uptime: '0分钟'
    });
  }, 1000);
}

// 定期显示统计
let lastStatsTime = Date.now();
setInterval(() => {
  const now = Date.now();
  if (now - lastStatsTime > 5 * 60 * 1000) { // 每5分钟显示一次统计
    const uptime = Math.floor((now - startTime) / 60000);
    const totalRequests = cacheStats.hits + cacheStats.misses;
    const hitRate = totalRequests > 0 
      ? ((cacheStats.hits / totalRequests) * 100).toFixed(1)
      : 0;
    
    logMonitor('stats', '运行统计', {
      cacheSize: cache.size,
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      retries: cacheStats.retries,
      rateLimited: cacheStats.rateLimited,
      hitRate: hitRate,
      pending: pendingRequests.size,
      uptime: `${uptime}分钟`
    });
    
    lastStatsTime = now;
  }
}, 60 * 1000);

const startTime = Date.now();
showStartupStats();

export default async function handler(req, res) {
  const requestId = Math.random().toString(36).substr(2, 6);
  const requestStart = Date.now();
  const { url, level = 'standard', type = 'json' } = req.query;
  const userAgent = req.headers['user-agent'] || '未知';
  const clientIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   '未知';
  
  // 检查IP速率限制
  const ipLimit = checkIPRateLimit(clientIP);
  if (!ipLimit.allowed) {
    logMonitor('rate-limit', '请求被拒绝', {
      ip: clientIP,
      limit: RATE_LIMIT_CONFIG.ip.maxRequests,
      window: RATE_LIMIT_CONFIG.ip.windowMs / 1000,
      reason: ipLimit.reason
    });
    
    res.setHeader('Retry-After', Math.ceil(ipLimit.resetIn));
    return res.status(429).json({ 
      error: '请求过于频繁，请稍后重试',
      retryAfter: ipLimit.resetIn,
      limit: RATE_LIMIT_CONFIG.ip.maxRequests,
      window: RATE_LIMIT_CONFIG.ip.windowMs / 1000
    });
  }
  
  if (!url) {
    logMonitor('error', '缺少必要参数', { 
      details: 'url 参数为空',
      clientIP
    });
    return res.status(400).json({ error: 'Missing required query param: url' });
  }
  
  const candidates = String(url)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .sort();
    
  // 检查请求数量限制
  if (candidates.length > 20) {
    logMonitor('warning', '请求歌曲数量超出限制', {
      clientIP,
      requested: candidates.length,
      maxAllowed: 20
    });
    candidates.length = 20; // 限制最多20首
  }
  
  // 记录请求开始
  logMonitor('request', `ID:${requestId} 歌曲:${candidates.length}首`, { 
    userAgent,
    clientIP,
    remaining: ipLimit.remaining
  });
  
  // 设置响应头
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200, stale-if-error=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_CONFIG.ip.maxRequests);
  res.setHeader('X-RateLimit-Remaining', ipLimit.remaining);
  res.setHeader('X-RateLimit-Reset', Math.ceil(ipLimit.resetIn));
  
  try {
    const results = await Promise.all(
      candidates.map(async (id) => {
        const cacheKey = `${id}_${level}_${type}`;
        
        // 检查缓存
        const cachedData = cache.get(cacheKey);
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
          cacheStats.hits++;
          const hitRate = ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1);
          logMonitor('cache-hit', `${cachedData.data.name || id}`, { 
            hitRate,
            clientIP 
          });
          return cachedData.data;
        }
        
        // 检查是否有正在进行的相同请求
        if (pendingRequests.has(cacheKey)) {
          cacheStats.hits++;
          const hitRate = ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1);
          logMonitor('cache-hit', `${id} (并发合并)`, { 
            hitRate,
            clientIP
          });
          return await pendingRequests.get(cacheKey);
        }
        
        cacheStats.misses++;
        const fetchPromise = fetchTrack(id, level, type, requestStart);
        pendingRequests.set(cacheKey, fetchPromise);
        
        try {
          const track = await fetchPromise;
          if (track) {
            cache.set(cacheKey, { 
              data: track, 
              timestamp: Date.now(),
              metadata: {
                cachedAt: new Date().toISOString(),
                source: 'upstream',
                clientIP
              }
            });
          }
          return track;
        } finally {
          pendingRequests.delete(cacheKey);
        }
      })
    );
    
    const tracks = results.filter(Boolean);
    const totalDuration = Date.now() - requestStart;
    
    if (tracks.length === 0) {
      logMonitor('error', '所有请求均失败', { 
        details: `ID:${requestId} | 耗时: ${totalDuration}ms | 歌曲: ${candidates.length}首 | 客户端: ${clientIP}`,
        retries: cacheStats.retries
      });
      return res.status(502).json({ 
        error: '上游数据获取失败',
        retries: cacheStats.retries
      });
    }
    
    // 固定排序
    tracks.sort((a, b) => a.name.localeCompare(b.name));
    
    // 记录成功响应
    logMonitor('response', `ID:${requestId}`, {
      duration: totalDuration,
      trackCount: tracks.length,
      clientIP
    });
    
    // 添加调试信息
    const responseData = {
      tracks,
      meta: {
        requestId,
        duration: totalDuration,
        total: tracks.length,
        retries: cacheStats.retries,
        cacheHitRate: ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1),
        rateLimit: {
          remaining: ipLimit.remaining,
          resetIn: ipLimit.resetIn
        }
      }
    };
    
    return res.status(200).json(responseData);
  } catch (error) {
    const errorDuration = Date.now() - requestStart;
    logMonitor('error', '处理异常', { 
      details: `ID:${requestId} | 耗时: ${errorDuration}ms | 错误: ${error.message} | 客户端: ${clientIP}`,
      stack: error.stack
    });
    console.error('Meting Proxy Multi-Fetch Error:', error);
    return res.status(500).json({ 
      error: '内部服务器错误',
      requestId,
      retries: cacheStats.retries
    });
  }
}
