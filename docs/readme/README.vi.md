<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="../../.github/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="../../.github/banner-light.svg">
    <img alt="satellite-mcp" src="../../.github/banner-dark.svg" width="600">
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/v/satellite-mcp.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/dm/satellite-mcp.svg" alt="npm downloads"></a>
  <a href="https://github.com/AumLabs/satellite-mcp/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/satellite-mcp.svg" alt="license"></a>
</p>

<p align="center">
  <a href="../../README.md">English</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.el.md">Ελληνικα</a> |
  <a href="README.es.md">Espanol</a> |
  <a href="README.fr.md">Francais</a> |
  <a href="README.hi.md">हिन्दी</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.nl.md">Nederlands</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.pt-BR.md">Portugues (BR)</a> |
  <a href="README.ro.md">Romana</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.sv.md">Svenska</a> |
  <a href="README.tr.md">Turkce</a> |
  <a href="README.uk.md">Українська</a> |
  <strong>Tieng Viet</strong> |
  <a href="README.zh-CN.md">简体中文</a>
</p>

---

# satellite-mcp

**Full-Spectrum GEOINT MCP Server** -- 171 cong cu trong 27 danh muc cho trinh sat khong gian dia ly, anh ve tinh, giam sat moi truong va phan tich quoc phong.

satellite-mcp la mot server [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) trang bi cho tro ly tri tue nhan tao kha nang trinh sat dia ly (GEOINT) toan dien. Tu du lieu da pho Sentinel-2 va theo doi tau thuyen thoi gian thuc den giam sat xung dot -- tat ca thong qua mot giao dien thong nhat, chuan hoa.

## Bat Dau Nhanh

### Cai dat qua npm

```bash
npm install -g satellite-mcp
```

### Su dung voi npx

```bash
npx satellite-mcp
```

### Cau hinh cho Claude Desktop

Them noi dung sau vao tap tin `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"],
      "env": {
        "SENTINEL_HUB_TOKEN": "your-token",
        "NASA_FIRMS_API_KEY": "your-key",
        "NASA_EARTHDATA_TOKEN": "your-token"
      }
    }
  }
}
```

### Lenh CLI

```bash
# List all available tools
npx satellite-mcp --list

# Run a single tool
npx satellite-mcp --tool <toolname> '<json-params>'

# Show help
npx satellite-mcp --help
```

## Danh Muc Cong Cu

| Danh muc | Cong cu | Mo ta |
|----------|---------|-------|
| Sentinel-2 | 8 | Anh ve tinh da pho (ESA Copernicus) |
| Landsat | 7 | Du lieu quan sat Trai Dat dai han (USGS/NASA) |
| NASA FIRMS | 6 | Phat hien chay va nguon nhiet thoi gian thuc |
| NASA Earth | 7 | Du lieu khoa hoc Trai Dat va hien tuong tu nhien |
| Anh Sang Ban Dem | 5 | Du lieu anh sang ban dem (VIIRS/DMSP) |
| Planet Labs | 4 | Anh do phan giai cao hang ngay |
| Tinh Bao Hang Khong | 10 | Theo doi chuyen bay va giam sat khong phan |
| Tinh Bao Hang Hai | 8 | Giao thong hang hai va theo doi AIS |
| Quan Su & Quoc Phong | 8 | Co so ha tang quoc phong va dieu dong luc luong |
| Khong Gian & Quy Dao | 6 | Theo doi ve tinh va nhan thuc tinh hinh khong gian |
| Xung Dot & Su Kien | 6 | Theo doi xung dot va du lieu su kien (ACLED) |
| Moi Truong | 6 | Giam sat moi truong va du lieu khi hau |
| Ha Tang Trong Yeu | 6 | Nha may dien, duong ong va vien thong |
| Cam Van | 5 | Danh sach cam van va kiem tra tuan thu |
| Dia Hinh | 6 | Mo hinh do cao va phan tich dia hinh |
| Cyber-Geo | 6 | Dinh vi dia ly moi de doa mang |
| Dan So | 5 | Mat do dan so va du lieu nhan khau hoc |
| Nong Nghiep | 5 | Suc khoe cay trong va chi so thuc vat |
| Nhan Dao | 5 | Cuu tro tham hoa va du lieu nguoi ti nan |
| Dai Duong | 5 | Be mat bien va hai duong hoc |
| Thuong Mai | 5 | Tuyen thuong mai va hoat dong cang |
| Dia Chan | 5 | Giam sat dong dat va du lieu dia chan |
| OSM | 8 | Truy van khong gian dia ly OpenStreetMap |
| Ma Hoa Dia Ly | 8 | Ma hoa dia ly thuan/nghich |
| Phan Tich Pho | 8 | Tinh toan bang tan va phan tich chi so |
| Phat Hien Thay Doi | 6 | So sanh thoi gian va phan tich thay doi |
| Thoi Tiet | 6 | Du lieu thoi tiet va du bao khi tuong |

## Khoa API

Hau het cac cong cu hoat dong voi API cong cong mien phi. De co quyen truy cap nang cao, ban co the thiet lap cac khoa API sau lam bien moi truong:

| Bien | Nha cung cap | Bat buoc |
|------|-------------|----------|
| `SENTINEL_HUB_TOKEN` | Copernicus Data Space | Tuy chon |
| `NASA_FIRMS_API_KEY` | NASA FIRMS | Tuy chon |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | Tuy chon |
| `PLANET_API_KEY` | Planet Labs | Tuy chon |
| `AVIATIONSTACK_API_KEY` | AviationStack | Tuy chon |
| `MARINETRAFFIC_API_KEY` | MarineTraffic | Tuy chon |
| `ACLED_API_KEY` | ACLED | Tuy chon |
| `ORS_API_KEY` | OpenRouteService | Tuy chon |
| `OPENWEATHER_API_KEY` | OpenWeatherMap | Tuy chon |

Tat ca cac khoa API deu la tuy chon. Khi thieu khoa, cac cong cu se tra ve thong bao loi ro rang.

## Kien Truc

```
satellite-mcp/
  src/
    index.ts              # Entry point & CLI
    protocol/
      tools.ts            # MCP tool registration
    providers/
      sentinel/           # Sentinel-2 provider
      landsat/            # Landsat provider
      firms/              # NASA FIRMS provider
      ...                 # 27 provider directories
    utils/
      cache.ts            # TTL cache
      rate-limiter.ts     # Rate limiting
```

- **Runtime:** Bun (phat trien), Node.js (xuat ban npm)
- **Transport:** stdio
- **Phu thuoc:** @modelcontextprotocol/sdk, zod
- **Mo hinh:** Moi nha cung cap trong thu muc rieng duoi `src/providers/`

## Dong Gop

Chao don moi dong gop. Vui long mo issue truoc de thao luan ve nhung thay doi du kien.

1. Fork repository
2. Tao feature branch (`git checkout -b feature/my-feature`)
3. Commit cac thay doi (`git commit -m 'feat: new feature'`)
4. Push branch (`git push origin feature/my-feature`)
5. Mo Pull Request

## Giay Phep

MIT
