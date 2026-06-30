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
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.pt-BR.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <strong>বাংলা</strong> |
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

<h3 align="center">AI এজেন্টদের জন্য সম্পূর্ণ-বর্ণালী GEOINT MCP সার্ভার।</h3>

<p align="center">
  Sentinel-2, Landsat, NASA FIRMS, রাতের আলো, বিমান ও জাহাজ ট্র্যাকিং, সামরিক ও প্রতিরক্ষা গোয়েন্দা তথ্য, সংঘাত ঘটনা, নিষেধাজ্ঞা, সাইবার-ভূগোল, আবহাওয়া তথ্য &mdash; সবকিছু একটি মাত্র MCP সার্ভারে একত্রিত, 27টি বিভাগে 171টি টুল।<br>
  আপনার AI এজেন্ট পাবে <b>চাহিদা অনুযায়ী সম্পূর্ণ-বর্ণালী ভূ-স্থানিক গোয়েন্দা তথ্য</b>, কয়েক ডজন API এবং হাতে হাতে তথ্য সমন্বয় নয়।
</p>

<br>

<p align="center">
  <a href="#দ্রুত-শুরু">দ্রুত শুরু</a> &bull;
  <a href="#টুল-বিভাগ-27-বিভাগ--171-টুল">টুল বিভাগ</a> &bull;
  <a href="#api-কী">API কী</a> &bull;
  <a href="#স্থাপত্য">স্থাপত্য</a> &bull;
  <a href="#অবদান">অবদান</a> &bull;
  <a href="#লাইসেন্স">লাইসেন্স</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/v/satellite-mcp.svg" alt="npm"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="লাইসেন্স"></a>
  <img src="https://img.shields.io/badge/tools-171-ef4444" alt="171 টুল">
  <img src="https://img.shields.io/badge/MCP-compatible-8b5cf6" alt="MCP সামঞ্জস্যপূর্ণ">
  <img src="https://img.shields.io/badge/config-zero-10b981" alt="কনফিগ শূন্য">
</p>

---

## সংক্ষিপ্ত বিবরণ

