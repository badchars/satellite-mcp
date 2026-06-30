<p align="center">
  <a href="../../README.md">English</a> |
  <strong>简体中文</strong> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.pt-BR.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.el.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.hi.md">हिन्दी</a>
</p>

<p align="center">
  <br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/badchars/satellite-mcp/main/.github/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/badchars/satellite-mcp/main/.github/banner-light.svg">
    <img alt="satellite-mcp" src="https://raw.githubusercontent.com/badchars/satellite-mcp/main/.github/banner-dark.svg" width="700">
  </picture>
</p>

<h3 align="center">面向 AI 智能体的全频谱地理空间情报。</h3>

<p align="center">
  卫星影像、飞行器追踪、船舶追踪、军事情报、光谱分析、变化检测、冲突监测、环境监测 &mdash; 统一整合至单一 MCP 服务器。<br>
  您的 AI 智能体可<b>按需获取完整的 GEOINT 能力</b>，而非在 27 个浏览器标签页之间手动切换。
</p>

<br>

<p align="center">
  <a href="#问题所在">问题所在</a> &bull;
  <a href="#差异化优势">差异化优势</a> &bull;
  <a href="#快速开始">快速开始</a> &bull;
  <a href="#ai-能力一览">AI 能力一览</a> &bull;
  <a href="#工具参考171-个工具">工具 (171)</a> &bull;
  <a href="#数据源27-个">数据源</a> &bull;
  <a href="#架构">架构</a> &bull;
  <a href="../../CHANGELOG.md">更新日志</a> &bull;
  <a href="../../CONTRIBUTING.md">贡献指南</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/v/satellite-mcp.svg" alt="npm"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <img src="https://img.shields.io/badge/runtime-Bun-f472b6" alt="Bun">
  <img src="https://img.shields.io/badge/protocol-MCP-8b5cf6" alt="MCP">
  <img src="https://img.shields.io/badge/tools-171-ef4444" alt="171 Tools">
  <img src="https://img.shields.io/badge/categories-27-f97316" alt="27 Categories">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/badchars/satellite-mcp/main/.github/demo.gif" alt="satellite-mcp 演示" width="800">
</p>

---

## 问题所在

地理空间情报是每项安全调查和态势感知任务中缺失的一环。卫星影像、飞行器追踪、船舶追踪、军事设施、冲突数据、环境监测、光谱分析、变化检测 &mdash; 您所需的数据分散在数十个平台上，每个平台各有独立的 API、身份认证、速率限制和输出格式。今天，您需要在 Copernicus 上搜索 Sentinel-2 影像，在 USGS 上查询 Landsat 数据，在 OpenSky 上追踪飞行器，在另一个界面上监控船舶，然后花费数小时手动关联所有信息。

```
传统 GEOINT 工作流程：
  搜索卫星影像               ->  Copernicus + USGS（两个独立界面）
  追踪飞行器                 ->  OpenSky Network 网页界面
  追踪船舶                   ->  Global Fishing Watch 网页界面
  监控军事活动               ->  多个独立 OSINT 源
  分析冲突事件               ->  ACLED 网页界面
  检查环境变化               ->  NASA Earthdata + FIRMS（两个界面）
  计算光谱指数               ->  桌面 GIS 软件
  执行变化检测               ->  专用遥感工具
  关联所有数据               ->  复制粘贴到报告中
  ────────────────────────────────
  总计：每次调查 60 分钟以上，绝大部分时间消耗在上下文切换上
```

