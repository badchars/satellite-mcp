<p align="center">
  <a href="../../README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <strong>한국어</strong> |
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

<h3 align="center">AI 에이전트를 위한 전 스펙트럼 지리공간 정보.</h3>

<p align="center">
  위성 영상, 항공기 추적, 선박 추적, 군사 정보, 분광 분석, 변화 탐지, 분쟁 모니터링, 환경 모니터링 &mdash; 단일 MCP 서버로 통합.<br>
  AI 에이전트가 27개 브라우저 탭을 수동으로 전환하는 대신, <b>필요할 때 완전한 GEOINT 역량을 온디맨드로 제공</b>합니다.
</p>

<br>

<p align="center">
  <a href="#문제점">문제점</a> &bull;
  <a href="#차별화-요소">차별화 요소</a> &bull;
  <a href="#빠른-시작">빠른 시작</a> &bull;
  <a href="#ai가-할-수-있는-일">AI가 할 수 있는 일</a> &bull;
  <a href="#도구-참조171개-도구">도구 (171)</a> &bull;
  <a href="#데이터-소스27개">데이터 소스</a> &bull;
  <a href="#아키텍처">아키텍처</a> &bull;
  <a href="../../CHANGELOG.md">변경 이력</a> &bull;
  <a href="../../CONTRIBUTING.md">기여 가이드</a>
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
  <img src="https://raw.githubusercontent.com/badchars/satellite-mcp/main/.github/demo.gif" alt="satellite-mcp 데모" width="800">
</p>

---

## 문제점

지리공간 정보는 모든 보안 조사와 상황 인식 작업에서 빠져 있는 레이어입니다. 위성 영상, 항공기 추적, 선박 추적, 군사 시설, 분쟁 데이터, 환경 모니터링, 분광 분석, 변화 탐지 &mdash; 필요한 데이터가 수십 개의 플랫폼에 흩어져 있으며, 각각 고유한 API, 인증, 속도 제한, 출력 형식을 가지고 있습니다. 오늘날 Copernicus에서 Sentinel-2 영상을 검색하고, USGS에서 Landsat 데이터를 조회하고, OpenSky에서 항공기를 추적하고, 다른 인터페이스에서 선박을 모니터링한 다음, 모든 정보를 수동으로 연관시키는 데 수 시간을 소비합니다.

```
기존 GEOINT 워크플로:
  위성 영상 검색               ->  Copernicus + USGS (2개의 별도 UI)
  항공기 추적                  ->  OpenSky Network 웹 인터페이스
  선박 추적                    ->  Global Fishing Watch 웹 인터페이스
  군사 활동 모니터링            ->  다수의 개별 OSINT 소스
  분쟁 이벤트 분석              ->  ACLED 웹 인터페이스
  환경 변화 확인                ->  NASA Earthdata + FIRMS (2개의 UI)
  분광 지수 계산                ->  데스크톱 GIS 소프트웨어
  변화 탐지 수행                ->  전용 원격 탐사 도구
  모든 데이터 연관              ->  복사-붙여넣기로 보고서 작성
  ────────────────────────────────
  합계: 조사당 60분 이상, 대부분 컨텍스트 전환에 소비
```

