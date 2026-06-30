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
  <img src="https://img.shields.io/badge/tools-171-ef4444" alt="171 ferramentas">
  <img src="https://img.shields.io/badge/protocol-MCP-8b5cf6" alt="MCP compativel">
  <img src="https://img.shields.io/badge/config-zero-22c55e" alt="configuracao zero">
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
  <strong>Portugues (Brasil)</strong> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Turkce</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.el.md">Ελληνικά</a> |
  <a href="README.vi.md">Tieng Viet</a>
</p>

---

# satellite-mcp

**Full-Spectrum GEOINT MCP Server** -- 171 ferramentas em 27 categorias para reconhecimento geoespacial, imageamento por satelite, monitoramento ambiental e analise de defesa.

satellite-mcp e um servidor [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) que equipa assistentes de IA com capacidades abrangentes de inteligencia geografica (GEOINT). De dados multiespectrais do Sentinel-2, passando por rastreamento de trafego maritimo em tempo real, ate monitoramento de conflitos -- tudo por meio de uma interface unica e padronizada.

## Inicio rapido

### Instalacao via npm

```bash
npm install -g satellite-mcp
```

### Uso com npx

```bash
npx satellite-mcp
```

### Configuracao para Claude Desktop

Adicione o seguinte ao seu arquivo `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "satellite": {
      "command": "npx",
      "args": ["-y", "satellite-mcp"],
      "env": {
        "SENTINEL_HUB_TOKEN": "seu-token",
        "NASA_FIRMS_API_KEY": "sua-chave",
        "NASA_EARTHDATA_TOKEN": "seu-token"
      }
    }
  }
}
```

### Comandos CLI

```bash
# Listar todas as ferramentas disponiveis
npx satellite-mcp --list

# Executar uma ferramenta individual
npx satellite-mcp --tool <nome-da-ferramenta> '<parametros-json>'

# Exibir ajuda
npx satellite-mcp --help
```

## Categorias de ferramentas

| Categoria | Ferramentas | Descricao |
|-----------|-------------|-----------|
| Sentinel-2 | 8 | Imageamento multiespectral por satelite (ESA Copernicus) |
| Landsat | 7 | Dados de observacao da Terra de longo prazo (USGS/NASA) |
| NASA FIRMS | 6 | Deteccao de incendios e fontes termicas em tempo real |
| NASA Earth | 7 | Dados de ciencias da Terra e eventos naturais |
| Luzes noturnas | 5 | Dados de iluminacao noturna (VIIRS/DMSP) |
| Planet Labs | 4 | Imageamento diario de alta resolucao |
| Inteligencia aeronautica | 10 | Rastreamento de voos e monitoramento do espaco aereo |
| Inteligencia maritima | 8 | Trafego maritimo e rastreamento AIS |
| Militar e defesa | 8 | Infraestrutura de defesa e movimentacao de tropas |
| Espaco e orbital | 6 | Rastreamento de satelites e consciencia situacional espacial |
| Conflitos e eventos | 6 | Monitoramento de conflitos e dados de eventos (ACLED) |
| Meio ambiente | 6 | Monitoramento ambiental e dados climaticos |
| Infraestrutura critica | 6 | Usinas, dutos e telecomunicacoes |
| Sancoes | 5 | Listas de sancoes e verificacao de conformidade |
| Terreno | 6 | Modelos de elevacao e analise de terreno |
| Ciber-Geo | 6 | Geolocalizacao de ameacas ciberneticas |
| Populacao | 5 | Densidade populacional e demografia |
| Agricultura | 5 | Saude das plantacoes e indices de vegetacao |
| Humanitario | 5 | Resposta a desastres e dados de refugiados |
| Oceano | 5 | Superficie marinha e oceanografia |
| Comercio | 5 | Rotas comerciais e atividades portuarias |
| Sismica | 5 | Monitoramento de terremotos e dados sismicos |
| OSM | 8 | Consultas geoespaciais OpenStreetMap |
| Geocodificacao | 8 | Geocodificacao direta/reversa |
| Analise espectral | 8 | Calculos de bandas e analise de indices |
| Deteccao de mudancas | 6 | Comparacoes temporais e analise de mudancas |
| Clima | 6 | Dados meteorologicos e previsoes |

## Chaves de API

A maioria das ferramentas funciona com APIs publicas gratuitas. Para acesso ampliado, voce pode configurar as seguintes chaves de API como variaveis de ambiente:

| Variavel | Provedor | Obrigatorio |
|----------|----------|-------------|
| `SENTINEL_HUB_TOKEN` | Copernicus Data Space | Opcional |
| `NASA_FIRMS_API_KEY` | NASA FIRMS | Opcional |
| `NASA_EARTHDATA_TOKEN` | NASA Earthdata | Opcional |
| `PLANET_API_KEY` | Planet Labs | Opcional |
| `AVIATIONSTACK_API_KEY` | AviationStack | Opcional |
| `MARINETRAFFIC_API_KEY` | MarineTraffic | Opcional |
| `ACLED_API_KEY` | ACLED | Opcional |
| `ORS_API_KEY` | OpenRouteService | Opcional |
| `OPENWEATHER_API_KEY` | OpenWeatherMap | Opcional |

Todas as chaves de API sao opcionais. Quando as chaves estao ausentes, as ferramentas retornam mensagens de erro descritivas.

## Arquitetura

```
satellite-mcp/
  src/
    index.ts              # Ponto de entrada e CLI
    protocol/
      tools.ts            # Registro de ferramentas MCP
    providers/
      sentinel/           # Provedor Sentinel-2
      landsat/            # Provedor Landsat
      firms/              # Provedor NASA FIRMS
      ...                 # 27 diretorios de provedores
    utils/
      cache.ts            # Cache TTL
      rate-limiter.ts     # Limitacao de taxa
```

- **Runtime:** Bun (desenvolvimento), Node.js (publicacao npm)
- **Transport:** stdio
- **Dependencias:** @modelcontextprotocol/sdk, zod
- **Padrao:** Cada provedor em seu proprio diretorio sob `src/providers/`

## Contribuicao

Contribuicoes sao bem-vindas. Por favor, abra uma issue primeiro para discutir as alteracoes planejadas.

1. Faca um fork do repositorio
2. Crie um branch de feature (`git checkout -b feature/meu-feature`)
3. Faca commit das suas alteracoes (`git commit -m 'feat: novo feature'`)
4. Faca push do branch (`git push origin feature/meu-feature`)
5. Abra um Pull Request

## Licenca

MIT
