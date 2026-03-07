# 按文件拆分的灵动岛播放器 API 优化改造任务列表

## 目标

基于当前项目的灵动岛播放器实现与 API 请求策略，按文件维度拆分可执行改造任务，并同步当前完成状态。

---

## 1. `pages/api/audio-meta.js`

### 优先级
P0

### 当前状态
已完成第一阶段核心改造，并已切换为复用 `lib/server/audioMeta.js` 共享模块；接口层主要保留请求级错误处理、响应头与调试头输出。

### 已完成
- 已改为真实错误状态码，不再使用 `200 + {}` 掩盖异常
- 已增加统一错误结构：`error` / `code` / `requestId`
- 已增加模块级并发去重 `pendingPromise`
- 已支持 Notion 分页拉取并合并 `results`
- 已保留当前 10 分钟内存缓存方案
- 已补测试：缺少 Token / Notion 非 2xx / 缓存命中 / 并发复用 / 分页聚合
- 已复用公共 `cache` 抽象，支持共享 provider 接入
- 已抽离 Notion AudioMeta 读取逻辑到 `lib/server/audioMeta.js`
- `/api/audio-meta` 已改为调用共享 `getAudioMetaMap()`


### 剩余任务
- 如有需要，补充缓存元信息
- 继续整理共享模块接入后的测试回归差异


### 预期收益
- 错误更容易定位
- 降低 Notion API 压力
- 支持更大规模的音频元数据库


---

## 2. `pages/api/meting.js`

### 优先级
P1

### 当前状态
已完成响应/错误结构改造、去定时器、懒清理、公共缓存/限流模块抽离，并已接入 AudioMeta 归档音频优先能力；当前可优先使用 Notion 中维护的稳定音频地址。


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
- 已接入 `lib/server/audioMeta.js`，优先按 `trackId` / `audioKey` 匹配归档条目
- 命中归档条目时已优先使用 `ArchivedAudioUrl / StableAudioUrl`
- 已将归档匹配结果写入 `track.meta.audioArchive`
- 已返回请求级归档统计：`meta.audioArchiveEnabled / meta.audioArchiveMatched`

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
- 已补充 AudioMeta 归档落库脚本，后续可继续对接远端对象存储/自动部署目录同步
- 已补充 `/api/meting?forceRefresh=1` 回退刷新直链能力，继续用于处理源站 `403/419`


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
已完成文章音频转换逻辑的核心拆分，并已修复运行时缺失函数导致的原生 `<audio>` 回退问题；当前文章音频可恢复渲染为 `InlineIslandAudio`。

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
已完成真实运行诊断增强；当记录只有 `file.notion.so` 临时链接且缺少真实曲目 ID 时，脚本会直接输出告警，便于识别为什么 `/api/meting` 回退不可用。

### 已完成
- 已新增 `scripts/archive-audio-to-notion-standalone.js`，支持从 AudioMeta 数据库批量归档音频并回写 Notion
- 已增强脚本下载策略，支持浏览器头部重试与 `/api/meting` 强刷直链回退
- 已增加来源类型与 TrackId 诊断输出，可识别 `notion-temp` 记录及缺失真实曲目 ID 的场景

### 待继续
- [ ] 真实样本 `雨后青花` 目前仅命中 `file.notion.so` 临时地址，且 `TrackId` 为页面 UUID，需在 AudioMeta 数据库补齐真实曲目 ID 或稳定源地址后再验证 `/api/meting` 回退

---

## 7. `conf/widget.config.js`

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
已完成首轮 API 测试补充，`/api/meting` 与 `/api/audio-meta` 相关回归已恢复通过。


### 改造任务
#### `/api/meting`
- [x] 缺少 `url` 参数
- [x] IP 限流
- [x] 上游失败重试
- [x] 缓存命中
- [x] 并发去重
- [x] Promise 失败后释放并重新请求
- [x] 全部失败返回 `502`
- [x] provider 诊断日志改造后回归通过（11/11）
- [x] `MUSIC_PLAYER_DEBUG_BADGE` 调试响应头测试通过
- [x] AudioMeta 归档地址优先与歌单回退相关回归已通过
- [x] `rhzhz.cn` 线上已验证缓存与限流均使用 `upstash`


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
- [x] `rhzhz.cn` 线上已验证缓存使用 `upstash`

### 当前联调环境状态
- [ ] `REDIS_URL`（当前缺失）
- [x] `UPSTASH_REDIS_REST_URL`（本地与线上已验证生效）
- [x] `UPSTASH_REDIS_REST_TOKEN`（本地与线上已验证生效）
- [ ] `KV_REST_API_URL`（当前缺失）
- [ ] `KV_REST_API_TOKEN`（当前缺失）
- [x] 已完成联调前可观测性准备：provider 诊断日志 + 调试响应头 + 定向测试
- [x] 已完成 `upstash` 本地联调验证
- [x] 已完成 `upstash` 线上联调验证
- [ ] 如需继续扩展，再补 `redis` 或 `kv` provider 真实联调

---

## 11. 自动归档任务化（新增）

### 11.1 `components/Player.js`

#### 优先级
P0