**satellite-mcp**는 [Model Context Protocol](https://modelcontextprotocol.io)을 통해 AI 에이전트에 27개 카테고리의 데이터 소스에 걸친 171개 도구를 제공합니다. 에이전트는 모든 데이터 소스를 병렬로 쿼리하고, 플랫폼 간 데이터를 상호 연관시키고, 패턴과 이상을 식별하며, 단일 대화에서 통합 정보 그림을 제시합니다.

```
satellite-mcp 사용 시:
  사용자: "이스탄불 지역의 지난 30일간 변화를 분석해 주세요"

  에이전트: -> sentinel_search: 12개 Sentinel-2 영상 발견 (구름 < 20%)
            -> firms_active_area: 3개의 활성 화재점 탐지
            -> quake_recent: 200km 반경 내 주요 지진 활동 없음
            -> ship_area: 보스포러스 해협에 847척의 선박
            -> aircraft_area: 156대의 항공기 탐지
            -> weather_current: 22°C, 부분 흐림, 가시거리 10km
            -> "이스탄불 지역 지난 30일: 변화 분석에 사용 가능한
               Sentinel-2 영상 12개, 3개의 활성 화재점 탐지(농업
               소각으로 추정), 보스포러스 해상 교통 혼잡.
               지진 활동 없음. 농업 지역에 NDVI 분석을
               통한 식생 변화 탐지를 권장합니다."
```

---

## 차별화 요소

기존 도구는 한 번에 하나의 데이터 소스에서 원시 데이터만 제공합니다. satellite-mcp는 AI 에이전트가 **여러 지리공간 정보 도메인을 동시에 추론**할 수 있게 합니다.

<table>
<thead>
<tr>
<th></th>
<th>기존 방식</th>
<th>satellite-mcp</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>인터페이스</b></td>
<td>27개의 서로 다른 웹 UI, CLI, API</td>
<td>MCP &mdash; AI 에이전트가 대화형으로 도구 호출</td>
</tr>
<tr>
<td><b>데이터 소스</b></td>
<td>한 번에 하나의 플랫폼</td>
<td>27개 카테고리 병렬 쿼리</td>
</tr>
<tr>
<td><b>위성 영상</b></td>
<td>Copernicus, USGS, Planet 인터페이스를 각각 사용</td>
<td>에이전트가 Sentinel-2 + Landsat + Planet 영상을 통합 검색</td>
</tr>
<tr>
<td><b>항공기 추적</b></td>
<td>OpenSky 웹 인터페이스에서 수동 조회</td>
<td>에이전트가 실시간 항공기 추적, 군사 신호 탐지, 항로 분석</td>
</tr>
<tr>
<td><b>선박 추적</b></td>
<td>여러 AIS 플랫폼을 각각 조회</td>
<td>에이전트가 선박 추적, 제재 대상 식별, 어업 활동 모니터링</td>
</tr>
<tr>
<td><b>API 키</b></td>
<td>거의 모든 도구에 필요</td>
<td>많은 도구가 무료로 작동; API 키로 프리미엄 소스 해제</td>
</tr>
<tr>
<td><b>설치</b></td>
<td>각 도구 개별 설치, 각각의 설정 관리</td>
<td><code>npx satellite-mcp</code> &mdash; 명령어 하나, 설정 없음</td>
</tr>
</tbody>
</table>

---

## 빠른 시작

### 옵션 1: npx (설치 불필요)

```bash
npx satellite-mcp
```

무료 도구가 즉시 작동합니다. 지진 데이터, 날씨, 지오코딩, 분광 분석, 변화 탐지, OpenStreetMap 등에 API 키가 필요하지 않습니다.

### 옵션 2: 클론

```bash
git clone https://github.com/badchars/satellite-mcp.git
cd satellite-mcp
bun install
```

### 환경 변수 (선택 사항)

```bash
# 위성 영상
export COPERNICUS_CLIENT_ID=your-id         # Sentinel-2 영상 검색 활성화
export COPERNICUS_CLIENT_SECRET=your-secret  # Copernicus OAuth2 시크릿
export USGS_USERNAME=your-user               # Landsat 영상 검색 활성화
export USGS_PASSWORD=your-pass               # USGS EarthExplorer 비밀번호
export PLANET_API_KEY=your-key               # Planet Labs 영상 도구 활성화

# NASA
export NASA_API_KEY=your-key                 # NASA API (대체: DEMO_KEY)
export NASA_FIRMS_KEY=your-key               # NASA FIRMS 활성 화재 데이터
export NASA_EARTHDATA_TOKEN=your-token       # NASA Earthdata 토큰

# 추적
export OPENSKY_USERNAME=your-user            # OpenSky Network (향상된 속도 제한)
export OPENSKY_PASSWORD=your-pass            # OpenSky Network 비밀번호
export GFW_API_KEY=your-key                  # Global Fishing Watch 선박 추적
export N2YO_API_KEY=your-key                 # N2YO 위성/우주 정거장 추적

# 정보
export ACLED_API_KEY=your-key                # ACLED 분쟁 데이터
export ACLED_EMAIL=your-email                # ACLED 등록 이메일
export COMTRADE_API_KEY=your-key             # UN 무역 데이터베이스
export TIMEZONEDB_KEY=your-key               # 시간대 데이터베이스
```

모든 API 키는 선택 사항입니다. 설정하지 않아도 지진 모니터링, 날씨 조회, 지오코딩, 분광 분석, 변화 탐지, OpenStreetMap, 지형 분석 등 다양한 기능을 사용할 수 있습니다.

### AI 에이전트에 연결

<details open>
<summary><b>Claude Code</b></summary>

```bash
# npx 사용
claude mcp add satellite-mcp -- npx satellite-mcp

# 로컬 클론 사용
claude mcp add satellite-mcp -- bun run /path/to/satellite-mcp/src/index.ts
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

`~/Library/Application Support/Claude/claude_desktop_config.json`에 추가:

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
<summary><b>Cursor / Windsurf / 기타 MCP 클라이언트</b></summary>

동일한 JSON 설정 형식을 사용합니다. command를 `npx satellite-mcp` 또는 로컬 설치 경로로 지정하세요.

</details>

### 쿼리 시작

```
사용자: "이스탄불 주변 50km 반경의 지진 활동과 활성 화재를 조회해 주세요"
```

그것으로 끝입니다. 에이전트가 위성 영상 검색, 항공기 추적, 선박 추적, 분쟁 분석 등을 자동으로 처리합니다.

---

## AI가 할 수 있는 일

### 위성 영상 분석

```
사용자: "앙카라의 2024년 3월 Sentinel-2 영상을 검색해 주세요"

에이전트: -> sentinel_search {bbox: [32.5, 39.7, 33.1, 40.1], date_from: "2024-03-01", date_to: "2024-03-31"}
          -> "8개의 Sentinel-2 영상을 찾았습니다:
             - 2024-03-28: 구름 5% (최적)
             - 2024-03-21: 구름 12%
             - 2024-03-15: 구름 8%
             NDVI 식생 분석 또는 도시 확산 변화 탐지에 사용 가능합니다."
```

### 항공기 추적

```
사용자: "현재 이스탄불 상공에 어떤 항공기가 있나요?"

에이전트: -> aircraft_area {lamin: 40.8, lamax: 41.3, lomin: 28.5, lomax: 29.4}
          -> "142대의 항공기가 탐지되었습니다:
             - 89대 상업 항공편 (THY, Pegasus, AJet 등)
             - 12대 일반 항공기
             - 3대 군사 신호 (미식별 기종)
             - 38대 지상 상태 (아타튀르크 / 이스탄불 공항)"
```

### 선박 및 해양 추적

```
사용자: "보스포러스 해협의 선박 활동은 어떤가요?"

에이전트: -> ship_area {lat: 41.1, lon: 29.05, radius: 10}
          -> sanctions_vessel_search {query: "탐지된 MMSI 목록"}
          -> "보스포러스 해협: 847척의 선박
             - 312척 화물선
             - 89척 유조선
             - 156척 여객선/페리
             - 2척이 제재 심사 목록에 해당 -- 추가 조사 필요"
```

---

## 도구 참조 (171개 도구)

| 카테고리 | 도구 수 | 인증 요구사항 |
|---------|---------|-------------|
| Sentinel-2 (Copernicus) | 8 | `COPERNICUS_CLIENT_ID` + `COPERNICUS_CLIENT_SECRET` |
| Landsat (USGS) | 7 | `USGS_USERNAME` + `USGS_PASSWORD` |
| NASA FIRMS (활성 화재) | 6 | `NASA_FIRMS_KEY` (선택) |
| NASA 지구 관측 | 7 | `NASA_API_KEY` (대체 DEMO_KEY) |
| 야간 조명 (VIIRS) | 5 | `NASA_EARTHDATA_TOKEN` |
| Planet Labs | 4 | `PLANET_API_KEY` |
| 항공기 정보 | 10 | `OPENSKY_USERNAME` (선택, 속도 향상) |
| 선박 정보 | 8 | `GFW_API_KEY` |
| 우주 및 궤도 추적 | 6 | `N2YO_API_KEY` |
| 군사 및 방위 | 8 | API 키 불필요 |
| 분쟁 및 이벤트 | 6 | `ACLED_API_KEY` + `ACLED_EMAIL` |
| 환경 정보 | 6 | API 키 불필요 |
| 해양 정보 | 5 | API 키 불필요 |
| 지진 및 재해 | 5 | API 키 불필요 |
| 날씨 및 대기 | 6 | API 키 불필요 |
| 지형 및 고도 | 6 | API 키 불필요 |
| 핵심 인프라 | 6 | API 키 불필요 |
| 제재 및 컴플라이언스 | 5 | API 키 불필요 |
| 사이버-지리 정보 | 6 | API 키 불필요 |
| 인구 및 인구 통계 | 5 | API 키 불필요 |
| 농업 및 식량 안보 | 5 | API 키 불필요 |
| 인도주의 및 난민 | 5 | API 키 불필요 |
| 무역 정보 | 5 | `COMTRADE_API_KEY` (선택) |
| OpenStreetMap / Overpass | 8 | API 키 불필요 |
| 지오코딩 및 좌표 | 8 | `TIMEZONEDB_KEY` (선택) |
| 분광 분석 | 8 | API 키 불필요 |
| 변화 탐지 | 6 | API 키 불필요 |
| Meta | 1 | API 키 불필요 |

---

### CLI 사용법

```bash
# 사용 가능한 모든 도구 나열
npx satellite-mcp --list

# 도구 직접 실행
npx satellite-mcp --tool spectral_ndvi '{"nir":0.8,"red":0.2}'
npx satellite-mcp --tool geo_distance '{"lat1":41.01,"lng1":28.98,"lat2":39.93,"lng2":32.86}'
npx satellite-mcp --tool quake_recent '{"min_magnitude":4.0,"limit":10}'
npx satellite-mcp --tool firms_active_country '{"country":"TR","days":1}'
```

---

## API 키 참조

| 환경 변수 | 데이터 소스 | 설명 |
|----------|-----------|------|
| `COPERNICUS_CLIENT_ID` | Copernicus Data Space | Sentinel-2 영상 검색 OAuth2 클라이언트 ID |
| `COPERNICUS_CLIENT_SECRET` | Copernicus Data Space | Sentinel-2 영상 검색 OAuth2 클라이언트 시크릿 |
| `USGS_USERNAME` | USGS EarthExplorer | Landsat 영상 검색 사용자 이름 |
| `USGS_PASSWORD` | USGS EarthExplorer | Landsat 영상 검색 비밀번호 |
| `NASA_API_KEY` | NASA APIs | NASA API 키 (미설정 시 DEMO_KEY 사용) |
| `NASA_FIRMS_KEY` | NASA FIRMS | 활성 화재 데이터 맵 키 |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | 야간 조명 및 고급 데이터용 베어러 토큰 |
| `PLANET_API_KEY` | Planet Labs | 고해상도 영상 API 키 |
| `OPENSKY_USERNAME` | OpenSky Network | 항공기 추적 사용자 이름 (향상된 속도 제한) |
| `OPENSKY_PASSWORD` | OpenSky Network | 항공기 추적 비밀번호 |
| `GFW_API_KEY` | Global Fishing Watch | 선박 추적 및 어업 모니터링 API 키 |
| `N2YO_API_KEY` | N2YO | 위성 및 우주 정거장 추적 API 키 |
| `ACLED_API_KEY` | ACLED | 분쟁 이벤트 데이터 API 키 |
| `ACLED_EMAIL` | ACLED | ACLED 등록 이메일 |
| `COMTRADE_API_KEY` | UN Comtrade | 국제 무역 데이터 API 키 |
| `TIMEZONEDB_KEY` | TimezoneDB | 시간대 조회 API 키 |

---

## 아키텍처

```
src/
  index.ts                # CLI 진입점 (--help, --list, --tool, stdio 서버)
  protocol/
    mcp-server.ts         # MCP 서버 설정 (stdio 전송)
    tools.ts              # 도구 레지스트리 -- 171개 도구 모두 여기에 집결
  types/
    index.ts              # 공유 타입 (ToolDef, ToolContext, ToolResult)
  utils/
    rate-limiter.ts       # 데이터 소스별 독립 속도 제한기
    cache.ts              # API 응답 TTL 캐시
  sentinel/               # Sentinel-2 영상 도구 (8)
  landsat/                # Landsat 영상 도구 (7)
  firms/                  # NASA FIRMS 화재 도구 (6)
  nasa/                   # NASA 지구 관측 도구 (7)
  nightlights/            # VIIRS 야간 조명 도구 (5)
  planet/                 # Planet Labs 영상 도구 (4)
  aircraft/               # 항공기 추적 도구 (10)
  maritime/               # 선박 추적 도구 (8)
  space/                  # 우주 추적 도구 (6)
  military/               # 군사 정보 도구 (8)
  conflict/               # 분쟁 이벤트 도구 (6)
  environment/            # 환경 모니터링 도구 (6)
  ocean/                  # 해양 정보 도구 (5)
  seismic/                # 지진 재해 도구 (5)
  weather/                # 날씨 정보 도구 (6)
  terrain/                # 지형 고도 도구 (6)
  infrastructure/         # 인프라 모니터링 도구 (6)
  sanctions/              # 제재 심사 도구 (5)
  cyber/                  # 사이버-지리 정보 도구 (6)
  population/             # 인구 통계 도구 (5)
  agriculture/            # 농업 식량 안보 도구 (5)
  humanitarian/           # 인도주의 위기 도구 (5)
  trade/                  # 무역 정보 도구 (5)
  osm/                    # OpenStreetMap 도구 (8)
  geo/                    # 지리공간 계산 도구 (8)
  spectral/               # 분광 분석 도구 (8)
  change/                 # 변화 탐지 도구 (6)
  meta/                   # Meta 도구 (1)
```

**설계 결정:**

- **27개 카테고리, 1개 서버** &mdash; 각 데이터 소스는 독립 모듈입니다. 에이전트가 쿼리에 따라 적절한 도구를 자율적으로 선택합니다.
- **데이터 소스별 독립 속도 제한** &mdash; 각 데이터 소스는 해당 API의 제한에 맞게 보정된 자체 `RateLimiter` 인스턴스를 가집니다. 공유 병목 없음.
- **TTL 캐시** &mdash; 위성 영상 검색(15분), 지진 데이터(5분), 날씨 데이터(10분) 결과가 캐시되어 다중 도구 워크플로에서 불필요한 API 호출을 방지합니다.
- **우아한 저하** &mdash; API 키가 없어도 서버가 중단되지 않습니다. 도구가 설명적 오류 메시지를 반환합니다: "COPERNICUS_CLIENT_ID를 설정하여 Sentinel-2 영상 검색을 활성화하세요."
- **2개 의존성** &mdash; `@modelcontextprotocol/sdk`와 `zod`. 모든 HTTP는 네이티브 `fetch`로 구현.

---

## 기여

기여를 환영합니다! 개발 설정, 코딩 규칙, 제출 절차에 대해서는 [CONTRIBUTING.md](../../CONTRIBUTING.md)를 참조하세요.

---

## MCP 보안 스위트 시리즈

| 프로젝트 | 도메인 | 도구 수 |
|---------|--------|---------|
| [hackbrowser-mcp](https://github.com/badchars/hackbrowser-mcp) | 브라우저 기반 보안 테스트 | 39개 도구 |
| [cloud-audit-mcp](https://github.com/badchars/cloud-audit-mcp) | 클라우드 보안 (AWS/Azure/GCP) | 38개 도구 |
| [github-security-mcp](https://github.com/badchars/github-security-mcp) | GitHub 보안 태세 | 39개 도구 |
| [cve-mcp](https://github.com/badchars/cve-mcp) | 취약점 인텔리전스 | 23개 도구 |
| [osint-mcp-server](https://github.com/badchars/osint-mcp-server) | OSINT 및 정찰 | 37개 도구 |
| [darknet-mcp-server](https://github.com/badchars/darknet-mcp-server) | 다크웹 및 위협 인텔리전스 | 66개 도구 |
| **satellite-mcp** | **지리공간 정보 (GEOINT)** | **171개 도구** |

---

<p align="center">
<b>승인된 보안 테스트 및 평가 목적으로만 사용하세요.</b><br>
어떤 대상에 대해서든 정보 수집을 수행하기 전에 반드시 적절한 권한을 확보하세요.
</p>

<p align="center">
  <a href="../../LICENSE">MIT License</a> &bull; Bun + TypeScript로 제작
</p>
