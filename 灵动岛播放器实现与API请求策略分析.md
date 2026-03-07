# 灵动岛播放器实现与 API 请求策略分析

## 一、整体实现概览

当前项目中的“灵动岛播放器”采用的是 **`APlayer` 音频内核 + 自定义灵动岛 UI 外壳** 的架构。

核心链路如下：

- `components/ExternalPlugins.js`
  - 全局插件入口
  - 当 `MUSIC_PLAYER` 开启时，同时挂载：
    - `MusicPlayer`
    - `DynamicIslandPlayer`
- `components/Player.js`
  - 加载 `APlayer`
  - 请求 `/api/meting`
  - 创建全局播放器实例 `window.__APPLAYER__`
- `components/DynamicIslandPlayer.js`
  - 订阅 `APlayer` 事件
  - 渲染悬浮灵动岛 UI
  - 同步播放状态、进度、歌词弹幕
- `components/InlineIslandAudio.js`
  - 文章内嵌音频卡片
  - 与全局 `APlayer` 联动
- `components/NotionPage.js`
  - 将 Notion 音频块转成 `InlineIslandAudio`
  - 请求 `/api/audio-meta` 补充音频元数据
- `pages/api/meting.js`
  - 歌曲/歌单代理 API
- `pages/api/audio-meta.js`
  - 音频元数据代理 API
- `conf/widget.config.js`
  - 播放器功能与 API 配置

---

## 二、播放器实现逻辑

### 1. 全局接入点

在 `components/ExternalPlugins.js` 中，播放器通过插件系统挂载：

```jsx
{MUSIC_PLAYER && (
  <>
    <MusicPlayer />
    <DynamicIslandPlayer />
  </>
)}
```

说明：

- `MusicPlayer` 负责音频播放内核
- `DynamicIslandPlayer` 负责界面显示
- UI 与播放内核解耦

---

### 2. 音频内核：`components/Player.js`

`Player.js` 的主要职责：

1. 动态加载 `APlayer` 的 JS/CSS
2. 通过 `/api/meting` 拉取音频列表
3. 初始化 `window.APlayer`
4. 将实例挂到 `window.__APPLAYER__`
5. 隐藏原生 `APlayer` UI，仅保留播放能力

关键特点：

- 前端不直接访问第三方音乐接口
- 请求失败时回退到 `MUSIC_PLAYER_AUDIO_LIST`
- 实际页面可见的播放器样式来自自定义灵动岛组件，而不是 `APlayer` 默认界面

---

### 3. 灵动岛悬浮播放器：`components/DynamicIslandPlayer.js`

该组件不创建播放器，而是：

1. 轮询等待 `window.__APPLAYER__`
2. 拿到实例后订阅播放器事件
3. 同步以下状态：
   - 当前歌曲信息
   - 播放/暂停状态
   - 加载状态
   - 错误状态
   - 当前进度与总时长
   - 是否显示歌词弹幕
4. 渲染展开/收起的灵动岛界面

主要状态包括：

- `expanded`
- `isPlaying`
- `isLoading`
- `isError`
- `track`
- `progress`
- `showLrc`
- `danmakus`

监听的核心事件包括：

- `play`
- `pause`
- `ended`
- `timeupdate`
- `listswitch`
- `waiting`
- `canplay`
- `loadstart`
- `loadeddata`
- `error`

说明：

- 这是一个典型的“事件驱动 UI”
- `APlayer` 是状态源
- `DynamicIslandPlayer` 是状态镜像与视觉层

---

### 4. 歌词与弹幕逻辑

`DynamicIslandPlayer.js` 中实现了：

- `parseLrc(lrcStr)`：解析 LRC 歌词
- `measureDanmakuWidth(text)`：测量弹幕宽度
- `pickDanmakuLane(textWidth)`：分配弹幕轨道，避免重叠
- 在 `timeupdate` 过程中推进歌词并生成弹幕

特点：

- 歌词不是传统逐行显示，而是“弹幕式滚动歌词”
- 使用多轨道策略减少碰撞
- 当前歌曲变化时会重新解析歌词

这部分是播放器 UI 的特色增强功能。

---

### 5. 文章内音频卡片：`components/InlineIslandAudio.js`

该组件负责文章中的音频块展示与交互。

它并不是独立播放器，而是全局播放器的一个“控制入口”：

