<p align="center">
  <a href="../../README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <strong>日本語</strong> |
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

<h3 align="center">AIエージェントのためのフルスペクトル地理空間インテリジェンス。</h3>

<p align="center">
  衛星画像、航空機追跡、船舶追跡、軍事インテリジェンス、スペクトル解析、変化検出、紛争モニタリング、環境モニタリング &mdash; 単一のMCPサーバーに統合。<br>
  AIエージェントは27個のブラウザタブを手動で切り替える代わりに、<b>完全なGEOINT能力をオンデマンドで取得</b>できます。
</p>

<br>

<p align="center">
  <a href="#課題">課題</a> &bull;
  <a href="#差別化ポイント">差別化ポイント</a> &bull;
  <a href="#クイックスタート">クイックスタート</a> &bull;
  <a href="#aiにできること">AIにできること</a> &bull;
  <a href="#ツールリファレンス171ツール">ツール (171)</a> &bull;
  <a href="#データソース27カテゴリ">データソース</a> &bull;
  <a href="#アーキテクチャ">アーキテクチャ</a> &bull;
  <a href="../../CHANGELOG.md">変更履歴</a> &bull;
  <a href="../../CONTRIBUTING.md">コントリビューション</a>
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
  <img src="https://raw.githubusercontent.com/badchars/satellite-mcp/main/.github/demo.gif" alt="satellite-mcp デモ" width="800">
</p>

---

## 課題

地理空間インテリジェンスは、あらゆるセキュリティ調査と状況認識タスクに欠けているレイヤーです。衛星画像、航空機追跡、船舶追跡、軍事施設、紛争データ、環境モニタリング、スペクトル解析、変化検出 &mdash; 必要なデータは数十のプラットフォームに散在し、それぞれが独自のAPI、認証、レート制限、出力形式を持っています。今日、CopernicusでSentinel-2画像を検索し、USGSでLandsatデータを照会し、OpenSkyで航空機を追跡し、別のインターフェースで船舶を監視し、そしてすべての情報を手動で相関させるのに数時間を費やしています。

```
従来のGEOINTワークフロー:
  衛星画像の検索               ->  Copernicus + USGS（2つの別々のUI）
  航空機の追跡                 ->  OpenSky Network ウェブインターフェース
  船舶の追跡                   ->  Global Fishing Watch ウェブインターフェース
  軍事活動の監視               ->  複数の個別OSINTソース
  紛争イベントの分析            ->  ACLED ウェブインターフェース
  環境変化の確認                ->  NASA Earthdata + FIRMS（2つのUI）
  スペクトル指数の計算           ->  デスクトップGISソフトウェア
  変化検出の実行                ->  専用リモートセンシングツール
  全データの相関                ->  コピー&ペーストでレポート作成
  ────────────────────────────────
  合計: 調査あたり60分以上、その大半がコンテキスト切り替えに消費
```

