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
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.el.md">Ελληνικά</a> |
  <strong>हिन्दी</strong>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="../../.github/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="../../.github/banner-light.svg">
    <img alt="satellite-mcp" src="../../.github/banner-dark.svg" width="600">
  </picture>
</p>

<h3 align="center">AI एजेंट्स के लिए पूर्ण-स्पेक्ट्रम GEOINT MCP सर्वर।</h3>

<p align="center">
  Sentinel-2, Landsat, NASA FIRMS, रात्रि प्रकाश, विमान और जहाज ट्रैकिंग, सैन्य और रक्षा खुफिया जानकारी, संघर्ष घटनाएं, प्रतिबंध, साइबर-भूगोल, मौसम डेटा &mdash; सभी एक ही MCP सर्वर में एकीकृत, 27 श्रेणियों में 171 टूल।<br>
  आपके AI एजेंट को मिलता है <b>मांग पर पूर्ण-स्पेक्ट्रम भू-स्थानिक खुफिया जानकारी</b>, दर्जनों API और मैनुअल डेटा सहसंबंध नहीं।
</p>

<br>

<p align="center">
  <a href="#त्वरित-शुरुआत">त्वरित शुरुआत</a> &bull;
  <a href="#टूल-श्रेणियां-27-श्रेणियां--171-टूल">टूल श्रेणियां</a> &bull;
  <a href="#api-कुंजियां">API कुंजियां</a> &bull;
  <a href="#आर्किटेक्चर">आर्किटेक्चर</a> &bull;
  <a href="#योगदान">योगदान</a> &bull;
  <a href="#लाइसेंस">लाइसेंस</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/satellite-mcp"><img src="https://img.shields.io/npm/v/satellite-mcp.svg" alt="npm"></a>
  <a href="../../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="लाइसेंस"></a>
  <img src="https://img.shields.io/badge/tools-171-ef4444" alt="171 टूल">
  <img src="https://img.shields.io/badge/MCP-compatible-8b5cf6" alt="MCP संगत">
  <img src="https://img.shields.io/badge/config-zero-10b981" alt="शून्य कॉन्फिग">
</p>

---

## अवलोकन