**satellite-mcp** 通过 [Model Context Protocol](https://modelcontextprotocol.io) 为您的 AI 智能体提供 171 个工具，涵盖 27 个类别的数据源。智能体可并行查询所有数据源，跨平台关联数据，识别模式与异常，并在一次对话中呈现统一的情报图景。

```
使用 satellite-mcp：
  您："分析伊斯坦布尔地区过去 30 天的变化情况"

  智能体：-> sentinel_search: 发现 12 张 Sentinel-2 影像（云覆盖率 < 20%）
          -> firms_active_area: 检测到 3 处活跃火点
          -> quake_recent: 200 公里范围内无重大地震活动
          -> ship_area: 博斯普鲁斯海峡有 847 艘船舶
          -> aircraft_area: 检测到 156 架飞行器
          -> weather_current: 22°C，部分多云，能见度 10 公里
          -> "伊斯坦布尔地区过去 30 天：12 张可用的 Sentinel-2
             影像用于变化分析，检测到 3 处活跃火点（可能为
             农业焚烧），博斯普鲁斯海峡海上交通繁忙。
             无地震活动。建议使用 NDVI 分析
             对农业区域进行植被变化检测。"
```

---

## 差异化优势

现有工具一次只能从单个数据源获取原始数据。satellite-mcp 让您的 AI 智能体能够**同时跨多个地理空间情报域进行推理**。

<table>
<thead>
<tr>
<th></th>
<th>传统方式</th>
<th>satellite-mcp</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>界面</b></td>
<td>27 个不同的网页界面、CLI 和 API</td>
<td>MCP &mdash; AI 智能体通过对话调用工具</td>
</tr>
<tr>
<td><b>数据源</b></td>
<td>一次使用一个平台</td>
<td>27 个类别并行查询</td>
</tr>
<tr>
<td><b>卫星影像</b></td>
<td>分别使用 Copernicus、USGS、Planet 界面</td>
<td>智能体统一搜索 Sentinel-2 + Landsat + Planet 影像</td>
</tr>
<tr>
<td><b>飞行器追踪</b></td>
<td>OpenSky 网页界面手动查询</td>
<td>智能体实时追踪飞行器、检测军用信号、分析航线</td>
</tr>
<tr>
<td><b>船舶追踪</b></td>
<td>多个 AIS 平台分别查询</td>
<td>智能体追踪船舶、识别制裁目标、监控渔业活动</td>
</tr>
<tr>
<td><b>API 密钥</b></td>
<td>几乎所有工具都需要</td>
<td>许多工具免费使用；API 密钥解锁高级数据源</td>
</tr>
<tr>
<td><b>部署</b></td>
<td>逐个安装工具，分别管理配置</td>
<td><code>npx satellite-mcp</code> &mdash; 一条命令，零配置</td>
</tr>
</tbody>
</table>

---

## 快速开始

### 方式 1：npx（无需安装）

```bash
npx satellite-mcp
```

免费工具开箱即用。地震数据、天气、地理编码、光谱分析、变化检测、OpenStreetMap 等无需 API 密钥。

### 方式 2：克隆

```bash
git clone https://github.com/badchars/satellite-mcp.git
cd satellite-mcp
bun install
```

### 环境变量（可选）

```bash
# 卫星影像
export COPERNICUS_CLIENT_ID=your-id         # 启用 Sentinel-2 影像搜索
export COPERNICUS_CLIENT_SECRET=your-secret  # Copernicus OAuth2 密钥
export USGS_USERNAME=your-user               # 启用 Landsat 影像搜索
export USGS_PASSWORD=your-pass               # USGS EarthExplorer 密码
export PLANET_API_KEY=your-key               # 启用 Planet Labs 影像工具

# NASA
export NASA_API_KEY=your-key                 # NASA API（备用：DEMO_KEY）
export NASA_FIRMS_KEY=your-key               # NASA FIRMS 活跃火点数据
export NASA_EARTHDATA_TOKEN=your-token       # NASA Earthdata 令牌

# 追踪
export OPENSKY_USERNAME=your-user            # OpenSky Network（提升速率限制）
export OPENSKY_PASSWORD=your-pass            # OpenSky Network 密码
export GFW_API_KEY=your-key                  # Global Fishing Watch 船舶追踪
export N2YO_API_KEY=your-key                 # N2YO 卫星/空间站追踪

# 情报
export ACLED_API_KEY=your-key                # ACLED 冲突数据
export ACLED_EMAIL=your-email                # ACLED 注册邮箱
export COMTRADE_API_KEY=your-key             # 联合国贸易数据库
export TIMEZONEDB_KEY=your-key               # 时区数据库
```

所有 API 密钥均为可选。未设置时，您仍可使用地震监测、天气查询、地理编码、光谱分析、变化检测、OpenStreetMap、地形分析等众多功能。

### 连接到您的 AI 智能体

<details open>
<summary><b>Claude Code</b></summary>

```bash
# 使用 npx
claude mcp add satellite-mcp -- npx satellite-mcp

# 使用本地克隆
claude mcp add satellite-mcp -- bun run /path/to/satellite-mcp/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

添加到 `~/Library/Application Support/Claude/claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"],
      "env": {
        "COPERNICUS_CLIENT_ID": "optional",
        "COPERNICUS_CLIENT_SECRET": "optional",
        "NASA_API_KEY": "optional",
        "OPENSKY_USERNAME": "optional",
        "PLANET_API_KEY": "optional",
        "ACLED_API_KEY": "optional"
      }
    }
  }
}
```

</details>

<details>
<summary><b>Cursor / Windsurf / 其他 MCP 客户端</b></summary>

使用相同的 JSON 配置格式。将 command 指向 `npx satellite-mcp` 或本地安装路径。

</details>

### 开始查询

```
您："查询伊斯坦布尔周边 50 公里范围内的地震活动和活跃火点"
```

就是这样。智能体自动处理卫星影像搜索、飞行器追踪、船舶追踪、冲突分析等。

---

## AI 能力一览

### 卫星影像分析

```
您："搜索安卡拉 2024 年 3 月的 Sentinel-2 影像"

