const cache = new Map();
const pendingRequests = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24小时
const cacheStats = { hits: 0, misses: 0 };

// 监控日志样式
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
    stats: '📊'
  }
};

// 监控日志函数
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
      if (data.pending) {
        console.log(`${c.dim}进行中请求: ${c.bright}${data.pending}${c.reset}`);
      }
      console.log(
        `${c.dim}${icons.time} 运行时间: ${c.bright}${data.uptime}${c.reset}`
      );
      console.log(
        `${c.bright}${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}\n`
      );
      break;
  }
}

async function fetchTrack(id, level, type, startTime) {
  const cacheKey = `${id}_${level}_${type}`;
  const upstream = new URL('https://metings.qjqq.cn/Song_V1');
  upstream.searchParams.set('url', id);
  upstream.searchParams.set('level', String(level));
  upstream.searchParams.set('type', String(type));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(upstream.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const fetchTime = Date.now() - startTime;
    
    if (!response.ok) {
      logMonitor('error', `上游请求失败`, { 
        details: `ID: ${id} | 状态码: ${response.status} | 耗时: ${fetchTime}ms`
      });
      return null;
    }
    
    const payload = await response.json();
    const d = payload?.data;
    if (!d?.url) {
      logMonitor('error', `无效响应数据`, { 
        details: `ID: ${id} | 耗时: ${fetchTime}ms`
      });
      return null;
    }

    logMonitor('cache-miss', `获取成功: ${d.name || id}`, { 
      duration: fetchTime
    });
    
    return {
      name: d.name || d.al_name || id,
      artist: d.ar_name || '',
      url: typeof d.url === 'string' ? d.url.replace(/^http:\/\//, 'https://') : d.url,
      cover: d.pic || '',
      lrc: d.lyric || ''
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const errorType = error.name === 'AbortError' ? '超时' : '网络错误';
    logMonitor('error', `${errorType}: ${id}`, { 
      details: `${error.message} | 耗时: ${Date.now() - startTime}ms`
    });
    return null;
  }
}

// 启动时显示统计
function showStartupStats() {
  setTimeout(() => {
    const hitRate = cacheStats.hits + cacheStats.misses > 0 
      ? ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1)
      : 0;
    
    logMonitor('stats', '插件已启动', {
      cacheSize: cache.size,
      hits: cacheStats.hits,
      misses: cacheStats.misses,
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
    const hitRate = cacheStats.hits + cacheStats.misses > 0 
      ? ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1)
      : 0;
    
    logMonitor('stats', '运行统计', {
      cacheSize: cache.size,
      hits: cacheStats.hits,
      misses: cacheStats.misses,
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

  if (!url) {
    logMonitor('error', '缺少必要参数', { details: 'url 参数为空' });
    return res.status(400).json({ error: 'Missing required query param: url' });
  }

  const candidates = String(url)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .sort();

  // 记录请求开始
  logMonitor('request', `ID:${requestId} 歌曲:${candidates.length}首`, { userAgent });

  // 设置缓存头
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const results = await Promise.all(
      candidates.map(async (id) => {
        const cacheKey = `${id}_${level}_${type}`;
        
        // 检查缓存
        const cachedData = cache.get(cacheKey);
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
          cacheStats.hits++;
          const hitRate = ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1);
          logMonitor('cache-hit', `${cachedData.data.name || id}`, { hitRate });
          return cachedData.data;
        }
        
        // 检查是否有正在进行的相同请求
        if (pendingRequests.has(cacheKey)) {
          cacheStats.hits++;
          const hitRate = ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1);
          logMonitor('cache-hit', `${id} (并发合并)`, { hitRate });
          return await pendingRequests.get(cacheKey);
        }
        
        cacheStats.misses++;
        const fetchPromise = fetchTrack(id, level, type, requestStart);
        pendingRequests.set(cacheKey, fetchPromise);
        
        try {
          const track = await fetchPromise;
          if (track) {
            cache.set(cacheKey, { data: track, timestamp: Date.now() });
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
        details: `ID:${requestId} | 耗时: ${totalDuration}ms | 歌曲: ${candidates.length}首`
      });
      return res.status(502).json({ error: '上游数据获取失败' });
    }

    // 固定排序
    tracks.sort((a, b) => a.name.localeCompare(b.name));
    
    // 记录成功响应
    logMonitor('response', `ID:${requestId}`, {
      duration: totalDuration,
      trackCount: tracks.length
    });
    
    return res.status(200).json(tracks);
  } catch (error) {
    const errorDuration = Date.now() - requestStart;
    logMonitor('error', '处理异常', { 
      details: `ID:${requestId} | 耗时: ${errorDuration}ms | 错误: ${error.message}`
    });
    console.error('Meting Proxy Multi-Fetch Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