**satellite-mcp** は [Model Context Protocol](https://modelcontextprotocol.io) を通じてAIエージェントに27カテゴリのデータソースにまたがる171のツールを提供します。エージェントは全データソースを並列にクエリし、プラットフォーム間でデータを相関させ、パターンと異常を識別し、単一の会話で統合インテリジェンスピクチャーを提示します。

```
satellite-mcp使用時:
  ユーザー: 「イスタンブール地域の過去30日間の変化を分析してください」

  エージェント: -> sentinel_search: 12枚のSentinel-2画像を発見（雲量 < 20%）
               -> firms_active_area: 3箇所の活性火災を検出
               -> quake_recent: 200km圏内で大きな地震活動なし
               -> ship_area: ボスポラス海峡に847隻の船舶
               -> aircraft_area: 156機の航空機を検出
               -> weather_current: 22°C、一部曇り、視程10km
               -> 「イスタンブール地域の過去30日間: 変化分析に利用可能な
                  Sentinel-2画像12枚、活性火災3箇所を検出（農業焼却
                  の可能性）、ボスポラス海峡の海上交通は混雑。
                  地震活動なし。農業地域にNDVI解析による
                  植生変化検出を推奨します。」
```

---

## 差別化ポイント

既存ツールは一度に1つのデータソースから生データを提供するだけです。satellite-mcpは、AIエージェントが**複数の地理空間インテリジェンスドメインを同時に推論**できるようにします。

<table>
<thead>
<tr>
<th></th>
<th>従来のアプローチ</th>
<th>satellite-mcp</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>インターフェース</b></td>
<td>27の異なるウェブUI、CLI、API</td>
<td>MCP &mdash; AIエージェントが会話形式でツールを呼び出し</td>
</tr>
<tr>
<td><b>データソース</b></td>
<td>一度に1つのプラットフォーム</td>
<td>27カテゴリを並列クエリ</td>
</tr>
<tr>
<td><b>衛星画像</b></td>
<td>Copernicus、USGS、Planetのインターフェースを個別に使用</td>
<td>エージェントがSentinel-2 + Landsat + Planet画像を統合検索</td>
</tr>
<tr>
<td><b>航空機追跡</b></td>
<td>OpenSkyウェブインターフェースで手動照会</td>
<td>エージェントがリアルタイムで航空機を追跡、軍事信号を検出、航路を分析</td>
</tr>
<tr>
<td><b>船舶追跡</b></td>
<td>複数のAISプラットフォームを個別に照会</td>
<td>エージェントが船舶を追跡、制裁対象を識別、漁業活動を監視</td>
</tr>
<tr>
<td><b>APIキー</b></td>
<td>ほぼすべてのツールに必要</td>
<td>多くのツールが無料で動作。APIキーでプレミアムソースを解放</td>
</tr>
<tr>
<td><b>セットアップ</b></td>
<td>各ツールを個別にインストール、各設定を管理</td>
<td><code>npx satellite-mcp</code> &mdash; コマンド1つ、設定不要</td>
</tr>
</tbody>
</table>

---

## クイックスタート

### オプション1: npx（インストール不要）

```bash
npx satellite-mcp
```

無料ツールがすぐに使えます。地震データ、天気、ジオコーディング、スペクトル解析、変化検出、OpenStreetMapなど、APIキーは不要です。

### オプション2: クローン

```bash
git clone https://github.com/badchars/satellite-mcp.git
cd satellite-mcp
bun install
```

### 環境変数（オプション）

```bash
# 衛星画像
export COPERNICUS_CLIENT_ID=your-id         # Sentinel-2画像検索を有効化
export COPERNICUS_CLIENT_SECRET=your-secret  # Copernicus OAuth2シークレット
export USGS_USERNAME=your-user               # Landsat画像検索を有効化
export USGS_PASSWORD=your-pass               # USGS EarthExplorerパスワード
export PLANET_API_KEY=your-key               # Planet Labs画像ツールを有効化

# NASA
export NASA_API_KEY=your-key                 # NASA API（フォールバック: DEMO_KEY）
export NASA_FIRMS_KEY=your-key               # NASA FIRMS活性火災データ
export NASA_EARTHDATA_TOKEN=your-token       # NASA Earthdataトークン

# 追跡
export OPENSKY_USERNAME=your-user            # OpenSky Network（レート制限向上）
export OPENSKY_PASSWORD=your-pass            # OpenSky Networkパスワード
export GFW_API_KEY=your-key                  # Global Fishing Watch船舶追跡
export N2YO_API_KEY=your-key                 # N2YO衛星/宇宙ステーション追跡

# インテリジェンス
export ACLED_API_KEY=your-key                # ACLED紛争データ
export ACLED_EMAIL=your-email                # ACLED登録メール
export COMTRADE_API_KEY=your-key             # 国連貿易データベース
export TIMEZONEDB_KEY=your-key               # タイムゾーンデータベース
```

すべてのAPIキーはオプションです。設定しなくても、地震モニタリング、天気照会、ジオコーディング、スペクトル解析、変化検出、OpenStreetMap、地形分析など多数の機能が利用可能です。

### AIエージェントに接続

<details open>
<summary><b>Claude Code</b></summary>

```bash
# npx使用
claude mcp add satellite-mcp -- npx satellite-mcp

# ローカルクローン使用
claude mcp add satellite-mcp -- bun run /path/to/satellite-mcp/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

`~/Library/Application Support/Claude/claude_desktop_config.json` に追加:

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
<summary><b>Cursor / Windsurf / その他のMCPクライアント</b></summary>

同じJSON設定形式を使用します。commandを `npx satellite-mcp` またはローカルインストールパスに指定してください。

</details>

### クエリ開始

```
ユーザー: 「イスタンブール周辺50km圏内の地震活動と活性火災を照会してください」
```

以上です。エージェントが衛星画像検索、航空機追跡、船舶追跡、紛争分析などを自動的に処理します。

---

## AIにできること

### 衛星画像分析

```
ユーザー: 「アンカラの2024年3月のSentinel-2画像を検索してください」

エージェント: -> sentinel_search {bbox: [32.5, 39.7, 33.1, 40.1], date_from: "2024-03-01", date_to: "2024-03-31"}
             -> 「8枚のSentinel-2画像が見つかりました:
                - 2024-03-28: 雲量5%（最適）
                - 2024-03-21: 雲量12%
                - 2024-03-15: 雲量8%
                NDVI植生分析または都市拡大変化検出に使用可能です。」
```

### 航空機追跡

```
ユーザー: 「現在イスタンブール上空にどんな航空機がいますか？」

エージェント: -> aircraft_area {lamin: 40.8, lamax: 41.3, lomin: 28.5, lomax: 29.4}
             -> 「142機の航空機を検出:
                - 89機 商用便（THY、Pegasus、AJetなど）
                - 12機 一般航空機
                - 3機 軍用信号（機種未特定）
                - 38機 地上状態（アタテュルク / イスタンブール空港）」
```

### 船舶・海洋追跡

```
ユーザー: 「ボスポラス海峡の船舶活動はどうですか？」

エージェント: -> ship_area {lat: 41.1, lon: 29.05, radius: 10}
             -> sanctions_vessel_search {query: "検出されたMMSIリスト"}
             -> 「ボスポラス海峡: 847隻の船舶
                - 312隻 貨物船
                - 89隻 タンカー
                - 156隻 旅客船/フェリー
                - 2隻が制裁審査リストに該当 -- 追加調査が必要」
```

---

## ツールリファレンス（171ツール）

| カテゴリ | ツール数 | 認証要件 |
|---------|---------|---------|
| Sentinel-2 (Copernicus) | 8 | `COPERNICUS_CLIENT_ID` + `COPERNICUS_CLIENT_SECRET` |
| Landsat (USGS) | 7 | `USGS_USERNAME` + `USGS_PASSWORD` |
| NASA FIRMS（活性火災） | 6 | `NASA_FIRMS_KEY`（オプション） |
| NASA 地球観測 | 7 | `NASA_API_KEY`（フォールバック DEMO_KEY） |
| 夜間光 (VIIRS) | 5 | `NASA_EARTHDATA_TOKEN` |
| Planet Labs | 4 | `PLANET_API_KEY` |
| 航空機インテリジェンス | 10 | `OPENSKY_USERNAME`（オプション、レート向上） |
| 船舶インテリジェンス | 8 | `GFW_API_KEY` |
| 宇宙・軌道追跡 | 6 | `N2YO_API_KEY` |
| 軍事・防衛 | 8 | APIキー不要 |
| 紛争・イベント | 6 | `ACLED_API_KEY` + `ACLED_EMAIL` |
| 環境インテリジェンス | 6 | APIキー不要 |
| 海洋インテリジェンス | 5 | APIキー不要 |
| 地震・災害 | 5 | APIキー不要 |
| 天気・大気 | 6 | APIキー不要 |
| 地形・標高 | 6 | APIキー不要 |
| 重要インフラ | 6 | APIキー不要 |
| 制裁・コンプライアンス | 5 | APIキー不要 |
| サイバー地理インテリジェンス | 6 | APIキー不要 |
| 人口・人口統計 | 5 | APIキー不要 |
| 農業・食料安全保障 | 5 | APIキー不要 |
| 人道支援・難民 | 5 | APIキー不要 |
| 貿易インテリジェンス | 5 | `COMTRADE_API_KEY`（オプション） |
| OpenStreetMap / Overpass | 8 | APIキー不要 |
| ジオコーディング・座標 | 8 | `TIMEZONEDB_KEY`（オプション） |
| スペクトル解析 | 8 | APIキー不要 |
| 変化検出 | 6 | APIキー不要 |
| Meta | 1 | APIキー不要 |

---

### CLI使用方法

```bash
# 利用可能な全ツールを一覧表示
npx satellite-mcp --list

# ツールを直接実行
npx satellite-mcp --tool spectral_ndvi '{"nir":0.8,"red":0.2}'
npx satellite-mcp --tool geo_distance '{"lat1":41.01,"lng1":28.98,"lat2":39.93,"lng2":32.86}'
npx satellite-mcp --tool quake_recent '{"min_magnitude":4.0,"limit":10}'
npx satellite-mcp --tool firms_active_country '{"country":"TR","days":1}'
```

---

## APIキーリファレンス

| 環境変数 | データソース | 説明 |
|---------|-----------|------|
| `COPERNICUS_CLIENT_ID` | Copernicus Data Space | Sentinel-2画像検索用OAuth2クライアントID |
| `COPERNICUS_CLIENT_SECRET` | Copernicus Data Space | Sentinel-2画像検索用OAuth2クライアントシークレット |
| `USGS_USERNAME` | USGS EarthExplorer | Landsat画像検索ユーザー名 |
| `USGS_PASSWORD` | USGS EarthExplorer | Landsat画像検索パスワード |
| `NASA_API_KEY` | NASA APIs | NASA APIキー（未設定時DEMO_KEY使用） |
| `NASA_FIRMS_KEY` | NASA FIRMS | 活性火災データマップキー |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | 夜間光および高度なデータ用ベアラートークン |
| `PLANET_API_KEY` | Planet Labs | 高解像度画像APIキー |
| `OPENSKY_USERNAME` | OpenSky Network | 航空機追跡ユーザー名（レート制限向上） |
| `OPENSKY_PASSWORD` | OpenSky Network | 航空機追跡パスワード |
| `GFW_API_KEY` | Global Fishing Watch | 船舶追跡・漁業モニタリングAPIキー |
| `N2YO_API_KEY` | N2YO | 衛星・宇宙ステーション追跡APIキー |
| `ACLED_API_KEY` | ACLED | 紛争イベントデータAPIキー |
| `ACLED_EMAIL` | ACLED | ACLED登録メール |
| `COMTRADE_API_KEY` | UN Comtrade | 国際貿易データAPIキー |
| `TIMEZONEDB_KEY` | TimezoneDB | タイムゾーン照会APIキー |

---

## アーキテクチャ

```
src/
  index.ts                # CLIエントリポイント（--help、--list、--tool、stdioサーバー）
  protocol/
    mcp-server.ts         # MCPサーバーセットアップ（stdioトランスポート）
    tools.ts              # ツールレジストリ -- 全171ツールをここで集約
  types/
    index.ts              # 共有型（ToolDef、ToolContext、ToolResult）
  utils/
    rate-limiter.ts       # データソースごとの独立レートリミッター
    cache.ts              # APIレスポンスTTLキャッシュ
  sentinel/               # Sentinel-2画像ツール (8)
  landsat/                # Landsat画像ツール (7)
  firms/                  # NASA FIRMS火災ツール (6)
  nasa/                   # NASA地球観測ツール (7)
  nightlights/            # VIIRS夜間光ツール (5)
  planet/                 # Planet Labs画像ツール (4)
  aircraft/               # 航空機追跡ツール (10)
  maritime/               # 船舶追跡ツール (8)
  space/                  # 宇宙追跡ツール (6)
  military/               # 軍事インテリジェンスツール (8)
  conflict/               # 紛争イベントツール (6)
  environment/            # 環境モニタリングツール (6)
  ocean/                  # 海洋インテリジェンスツール (5)
  seismic/                # 地震災害ツール (5)
  weather/                # 天気インテリジェンスツール (6)
  terrain/                # 地形標高ツール (6)
  infrastructure/         # インフラモニタリングツール (6)
  sanctions/              # 制裁審査ツール (5)
  cyber/                  # サイバー地理インテリジェンスツール (6)
  population/             # 人口統計ツール (5)
  agriculture/            # 農業食料安全保障ツール (5)
  humanitarian/           # 人道支援危機ツール (5)
  trade/                  # 貿易インテリジェンスツール (5)
  osm/                    # OpenStreetMapツール (8)
  geo/                    # 地理空間計算ツール (8)
  spectral/               # スペクトル解析ツール (8)
  change/                 # 変化検出ツール (6)
  meta/                   # Metaツール (1)
```

**設計上の判断:**

- **27カテゴリ、1サーバー** &mdash; 各データソースは独立モジュールです。エージェントがクエリに基づいて適切なツールを自律的に選択します。
- **データソースごとの独立レート制限** &mdash; 各データソースはそのAPIの制限に合わせて調整された独自の `RateLimiter` インスタンスを持ちます。共有ボトルネックはありません。
- **TTLキャッシュ** &mdash; 衛星画像検索（15分）、地震データ（5分）、天気データ（10分）の結果がキャッシュされ、マルチツールワークフローでの冗長なAPI呼び出しを防止します。
- **グレースフルデグラデーション** &mdash; APIキーがなくてもサーバーはクラッシュしません。ツールが説明的なエラーメッセージを返します：「COPERNICUS_CLIENT_IDを設定してSentinel-2画像検索を有効にしてください。」
- **依存関係2つ** &mdash; `@modelcontextprotocol/sdk` と `zod`。すべてのHTTPはネイティブ `fetch` で実装。

---

## コントリビューション

コントリビューションを歓迎します。開発セットアップ、コーディングガイドライン、提出手順については [CONTRIBUTING.md](../../CONTRIBUTING.md) をお読みください。

---

## MCPセキュリティスイートシリーズ

| プロジェクト | ドメイン | ツール数 |
|------------|---------|---------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | ブラウザベースのセキュリティテスト | 39ツール |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | クラウドセキュリティ (AWS/Azure/GCP) | 38ツール |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHubセキュリティポスチャー | 39ツール |
| [cve-mcp](https://github.com/badchars/cve-mcp) | 脆弱性インテリジェンス | 23ツール |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT・偵察 | 37ツール |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | ダークウェブ・脅威インテリジェンス | 66ツール |
| **satellite-mcp** | **地理空間インテリジェンス (GEOINT)** | **171ツール** |

---

<p align="center">
<b>認可されたセキュリティテストおよび評価目的にのみ使用してください。</b><br>
いかなる対象に対してもインテリジェンス収集を実施する前に、適切な権限を確保してください。
</p>

<p align="center">
  <a href="../../LICENSE">MIT License</a> &bull; Bun + TypeScriptで構築
</p>