- 当前音频正在播放：点击切换播放/暂停
- 当前音频已在播放列表：切换到对应曲目
- 当前音频不在列表中：动态加入 `APlayer` 列表后播放

说明：

- 文章中的音频块与悬浮灵动岛共用一个全局播放队列
- 所有播放状态都统一归 `window.__APPLAYER__` 管理

---

### 6. Notion 页面中的音频接入：`components/NotionPage.js`

文章音频接入有两条链路：

#### 6.1 `NotionRenderer` 组件映射

直接把 `Audio` block 映射成 `InlineIslandAudio`。

#### 6.2 DOM 扫描增强

页面加载后：

1. 扫描 `.notion-audio:not(.island-converted)`
2. 读取其中的 `<audio>` URL
3. 通过 `/api/audio-meta` 获取元数据
4. 隐藏原生 `<audio>`
5. 手动挂载 `InlineIslandAudio`

这样做的结果是：

- Notion 原生音频块被统一替换为项目自定义的灵动岛风格卡片
- 可附加封面、歌词、歌手、专辑等扩展信息

---

## 三、配置层

播放器相关配置集中在 `conf/widget.config.js`，包括：

- `MUSIC_PLAYER`
- `MUSIC_PLAYER_VISIBLE`
- `MUSIC_PLAYER_AUTO_PLAY`
- `MUSIC_PLAYER_LRC_TYPE`
- `MUSIC_PLAYER_AUDIO_LIST`
- `MUSIC_PLAYER_METING`
- `MUSIC_PLAYER_METING_ID`
- `MUSIC_PLAYER_METING_API`
- `MUSIC_PLAYER_ARTICLE_AUDIO_CONVERT`
- `MUSIC_PLAYER_ARTICLE_META_ENABLE`
- `MUSIC_PLAYER_ARTICLE_META_DB_ID`
- `MUSIC_PLAYER_ARTICLE_DEFAULT_COVER`
- `MUSIC_PLAYER_ARTICLE_DEFAULT_ARTIST`

说明：

- 全局播放器与文章音频增强都可以通过配置项独立控制
- 支持本地歌单与远程 Meting API 两种来源

---

## 四、API 请求策略总览

当前项目 API 请求主要分为两条链路：

1. `GET /api/meting`
   - 负责全局音乐播放器的歌单/歌曲代理
2. `GET /api/audio-meta`
   - 负责文章音频的元数据代理

两者定位不同：

- `/api/meting`：偏“高容错的音乐代理层”
- `/api/audio-meta`：偏“轻量内容缓存层”

---

## 五、`/api/meting` 请求策略分析

### 1. 前端请求入口

`components/Player.js` 初始化播放器时，会请求：

- `MUSIC_PLAYER_METING_API`
- 默认值：`/api/meting?url=:id`

特点：

- 前端只请求博客自身 API
- 不直接访问第三方音乐服务
- 接口失败时会回退到本地静态列表

---

### 2. 多级缓存策略

#### 2.1 服务端内存缓存

`pages/api/meting.js` 顶部定义：

- `cache = new Map()`
- `CACHE_TTL = 24 * 60 * 60 * 1000`

即：

- 服务端进程内缓存 24 小时
- 缓存维度按歌曲 ID / level / type 区分
- 命中缓存时避免重复请求上游音乐接口

#### 2.2 并发去重

还定义了：

- `pendingRequests = new Map()`

含义：

- 同一首歌曲如果在同一时间被多个请求命中，只会发起一次上游请求
- 其余请求复用这次进行中的 Promise
- 可以避免高并发下的“重复击穿”问题

---

### 3. 客户端 IP 限流

`pages/api/meting.js` 对客户端请求做了前置限流：

- 每分钟最多 60 次请求
- 单秒突发最多 10 次请求

特点：

- 限流对象是客户端 IP
- 超限后直接返回 `429`
- 响应头包含 `Retry-After`

这是一层典型的防滥用保护。

---

### 4. 上游请求限流

除了客户端限流，还对第三方音乐 API 做了“上游限流”：

- 每分钟最多 30 次上游请求
- 超限后不会立刻失败，而是等待后重试

特点：

- 保护第三方源站
- 降低被封禁或拉黑的风险
- 与客户端限流形成双层保护

也就是说：

- 对用户是“超限拒绝”
- 对上游是“节流排队”

---

### 5. 重试机制