智能体：-> sentinel_search {bbox: [32.5, 39.7, 33.1, 40.1], date_from: "2024-03-01", date_to: "2024-03-31"}
        -> "找到 8 张 Sentinel-2 影像：
           - 2024-03-28: 云覆盖率 5%（最优）
           - 2024-03-21: 云覆盖率 12%
           - 2024-03-15: 云覆盖率 8%
           可用于 NDVI 植被分析或城市扩展变化检测。"
```

### 飞行器追踪

```
您："伊斯坦布尔上空现在有哪些飞行器？"

智能体：-> aircraft_area {lamin: 40.8, lamax: 41.3, lomin: 28.5, lomax: 29.4}
        -> "检测到 142 架飞行器：
           - 89 架商用航班（THY、Pegasus、AJet 等）
           - 12 架通用航空器
           - 3 架军用信号（未识别型号）
           - 38 架地面状态（阿塔图尔克 / 伊斯坦布尔机场）"
```

### 船舶与海洋追踪

```
您："博斯普鲁斯海峡的船舶活动情况？"

智能体：-> ship_area {lat: 41.1, lon: 29.05, radius: 10}
        -> sanctions_vessel_search {query: "检测到的 MMSI 列表"}
        -> "博斯普鲁斯海峡：847 艘船舶
           - 312 艘货船
           - 89 艘油轮
           - 156 艘客船/渡轮
           - 2 艘船舶匹配制裁筛查名单 — 需进一步调查"
