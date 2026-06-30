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
  <a href="README.ja.md">日本語</a> |
  <strong>Polski</strong> |
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
  <a href="README.hi.md">हिन्दी</a>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="../../.github/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="../../.github/banner-light.svg">
    <img alt="satellite-mcp" src="../../.github/banner-dark.svg" width="600">
  </picture>
</p>

<h3 align="center">Serwer MCP GEOINT pelnego spektrum dla agentow AI.</h3>

<p align="center">
  Sentinel-2, Landsat, NASA FIRMS, oswietlenie nocne, sledzenie samolotow i statkow, wywiad wojskowy i obronny, zdarzenia konfliktowe, sankcje, blockchain-geo, dane pogodowe &mdash; zjednoczone w jednym serwerze MCP ze 171 narzedziami w 27 kategoriach.<br>
  Twoj agent AI otrzymuje <b>pelne spektrum wywiadu geoprzestrzennego na zadanie</b>, a nie dziesiatki API-ow i reczna korelacje danych.
</p>

<br>

<p align="center">
  <a href="#szybki-start">Szybki Start</a> &bull;
  <a href="#kategorie-narzedzi-27-kategorii--171-narzedzi">Kategorie Narzedzi</a> &bull;
  <a href="#klucze-api">Klucze API</a> &bull;
  <a href="#architektura">Architektura</a> &bull;
  <a href="#wspolpraca">Wspolpraca</a> &bull;
  <a href="#licencja">Licencja</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/v/satellite-mcp.svg" alt="npm"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Licencja"></a>
  <img src="https://img.shields.io/badge/tools-171-ef4444" alt="171 Narzedzi">
  <img src="https://img.shields.io/badge/MCP-compatible-8b5cf6" alt="Kompatybilny z MCP">
  <img src="https://img.shields.io/badge/config-zero-10b981" alt="Zero konfiguracji">
</p>

---

## Przeglad