`/api/meting` 实现了较完整的重试策略：

#### 5.1 重试次数

- 最大重试次数：3 次

#### 5.2 可重试错误类型

包括：

- `ECONNRESET`
- `ETIMEDOUT`
- `ENOTFOUND`
- `ECONNREFUSED`
- `EAI_AGAIN`
- `AbortError`

以及 HTTP 状态码：

- `408`
- `429`
- `500`
- `502`
- `503`
- `504`
- `403`

#### 5.3 指数退避

重试采用：

- 基础延迟 1 秒
- 指数退避倍数 2
- 最大延迟 10 秒
- 增加随机抖动

优点：

- 避免短时间内大量重复重试
- 降低“惊群效应”
- 提高上游接口不稳定时的恢复成功率

---

### 6. 超时控制

`fetchTrack` 中使用 `AbortController` 做超时控制：

- 初次请求超时较短
- 重试次数越高，超时时间越长
- 最大超时 10 秒

这样做的效果是：

- 正常情况尽快返回
- 网络波动时给重试更多容错空间

---

### 7. 批量请求策略

`url` 参数支持逗号分隔多个歌曲 ID。

这意味着：

- 前端只需要请求一次 `/api/meting`
- 后端可以对多首歌曲做聚合处理
- 减少浏览器端请求数量
- 更适合初始化全局歌单

这也是项目里播放器启动时只打一跳接口的原因。

---

### 8. 数据标准化策略

`/api/meting` 会把上游返回的数据统一整理成播放器可直接消费的结构：

- `name`
- `artist`
- `url`
- `cover`
- `lrc`

此外还会：

- 将 `http://` 音频地址升级为 `https://`
- 附带抓取尝试次数等 meta 信息

优点：

- 前端不需要理解第三方 API 的原始格式
- 降低混合内容风险
- 保证 `APlayer` 初始化数据结构统一

---

### 9. 前端请求时机

`/api/meting` 一般只在播放器初始化时请求一次：

- 页面首次挂载 `Player.js`
- 创建 `APlayer` 前拉取歌单
- 后续切歌在本地播放列表中进行，不会反复请求 API

所以它更偏“启动加载型 API”，而不是“高频交互型 API”。

---

## 六、`/api/audio-meta` 请求策略分析

### 1. 数据来源

`pages/api/audio-meta.js` 的数据源是 Notion 数据库，而不是音乐平台。

它会：

1. 读取 `NOTION_ACCESS_TOKEN`
2. 请求指定的 Notion 数据库
3. 只筛选 `Enabled = true` 的记录
4. 把结果转换成 `metaMap`

用途是给文章音频块补全：

- 标题
- 歌手
- 专辑
- 封面
- 歌词

---

### 2. 页面级一次请求

`components/NotionPage.js` 在转换文章音频时，会先请求一次 `/api/audio-meta`：

- 不是每个音频块单独请求
- 而是一次请求拿到整张元数据映射表

优点：

- 避免 N+1 请求问题
- 同一文章中多个音频块不会重复拉取元数据
- 更适合内容页面场景

---

### 3. 缓存策略

`pages/api/audio-meta.js` 使用了轻量缓存：

- 进程内缓存 `cache.data`
- TTL = 10 分钟
- 响应头 `Cache-Control: public, s-maxage=600`

这意味着：

- 服务端 10 分钟内不再重复查询 Notion
- CDN/边缘层可缓存 10 分钟
- 元数据更新不会实时生效，但延迟是可接受的

---

### 4. Key 映射策略

后端会把音频 URL 规范化为“文件名 key”：

- 去掉 query 参数
- 提取 URL 末尾文件名
- 支持 `decodeURIComponent`

前端在 `NotionPage.js` 里也是按同样规则提取 key，然后在 `metaMap` 中查找。

这套策略的意义是：

- 前后端都不需要保存复杂 ID 映射
- 只要音频文件名一致，就能自动对上元数据
- 查找复杂度低，适合页面渲染时批量匹配

---

### 5. 容错策略

`/api/audio-meta` 的错误处理偏“弱失败”：

- 如果缺少 Token，返回 `{}`
- 如果 Notion 查询失败，返回 `{}`
- HTTP 层通常仍返回 `200`

优点：

- 不会阻塞文章页面渲染
- 即使元数据服务异常，文章音频仍可显示基础卡片

