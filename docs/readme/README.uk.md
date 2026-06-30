<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="../../.github/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="../../.github/banner-light.svg">
    <img alt="satellite-mcp" src="../../.github/banner-dark.svg" width="600">
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/v/satellite-mcp.svg" alt="npm version"></a>
  <a href="https://github.com/AumLabs/satellite-mcp/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>
  <img src="https://img.shields.io/badge/tools-171-ef4444" alt="171 інструментів">
  <img src="https://img.shields.io/badge/protocol-MCP-8b5cf6" alt="MCP сумісний">
  <img src="https://img.shields.io/badge/config-zero-22c55e" alt="нульова конфігурація">
</p>

<p align="center">
  <a href="../../README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zh-TW.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Espanol</a> |
  <a href="README.fr.md">Francais</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.pt-BR.md">Portugues (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Turkce</a> |
  <strong>Українська</strong> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.el.md">Ελληνικά</a> |
  <a href="README.vi.md">Tieng Viet</a>
</p>

---

# satellite-mcp

**Full-Spectrum GEOINT MCP Server** -- 171 інструмент у 27 категоріях для геопросторової розвідки, супутникової зйомки, моніторингу довкілля та оборонного аналізу.

satellite-mcp -- це [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) сервер, який надає AI-асистентам повний спектр можливостей географічної розвідки (GEOINT). Від мультиспектральних даних Sentinel-2, через відстеження морського руху в реальному часі, до моніторингу конфліктів -- все через єдиний, стандартизований інтерфейс.

## Швидкий старт

### Встановлення через npm

```bash
npm install -g satellite-mcp
```

### Використання з npx

```bash
npx satellite-mcp
```

### Налаштування для Claude Desktop

Додайте наступне до вашого файлу `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"],
      "env": {
        "SENTINEL_HUB_TOKEN": "ваш-токен",
        "NASA_FIRMS_API_KEY": "ваш-ключ",
        "NASA_EARTHDATA_TOKEN": "ваш-токен"
      }
    }
  }
}
```

### CLI-команди

```bash
# Показати всі доступні інструменти
npx satellite-mcp --list

# Запустити окремий інструмент
npx satellite-mcp --tool <назва-інструмента> '<json-параметри>'

# Показати довідку
npx satellite-mcp --help
```

## Категорії інструментів

| Категорія | Інструменти | Опис |
|-----------|-------------|------|
| Sentinel-2 | 8 | Мультиспектральна супутникова зйомка (ESA Copernicus) |
| Landsat | 7 | Довгострокові дані спостереження за Землею (USGS/NASA) |
| NASA FIRMS | 6 | Виявлення пожеж та теплових джерел у реальному часі |
| NASA Earth | 7 | Дані наук про Землю та природні явища |
| Нічні вогні | 5 | Дані нічного освітлення (VIIRS/DMSP) |
| Planet Labs | 4 | Щоденна зйомка високої роздільної здатності |
| Авіаційна розвідка | 10 | Відстеження польотів та моніторинг повітряного простору |
| Морська розвідка | 8 | Морський рух та AIS-відстеження |
| Військова справа та оборона | 8 | Оборонна інфраструктура та переміщення військ |
| Космос та орбіта | 6 | Відстеження супутників та ситуаційна обізнаність у космосі |
| Конфлікти та події | 6 | Моніторинг конфліктів та дані подій (ACLED) |
| Довкілля | 6 | Моніторинг довкілля та кліматичні дані |
| Критична інфраструктура | 6 | Електростанції, трубопроводи та телекомунікації |
| Санкції | 5 | Санкційні списки та перевірка відповідності |
| Рельєф | 6 | Моделі висот та аналіз рельєфу |
| Кібер-Гео | 6 | Геолокація кіберзагроз |
| Населення | 5 | Густота населення та демографія |
| Сільське господарство | 5 | Здоров'я посівів та вегетаційні індекси |
| Гуманітарна сфера | 5 | Допомога при катастрофах та дані про біженців |
| Океан | 5 | Поверхня моря та океанографія |
| Торгівля | 5 | Торговельні маршрути та портова діяльність |
| Сейсміка | 5 | Моніторинг землетрусів та сейсмічні дані |
| OSM | 8 | Геопросторові запити OpenStreetMap |
| Геокодування | 8 | Пряме/зворотне геокодування |
| Спектральний аналіз | 8 | Розрахунки каналів та індексний аналіз |
| Виявлення змін | 6 | Часові порівняння та аналіз змін |
| Погода | 6 | Погодні дані та метеорологічні прогнози |

## API-ключі

Більшість інструментів працюють з безкоштовними публічними API. Для розширеного доступу ви можете встановити наступні API-ключі як змінні середовища:

| Змінна | Провайдер | Обов'язковий |
|--------|-----------|--------------|
| `SENTINEL_HUB_TOKEN` | Copernicus Data Space | Необов'язковий |
| `NASA_FIRMS_API_KEY` | NASA FIRMS | Необов'язковий |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | Необов'язковий |
| `PLANET_API_KEY` | Planet Labs | Необов'язковий |
| `AVIATIONSTACK_API_KEY` | AviationStack | Необов'язковий |
| `MARINETRAFFIC_API_KEY` | MarineTraffic | Необов'язковий |
| `ACLED_API_KEY` | ACLED | Необов'язковий |
| `ORS_API_KEY` | OpenRouteService | Необов'язковий |
| `OPENWEATHER_API_KEY` | OpenWeatherMap | Необов'язковий |

Усі API-ключі необов'язкові. Коли ключі відсутні, інструменти повертають описові повідомлення про помилки.

## Архітектура

```
satellite-mcp/
  src/
    index.ts              # Точка входу та CLI
    protocol/
      tools.ts            # Реєстрація MCP-інструментів
    providers/
      sentinel/           # Провайдер Sentinel-2
      landsat/            # Провайдер Landsat
      firms/              # Провайдер NASA FIRMS
      ...                 # 27 директорій провайдерів
    utils/
      cache.ts            # TTL-кеш
      rate-limiter.ts     # Обмеження швидкості
```

- **Runtime:** Bun (розробка), Node.js (публікація npm)
- **Transport:** stdio
- **Залежності:** @modelcontextprotocol/sdk, zod
- **Шаблон:** Кожен провайдер у власній директорії під `src/providers/`

## Внесок

Внески вітаються. Будь ласка, спочатку створіть issue для обговорення запланованих змін.

1. Зробіть форк репозиторію
2. Створіть feature-гілку (`git checkout -b feature/my-feature`)
3. Зробіть коміт змін (`git commit -m 'feat: new feature'`)
4. Запуште гілку (`git push origin feature/my-feature`)
5. Відкрийте Pull Request

## Ліцензія

MIT