**satellite-mcp** एक पूर्ण-स्पेक्ट्रम GEOINT (Geospatial Intelligence) MCP सर्वर है जो आपके AI एजेंट को [Model Context Protocol](https://modelcontextprotocol.io) के माध्यम से 27 श्रेणियों में 171 टूल प्रदान करता है। उपग्रह इमेजरी और आग का पता लगाने से लेकर विमान ट्रैकिंग, जहाज यातायात विश्लेषण, सैन्य खुफिया जानकारी और संघर्ष निगरानी तक &mdash; एजेंट को एक ही बातचीत में सब कुछ उपलब्ध होता है।

---

## त्वरित शुरुआत

### विकल्प 1: npx (इंस्टॉलेशन नहीं चाहिए)

```bash
npx satellite-mcp
```

### विकल्प 2: ग्लोबल इंस्टॉलेशन

```bash
npm install -g satellite-mcp
satellite-mcp
```

### अपने AI एजेंट से जोड़ें

<details open>
<summary><b>Claude Code</b></summary>

```bash
claude mcp add satellite-mcp -- npx satellite-mcp
```

</details>

<details>
<summary><b>Claude Desktop</b></summary>

`~/Library/Application Support/Claude/claude_desktop_config.json` में जोड़ें:

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
<summary><b>Cursor / Windsurf / अन्य MCP क्लाइंट</b></summary>

वही JSON कॉन्फिगरेशन फॉर्मेट। कमांड को `npx satellite-mcp` या अपने लोकल इंस्टॉलेशन पाथ की ओर इंगित करें।

</details>

---

## टूल श्रेणियां (27 श्रेणियां / 171 टूल)

| श्रेणी | टूल | विवरण |
|--------|------|-------|
| Sentinel-2 | 8 | ESA Sentinel-2 से ऑप्टिकल सैटेलाइट इमेजरी |
| Landsat | 7 | USGS Landsat प्रोग्राम से मल्टीस्पेक्ट्रल इमेजरी |
| NASA FIRMS | 6 | लगभग-रियलटाइम में सक्रिय आग और थर्मल विसंगतियां |
| NASA Earth | 7 | NASA पृथ्वी अवलोकन डेटा और प्राकृतिक घटनाएं |
| रात्रि प्रकाश | 5 | शहरीकरण और आर्थिक गतिविधि के लिए VIIRS रात्रि प्रकाश डेटा |
| Planet Labs | 4 | Planet Labs नक्षत्र से उच्च-रिज़ॉल्यूशन दैनिक इमेजरी |
| विमान खुफिया | 10 | विमान ट्रैकिंग, पहचान और रूट खुफिया जानकारी |
| समुद्री खुफिया | 8 | जहाज ट्रैकिंग, बंदरगाह गतिविधि और समुद्री क्षेत्र जागरूकता |
| सैन्य और रक्षा | 8 | रक्षा सुविधाएं, तैनाती और सैन्य गतिविधि निगरानी |
| अंतरिक्ष और कक्षीय | 6 | उपग्रह ट्रैकिंग, अंतरिक्ष मौसम और कक्षीय खुफिया जानकारी |
| संघर्ष और घटनाएं | 6 | संघर्ष क्षेत्र, ACLED घटना डेटा और हिंसा ट्रैकिंग |
| पर्यावरण | 6 | जलवायु, वायु गुणवत्ता, वन हानि और पर्यावरण निगरानी |
| महत्वपूर्ण अवसंरचना | 6 | ऊर्जा, परिवहन और महत्वपूर्ण अवसंरचना सुरक्षा |
| प्रतिबंध | 5 | वैश्विक प्रतिबंध सूची, व्यापार अनुपालन और नियंत्रण जांच |
| भूभाग | 6 | ऊंचाई डेटा, भूभाग विश्लेषण और स्थलाकृतिक खुफिया जानकारी |
| साइबर-भूगोल | 6 | साइबर खतरों और IP का भौगोलिक स्थान निर्धारण |
| जनसंख्या | 5 | जनसांख्यिकीय डेटा और जनसंख्या घनत्व विश्लेषण |
| कृषि | 5 | फसल स्वास्थ्य, वनस्पति सूचकांक और कृषि निगरानी |
| मानवीय | 5 | संकट मानचित्रण, शरणार्थी प्रवाह और मानवीय प्रतिक्रिया |
| महासागर | 5 | समुद्र सतह तापमान, धाराएं और महासागर निगरानी |
| व्यापार | 5 | वैश्विक व्यापार, शिपिंग रूट और आपूर्ति श्रृंखला खुफिया जानकारी |
| भूकंप | 5 | भूकंप निगरानी, भूकंपीय गतिविधि और विवर्तनिक निगरानी |
| OSM | 8 | OpenStreetMap डेटा, अवसंरचना खोज और भू-स्थानिक प्रश्न |
| जियोकोडिंग | 8 | पता खोज, रिवर्स जियोकोडिंग और स्थान खोज |
| स्पेक्ट्रल विश्लेषण | 8 | मल्टीस्पेक्ट्रल और हाइपरस्पेक्ट्रल इमेज विश्लेषण |
| परिवर्तन पहचान | 6 | समय-आधारित तुलना और सैटेलाइट इमेजरी में परिवर्तन पहचान |
| मौसम | 6 | वर्तमान मौसम स्थितियां, पूर्वानुमान और मौसम विज्ञान डेटा |

---

## API कुंजियां

कई टूल मुफ्त उपलब्ध डेटा स्रोतों का उपयोग करके बिना API कुंजी के काम करते हैं। प्रीमियम डेटा स्रोतों के लिए अलग API कुंजियों की आवश्यकता होती है जिन्हें एनवायरनमेंट वेरिएबल के रूप में सेट किया जा सकता है।

```bash
export SENTINEL_API_KEY=your-key
export NASA_API_KEY=your-key
export PLANET_API_KEY=your-key
export OPENWEATHER_API_KEY=your-key
```

सभी कुंजियां वैकल्पिक हैं। सर्वर सुरुचिपूर्ण ढंग से कार्यक्षमता कम करता है और किसी दिए गए टूल के लिए कुंजी अनुपस्थित होने पर वर्णनात्मक त्रुटि संदेश लौटाता है।

---

## आर्किटेक्चर

```
src/
  index.ts                # CLI एंट्री पॉइंट और MCP सर्वर सेटअप
  protocol/
    tools.ts              # टूल रजिस्ट्री — सभी 171 टूल यहां पंजीकृत
  providers/
    sentinel/             # Sentinel-2 इमेजिंग टूल (8)
    landsat/              # Landsat इमेजिंग टूल (7)
    firms/                # NASA FIRMS आग टूल (6)
    nasa-earth/           # NASA पृथ्वी अवलोकन (7)
    nightlights/          # VIIRS रात्रि प्रकाश टूल (5)
    planet/               # Planet Labs टूल (4)
    aircraft/             # विमान खुफिया टूल (10)
    maritime/             # समुद्री खुफिया टूल (8)
    military/             # सैन्य और रक्षा टूल (8)
    space/                # अंतरिक्ष और कक्षीय टूल (6)
    conflict/             # संघर्ष और घटना टूल (6)
    environmental/        # पर्यावरण टूल (6)
    infrastructure/       # महत्वपूर्ण अवसंरचना टूल (6)
    sanctions/            # प्रतिबंध टूल (5)
    terrain/              # भूभाग टूल (6)
    cyber-geo/            # साइबर-भूगोल टूल (6)
    population/           # जनसंख्या टूल (5)
    agriculture/          # कृषि टूल (5)
    humanitarian/         # मानवीय टूल (5)
    ocean/                # महासागर टूल (5)
    trade/                # व्यापार टूल (5)
    seismic/              # भूकंप टूल (5)
    osm/                  # OpenStreetMap टूल (8)
    geocoding/            # जियोकोडिंग टूल (8)
    spectral/             # स्पेक्ट्रल विश्लेषण टूल (8)
    change-detection/     # परिवर्तन पहचान टूल (6)
    weather/              # मौसम टूल (6)
```

**डिज़ाइन सिद्धांत:**

- **27 प्रदाता, 1 सर्वर** &mdash; प्रत्येक डेटा स्रोत एक स्वतंत्र मॉड्यूल है। एजेंट प्रश्न के आधार पर उपयुक्त टूल चुनता है।
- **प्रति-प्रदाता रेट लिमिटर** &mdash; प्रत्येक डेटा स्रोत का अपना `RateLimiter` इंस्टेंस है जो उस API की सीमाओं के अनुसार कैलिब्रेट किया गया है।
- **TTL कैशिंग** &mdash; सैटेलाइट डेटा, मौसम और भू-राजनीतिक फीड को अनावश्यक API कॉल से बचने के लिए कैश किया जाता है।
- **सुरुचिपूर्ण गिरावट** &mdash; अनुपस्थित API कुंजियां सर्वर को क्रैश नहीं करतीं। टूल वर्णनात्मक त्रुटि संदेश लौटाते हैं।
- **शून्य कॉन्फिगरेशन** &mdash; `npx satellite-mcp` &mdash; एक कमांड, कोई सेटअप नहीं।

---

## योगदान

योगदान का स्वागत है। एक Issue खोलें या Pull Request सबमिट करें।

---

## लाइसेंस

[MIT](../../LICENSE)

<p align="center">
  TypeScript से निर्मित &bull; Model Context Protocol द्वारा संचालित
</p>
