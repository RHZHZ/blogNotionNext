# 按文件拆分的灵动岛播放器 API 优化改造任务列表

## 目标

基于当前项目的灵动岛播放器实现与 API 请求策略，按文件维度拆分可执行改造任务，并同步当前完成状态。

---

## 1. `pages/api/audio-meta.js`

### 优先级
P0

### 当前状态
已完成第一阶段核心改造、日志收敛与大部分接口测试；已复用共享 `cache` 抽象，并补充 provider 诊断日志用于记录配置 provider / 实际 provider / fallback 状态。

### 已完成
- 已改为真实错误状态码，不再使用 `200 + {}` 掩盖异常
- 已增加统一错误结构：`error` / `code` / `requestId`
- 已增加模块级并发去重 `pendingPromise`
- 已支持 Notion 分页拉取并合并 `results`
- 已保留当前 10 分钟内存缓存方案
- 已补测试：缺少 Token / Notion 非 2xx / 缓存命中 / 并发复用 / 分页聚合
- 已复用公共 `cache` 抽象，支持共享 provider 接入


### 剩余任务
- 如有需要，补充缓存元信息
- 后续补 `upstash / kv` provider 支持


### 预期收益
- 错误更容易定位
- 降低 Notion API 压力
- 支持更大规模的音频元数据库

---

## 2. `pages/api/meting.js`

### 优先级
P1

### 当前状态
已完成响应/错误结构改造、去定时器、懒清理、公共缓存/限流模块抽离，并已补充大部分接口测试；当前已接入共享 provider 工厂，支持 `memory / redis / upstash / kv`，其中 `upstash / kv` 通过 REST 兼容层接入。


### 已完成
- 已精简响应结构为请求级字段
- 已统一错误模型：`error` / `code` / `requestId`
- 已不再向前端暴露全局累计 `cacheHitRate` / `retries`
- 已改为返回本次请求 `cacheHits` / `retries`
- 已移除 `setInterval` 维护逻辑
- 已改为请求进入时懒清理过期 IP 限流记录
- 已接入 `lib/server/apiResponse.js`
- 已接入 `lib/server/cache.js` 与 `lib/server/rateLimit.js`
- 已支持 `playlistId` 歌单模式并返回 `meta.playlist`
- 歌单模式下已保留原始曲目顺序
- 已补测试：缺少 `url` / 缓存命中 / 并发合并 / 上游失败重试 / 全部失败 502 / `playlistId` 成功与异常路径
- 已将旧 `logMonitor` 收敛为语义化 logger 调用
- 已增加 provider 诊断日志，记录 cache/rate-limit provider fallback 状态

### 剩余任务
#### 2.1 重构缓存层
- 已预留 Redis / KV 切换能力
- 已统一缓存 key 规则
- 已接入 provider 工厂入口，`redis` 已可用，其余 provider 仍回退到 memory



#### 2.2 重构限流层
- 已封装 `Retry-After` 与 `X-RateLimit-*` 响应头
- 已接入共享限流 store 适配接口
- 已接入 provider 工厂，支持 `memory / redis / upstash / kv`
- 已补 provider 诊断日志


#### 2.3 并发去重测试
- 验证 Promise 失败后是否正确释放
- 补充 IP 限流返回 `429` 测试

### 预期收益
- 降低接口复杂度
- 提升部署适配性
- 为共享缓存/共享限流迁移打基础

---

## 3. `components/Player.js`

### 优先级
P1

### 当前状态
已完成，并已接入歌单模式入口配置。

### 已完成
- 已增加 `remote` / `fallback` 来源标记
- 已挂载 `window.__APPLAYER_META__`
- 已区分接口失败、结构异常、空数据情况
- 已在开发环境输出当前歌单来源
- 已接入 `playlistId` 歌单模式入口配置

### 剩余任务
- 如需要，可在前端补请求超时包装
- 如需要，可在 UI 层消费 `__APPLAYER_META__`

### 预期收益
- 更容易判断当前播放器是否使用远程歌单
- 更便于排查线上歌单失效问题

---

## 4. `components/NotionPage.js`

### 优先级
P2

### 当前状态
已完成文章音频转换逻辑的核心拆分。

### 改造任务
- [x] 将 `convertAudios` 拆分为独立方法或 Hook
- [x] 分离：拉元数据 / 扫描 DOM / 匹配 key / 挂载组件
- [x] 增强 `audio-meta` 失败时的降级日志
- [x] 为按需查询元数据预留接口

### 预期收益
- 让文章音频增强逻辑更清晰
- 降低页面层复杂度

---

## 5. `components/DynamicIslandPlayer.js`

### 优先级
P2

### 当前状态
已完成读取播放器来源元数据与调试提示入口接入。

### 改造任务
- [x] 读取 `window.__APPLAYER_META__`
- [x] 用于区分远程歌单 / 本地回退歌单
- [x] 增加可选调试提示入口
- [x] 保持 UI 层与 API 层解耦

### 预期收益
- 提升整体播放器状态透明度

---

## 6. `components/InlineIslandAudio.js`

### 优先级
P3

### 当前状态
已完成默认信息兜底与挂载稳定性修正。

### 改造任务
- [x] 强化默认标题 / 封面 / 歌手兜底
- [x] 检查事件绑定与解绑是否成对
- [x] 验证多次挂载/卸载场景

---

## 7. `conf/widget.config.js`

### 优先级
P2