**satellite-mcp** হলো একটি সম্পূর্ণ-বর্ণালী GEOINT (Geospatial Intelligence) MCP সার্ভার যা আপনার AI এজেন্টকে [Model Context Protocol](https://modelcontextprotocol.io)-এর মাধ্যমে 27টি বিভাগে 171টি টুল প্রদান করে। স্যাটেলাইট ইমেজ এবং অগ্নি শনাক্তকরণ থেকে শুরু করে বিমান ট্র্যাকিং, জাহাজ চলাচল বিশ্লেষণ, সামরিক গোয়েন্দা তথ্য এবং সংঘাত পর্যবেক্ষণ পর্যন্ত &mdash; এজেন্ট একটি মাত্র কথোপকথনে সবকিছু অ্যাক্সেস করতে পারে।

---

## দ্রুত শুরু

### বিকল্প 1: npx (ইনস্টলেশন ছাড়া)

```bash
npx satellite-mcp
```

### বিকল্প 2: গ্লোবাল ইনস্টলেশন

```bash
npm install -g satellite-mcp
satellite-mcp
```

### আপনার AI এজেন্টের সাথে সংযোগ করুন

<details open>
<summary><b>Claude Code</b></summary>

```bash
claude mcp add satellite-mcp -- npx satellite-mcp
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

`~/Library/Application Support/Claude/claude_desktop_config.json`-এ যোগ করুন:

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
<summary><b>Cursor / Windsurf / অন্যান্য MCP ক্লায়েন্ট</b></summary>

একই JSON কনফিগারেশন ফরম্যাট। কমান্ডটি `npx satellite-mcp` অথবা আপনার স্থানীয় ইনস্টলেশন পাথের দিকে নির্দেশ করুন।

</details>

---

## টুল বিভাগ (27 বিভাগ / 171 টুল)

| বিভাগ | টুল | বিবরণ |
|-------|------|-------|
| Sentinel-2 | 8 | ESA Sentinel-2 থেকে অপটিক্যাল স্যাটেলাইট ইমেজ |
| Landsat | 7 | USGS Landsat প্রোগ্রাম থেকে মাল্টিস্পেকট্রাল ইমেজ |
| NASA FIRMS | 6 | প্রায়-রিয়েলটাইমে সক্রিয় দাবানল এবং তাপীয় অসঙ্গতি |
| NASA Earth | 7 | NASA পৃথিবী পর্যবেক্ষণ তথ্য এবং প্রাকৃতিক ঘটনা |
| রাতের আলো | 5 | নগরায়ণ ও অর্থনৈতিক কর্মকাণ্ডের জন্য VIIRS রাতের আলোর তথ্য |
| Planet Labs | 4 | Planet Labs নক্ষত্রমণ্ডল থেকে উচ্চ-রেজোলিউশনের দৈনিক ইমেজ |
| বিমান গোয়েন্দা | 10 | বিমান ট্র্যাকিং, শনাক্তকরণ এবং রুট গোয়েন্দা তথ্য |
| সামুদ্রিক গোয়েন্দা | 8 | জাহাজ ট্র্যাকিং, বন্দর কার্যকলাপ এবং সামুদ্রিক ডোমেইন সচেতনতা |
| সামরিক ও প্রতিরক্ষা | 8 | প্রতিরক্ষা স্থাপনা, মোতায়েন এবং সামরিক কার্যকলাপ পর্যবেক্ষণ |
| মহাকাশ ও কক্ষপথ | 6 | স্যাটেলাইট ট্র্যাকিং, মহাকাশ আবহাওয়া এবং কক্ষপথ গোয়েন্দা তথ্য |
| সংঘাত ও ঘটনা | 6 | সংঘাত অঞ্চল, ACLED ঘটনা তথ্য এবং সহিংসতা ট্র্যাকিং |
| পরিবেশ | 6 | জলবায়ু, বায়ু মান, বনভূমি ক্ষতি এবং পরিবেশ পর্যবেক্ষণ |
| গুরুত্বপূর্ণ অবকাঠামো | 6 | জ্বালানি, পরিবহন এবং গুরুত্বপূর্ণ অবকাঠামো সুরক্ষা |
| নিষেধাজ্ঞা | 5 | বৈশ্বিক নিষেধাজ্ঞা তালিকা, বাণিজ্য সম্মতি এবং নিয়ন্ত্রণ পরীক্ষা |
| ভূমিরূপ | 6 | উচ্চতা তথ্য, ভূমিরূপ বিশ্লেষণ এবং ভূ-সংস্থানিক গোয়েন্দা তথ্য |
| সাইবার-ভূগোল | 6 | সাইবার হুমকি ও IP-এর ভৌগলিক অবস্থান নির্ণয় |
| জনসংখ্যা | 5 | জনসংখ্যাতাত্ত্বিক তথ্য এবং জনসংখ্যা ঘনত্ব বিশ্লেষণ |
| কৃষি | 5 | ফসলের স্বাস্থ্য, উদ্ভিদ সূচক এবং কৃষি পর্যবেক্ষণ |
| মানবিক | 5 | সংকট মানচিত্রকরণ, শরণার্থী প্রবাহ এবং মানবিক সাড়া |
| মহাসাগর | 5 | সমুদ্রপৃষ্ঠের তাপমাত্রা, স্রোত এবং মহাসাগর পর্যবেক্ষণ |
| বাণিজ্য | 5 | বৈশ্বিক বাণিজ্য, শিপিং রুট এবং সরবরাহ শৃঙ্খল গোয়েন্দা তথ্য |
| ভূকম্পন | 5 | ভূমিকম্প পর্যবেক্ষণ, ভূকম্পনীয় কার্যকলাপ এবং ভূগর্ভস্থ পর্যবেক্ষণ |
| OSM | 8 | OpenStreetMap তথ্য, অবকাঠামো অনুসন্ধান এবং ভূ-স্থানিক প্রশ্ন |
| জিওকোডিং | 8 | ঠিকানা অনুসন্ধান, বিপরীত জিওকোডিং এবং স্থান অনুসন্ধান |
| বর্ণালী বিশ্লেষণ | 8 | মাল্টিস্পেকট্রাল এবং হাইপারস্পেকট্রাল ইমেজ বিশ্লেষণ |
| পরিবর্তন শনাক্তকরণ | 6 | সময়ভিত্তিক তুলনা এবং স্যাটেলাইট ইমেজে পরিবর্তন শনাক্তকরণ |
| আবহাওয়া | 6 | বর্তমান আবহাওয়া পরিস্থিতি, পূর্বাভাস এবং আবহাওয়া বিষয়ক তথ্য |

---

## API কী

অনেক টুল বিনামূল্যে উপলব্ধ তথ্যসূত্র ব্যবহার করে API কী ছাড়াই কাজ করে। প্রিমিয়াম তথ্যসূত্রের জন্য পরিবেশ ভেরিয়েবল হিসেবে সেট করা যায় এমন আলাদা API কী প্রয়োজন।

```bash
export SENTINEL_API_KEY=your-key
export NASA_API_KEY=your-key
export PLANET_API_KEY=your-key
export OPENWEATHER_API_KEY=your-key
```

সমস্ত কী ঐচ্ছিক। সার্ভার সুন্দরভাবে কার্যক্ষমতা হ্রাস করে এবং নির্দিষ্ট টুলের জন্য কী অনুপস্থিত থাকলে বর্ণনামূলক ত্রুটি বার্তা প্রদান করে।

---

## স্থাপত্য

```
src/
  index.ts                # CLI এন্ট্রি পয়েন্ট এবং MCP সার্ভার সেটআপ
  protocol/
    tools.ts              # টুল রেজিস্ট্রি — সমস্ত 171টি টুল এখানে নিবন্ধিত
  providers/
    sentinel/             # Sentinel-2 ইমেজিং টুল (8)
    landsat/              # Landsat ইমেজিং টুল (7)
    firms/                # NASA FIRMS অগ্নি টুল (6)
    nasa-earth/           # NASA পৃথিবী পর্যবেক্ষণ (7)
    nightlights/          # VIIRS রাতের আলো টুল (5)
    planet/               # Planet Labs টুল (4)
    aircraft/             # বিমান গোয়েন্দা টুল (10)
    maritime/             # সামুদ্রিক গোয়েন্দা টুল (8)
    military/             # সামরিক ও প্রতিরক্ষা টুল (8)
    space/                # মহাকাশ ও কক্ষপথ টুল (6)
    conflict/             # সংঘাত ও ঘটনা টুল (6)
    environmental/        # পরিবেশ টুল (6)
    infrastructure/       # গুরুত্বপূর্ণ অবকাঠামো টুল (6)
    sanctions/            # নিষেধাজ্ঞা টুল (5)
    terrain/              # ভূমিরূপ টুল (6)
    cyber-geo/            # সাইবার-ভূগোল টুল (6)
    population/           # জনসংখ্যা টুল (5)
    agriculture/          # কৃষি টুল (5)
    humanitarian/         # মানবিক টুল (5)
    ocean/                # মহাসাগর টুল (5)
    trade/                # বাণিজ্য টুল (5)
    seismic/              # ভূকম্পন টুল (5)
    osm/                  # OpenStreetMap টুল (8)
    geocoding/            # জিওকোডিং টুল (8)
    spectral/             # বর্ণালী বিশ্লেষণ টুল (8)
    change-detection/     # পরিবর্তন শনাক্তকরণ টুল (6)
    weather/              # আবহাওয়া টুল (6)
```

**নকশা নীতিমালা:**

- **27 প্রদানকারী, 1 সার্ভার** &mdash; প্রতিটি তথ্যসূত্র একটি স্বাধীন মডিউল। এজেন্ট প্রশ্নের ভিত্তিতে উপযুক্ত টুল নির্বাচন করে।
- **প্রদানকারী-প্রতি রেট লিমিটার** &mdash; প্রতিটি তথ্যসূত্রের নিজস্ব `RateLimiter` ইনস্ট্যান্স রয়েছে যা সেই API-এর সীমা অনুযায়ী ক্যালিব্রেট করা।
- **TTL ক্যাশিং** &mdash; স্যাটেলাইট তথ্য, আবহাওয়া এবং ভূ-রাজনৈতিক ফিড ক্যাশ করা হয় অপ্রয়োজনীয় API কল এড়াতে।
- **সুন্দর অবক্ষয়** &mdash; অনুপস্থিত API কী সার্ভার ক্র্যাশ করে না। টুলগুলো বর্ণনামূলক ত্রুটি বার্তা প্রদান করে।
- **শূন্য কনফিগারেশন** &mdash; `npx satellite-mcp` &mdash; একটি কমান্ড, কোনো সেটআপ প্রয়োজন নেই।

---

## অবদান

অবদান স্বাগত। একটি Issue খুলুন অথবা Pull Request জমা দিন।

---

## লাইসেন্স

[MIT](../../LICENSE)

<p align="center">
  TypeScript দিয়ে তৈরি &bull; Model Context Protocol দ্বারা চালিত
</p>