```

---

## 工具参考（171 个工具）

| 类别 | 工具数 | 认证要求 |
|------|--------|---------|
| Sentinel-2 (Copernicus) | 8 | `COPERNICUS_CLIENT_ID` + `COPERNICUS_CLIENT_SECRET` |
| Landsat (USGS) | 7 | `USGS_USERNAME` + `USGS_PASSWORD` |
| NASA FIRMS（活跃火点） | 6 | `NASA_FIRMS_KEY`（可选） |
| NASA 地球观测 | 7 | `NASA_API_KEY`（备用 DEMO_KEY） |
| 夜间灯光 (VIIRS) | 5 | `NASA_EARTHDATA_TOKEN` |
| Planet Labs | 4 | `PLANET_API_KEY` |
| 飞行器情报 | 10 | `OPENSKY_USERNAME`（可选，提升速率） |
| 船舶情报 | 8 | `GFW_API_KEY` |
| 空间与轨道追踪 | 6 | `N2YO_API_KEY` |
| 军事与国防 | 8 | 无需密钥 |
| 冲突与事件 | 6 | `ACLED_API_KEY` + `ACLED_EMAIL` |
| 环境情报 | 6 | 无需密钥 |
| 海洋情报 | 5 | 无需密钥 |
| 地震与灾害 | 5 | 无需密钥 |
| 天气与大气 | 6 | 无需密钥 |
| 地形与海拔 | 6 | 无需密钥 |
| 关键基础设施 | 6 | 无需密钥 |
| 制裁与合规 | 5 | 无需密钥 |
| 网络-地理情报 | 6 | 无需密钥 |
| 人口与人口统计 | 5 | 无需密钥 |
| 农业与粮食安全 | 5 | 无需密钥 |
| 人道主义与难民 | 5 | 无需密钥 |
| 贸易情报 | 5 | `COMTRADE_API_KEY`（可选） |
| OpenStreetMap / Overpass | 8 | 无需密钥 |
| 地理编码与坐标 | 8 | `TIMEZONEDB_KEY`（可选） |
| 光谱分析 | 8 | 无需密钥 |
| 变化检测 | 6 | 无需密钥 |
| Meta | 1 | 无需密钥 |

---

### CLI 用法

```bash
# 列出所有可用工具
npx satellite-mcp --list

# 直接运行任意工具
npx satellite-mcp --tool spectral_ndvi '{"nir":0.8,"red":0.2}'
npx satellite-mcp --tool geo_distance '{"lat1":41.01,"lng1":28.98,"lat2":39.93,"lng2":32.86}'
npx satellite-mcp --tool quake_recent '{"min_magnitude":4.0,"limit":10}'
npx satellite-mcp --tool firms_active_country '{"country":"TR","days":1}'
```

---

## API 密钥参考

| 环境变量 | 数据源 | 说明 |
|---------|--------|------|
| `COPERNICUS_CLIENT_ID` | Copernicus Data Space | Sentinel-2 影像搜索 OAuth2 客户端 ID |
| `COPERNICUS_CLIENT_SECRET` | Copernicus Data Space | Sentinel-2 影像搜索 OAuth2 客户端密钥 |
| `USGS_USERNAME` | USGS EarthExplorer | Landsat 影像搜索用户名 |
| `USGS_PASSWORD` | USGS EarthExplorer | Landsat 影像搜索密码 |
| `NASA_API_KEY` | NASA APIs | NASA API 密钥（未设置时使用 DEMO_KEY） |
| `NASA_FIRMS_KEY` | NASA FIRMS | 活跃火点数据地图密钥 |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | 夜间灯光及高级数据承载令牌 |
| `PLANET_API_KEY` | Planet Labs | 高分辨率影像 API 密钥 |
| `OPENSKY_USERNAME` | OpenSky Network | 飞行器追踪用户名（提升速率限制） |
| `OPENSKY_PASSWORD` | OpenSky Network | 飞行器追踪密码 |
| `GFW_API_KEY` | Global Fishing Watch | 船舶追踪与渔业监测 API 密钥 |
| `N2YO_API_KEY` | N2YO | 卫星与空间站追踪 API 密钥 |
| `ACLED_API_KEY` | ACLED | 冲突事件数据 API 密钥 |
| `ACLED_EMAIL` | ACLED | ACLED 注册邮箱 |
| `COMTRADE_API_KEY` | UN Comtrade | 国际贸易数据 API 密钥 |
| `TIMEZONEDB_KEY` | TimezoneDB | 时区查询 API 密钥 |

---

## 架构

```
src/
  index.ts                # CLI 入口（--help、--list、--tool、stdio 服务器）
  protocol/
    mcp-server.ts         # MCP 服务器设置（stdio 传输）
    tools.ts              # 工具注册 — 全部 171 个工具在此汇聚
  types/
    index.ts              # 共享类型（ToolDef、ToolContext、ToolResult）
  utils/
    rate-limiter.ts       # 按数据源独立限速器
    cache.ts              # API 响应 TTL 缓存
  sentinel/               # Sentinel-2 影像工具 (8)
  landsat/                # Landsat 影像工具 (7)
  firms/                  # NASA FIRMS 火点工具 (6)
  nasa/                   # NASA 地球观测工具 (7)
  nightlights/            # VIIRS 夜间灯光工具 (5)
  planet/                 # Planet Labs 影像工具 (4)
  aircraft/               # 飞行器追踪工具 (10)
  maritime/               # 船舶追踪工具 (8)
  space/                  # 空间追踪工具 (6)
  military/               # 军事情报工具 (8)
  conflict/               # 冲突事件工具 (6)
  environment/            # 环境监测工具 (6)
  ocean/                  # 海洋情报工具 (5)
  seismic/                # 地震灾害工具 (5)
  weather/                # 天气情报工具 (6)
  terrain/                # 地形海拔工具 (6)
  infrastructure/         # 基础设施监测工具 (6)
  sanctions/              # 制裁筛查工具 (5)
  cyber/                  # 网络-地理情报工具 (6)
  population/             # 人口统计工具 (5)
  agriculture/            # 农业粮食安全工具 (5)
  humanitarian/           # 人道主义危机工具 (5)
  trade/                  # 贸易情报工具 (5)
  osm/                    # OpenStreetMap 工具 (8)
  geo/                    # 地理空间计算工具 (8)
  spectral/               # 光谱分析工具 (8)
  change/                 # 变化检测工具 (6)
  meta/                   # Meta 工具 (1)