**satellite-mcp** to serwer MCP GEOINT (Geospatial Intelligence) pelnego spektrum, ktory daje twojemu agentowi AI 171 narzedzi w 27 kategoriach przez [Model Context Protocol](https://modelcontextprotocol.io). Od zdjec satelitarnych i detekcji pozarow po sledzenie samolotow, analize ruchu morskiego, wywiad wojskowy i monitorowanie konfliktow &mdash; agent ma dostep do wszystkiego w jednej rozmowie.

---

## Szybki Start

### Opcja 1: npx (bez instalacji)

```bash
npx satellite-mcp
```

### Opcja 2: Instalacja globalna

```bash
npm install -g satellite-mcp
satellite-mcp
```

### Polacz ze swoim agentem AI

<details open>
<summary><b>Claude Code</b></summary>

```bash
claude mcp add satellite-mcp -- npx satellite-mcp
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

Dodaj do `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"]
    }
  }
}
```

</details>

<details>
<summary><b>Cursor / Windsurf / inni klienci MCP</b></summary>

Ten sam format konfiguracji JSON. Ustaw komende na `npx satellite-mcp` lub sciezke lokalnej instalacji.

</details>

---

## Kategorie Narzedzi (27 kategorii / 171 narzedzi)

| Kategoria | Narzedzia | Opis |
|-----------|-----------|------|
| Sentinel-2 | 8 | Optyczne zdjecia satelitarne z ESA Sentinel-2 |
| Landsat | 7 | Obrazy multispektralne z programu USGS Landsat |
| NASA FIRMS | 6 | Aktywne pozary i anomalie termiczne w czasie zblionym do rzeczywistego |
| NASA Earth | 7 | Dane obserwacji Ziemi NASA i zdarzenia naturalne |
| Oswietlenie nocne | 5 | Dane VIIRS o oswietleniu nocnym dla urbanizacji i aktywnosci ekonomicznej |
| Planet Labs | 4 | Obrazy o wysokiej rozdzielczosci z konstelacji Planet Labs |
| Wywiad lotniczy | 10 | Sledzenie samolotow, identyfikacja i wywiad o trasach |
| Wywiad morski | 8 | Sledzenie statkow, aktywnosc portowa i morski obraz sytuacyjny |
| Wojsko i Obronnosc | 8 | Obiekty obronne, rozmieszczenia i monitorowanie aktywnosci wojskowej |
| Przestrzen kosmiczna i Orbita | 6 | Sledzenie satelitow, pogoda kosmiczna i wywiad orbitalny |
| Konflikty i Zdarzenia | 6 | Strefy konfliktowe, dane o zdarzeniach ACLED i sledzenie przemocy |
| Srodowisko | 6 | Klimat, jakosc powietrza, utrata lasow i monitoring srodowiska |
| Infrastruktura krytyczna | 6 | Energia, transport i ochrona infrastruktury krytycznej |
| Sankcje | 5 | Globalne listy sankcji, zgodnosc handlowa i kontrole |
| Teren | 6 | Dane wysokosciowe, analiza terenu i wywiad topograficzny |
| Cyber-Geo | 6 | Lokalizacja geograficzna cyberzagrozen i geolokacja IP |
| Ludnosc | 5 | Dane demograficzne, analiza gestosci zaludnienia |
| Rolnictwo | 5 | Zdrowie upraw, indeks wegetacji i monitorowanie rolnictwa |
| Pomoc humanitarna | 5 | Mapowanie kryzysowe, ruchy uchodzcow i reakcja humanitarna |
| Ocean | 5 | Temperatura powierzchni morza, prady i monitoring oceaniczny |
| Handel | 5 | Handel globalny, szlaki handlowe i wywiad lancucha dostaw |
| Sejsmika | 5 | Trzesienia ziemi, aktywnosc sejsmiczna i monitoring tektoniczny |
| OSM | 8 | Dane OpenStreetMap, wyszukiwanie infrastruktury i zapytania geoprzestrzenne |
| Geokodowanie | 8 | Wyszukiwanie adresow, odwrotne geokodowanie i wyszukiwanie lokalizacji |
| Analiza spektralna | 8 | Analiza obrazow multispektralnych i hiperspektralnych |
| Detekcja zmian | 6 | Porownanie temporalne i detekcja zmian w zdjeciach satelitarnych |
| Pogoda | 6 | Aktualne warunki pogodowe, prognozy i dane meteorologiczne |

---

## Klucze API

Wiele narzedzi dziala bez kluczy API, korzystajac z ogolnodostepnych zrodel danych. Zrodla danych premium wymagaja oddzielnych kluczy API konfigurowanych jako zmienne srodowiskowe.

```bash
# Przyklady opcjonalnych kluczy API
export SENTINEL_API_KEY=your-key
export NASA_API_KEY=your-key
export PLANET_API_KEY=your-key
export OPENWEATHER_API_KEY=your-key
```

Wszystkie klucze sa opcjonalne. Serwer degraduje lagodnie i zwraca opisowe komunikaty o bledach, gdy brakuje klucza dla danego narzedzia.

---

## Architektura

```
src/
  index.ts                # Punkt wejscia CLI i konfiguracja serwera MCP
  protocol/
    tools.ts              # Rejestr narzedzi — wszystkie 171 narzedzi zmontowanych tutaj
  providers/
    sentinel/             # Narzedzia obrazow Sentinel-2 (8)
    landsat/              # Narzedzia obrazow Landsat (7)
    firms/                # Narzedzia pozarowe NASA FIRMS (6)
    nasa-earth/           # Obserwacja Ziemi NASA (7)
    nightlights/          # Narzedzia oswietlenia nocnego VIIRS (5)
    planet/               # Narzedzia Planet Labs (4)
    aircraft/             # Narzedzia wywiadu lotniczego (10)
    maritime/             # Narzedzia wywiadu morskiego (8)
    military/             # Narzedzia wojskowe i obronne (8)
    space/                # Narzedzia kosmiczne i orbitalne (6)
    conflict/             # Narzedzia konfliktow i zdarzen (6)
    environmental/        # Narzedzia srodowiskowe (6)
    infrastructure/       # Narzedzia infrastruktury krytycznej (6)
    sanctions/            # Narzedzia sankcji (5)
    terrain/              # Narzedzia terenu (6)
    cyber-geo/            # Narzedzia cyber-geo (6)
    population/           # Narzedzia ludnosciowe (5)
    agriculture/          # Narzedzia rolnicze (5)
    humanitarian/         # Narzedzia humanitarne (5)
    ocean/                # Narzedzia oceaniczne (5)
    trade/                # Narzedzia handlowe (5)
    seismic/              # Narzedzia sejsmiczne (5)
    osm/                  # Narzedzia OpenStreetMap (8)
    geocoding/            # Narzedzia geokodowania (8)
    spectral/             # Narzedzia analizy spektralnej (8)
    change-detection/     # Narzedzia detekcji zmian (6)
    weather/              # Narzedzia pogodowe (6)
```

**Decyzje projektowe:**

- **27 dostawcow, 1 serwer** &mdash; Kazde zrodlo danych to niezalezny modul. Agent wybiera ktore narzedzia uzyc na podstawie zapytania.
- **Ograniczniki zapytan per dostawca** &mdash; Kazde zrodlo danych ma wlasna instancje `RateLimiter` skalibrowana do limitow danego API.
- **Cachowanie TTL** &mdash; Dane satelitarne, pogodowe i geopolityczne feeds sa cachowane aby uniknac nadmiarowych wywolan API.
- **Lagodna degradacja** &mdash; Brakujace klucze API nie powoduja awarii serwera. Narzedzia zwracaja opisowe komunikaty o bledach.
- **Zero konfiguracji** &mdash; `npx satellite-mcp` &mdash; jedna komenda, bez konfiguracji.

---

## Wspolpraca

Wspolpraca jest mile widziana. Otworz issue lub wyslij pull request.

---

## Licencja

[MIT](../../LICENSE)

<p align="center">
  Zbudowane z TypeScript &bull; Napedzane przez Model Context Protocol
</p>
