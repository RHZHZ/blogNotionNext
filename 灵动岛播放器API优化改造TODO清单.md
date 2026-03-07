# 灵动岛播放器 API 优化改造 TODO 清单

## 使用说明

本清单反映当前项目的最新实施状态。

状态说明：

- `[ ]` 未开始
- `[-]` 进行中
- `[x]` 已完成

---

# 第一阶段：高优先级，已完成

## A. `pages/api/audio-meta.js`

### A1. 修正错误语义
- [x] 为每次请求生成 `requestId`
- [x] 缺少 `NOTION_ACCESS_TOKEN` 时返回真实错误码
- [x] Notion API 非 2xx 时返回 `502`
- [x] 不再使用 `200 + {}` 掩盖异常
- [x] 统一错误响应结构：`error` / `code` / `requestId`

### A2. 增加并发去重
- [x] 增加模块级 `pendingPromise`
- [x] 缓存失效时复用进行中的 Promise
- [x] 请求结束后清空 `pendingPromise`

### A3. 增加分页支持
- [x] 读取 Notion 返回的 `has_more`
- [x] 使用 `next_cursor` 循环请求后续数据
- [x] 合并所有分页结果

### A4. 日志与缓存整理
- [x] 保留 10 分钟缓存作为当前版本方案
- [x] 保留关键错误日志
- [x] 继续收敛调试日志输出
- [x] 已接入共享 `cache` 抽象，支持 `memory / redis / upstash / kv`
- [x] 已增加 provider 诊断日志，记录配置 provider / 实际 provider / fallback 状态
- [x] 已改为复用 `lib/server/audioMeta.js` 共享模块，后续继续补充更细粒度缓存元信息/诊断透出



---

## B. `components/Player.js`

### B1. 增加数据来源标记
- [x] 为播放器初始化结果增加 `source` 状态
- [x] 支持两种来源：`remote` / `fallback`
- [x] 将来源信息挂载到 `window.__APPLAYER_META__`
- [x] 远程歌单成功时标记为 `remote`
- [x] 回退本地歌单时标记为 `fallback`
- [x] 接入 `playlistId` 歌单模式入口配置

### B2. 细化初始化异常处理
- [x] 区分接口请求失败、接口结构异常、空数据三类情况
- [x] 回退时输出明确日志
- [x] 保证异常时仍可正常初始化本地播放列表

### B3. 最小可观测性
- [x] 开发环境打印当前歌单来源
- [x] 预留给 UI 层消费的数据入口

---

## C. `pages/api/meting.js`

### C1. 精简响应结构
- [x] 保留 `tracks`
- [x] 保留 `meta.requestId`
- [x] 保留 `meta.duration`
- [x] 保留 `meta.total`
- [x] 移除全局累计 `cacheHitRate`
- [x] 移除全局累计 `retries`
- [x] 改为仅返回本次请求 `cacheHits` / `retries`
- [x] 新增 `playlistId` 模式
- [x] 歌单模式返回 `meta.playlist`
- [x] 歌单模式保留原始歌单顺序

### C2. 统一错误模型
- [x] 缺少参数时返回统一错误结构
- [x] 上游失败时返回统一错误结构
- [x] 限流时返回统一错误结构
- [x] 内部异常时返回统一错误结构
- [x] 错误结构统一包含：`error` / `code` / `requestId`

### C3. 请求级统计替代全局统计暴露
- [x] 仅统计当前请求的耗时
- [x] 仅统计当前请求歌曲数
- [x] 仅统计当前请求重试次数
- [x] 不再向前端暴露全局累计指标

---

# 第二阶段：结构优化，部分完成

## D. `pages/api/meting.js`

### D1. 移除定时器式逻辑
- [x] 删除周期性统计输出 `setInterval`
- [x] 删除周期性缓存/限流清理 `setInterval`
- [x] 改为请求进入时懒清理过期项
- [x] 确认无新增 lint 问题

### D2. 抽离缓存层
- [x] 提取缓存读写逻辑到独立模块
- [x] 统一缓存 key 规则
- [x] 统一 TTL 管理
- [x] 保持当前内存缓存行为不变，先做抽象
- [x] 增加 provider 工厂入口，已支持 `memory / redis / upstash / kv`（`upstash / kv` 通过 REST 兼容层接入）