```

**设计决策：**

- **27 个类别，1 个服务器** &mdash; 每个数据源是独立模块。智能体根据查询自主选择合适的工具。
- **按数据源独立限速** &mdash; 每个数据源拥有独立的 `RateLimiter` 实例，针对该 API 的限制进行校准。无共享瓶颈。
- **TTL 缓存** &mdash; 卫星影像搜索（15 分钟）、地震数据（5 分钟）、天气数据（10 分钟）结果均被缓存，避免多工具工作流中的冗余 API 调用。
- **优雅降级** &mdash; 缺少 API 密钥不会导致服务器崩溃。工具返回描述性错误信息："设置 COPERNICUS_CLIENT_ID 以启用 Sentinel-2 影像搜索。"
- **2 个依赖** &mdash; `@modelcontextprotocol/sdk` 和 `zod`。所有 HTTP 通过原生 `fetch` 实现。

---

## 贡献

欢迎贡献！请阅读 [CONTRIBUTING.md](../../CONTRIBUTING.md) 了解开发设置、编码规范和提交流程。

---

## MCP 安全套件系列

| 项目 | 领域 | 工具数 |
|------|------|--------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | 基于浏览器的安全测试 | 39 个工具 |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | 云安全 (AWS/Azure/GCP) | 38 个工具 |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub 安全态势 | 39 个工具 |
| [cve-mcp](https://github.com/badchars/cve-mcp) | 漏洞情报 | 23 个工具 |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT 与侦察 | 37 个工具 |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | 暗网与威胁情报 | 66 个工具 |
| **satellite-mcp** | **地理空间情报 (GEOINT)** | **171 个工具** |

---

<p align="center">
<b>仅用于经授权的安全测试与评估。</b><br>
在对任何目标执行情报收集之前，请始终确保您已获得适当授权。
</p>

<p align="center">
  <a href="../../LICENSE">MIT License</a> &bull; 使用 Bun + TypeScript 构建
</p>
