<p align="center">
  <a href="../../README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <strong>繁體中文</strong> |
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

<h3 align="center">面向 AI 智慧體的全頻譜地理空間情報。</h3>

<p align="center">
  衛星影像、飛行器追蹤、船舶追蹤、軍事情報、光譜分析、變化偵測、衝突監測、環境監測 &mdash; 統一整合至單一 MCP 伺服器。<br>
  您的 AI 智慧體可<b>按需取得完整的 GEOINT 能力</b>，而非在 27 個瀏覽器分頁之間手動切換。
</p>

<br>

<p align="center">
  <a href="#問題所在">問題所在</a> &bull;
  <a href="#差異化優勢">差異化優勢</a> &bull;
  <a href="#快速開始">快速開始</a> &bull;
  <a href="#ai-能力一覽">AI 能力一覽</a> &bull;
  <a href="#工具參考171-個工具">工具 (171)</a> &bull;
  <a href="#資料來源27-個">資料來源</a> &bull;
  <a href="#架構">架構</a> &bull;
  <a href="../../CHANGELOG.md">更新日誌</a> &bull;
  <a href="../../CONTRIBUTING.md">貢獻指南</a>
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
  <img src="https://raw.githubusercontent.com/badchars/satellite-mcp/main/.github/demo.gif" alt="satellite-mcp 展示" width="800">
</p>

---

## 問題所在

地理空間情報是每項安全調查與態勢感知任務中缺失的一環。衛星影像、飛行器追蹤、船舶追蹤、軍事設施、衝突資料、環境監測、光譜分析、變化偵測 &mdash; 您所需的資料分散在數十個平台上，每個平台各有獨立的 API、身份驗證、速率限制與輸出格式。今天，您需要在 Copernicus 上搜尋 Sentinel-2 影像，在 USGS 上查詢 Landsat 資料，在 OpenSky 上追蹤飛行器，在另一個介面上監控船舶，然後花費數小時手動關聯所有資訊。

```
傳統 GEOINT 工作流程：
  搜尋衛星影像               ->  Copernicus + USGS（兩個獨立介面）
  追蹤飛行器                 ->  OpenSky Network 網頁介面
  追蹤船舶                   ->  Global Fishing Watch 網頁介面
  監控軍事活動               ->  多個獨立 OSINT 來源
  分析衝突事件               ->  ACLED 網頁介面
  檢查環境變化               ->  NASA Earthdata + FIRMS（兩個介面）
  計算光譜指數               ->  桌面 GIS 軟體
  執行變化偵測               ->  專用遙測工具
  關聯所有資料               ->  複製貼上到報告中
  ────────────────────────────────
  合計：每次調查 60 分鐘以上，絕大部分時間消耗在上下文切換上
```

