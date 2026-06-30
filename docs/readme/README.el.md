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
  <strong>Ελληνικα</strong> |
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
  <a href="README.vi.md">Tieng Viet</a> |
  <a href="README.zh-CN.md">简体中文</a>
</p>

---

# satellite-mcp

**Full-Spectrum GEOINT MCP Server** -- 171 εργαλεια σε 27 κατηγοριες για γεωχωρικη αναγνωριση, δορυφορικη απεικονιση, περιβαλλοντικη παρακολουθηση και αναλυση αμυνας.

Το satellite-mcp ειναι ενας [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server που εξοπλιζει βοηθους τεχνητης νοημοσυνης με ολοκληρωμενες δυνατοτητες γεωγραφικης αναγνωρισης (GEOINT). Απο πολυφασματικα δεδομενα Sentinel-2 και παρακολουθηση πλοιων σε πραγματικο χρονο εως ιχνηλατηση συγκρουσεων -- ολα μεσω μιας ενιαιας, τυποποιημενης διεπαφης.

## Γρηγορη Εκκινηση

### Εγκατασταση μεσω npm

```bash
npm install -g satellite-mcp
```

### Χρηση με npx

```bash
npx satellite-mcp
```

### Ρυθμιση για Claude Desktop

Προσθεστε τα ακολουθα στο αρχειο `claude_desktop_config.json`:

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

### Εντολες CLI

```bash
# List all available tools
npx satellite-mcp --list

# Run a single tool
npx satellite-mcp --tool <toolname> '<json-params>'

# Show help
npx satellite-mcp --help
```

## Κατηγοριες Εργαλειων

| Κατηγορια | Εργαλεια | Περιγραφη |
|-----------|----------|-----------|
| Sentinel-2 | 8 | Πολυφασματικη δορυφορικη απεικονιση (ESA Copernicus) |
| Landsat | 7 | Μακροχρονια δεδομενα παρατηρησης Γης (USGS/NASA) |
| NASA FIRMS | 6 | Ανιχνευση πυρκαγιων και θερμικων πηγων σε πραγματικο χρονο |
| NASA Earth | 7 | Δεδομενα γεωεπιστημων και φυσικα φαινομενα |
| Νυχτερινα Φωτα | 5 | Δεδομενα νυχτερινου φωτισμου (VIIRS/DMSP) |
| Planet Labs | 4 | Υψηλης αναλυσης καθημερινη απεικονιση |
| Αεροπορικη Πληροφορια | 10 | Ιχνηλατηση πτησεων και παρακολουθηση εναεριου χωρου |
| Ναυτικη Πληροφορια | 8 | Θαλασσια κυκλοφορια και ιχνηλατηση AIS |
| Στρατιωτικα & Αμυνα | 8 | Αμυντικες υποδομες και κινησεις δυναμεων |
| Διαστημα & Τροχιες | 6 | Ιχνηλατηση δορυφορων και διαστημικη επιγνωση |
| Συγκρουσεις & Γεγονοτα | 6 | Ιχνηλατηση συγκρουσεων και δεδομενα γεγονοτων (ACLED) |
| Περιβαλλον | 6 | Περιβαλλοντικη παρακολουθηση και κλιματικα δεδομενα |
| Κρισιμες Υποδομες | 6 | Ηλεκτροπαραγωγη, αγωγοι και τηλεπικοινωνιες |
| Κυρωσεις | 5 | Λιστες κυρωσεων και ελεγχος συμμορφωσης |
| Εδαφος | 6 | Υψομετρικα μοντελα και αναλυση εδαφους |
| Cyber-Geo | 6 | Γεωεντοπισμος κυβερνοαπειλων |
| Πληθυσμος | 5 | Πληθυσμιακη πυκνοτητα και δημογραφικα στοιχεια |
| Γεωργια | 5 | Υγεια καλλιεργειων και δεικτες βλαστησης |
| Ανθρωπιστικα | 5 | Αρωγη καταστροφων και δεδομενα προσφυγων |
| Ωκεανος | 5 | Θαλασσιες επιφανειες και ωκεανογραφια |
| Εμποριο | 5 | Εμπορικες διαδρομες και δραστηριοτητα λιμανιων |
| Σεισμικη | 5 | Παρακολουθηση σεισμων και σεισμικα δεδομενα |
| OSM | 8 | Γεωχωρικα ερωτηματα OpenStreetMap |
| Γεωκωδικοποιηση | 8 | Ευθεια/αντιστροφη γεωκωδικοποιηση |
| Φασματικη Αναλυση | 8 | Υπολογισμοι ζωνων και αναλυση δεικτων |
| Ανιχνευση Αλλαγων | 6 | Χρονικες συγκρισεις και αναλυση αλλαγων |
| Καιρος | 6 | Μετεωρολογικα δεδομενα και προγνωσεις |

## Κλειδια API

Τα περισσοτερα εργαλεια λειτουργουν με δωρεαν δημοσια APIs. Για προηγμενη προσβαση, μπορειτε να ορισετε τα ακολουθα κλειδια API ως μεταβλητες περιβαλλοντος:

| Μεταβλητη | Παροχος | Απαιτειται |
|-----------|---------|------------|
| `SENTINEL_HUB_TOKEN` | Copernicus Data Space | Προαιρετικο |
| `NASA_FIRMS_API_KEY` | NASA FIRMS | Προαιρετικο |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | Προαιρετικο |
| `PLANET_API_KEY` | Planet Labs | Προαιρετικο |
| `AVIATIONSTACK_API_KEY` | AviationStack | Προαιρετικο |
| `MARINETRAFFIC_API_KEY` | MarineTraffic | Προαιρετικο |
| `ACLED_API_KEY` | ACLED | Προαιρετικο |
| `ORS_API_KEY` | OpenRouteService | Προαιρετικο |
| `OPENWEATHER_API_KEY` | OpenWeatherMap | Προαιρετικο |

Ολα τα κλειδια API ειναι προαιρετικα. Οταν λειπει ενα κλειδι, τα εργαλεια επιστρεφουν ενα κατατοπιστικο μηνυμα σφαλματος.

## Αρχιτεκτονικη

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

- **Runtime:** Bun (αναπτυξη), Node.js (δημοσιευση npm)
- **Transport:** stdio
- **Εξαρτησεις:** @modelcontextprotocol/sdk, zod
- **Μοτιβο:** Καθε παροχος σε δικο του φακελο κατω απο `src/providers/`

## Συνεισφορα

Οι συνεισφορες ειναι ευπροσδεκτες. Παρακαλω ανοιξτε πρωτα ενα issue για να συζητησετε τις προγραμματισμενες αλλαγες.

1. Κανετε fork το repository
2. Δημιουργηστε ενα feature branch (`git checkout -b feature/my-feature`)
3. Κανετε commit τις αλλαγες σας (`git commit -m 'feat: new feature'`)
4. Κανετε push το branch (`git push origin feature/my-feature`)
5. Ανοιξτε ενα Pull Request

## Αδεια

MIT
