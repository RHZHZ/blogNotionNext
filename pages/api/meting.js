const cache = new Map();
const pendingRequests = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24小时
const cacheStats = { hits: 0, misses: 0 };
// 记录失败时间
const failureCache = new Map();

async function fetchTrack(id, level, type) {
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
    
    if (!response.ok) return null;
    const payload = await response.json();
    const d = payload?.data;
    if (!d?.url) return null;

    return {
      name: d.name || d.al_name || id,
      artist: d.ar_name || '',
      url: typeof d.url === 'string' ? d.url.replace(/^http:\/\//, 'https://') : d.url,
      cover: d.pic || '',
      lrc: d.lyric || ''
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`Failed to fetch ID ${id}:`, error);
  
    // 检查是否有旧的缓存（即使过期）
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Using expired cache for ${id} due to upstream failure`);
      failureCache.set(cacheKey, Date.now());
      return cachedData.data; // 返回过期缓存
    }
    
    return null;
  }
}

export default async function handler(req, res) {
  const { url, level = 'standard', type = 'json' } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing required query param: url' });
  }

  const candidates = String(url)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .sort();

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
          return cachedData.data;
        }
        
        // 检查是否有正在进行的相同请求
        if (pendingRequests.has(cacheKey)) {
          cacheStats.hits++; // 避免重复请求
          return await pendingRequests.get(cacheKey);
        }
        
        cacheStats.misses++;
        const fetchPromise = fetchTrack(id, level, type);
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

    if (tracks.length === 0) {
      return res.status(502).json({ error: '上游数据获取失败' });
    }

    // 固定排序
    tracks.sort((a, b) => a.name.localeCompare(b.name));
    
    return res.status(200).json(tracks);
  } catch (error) {
    console.error('Meting Proxy Multi-Fetch Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
