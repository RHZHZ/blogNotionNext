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
- [ ] 增加缓存元信息（可选）

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



---

# 测试任务

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
- [ ] `UPSTASH_REDIS_REST_URL`（当前缺失）
- [ ] `UPSTASH_REDIS_REST_TOKEN`（当前缺失）
- [ ] `KV_REST_API_URL`（当前缺失）
- [ ] `KV_REST_API_TOKEN`（当前缺失）
- [x] 已完成联调前可观测性准备：provider 诊断日志 + 调试响应头 + 定向测试
- [ ] 待补齐任一共享 provider 所需环境后再进入真实联调

---

# 当前建议的下一步

优先继续这三项：

1. 优先补 `upstash / kv` 真实环境联调与可用性验证
2. 视需要为 `au