缺点：

- 前端不容易区分“没有元数据”和“接口异常”
- 监控上会弱化错误感知

---

### 6. 前端请求时机

`/api/audio-meta` 的调用时机是：

- 文章页渲染后
- 延迟一段时间执行音频转换逻辑
- 文章切换时重新触发

因此它属于“页面增强型 API”。

---

## 七、当前 API 策略的优势

### `/api/meting` 的优势

- 前端只打一跳，隐藏第三方音乐源
- 支持批量聚合请求
- 24 小时内存缓存降低上游压力
- 并发去重避免缓存击穿
- 客户端 IP 限流防滥用
- 上游限流保护第三方接口
- 超时控制 + 指数退避重试，稳定性较高
- 自动标准化返回结构
- 自动把音频地址升级为 HTTPS
- 前端失败时可回退本地歌单

### `/api/audio-meta` 的优势

- 一次请求拿全量元数据，避免逐条查询
- 10 分钟缓存适合内容型页面
- 与文章音频文件名映射简单直接
- 异常时返回空对象，不阻塞页面
- 非核心功能失败不会影响主链路播放

---

## 八、当前 API 策略的局限与风险

### 1. 进程内缓存的局限

两个接口都主要依赖进程内缓存，这意味着：

- 只对当前 Node 实例有效
- 多实例部署时缓存不共享
- Serverless 冷启动后缓存丢失
- 统计信息与限流状态也不是全局一致的

所以更适合：

- 单实例 Node 服务
- 或对缓存一致性要求不高的部署方式

---

### 2. `/api/meting` 的状态管理较重

它内部维护了：

- 缓存 Map
- 进行中请求 Map
- IP 限流状态
- 上游限流状态
- 周期性清理任务
- 周期性统计输出

在长期运行的单进程服务里问题不大；但在 Serverless 环境中，这些状态和定时器的收益会明显下降。

---

### 3. `/api/audio-meta` 的错误语义较弱