### D3. 抽离限流层
- [x] 提取 IP 限流逻辑到独立模块
- [x] 提取上游限流逻辑到独立模块
- [x] 保留现有响应头输出能力
- [x] 为后续迁移 Redis/KV 做接口抽象
- [x] 增加 provider 工厂入口，已支持 `memory / redis / upstash / kv`（`upstash / kv` 通过 REST 兼容层接入）
- [x] 已增加 provider 诊断日志，记录 cache/rate-limit provider fallback 状态



### D4. 保留并强化并发去重
- [x] 保留 `pendingRequests`
- [x] 补单测验证同 key 并发请求只打一次上游
- [x] 补单测验证 Promise 失败后正确释放

### D5. 接入 AudioMeta 归档音频优先
- [x] `/api/meting` 已接入 `lib/server/audioMeta.js`
- [x] 优先按 `trackId` 匹配归档条目，未命中再回退 `audioKey`
- [x] 命中 `ArchivedAudioUrl / StableAudioUrl` 时优先替换 `track.url`
- [x] 将归档匹配结果写入 `track.meta.audioArchive`
- [x] 已补充定向测试与请求级统计字段，相关 Jest 回归已恢复通过（`/api/meting` 11/11）
- [x] 已增强真实运行诊断：脚本现在会输出来源类型，并在仅命中 Notion 临时文件且缺少真实 `TrackId` 时直接告警，便于识别无法通过 `/api/meting` 回退刷新的记录
- [x] 已确认当前正确方向：前端播放器与离线归档脚本统一复用 `/api/meting` 作为解析层，不再让前端直接依赖第三方临时音源
- [x] 已补 `playlistId` 归档脚本入口并完成本地验证，确认歌单场景可以先经 `/api/meting?playlistId=...` 再逐曲归档
- [x] 已将 `lib/server/audioMeta.js` 扩展为同时读取 `AudioMeta DB + Archive DB`，使 `/api/meting` 可以消费独立归档库中的稳定地址
- [-] 当前真实联调结论：前端链路方向正确、歌单模式已可播放，但 `403` 仍容易出现；根因不是前端入口错误，而是当前歌单大部分曲目尚未在 `Archive DB` 命中稳定归档记录，接口仍会回退到上游临时直链
- [ ] 继续批量归档当前歌单曲目到 `Archive DB`，并再次验证 `meta.audioArchiveMatched` 是否明显提升
- [ ] 对 `雨后青花` 等历史样本补齐真实 `TrackId` 或稳定源地址，避免仅靠 `file.notion.so` 临时链接







---

## E. `lib/server/*` 公共服务层

### E1. `lib/server/apiResponse.js`
- [x] 封装成功响应
- [x] 封装错误响应
- [ ] 支持自动挂载 `requestId`
- [ ] 支持统一设置响应头

### E2. `lib/server/cache.js`
- [x] 封装内存缓存读写
- [x] 封装 TTL 判断
- [x] 预留 Redis / KV 适配接口

### E3. `lib/server/rateLimit.js`
- [x] 封装 IP 限流能力
- [x] 封装上游限流能力
- [x] 封装 `Retry-After` 与 `X-RateLimit-*` 头部设置


### E4. `lib/server/logger.js`
- [x] 统一开发环境日志
- [x] 统一生产环境日志
- [x] 支持日志级别控制

---

# 第三阶段：页面层与配置层优化

## F. `components/NotionPage.js`
- [x] 提取 `convertAudios` 为独立函数或 Hook
- [x] 分离“拉元数据”和“扫描 DOM”职责
- [x] 分离“匹配 key”和“挂载组件”职责
- [x] `audio-meta` 失败时增加更清晰日志
- [x] 为按需查询元数据预留接口

## G. `components/DynamicIslandPlayer.js`
- [x] 读取 `window.__APPLAYER_META__`
- [x] 支持识别 `remote` / `fallback`
- [x] 增加可选调试提示入口