### 当前状态
已完成播放器 API 策略配置项接入，并已用于现有接口。

### 改造任务
- [x] 增加 `MUSIC_PLAYER_METING_CACHE_TTL`
- [x] 增加 `MUSIC_PLAYER_METING_MAX_REQUESTS`
- [x] 增加 `MUSIC_PLAYER_METING_UPSTREAM_LIMIT`
- [x] 增加 `MUSIC_PLAYER_AUDIO_META_CACHE_TTL`
- [x] 增加 `MUSIC_PLAYER_AUDIO_META_STRICT_ERROR`
- [x] 将硬编码策略迁移到配置层

---

## 8. `blog.config.js`

### 优先级
P3

### 当前状态
已完成播放器 API 配置说明补充。

### 改造任务
- [x] 统一配置来源说明
- [x] 补充播放器 API 配置注释
- [x] 明确哪些配置必须来自环境变量

---

## 9. `lib/server/*`

### 优先级
P1

### 当前状态
已完成基础限流能力与响应头封装接入，并已新增基础 `logger` 抽象接入播放器相关接口；`cache` / `rateLimit` 已支持 `memory / redis / upstash / kv` provider，且 `upstash / kv` 通过 REST 兼容层接入并已有单测覆盖。



### 已完成
- 已新增 `lib/server/apiResponse.js`
- 已在 `meting.js` 中使用基础响应 helper
- 已封装 `Retry-After` 与 `X-RateLimit-*` 响应头设置
- 已新增 `lib/server/logger.js` 基础日志抽象
- 已在 `audio-meta.js` / `meting.js` 接入基础 logger
- 已通过测试环境 `LOG_LEVEL=silent` 收敛 Jest 日志噪音
- 已为 `cache` / `rateLimit` 补充可替换内存 store 适配接口与单测
- 已新增 `buildMetingCacheKey` 统一 `meting` 缓存 key 规则

### 剩余任务
#### 9.1 `lib/server/cache.js`
- [x] 封装内存缓存读写
- [x] 封装 TTL 判断
- [x] 支持 `redis / upstash / kv` 共享 provider
- [x] 支持更细粒度 REST provider 可用性原因输出
- [x] 在 `MUSIC_PLAYER_DEBUG_BADGE` 开启时输出 cache provider 调试响应头
- [ ] 补真实环境联调与可用性观测（当前 `REDIS_URL / UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN / KV_REST_API_URL / KV_REST_API_TOKEN` 全部缺失）

#### 9.2 `lib/server/rateLimit.js`
- [x] 封装 IP 限流能力
- [x] 封装上游限流能力
- [x] 封装 `Retry-After` 与 `X-RateLimit-*`
- [x] 支持 `redis / upstash / kv` 共享 provider
- [x] 在 `MUSIC_PLAYER_DEBUG_BADGE` 开启时输出 rate-limit provider 调试响应头
- [ ] 补真实环境联调与降级观测（当前共享 provider 环境变量未就绪）

#### 9.3 `lib/server/logger.js`
- [x] 统一开发环境日志
- [x] 统一生产环境日志
- [x] 支持日志级别控制

#### 9.4 `lib/server/apiResponse.js`
- 支持自动挂载 `requestId`
- 支持统一设置响应头

---

## 10. `__tests__/*`

### 优先级
P1

### 当前状态
已完成首轮 API 测试补充。

### 改造任务
#### `/api/meting`
- [x] 缺少 `url` 参数
- [x] IP 限流
- [x] 上游失败重试
- [x] 缓存命中
- [x] 并发去重
- [x] Promise 失败后释放并重新请求
- [x] 全部失败返回 `502`
- [x] provider 诊断日志改造后回归通过（10/10）
- [x] `MUSIC_PLAYER_DEBUG_BADGE` 调试响应头测试通过

#### `/api/audio-meta`
- [x] 缺少 Token
- [x] 数据库 ID 缺失
- [x] Notion 非 2xx
- [x] 缓存命中
- [x] 并发去重
- [x] 分页聚合
- [x] 空数据场景
- [x] provider 诊断日志改造后回归通过（8/8）
- [x] 共享 provider 环境校验 / 可用性原因改造后基础回归通过
- [x] `MUSIC_PLAYER_DEBUG_BADGE` 调试响应头测试通过

### 当前联调环境状态
- [ ] `REDIS_URL`（当前缺失）
- [ ] `UPSTASH_REDIS_REST_URL`（当前缺失）
- [ ] `UPSTASH_REDIS_REST_TOKEN`（当前缺失）
- [ ] `KV_REST_API_URL`（当前缺失）
- [ ] `KV_REST_API_TOKEN`（当前缺失）
- [x] 已完成联调前可观测性准备：provider 诊断日志 + 调试响应头 + 定向测试
- [ ] 待补齐任一共享 provider 所需环境后再进入真实联调

---

## 推荐实施顺序（已更新）

### 已完成
1. `pages/api/audio-meta.js`
   - 错误语义
   - 并发去重
   - 分页支持
2. `components/Player.js`
   - 远程 / 回退来源标记
3. `pages/api/meting.js`
   - 精简响应结构
   - 统一错误模型
   - 移除定时器式逻辑
4. `lib/server/apiResponse.js`
   - 基础响应 helper

### 下一步优先
1. 优先补 `upstash / kv` 真实环境联调与可用性验证
2. 继续补共享 provider 的环境校验与降级观测
3. 如有需要，为 `audio-meta` 增加缓存元信息