**satellite-mcp** 透過 [Model Context Protocol](https://modelcontextprotocol.io) 為您的 AI 智慧體提供 171 個工具，涵蓋 27 個類別的資料來源。智慧體可並行查詢所有資料來源，跨平台關聯資料，辨識模式與異常，並在一次對話中呈現統一的情報圖景。

```
使用 satellite-mcp：
  您：「分析伊斯坦堡地區過去 30 天的變化情況」

  智慧體：-> sentinel_search: 發現 12 張 Sentinel-2 影像（雲覆蓋率 < 20%）
          -> firms_active_area: 偵測到 3 處活躍火點
          -> quake_recent: 200 公里範圍內無重大地震活動
          -> ship_area: 博斯普魯斯海峽有 847 艘船舶
          -> aircraft_area: 偵測到 156 架飛行器
          -> weather_current: 22°C，部分多雲，能見度 10 公里
          -> "伊斯坦堡地區過去 30 天：12 張可用的 Sentinel-2
             影像用於變化分析，偵測到 3 處活躍火點（可能為
             農業焚燒），博斯普魯斯海峽海上交通繁忙。
             無地震活動。建議使用 NDVI 分析
             對農業區域進行植被變化偵測。"
```

---

## 差異化優勢

現有工具一次只能從單個資料來源取得原始資料。satellite-mcp 讓您的 AI 智慧體能夠**同時跨多個地理空間情報領域進行推理**。

<table>
<thead>
<tr>
<th></th>
<th>傳統方式</th>
<th>satellite-mcp</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>介面</b></td>
<td>27 個不同的網頁介面、CLI 與 API</td>
<td>MCP &mdash; AI 智慧體透過對話呼叫工具</td>
</tr>
<tr>
<td><b>資料來源</b></td>
<td>一次使用一個平台</td>
<td>27 個類別並行查詢</td>
</tr>
<tr>
<td><b>衛星影像</b></td>
<td>分別使用 Copernicus、USGS、Planet 介面</td>
<td>智慧體統一搜尋 Sentinel-2 + Landsat + Planet 影像</td>
</tr>
<tr>
<td><b>飛行器追蹤</b></td>
<td>OpenSky 網頁介面手動查詢</td>
<td>智慧體即時追蹤飛行器、偵測軍用訊號、分析航線</td>
</tr>
<tr>
<td><b>船舶追蹤</b></td>
<td>多個 AIS 平台分別查詢</td>
<td>智慧體追蹤船舶、辨識制裁目標、監控漁業活動</td>
</tr>
<tr>
<td><b>API 金鑰</b></td>
<td>幾乎所有工具都需要</td>
<td>許多工具免費使用；API 金鑰解鎖進階資料來源</td>
</tr>
<tr>
<td><b>部署</b></td>
<td>逐個安裝工具，分別管理設定</td>
<td><code>npx satellite-mcp</code> &mdash; 一條指令，零設定</td>
</tr>
</tbody>
</table>

---

## 快速開始

### 方式 1：npx（無需安裝）

```bash
npx satellite-mcp
```

免費工具開箱即用。地震資料、天氣、地理編碼、光譜分析、變化偵測、OpenStreetMap 等無需 API 金鑰。

### 方式 2：複製

```bash
git clone https://github.com/badchars/satellite-mcp.git
cd satellite-mcp
bun install
```

### 環境變數（可選）

```bash
# 衛星影像
export COPERNICUS_CLIENT_ID=your-id         # 啟用 Sentinel-2 影像搜尋
export COPERNICUS_CLIENT_SECRET=your-secret  # Copernicus OAuth2 密鑰
export USGS_USERNAME=your-user               # 啟用 Landsat 影像搜尋
export USGS_PASSWORD=your-pass               # USGS EarthExplorer 密碼
export PLANET_API_KEY=your-key               # 啟用 Planet Labs 影像工具

# NASA
export NASA_API_KEY=your-key                 # NASA API（備用：DEMO_KEY）
export NASA_FIRMS_KEY=your-key               # NASA FIRMS 活躍火點資料
export NASA_EARTHDATA_TOKEN=your-token       # NASA Earthdata 權杖

# 追蹤
export OPENSKY_USERNAME=your-user            # OpenSky Network（提升速率限制）
export OPENSKY_PASSWORD=your-pass            # OpenSky Network 密碼
export GFW_API_KEY=your-key                  # Global Fishing Watch 船舶追蹤
export N2YO_API_KEY=your-key                 # N2YO 衛星/太空站追蹤

# 情報
export ACLED_API_KEY=your-key                # ACLED 衝突資料
export ACLED_EMAIL=your-email                # ACLED 註冊電子郵件
export COMTRADE_API_KEY=your-key             # 聯合國貿易資料庫
export TIMEZONEDB_KEY=your-key               # 時區資料庫
```

所有 API 金鑰均為可選。未設定時，您仍可使用地震監測、天氣查詢、地理編碼、光譜分析、變化偵測、OpenStreetMap、地形分析等眾多功能。

### 連接到您的 AI 智慧體

<details open>
<summary><b>Claude Code</b></summary>

```bash
# 使用 npx
claude mcp add satellite-mcp -- npx satellite-mcp

# 使用本地複製
claude mcp add satellite-mcp -- bun run /path/to/satellite-mcp/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

新增至 `~/Library/Application Support/Claude/claude_desktop_config.json`：

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
<summary><b>Cursor / Windsurf / 其他 MCP 用戶端</b></summary>

使用相同的 JSON 設定格式。將 command 指向 `npx satellite-mcp` 或本地安裝路徑。

</details>

### 開始查詢

```
您：「查詢伊斯坦堡周邊 50 公里範圍內的地震活動和活躍火點」
```

就是這樣。智慧體自動處理衛星影像搜尋、飛行器追蹤、船舶追蹤、衝突分析等。

---

## AI 能力一覽

### 衛星影像分析

```
您：「搜尋安卡拉 2024 年 3 月的 Sentinel-2 影像」

智慧體：-> sentinel_search {bbox: [32.5, 39.7, 33.1, 40.1], date_from: "2024-03-01", date_to: "2024-03-31"}
        -> "找到 8 張 Sentinel-2 影像：
           - 2024-03-28: 雲覆蓋率 5%（最優）
           - 2024-03-21: 雲覆蓋率 12%
           - 2024-03-15: 雲覆蓋率 8%
           可用於 NDVI 植被分析或城市擴展變化偵測。"
```

### 飛行器追蹤

```
您：「伊斯坦堡上空現在有哪些飛行器？」

智慧體：-> aircraft_area {lamin: 40.8, lamax: 41.3, lomin: 28.5, lomax: 29.4}
        -> "偵測到 142 架飛行器：
           - 89 架商用航班（THY、Pegasus、AJet 等）
           - 12 架通用航空器
           - 3 架軍用訊號（未辨識型號）
           - 38 架地面狀態（阿塔圖克 / 伊斯坦堡機場）"
```

### 船舶與海洋追蹤

```
您：「博斯普魯斯海峽的船舶活動情況？」

智慧體：-> ship_area {lat: 41.1, lon: 29.05, radius: 10}
        -> sanctions_vessel_search {query: "偵測到的 MMSI 清單"}
        -> "博斯普魯斯海峽：847 艘船舶
           - 312 艘貨船
           - 89 艘油輪
           - 156 艘客船/渡輪
           - 2 艘船舶符合制裁篩查名單 — 需進一步調查"
```

---

## 工具參考（171 個工具）

| 類別 | 工具數 | 驗證要求 |
|------|--------|---------|
| Sentinel-2 (Copernicus) | 8 | `COPERNICUS_CLIENT_ID` + `COPERNICUS_CLIENT_SECRET` |
| Landsat (USGS) | 7 | `USGS_USERNAME` + `USGS_PASSWORD` |
| NASA FIRMS（活躍火點） | 6 | `NASA_FIRMS_KEY`（可選） |
| NASA 地球觀測 | 7 | `NASA_API_KEY`（備用 DEMO_KEY） |
| 夜間燈光 (VIIRS) | 5 | `NASA_EARTHDATA_TOKEN` |
| Planet Labs | 4 | `PLANET_API_KEY` |
| 飛行器情報 | 10 | `OPENSKY_USERNAME`（可選，提升速率） |
| 船舶情報 | 8 | `GFW_API_KEY` |
| 太空與軌道追蹤 | 6 | `N2YO_API_KEY` |
| 軍事與國防 | 8 | 無需金鑰 |
| 衝突與事件 | 6 | `ACLED_API_KEY` + `ACLED_EMAIL` |
| 環境情報 | 6 | 無需金鑰 |
| 海洋情報 | 5 | 無需金鑰 |
| 地震與災害 | 5 | 無需金鑰 |
| 天氣與大氣 | 6 | 無需金鑰 |
| 地形與海拔 | 6 | 無需金鑰 |
| 關鍵基礎設施 | 6 | 無需金鑰 |
| 制裁與合規 | 5 | 無需金鑰 |
| 網路-地理情報 | 6 | 無需金鑰 |
| 人口與人口統計 | 5 | 無需金鑰 |
| 農業與糧食安全 | 5 | 無需金鑰 |
| 人道主義與難民 | 5 | 無需金鑰 |
| 貿易情報 | 5 | `COMTRADE_API_KEY`（可選） |
| OpenStreetMap / Overpass | 8 | 無需金鑰 |
| 地理編碼與座標 | 8 | `TIMEZONEDB_KEY`（可選） |
| 光譜分析 | 8 | 無需金鑰 |
| 變化偵測 | 6 | 無需金鑰 |
| Meta | 1 | 無需金鑰 |

---

### CLI 用法

```bash
# 列出所有可用工具
npx satellite-mcp --list

# 直接執行任意工具
npx satellite-mcp --tool spectral_ndvi '{"nir":0.8,"red":0.2}'
npx satellite-mcp --tool geo_distance '{"lat1":41.01,"lng1":28.98,"lat2":39.93,"lng2":32.86}'
npx satellite-mcp --tool quake_recent '{"min_magnitude":4.0,"limit":10}'
npx satellite-mcp --tool firms_active_country '{"country":"TR","days":1}'
```

---

## API 金鑰參考

| 環境變數 | 資料來源 | 說明 |
|---------|----------|------|
| `COPERNICUS_CLIENT_ID` | Copernicus Data Space | Sentinel-2 影像搜尋 OAuth2 用戶端 ID |
| `COPERNICUS_CLIENT_SECRET` | Copernicus Data Space | Sentinel-2 影像搜尋 OAuth2 用戶端密鑰 |
| `USGS_USERNAME` | USGS EarthExplorer | Landsat 影像搜尋使用者名稱 |
| `USGS_PASSWORD` | USGS EarthExplorer | Landsat 影像搜尋密碼 |
| `NASA_API_KEY` | NASA APIs | NASA API 金鑰（未設定時使用 DEMO_KEY） |
| `NASA_FIRMS_KEY` | NASA FIRMS | 活躍火點資料地圖金鑰 |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | 夜間燈光及進階資料承載權杖 |
| `PLANET_API_KEY` | Planet Labs | 高解析度影像 API 金鑰 |
| `OPENSKY_USERNAME` | OpenSky Network | 飛行器追蹤使用者名稱（提升速率限制） |
| `OPENSKY_PASSWORD` | OpenSky Network | 飛行器追蹤密碼 |
| `GFW_API_KEY` | Global Fishing Watch | 船舶追蹤與漁業監測 API 金鑰 |
| `N2YO_API_KEY` | N2YO | 衛星與太空站追蹤 API 金鑰 |
| `ACLED_API_KEY` | ACLED | 衝突事件資料 API 金鑰 |
| `ACLED_EMAIL` | ACLED | ACLED 註冊電子郵件 |
| `COMTRADE_API_KEY` | UN Comtrade | 國際貿易資料 API 金鑰 |
| `TIMEZONEDB_KEY` | TimezoneDB | 時區查詢 API 金鑰 |

---

## 架構

```
src/
  index.ts                # CLI 進入點（--help、--list、--tool、stdio 伺服器）
  protocol/
    mcp-server.ts         # MCP 伺服器設定（stdio 傳輸）
    tools.ts              # 工具註冊 — 全部 171 個工具在此匯聚
  types/
    index.ts              # 共享型別（ToolDef、ToolContext、ToolResult）
  utils/
    rate-limiter.ts       # 按資料來源獨立限速器
    cache.ts              # API 回應 TTL 快取
  sentinel/               # Sentinel-2 影像工具 (8)
  landsat/                # Landsat 影像工具 (7)
  firms/                  # NASA FIRMS 火點工具 (6)
  nasa/                   # NASA 地球觀測工具 (7)
  nightlights/            # VIIRS 夜間燈光工具 (5)
  planet/                 # Planet Labs 影像工具 (4)
  aircraft/               # 飛行器追蹤工具 (10)
  maritime/               # 船舶追蹤工具 (8)
  space/                  # 太空追蹤工具 (6)
  military/               # 軍事情報工具 (8)
  conflict/               # 衝突事件工具 (6)
  environment/            # 環境監測工具 (6)
  ocean/                  # 海洋情報工具 (5)
  seismic/                # 地震災害工具 (5)
  weather/                # 天氣情報工具 (6)
  terrain/                # 地形海拔工具 (6)
  infrastructure/         # 基礎設施監測工具 (6)
  sanctions/              # 制裁篩查工具 (5)
  cyber/                  # 網路-地理情報工具 (6)
  population/             # 人口統計工具 (5)
  agriculture/            # 農業糧食安全工具 (5)
  humanitarian/           # 人道主義危機工具 (5)
  trade/                  # 貿易情報工具 (5)
  osm/                    # OpenStreetMap 工具 (8)
  geo/                    # 地理空間計算工具 (8)
  spectral/               # 光譜分析工具 (8)
  change/                 # 變化偵測工具 (6)
  meta/                   # Meta 工具 (1)
```

**設計決策：**

- **27 個類別，1 個伺服器** &mdash; 每個資料來源是獨立模組。智慧體根據查詢自主選擇合適的工具。
- **按資料來源獨立限速** &mdash; 每個資料來源擁有獨立的 `RateLimiter` 實例，針對該 API 的限制進行校準。無共享瓶頸。
- **TTL 快取** &mdash; 衛星影像搜尋（15 分鐘）、地震資料（5 分鐘）、天氣資料（10 分鐘）結果均被快取，避免多工具工作流中的冗餘 API 呼叫。
- **優雅降級** &mdash; 缺少 API 金鑰不會導致伺服器當機。工具回傳描述性錯誤訊息：「設定 COPERNICUS_CLIENT_ID 以啟用 Sentinel-2 影像搜尋。」
- **2 個相依性** &mdash; `@modelcontextprotocol/sdk` 與 `zod`。所有 HTTP 透過原生 `fetch` 實現。

---

## 貢獻

歡迎貢獻！請閱讀 [CONTRIBUTING.md](../../CONTRIBUTING.md) 了解開發設定、編碼規範與提交流程。

---

## MCP 安全套件系列

| 專案 | 領域 | 工具數 |
|------|------|--------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | 基於瀏覽器的安全測試 | 39 個工具 |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | 雲端安全 (AWS/Azure/GCP) | 38 個工具 |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub 安全態勢 | 39 個工具 |
| [cve-mcp](https://github.com/badchars/cve-mcp) | 弱點情報 | 23 個工具 |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT 與偵察 | 37 個工具 |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | 暗網與威脅情報 | 66 個工具 |
| **satellite-mcp** | **地理空間情報 (GEOINT)** | **171 個工具** |

---

<p align="center">
<b>僅用於經授權的安全測試與評估。</b><br>
在對任何目標執行情報蒐集之前，請始終確保您已取得適當授權。
</p>

<p align="center">
  <a href="../../LICENSE">MIT License</a> &bull; 使用 Bun + TypeScript 建置
</p>