## H. `components/InlineIslandAudio.js`
- [x] 强化默认标题/封面/歌手兜底
- [x] 检查事件绑定解绑是否成对
- [x] 验证多次挂载/卸载场景

## I. `conf/widget.config.js`
- [x] 增加 API 策略配置项
- [x] 将硬编码策略迁移到配置层
- [x] 为不同部署环境预留调优空间

## J. `blog.config.js`
- [x] 统一配置来源说明
- [x] 补充播放器 API 配置注释

---

# 第四阶段：基础设施升级

## K. 缓存与限流迁移
- [-] 已完成 `Redis / Upstash / KV` 方案抽象与 provider 接入，后续以真实环境联调为主
- [-] 已将 `/api/meting` 缓存迁移到共享存储抽象
- [-] 已将 `/api/audio-meta` 缓存迁移到共享存储抽象
- [-] 已将 IP 限流迁移到共享存储抽象
- [-] 已将上游限流迁移到共享存储抽象
- [x] 已补 `upstash / kv` 环境变量成对校验
- [x] 已补 REST provider 更细粒度可用性原因输出（缺 URL / 缺 Token / 缺完整配置）



## M. 自动归档任务化（新增）

### M1. 明确自动化边界
- [x] 已确认不能由前端直接执行 COS 上传 / Notion 写库 / 删除修改记录
- [x] 已确认前端只负责“检测与触发”，真正归档必须在服务端任务中执行
- [x] 已确认前端、归档任务、后台巡检都应统一复用 `/api/meting` 解析层

### M2. 调度入口设计
- [x] 新增内部调度入口（如 `POST /api/archive/schedule`）
- [x] 支持按 `playlistId` / `trackId` / `songUrl` 上报待归档任务
- [x] 对重复触发做幂等去重，避免同一曲目被重复归档
- [x] 区分触发原因：初始化缺归档 / 播放 `403` / 手动强制刷新 / 定时巡检

### M3. 执行器与归档核心抽离
- [x] 已新增 `lib/server/archiveExecutor.js`，统一归档任务参数归一化与模式判定
- [x] `/api/archive/schedule` 已改为复用共享执行入口，并补充定向测试
- [ ] 将原离线脚本中的完整归档实现继续下沉到共享服务层，彻底移除对脚本入口的依赖
- [ ] 统一归档状态流转：`pending -> archiving -> archived / failed / stale`
- [ ] 统一失败重试与错误记录字段

### M4. 前端协同而非直接归档
- [x] `components/Player.js` 在检测到歌单未命中归档或播放 `403` 时，仅上报调度请求，不直接执行归档
- [x] 增加最小去抖/节流，避免同一会话内重复上报
- [x] 保持前端播放链路不被后台归档阻塞

### M5. 自动更新 / 删除 / 修改策略
- [ ] 自动新增：歌单出现新曲目时自动补归档
- [ ] 自动更新：已归档记录失效、失败或元数据变化时自动刷新
- [ ] 自动删除先采用软删除/失效标记，不直接物理删除 COS 文件
- [ ] 自动修改统一回写 `ArchiveDB` 字段：标题、歌手、专辑、状态、错误、存储键、文件大小等

### M5.1 手动归档补充池（新增）
- [x] 已明确 `ArchiveDB` 中“仅归档映射”和“进入全局播放器补充池”两类记录边界
- [x] 已为手动归档记录增加 `InGlobalPlayer / AddToPlaylist` 布尔字段兼容读取
- [x] 已支持 `PlaylistOrder` 字段控制补充曲目顺序
- [x] `/api/meting?playlistId=...` 已先返回歌单曲目，再合并 `ArchiveDB` 中允许进入全局播放器的补充曲目
- [x] 已按 `trackId / audioKey / url` 去重，重复项优先保留歌单项，仅使用归档稳定地址与元数据覆盖展示字段
- [x] 已明确 `AudioMeta DB` 仍只承担元数据/映射职责，不直接作为全局播放器列表来源
- [x] 已支持手动归档补充曲目按 `AudioKey` 回查 `AudioMeta DB`，补全歌词 / 封面 / 标题 / 歌手等展示元数据，同时继续优先保留 `ArchiveDB` 稳定音源地址
- [x] 已将 `AudioMeta DB / ArchiveDB` 的推荐字段规范、职责边界、优先收敛字段与迁移顺序整理到分析文档，便于后续按表收敛 Notion 字段命名

