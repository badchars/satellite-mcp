<div dir="rtl">

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
  <strong>العربية</strong> |
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

<h3 align="center">خادم MCP للاستخبارات الجغرافية المكانية الشاملة لوكلاء الذكاء الاصطناعي.</h3>

<p align="center">
  Sentinel-2، Landsat، NASA FIRMS، الأضواء الليلية، تتبع الطائرات والسفن، الاستخبارات العسكرية والدفاعية، أحداث النزاعات، العقوبات، الجغرافيا السيبرانية، بيانات الطقس &mdash; كلها مجمعة في خادم MCP واحد يضم 171 أداة عبر 27 فئة.<br>
  يحصل وكيل الذكاء الاصطناعي الخاص بك على <b>استخبارات جغرافية مكانية شاملة عند الطلب</b>، وليس عشرات واجهات برمجة التطبيقات والربط اليدوي للبيانات.
</p>

<br>

<p align="center">
  <a href="#البداية-السريعة">البداية السريعة</a> &bull;
  <a href="#فئات-الأدوات-27-فئة--171-أداة">فئات الأدوات</a> &bull;
  <a href="#مفاتيح-api">مفاتيح API</a> &bull;
  <a href="#البنية">البنية</a> &bull;
  <a href="#المساهمة">المساهمة</a> &bull;
  <a href="#الرخصة">الرخصة</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/v/satellite-mcp.svg" alt="npm"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="الرخصة"></a>
  <img src="https://img.shields.io/badge/tools-171-ef4444" alt="171 أداة">
  <img src="https://img.shields.io/badge/MCP-compatible-8b5cf6" alt="متوافق مع MCP">
  <img src="https://img.shields.io/badge/config-zero-10b981" alt="بدون إعدادات">
</p>

---

## نظرة عامة