#### 当前状态
当前前端已能检测歌单播放与 `403` 刷新，并已改为在低覆盖率或音频错误场景下仅上报归档调度请求，不再由前端直接执行归档。

#### 待新增任务
- [x] 当 `meta.audioArchiveMatched` 偏低时，上报归档调度请求而不是直接处理归档
- [x] 当播放触发 `403` 且刷新后仍不稳定时，上报单曲或歌单级调度请求
- [x] 对同一会话内重复上报做去抖/节流与去重
- [x] 保证前端只做检测与通知，不持有 COS / Notion 写权限

### 11.2 `pages/api/archive/*`（待新增）

#### 优先级
P0

#### 当前状态
当前仓库只有离线归档脚本，尚无自动化调度 API。

#### 待新增任务
- [ ] 新增 `POST /api/archive/schedule` 作为任务调度入口
- [ ] 支持 `playlistId / trackId / songUrl` 三类输入
- [ ] 为任务增加幂等校验，避免重复归档
- [ ] 支持记录触发原因：初始化缺归档 / 播放403 / 手动刷新 / 巡检任务
- [ ] 为手动归档补充池预留字段校验：`InGlobalPlayer / AddToPlaylist / PlaylistOrder`

### 11.3 `lib/server/archive*`（待新增）

#### 优先级
P0

#### 当前状态
已新增 `lib/server/archiveExecutor.js` 作为共享执行入口，`pages/api/archive/schedule` 已开始复用共享参数归一化与模式判定；完整的归档下载 / 上传 / Notion 回写细节仍待继续从旧离线脚本中下沉。

#### 待新增任务
- [x] 抽离归档执行入口到 `lib/server` 共享模块
- [x] 让调度 API 复用共享执行入口与模式判定
- [ ] 继续把旧离线脚本中的下载、上传、回写细节下沉到服务层
- [ ] 统一归档状态：`pending / archiving / archived / failed / stale`
- [ ] 统一失败重试、错误截断、字段回写逻辑

### 11.4 `scripts/archive-audio-to-notion-standalone.js`

#### 优先级
P1

#### 当前状态
已完成手动批量归档、单曲归档、歌单归档验证，但仍偏离线工具角色。

#### 待新增任务
- [ ] 将脚本内归档核心下沉到服务层，仅保留 CLI 参数解析与批处理入口
- [ ] 与自动调度 API 共用同一执行器
- [ ] 为后续定时巡检任务复用同一实现

### 11.5 `lib/server/audioMeta.js`

#### 优先级
P1

#### 当前状态
已能聚合 `AudioMeta DB + Archive DB`，供 `/api/meting` 优先命中稳定地址；并已增加“可进入全局播放器补充池”的归档曲目读取能力。

#### 待新增任务
- [ ] 继续补充覆盖率与命中来源诊断信息，便于自动调度判断是否需要补归档
- [ ] 如有需要，增加更细粒度缓存失效控制，避免归档完成后命中延迟过长
- [x] 已兼容 `InGlobalPlayer / AddToPlaylist / PlaylistOrder` 等字段命名
- [x] 已将 `AudioMeta DB / ArchiveDB` 的推荐字段规范、职责边界、优先收敛字段与迁移顺序整理到分析文档
- [ ] 后续在真实 Notion 库中按该规范逐步收敛字段命名，优先统一 `SourceAudioUrl / ArchivedAudioUrl / InGlobalPlayer / PlaylistOrder / Lyrics`

### 11.6 `pages/api/meting.js`（补充池合并）

#### 优先级
P0

#### 当前状态
当前 `/api/meting` 已支持在 `playlistId` 分支合并歌单曲目与手动归档补充池，并已通过定向测试验证去重与顺序行为。

#### 待新增任务
- [x] 在 `playlistId` 分支合并歌单曲目与手动归档补充曲目
- [x] 合并时按 `trackId / audioKey / url` 去重
- [x] 重复曲目优先保留歌单项，仅使用归档稳定地址和元数据覆盖展示字段
- [x] 在响应 `meta` 中补充补充池合并统计字段
- [ ] 增加真实接口联调，验证补充曲目在前端全局播放器中的最终展示顺序

### 11.7 定时任务 / 巡检入口（待新增）

#### 优先级
P1

#### 当前状态
尚未建立自动巡检歌单与归档覆盖率的后台任务。

#### 待新增任务
- [ ] 定时拉取 `/api/meting?playlistId=...` 检查歌单覆盖率
- [ ] 对未命中归档的曲目自动入队
- [ ] 对长期不在歌单或长期失效的资产打 `stale` 标记

### 推荐新增实施顺序
1. `lib/server/archive*` 共享执行器
2. `pages/api/archive/schedule`
3. `components/Player.js` 前端上报
4. `lib/server/audioMeta.js` 补充池读取 + `pages/api/meting.js` 合并逻辑
5. 定时巡检任务
6. 归档状态与清理策略完善

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
1. 优先落地自动归档任务化：共享执行器 + 调度 API + 前端上报 + 定时巡检
2. 再补 `upstash / kv` 真实环境联调与可用性验证
3. 继续补共享 provider 的环境校验与降级观测
4. 如有需要，为 `audio-meta` 增加缓存元信息