接口失败时仍返回 `200 + {}``，这样虽然页面更稳，但也会带来：

- 难以区分“无数据”与“请求失败”
- 调试和监控时不够明确

---

## 九、最终结论

### 1. 播放器实现层面

当前项目的灵动岛播放器并不是自研音频播放引擎，而是：

- 以 `APlayer` 作为播放内核
- 通过 `window.__APPLAYER__` 做全局共享实例
- 用 `DynamicIslandPlayer` 实现悬浮灵动岛 UI
- 用 `InlineIslandAudio` 把文章内音频接入同一个播放队列
- 用 LRC 解析 + 弹幕歌词增强交互体验

### 2. API 层面

#### `/api/meting`

定位是“高容错音乐代理层”：

- 一次请求聚合歌单
- 24 小时缓存
- 并发去重
- 双层限流
- 超时控制
- 指数退避重试
- 数据标准化
- 前端失败回退

#### `/api/audio-meta`

定位是“轻量内容增强层”：

- 页面级一次请求
- Notion 数据库转字典映射
- 10 分钟缓存
- 异常返回空对象
- 不阻塞页面主功能

整体来看，这是一套 **“播放主链路重稳定性、内容增强链路重容错性”** 的实现方案。

---

## 十、补充：仓库内多版本关系

仓库中与灵动岛播放器相关的实现存在多个版本：

- `components/*`
  - 当前主项目实际接入版本
- `DynamicIslandPlayer/*`
  - 面向 NotionNext 的提取安装版
- `UniversalDynamicIslandPlayer/*`
  - 跨框架通用版（Vanilla / React / Vue）
- `*.zip`
  - 对应分发压缩包


---

## 十一、自动归档方向补充结论

基于当前联调结果，可以明确后续“全自动归档”的正确方向不是让前端直接执行归档，而是采用 **前端检测 + 服务端调度 + 后台执行** 的任务化结构。

### 1. 为什么不能由前端直接归档

前端虽然最先感知到：

- 当前歌单未命中稳定归档
- 实际播放中出现 `403`
- `meta.audioArchiveMatched` 偏低

但前端不适合直接执行以下动作：

- 下载音频文件
- 上传 COS
- 写入 / 更新 / 删除 `ArchiveDB`
- 持有 Notion / COS 写权限

因此，前端应只承担“检测问题并上报任务”的职责，而不承担真正的归档写入。

### 2. 正确的自动归档链路

推荐统一为三层：

1. **前端检测层**
   - `components/Player.js` 在检测到低覆盖率或播放 `403` 时，仅上报调度请求
2. **服务端调度层**
   - 新增内部接口（如 `POST /api/archive/schedule`）负责去重、幂等与入队
3. **后台执行层**
   - 复用现有归档逻辑，通过 `/api/meting` 解析后下载音频、上传 COS、写入 `ArchiveDB`

### 3. 为什么当前仍会频繁 `403`

当前前端链路已经正确：

- 播放器会优先请求 `/api/meting?playlistId=...`
- `/api/meting` 已支持优先使用归档地址
- `lib/server/audioMeta.js` 已可聚合 `AudioMeta DB + Archive DB`

但真实联调中，当前歌单的 `meta.audioArchiveMatched` 仍偏低，这意味着：

- 很多曲目尚未在 `ArchiveDB` 中存在稳定归档记录
- `/api/meting` 仍会回退到第三方临时直链
- 临时直链过期后就容易在前端播放阶段触发 `403`

所以后续重点不应再是反复改前端入口，而应转向：

- 自动补齐归档覆盖率
- 自动刷新失效曲目
- 自动巡检歌单稳定率

### 4. 后续自动化目标

自动化目标建议拆为四类：

- **自动新增**：歌单出现新曲目时自动归档
- **自动更新**：稳定链接缺失、失效、失败时自动刷新
- **自动删除/失效**：长期不在歌单或长期不可用的资产打 `stale` 标记
- **自动巡检**：周期性统计歌单归档覆盖率，并补齐缺失曲目

### 5. 与当前仓库结构的关系

当前仓库内：

- `components/*` 是真实运行主链路
- `scripts/archive-audio-to-notion-standalone.js` 是当前可用的离线归档入口
- 下一步应将脚本中的归档核心抽离到 `lib/server/*`，供 API、脚本、定时任务三方复用

### 6. 手动归档补充池的当前实现结论

在当前这轮实现后，`ArchiveDB` 已不再只是“稳定地址映射库”，还可以作为 **歌单之外的补充音源池**。

当前已落地的规则是：

- 全局播放器默认列表仍以 `/api/meting?playlistId=...` 返回的歌单曲目为主
- `ArchiveDB` 中被标记为允许进入全局播放器的记录，会在 `playlistId` 模式下追加合并到返回结果里
- 当前兼容字段名：
  - `InGlobalPlayer`
  - `AddToPlaylist`
  - `AddToGlobalPlayer`
  - `GlobalPlayerEnabled`
- 当前排序字段：
  - `PlaylistOrder`
- 合并时会按 `trackId / audioKey / url` 去重
- 若手动归档曲目与歌单曲目重复，则优先保留歌单项，只用归档稳定地址和元数据覆盖展示字段

这意味着当前最推荐的数据库字段规范已经基本明确为：

1. `InGlobalPlayer`
   - 类型：Checkbox
   - 作用：是否允许该手动归档曲目进入全局播放器补充池
2. `PlaylistOrder`
   - 类型：Number
   - 作用：控制补充曲目在歌单主列表之后的顺序

而 `AudioMeta DB` 的职责仍应保持不变：

- 只承担文章音频元数据补全与归档地址映射
- 不直接作为全局播放器列表来源

### 6.1 推荐的两张表字段规范（新增整理）

为了降低后续维护成本，建议将两张 Notion 表的职责进一步收敛为：

- `AudioMeta DB`：只负责元数据
- `ArchiveDB`：只负责稳定音源、归档状态与全局播放器补充池

#### A. `AudioMeta DB` 推荐字段

用途：为文章音频、手动归档曲目、补充池曲目提供展示信息补全。

推荐保留字段：

1. `Enabled`
   - 类型：Checkbox
   - 作用：是否启用该条元数据参与匹配
2. `TrackId`
   - 类型：Text
   - 作用：歌曲唯一 ID，优先匹配键
3. `SourceAudioUrl`
   - 类型：URL
   - 作用：原始音源地址，用于生成 `AudioKey`
4. `Name`
   - 类型：Title / Text
   - 作用：标题
5. `Artist`
   - 类型：Text
   - 作用：歌手
6. `Album`
   - 类型：Text
   - 作用：专辑
7. `Cover`
   - 类型：URL / Files
   - 作用：封面
8. `Lyrics`
   - 类型：Text
   - 作用：歌词
9. `Remark`
   - 类型：Text
   - 作用：备注，可选

职责说明：

- 负责标题 / 歌手 / 专辑 / 封面 / 歌词等展示元数据
- 可通过 `TrackId` 或 `SourceAudioUrl -> AudioKey` 为手动归档曲目补全展示信息
- 不负责稳定归档地址
- 不负责控制是否进入全局播放器

建议逐步废弃的历史别名：

- `AudioUrl`
- `OriginalSourceUrl`
- `OriginAudioUrl`
- `Lrc`

长期建议统一到：

- `SourceAudioUrl`
- `Lyrics`

#### B. `ArchiveDB` 推荐字段

用途：保存稳定音源、归档状态，以及是否进入全局播放器补充池。

推荐保留字段：

1. `TrackId`
   - 类型：Text
   - 作用：歌曲唯一 ID，优先匹配键
2. `SourceAudioUrl`
   - 类型：URL
   - 作用：原始音源地址
3. `ArchivedAudioUrl`
   - 类型：URL / Files
   - 作用：归档后的稳定地址
4. `ArchiveStatus`
   - 类型：Select / Status
   - 作用：建议统一为 `pending / archived / failed / stale`
5. `Name`
   - 类型：Title / Text
   - 作用：标题
6. `Artist`
   - 类型：Text
   - 作用：歌手
7. `Album`
   - 类型：Text
   - 作用：专辑
8. `Cover`
   - 类型：URL / Files
   - 作用：封面
9. `Lyrics`
   - 类型：Text
   - 作用：歌词，可选冗余保存
10. `InGlobalPlayer`
    - 类型：Checkbox
    - 作用：是否进入全局播放器补充池
11. `PlaylistOrder`
    - 类型：Number
    - 作用：补充池排序
12. `StorageKey`
    - 类型：Text
    - 作用：对象存储路径
13. `FileSize`
    - 类型：Number
    - 作用：文件大小
14. `LastArchiveAt`
    - 类型：Date
    - 作用：最近归档时间
15. `LastError`
    - 类型：Text
    - 作用：最近归档错误
16. `Remark`
    - 类型：Text
    - 作用：备注，可选

职责说明：

- 负责为 `/api/meting` 提供稳定音源地址
- 负责记录归档状态与错误
- 负责作为全局播放器补充池来源
- 可以保留部分标题 / 封面 / 歌词副本，但长期建议仍以 `AudioMeta DB` 作为展示元数据主来源

建议逐步废弃的历史别名：

- `StableAudioUrl`
- `AddToPlaylist`
- `AddToGlobalPlayer`
- `GlobalPlayerEnabled`

长期建议统一到：

- `ArchivedAudioUrl`
- `InGlobalPlayer`

#### C. 两张表的匹配优先级

后续建议统一按以下顺序匹配：

1. `TrackId`
2. `SourceAudioUrl` 生成的 `AudioKey`
3. 兜底再看当前 `url`

#### D. 当前最值得优先统一的字段

如果暂时不想一次性调整太多字段，建议先统一以下最关键字段：

- `AudioMeta DB`
  - `SourceAudioUrl`
  - `Lyrics`
- `ArchiveDB`
  - `SourceAudioUrl`
  - `ArchivedAudioUrl`
  - `InGlobalPlayer`
  - `PlaylistOrder`

#### E. 迁移建议

推荐分阶段迁移：

1. 先在两张表中新增标准字段
2. 将旧字段值逐步迁移到标准字段
3. 代码继续兼容历史字段一段时间
4. 最后再废弃旧字段

### 7. 当前已验证结果

当前定向测试已覆盖并通过：

- `playlistId` 模式保持原歌单顺序
- 手动归档补充曲目可被追加到结果中
- 补充曲目与歌单重复时不会重复出现
- `/api/meting` 响应中已增加：
  - `meta.archivePoolEnabled`
  - `meta.archivePoolMerged`

这意味着，后续下一步重点已经从“是否可行”转为：

- 在真实 `ArchiveDB` 中统一字段命名
- 做一次真实接口联调，确认前端全局播放器最终展示结果

这意味着，后续代码落地方向应是：

1. 抽共享归档执行器
2. 新增调度 API
3. 前端只做任务上报
4. 再补后台巡检入口