**satellite-mcp** هو خادم MCP للاستخبارات الجغرافية المكانية الشاملة (GEOINT) يمنح وكيل الذكاء الاصطناعي الخاص بك 171 أداة عبر 27 فئة من خلال [Model Context Protocol](https://modelcontextprotocol.io). من صور الأقمار الصناعية واكتشاف الحرائق إلى تتبع الطائرات وتحليل حركة السفن والاستخبارات العسكرية ومراقبة النزاعات &mdash; يحصل الوكيل على كل شيء في محادثة واحدة.

---

## البداية السريعة

### الخيار 1: npx (بدون تثبيت)

```bash
npx satellite-mcp
```

### الخيار 2: التثبيت العام

```bash
npm install -g satellite-mcp
satellite-mcp
```

### الاتصال بوكيل الذكاء الاصطناعي

<details open>
<summary><b>Claude Code</b></summary>

```bash
claude mcp add satellite-mcp -- npx satellite-mcp
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

أضف إلى `~/Library/Application Support/Claude/claude_desktop_config.json`:

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
<summary><b>Cursor / Windsurf / عملاء MCP أخرى</b></summary>

نفس تنسيق إعدادات JSON. قم بتوجيه الأمر إلى `npx satellite-mcp` أو مسار التثبيت المحلي.

</details>

---

## فئات الأدوات (27 فئة / 171 أداة)

| الفئة | الأدوات | الوصف |
|-------|---------|-------|
| Sentinel-2 | 8 | صور الأقمار الصناعية البصرية من ESA Sentinel-2 |
| Landsat | 7 | صور متعددة الأطياف من برنامج USGS Landsat |
| NASA FIRMS | 6 | الحرائق النشطة والشذوذات الحرارية في الوقت شبه الفعلي |
| NASA Earth | 7 | بيانات رصد الأرض والأحداث الطبيعية من NASA |
| الأضواء الليلية | 5 | بيانات الأضواء الليلية VIIRS للتحضر والنشاط الاقتصادي |
| Planet Labs | 4 | صور يومية عالية الدقة من كوكبة Planet Labs |
| استخبارات الطيران | 10 | تتبع الطائرات وتحديد هويتها واستخبارات المسارات |
| الاستخبارات البحرية | 8 | تتبع السفن ونشاط الموانئ والوعي بالمجال البحري |
| العسكرية والدفاع | 8 | المنشآت الدفاعية والانتشار ومراقبة النشاط العسكري |
| الفضاء والمدارات | 6 | تتبع الأقمار الصناعية وطقس الفضاء والاستخبارات المدارية |
| النزاعات والأحداث | 6 | مناطق النزاع وبيانات أحداث ACLED وتتبع العنف |
| البيئة | 6 | المناخ وجودة الهواء وفقدان الغابات والمراقبة البيئية |
| البنية التحتية الحيوية | 6 | الطاقة والنقل وحماية البنية التحتية الحيوية |
| العقوبات | 5 | قوائم العقوبات العالمية والامتثال التجاري وفحوصات الرقابة |
| التضاريس | 6 | بيانات الارتفاع وتحليل التضاريس والاستخبارات الطبوغرافية |
| الجغرافيا السيبرانية | 6 | تحديد الموقع الجغرافي للتهديدات السيبرانية وتحديد موقع IP |
| السكان | 5 | البيانات الديموغرافية وتحليل الكثافة السكانية |
| الزراعة | 5 | صحة المحاصيل ومؤشرات الغطاء النباتي والمراقبة الزراعية |
| الشؤون الإنسانية | 5 | رسم خرائط الأزمات وتدفقات اللاجئين والاستجابة الإنسانية |
| المحيطات | 5 | درجة حرارة سطح البحر والتيارات ومراقبة المحيطات |
| التجارة | 5 | التجارة العالمية وطرق الشحن واستخبارات سلاسل التوريد |
| الزلازل | 5 | رصد الزلازل والنشاط الزلزالي والمراقبة التكتونية |
| OSM | 8 | بيانات OpenStreetMap والبحث في البنية التحتية والاستعلامات المكانية |
| الترميز الجغرافي | 8 | البحث عن العناوين والترميز الجغرافي العكسي والبحث عن المواقع |
| التحليل الطيفي | 8 | تحليل الصور متعددة الأطياف وفائقة الأطياف |
| كشف التغيرات | 6 | المقارنة الزمنية وكشف التغيرات في صور الأقمار الصناعية |
| الطقس | 6 | أحوال الطقس الحالية والتوقعات والبيانات المناخية |

---

## مفاتيح API

تعمل العديد من الأدوات بدون مفاتيح API باستخدام مصادر البيانات المتاحة مجانًا. تتطلب مصادر البيانات المتميزة مفاتيح API منفصلة يمكن تعيينها كمتغيرات بيئة.

```bash
export SENTINEL_API_KEY=your-key
export NASA_API_KEY=your-key
export PLANET_API_KEY=your-key
export OPENWEATHER_API_KEY=your-key
```

جميع المفاتيح اختيارية. يتراجع الخادم بسلاسة ويعيد رسائل خطأ وصفية عند فقدان مفتاح لأداة معينة.

---

## البنية

```
src/
  index.ts                # نقطة الدخول CLI وإعداد خادم MCP
  protocol/
    tools.ts              # سجل الأدوات — جميع الأدوات الـ 171 مسجلة هنا
  providers/
    sentinel/             # أدوات صور Sentinel-2 (8)
    landsat/              # أدوات صور Landsat (7)
    firms/                # أدوات حرائق NASA FIRMS (6)
    nasa-earth/           # رصد الأرض من NASA (7)
    nightlights/          # أدوات الأضواء الليلية VIIRS (5)
    planet/               # أدوات Planet Labs (4)
    aircraft/             # أدوات استخبارات الطيران (10)
    maritime/             # أدوات الاستخبارات البحرية (8)
    military/             # أدوات العسكرية والدفاع (8)
    space/                # أدوات الفضاء والمدارات (6)
    conflict/             # أدوات النزاعات والأحداث (6)
    environmental/        # أدوات البيئة (6)
    infrastructure/       # أدوات البنية التحتية الحيوية (6)
    sanctions/            # أدوات العقوبات (5)
    terrain/              # أدوات التضاريس (6)
    cyber-geo/            # أدوات الجغرافيا السيبرانية (6)
    population/           # أدوات السكان (5)
    agriculture/          # أدوات الزراعة (5)
    humanitarian/         # أدوات الشؤون الإنسانية (5)
    ocean/                # أدوات المحيطات (5)
    trade/                # أدوات التجارة (5)
    seismic/              # أدوات الزلازل (5)
    osm/                  # أدوات OpenStreetMap (8)
    geocoding/            # أدوات الترميز الجغرافي (8)
    spectral/             # أدوات التحليل الطيفي (8)
    change-detection/     # أدوات كشف التغيرات (6)
    weather/              # أدوات الطقس (6)
```

**مبادئ التصميم:**

- **27 مزودًا، خادم واحد** &mdash; كل مصدر بيانات هو وحدة مستقلة. يختار الوكيل الأدوات المناسبة بناءً على الاستعلام.
- **محدد معدل لكل مزود** &mdash; لكل مصدر بيانات نسخة `RateLimiter` خاصة به مُعايرة وفقًا لحدود واجهة برمجة التطبيقات.
- **تخزين مؤقت بمدة انتهاء** &mdash; يتم تخزين بيانات الأقمار الصناعية والطقس والتغذيات الجيوسياسية مؤقتًا لتجنب استدعاءات API الزائدة.
- **تراجع سلس** &mdash; مفاتيح API المفقودة لا تُعطل الخادم. تعيد الأدوات رسائل خطأ وصفية.
- **بدون إعدادات** &mdash; `npx satellite-mcp` &mdash; أمر واحد، لا حاجة لأي إعداد.

---

## المساهمة

المساهمات مرحب بها. افتح مشكلة أو أرسل طلب سحب.

---

## الرخصة

[MIT](../../LICENSE)

<p align="center">
  مبني بـ TypeScript &bull; مدعوم بـ Model Context Protocol
</p>

</div>