### M6. 定时巡检与兜底
- [ ] 增加服务端巡检任务，定时比对 `playlistId` 与 `ArchiveDB` 覆盖率
- [ ] 定时补齐缺失归档，降低必须依赖前端访问才能触发的问题
- [ ] 巡检后输出覆盖率指标，如 `audioArchiveMatched / total`

---



## L. `__tests__/*`

### L1. `/api/meting`
- [x] 缺少 `url` 参数返回 400
- [x] IP 限流返回 429
- [x] 上游失败时触发重试
- [x] 缓存命中时不重复请求上游
- [x] 并发请求时只发一次上游请求
- [x] 全部失败时返回 502
- [x] `playlistId` 成功解析并补全曲目
- [x] 歌单模式保持原始顺序
- [x] 歌单详情失败或空歌单时返回明确错误
- [x] provider 诊断日志改造后回归通过（10/10）
- [x] 共享 provider 环境校验 / 可用性原因改造后基础回归通过
- [x] `MUSIC_PLAYER_DEBUG_BADGE` 开启时输出 provider 调试响应头并通过定向测试

### L2. `/api/audio-meta`
- [x] 缺少 Token 时返回预期错误状态码
- [x] Notion 非 2xx 时返回 502
- [x] 缓存命中时不重复请求 Notion
- [x] 并发请求时复用同一个 Promise
- [x] 分页数据可以完整聚合
- [x] 空数据场景返回正常结果
- [x] 数据库 ID 缺失时返回 500
- [x] provider 诊断日志改造后回归通过（8/8）
- [x] 共享 provider 环境校验 / 可用性原因改造后基础回归通过
- [x] `MUSIC_PLAYER_DEBUG_BADGE` 开启时输出 provider 调试响应头并通过定向测试

### 当前联调环境状态
- [ ] `REDIS_URL`（当前缺失）
- [x] `UPSTASH_REDIS_REST_URL`（本地与线上已验证生效）
- [x] `UPSTASH_REDIS_REST_TOKEN`（本地与线上已验证生效）
- [ ] `KV_REST_API_URL`（当前缺失）
- [ ] `KV_REST_API_TOKEN`（当前缺失）
- [x] 已完成联调前可观测性准备：provider 诊断日志 + 调试响应头 + 定向测试
- [x] 已完成 `upstash` 本地联调验证（`/api/meting` 与 `/api/audio-meta` 均为 `Active: upstash`）
- [x] 已完成 `rhzhz.cn` 线上联调验证（缓存与限流均为 `upstash`，且 `Fallback: false`）
- [x] 已完成本地前端联调验证：播放器实际走 `playlistId` 模式，请求 `/api/meting?playlistId=17814924409`，且页面可以正常播放
- [x] 已完成本地脚本联调验证：`scripts/archive-audio-to-notion-standalone.js --playlistId 17814924409 --dry-run --limit 2` 能正确返回歌单曲目
- [-] 已完成 ArchiveDB 接线，但当前歌单接口返回的 `meta.audioArchiveMatched` 仍为 `0`，说明稳定归档资产覆盖率仍不足
- [x] 已完成 `/api/meting` 补充池合并实现与定向测试：手动归档曲目可在 `playlistId` 模式下追加进入全局播放器结果，并按 `trackId / audioKey / url` 去重
- [ ] 仍需做一次真实 `ArchiveDB` 数据联调，确认前端全局播放器最终展示顺序与数据库字段命名一致
- [ ] 如需继续扩展，再补 `redis` 或 `kv` provider 真实联调

---

# 当前建议的下一步

优先继续这三项：

1. 先批量归档当前播放器歌单到 `Archive DB`，让 `/api/meting` 尽量返回 COS 稳定地址，而不是上游临时直链
2. 归档后再次验证 `/api/meting?playlistId=17814924409&forceRefresh=1` 的 `meta.audioArchiveMatched`
3. 再视需要补 `upstash / kv` 真实环境联调与可用性验证
