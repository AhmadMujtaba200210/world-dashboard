<p align="center">
  <h1 align="center">🌍 World Dashboard</h1>
  <p align="center">
    <strong>The Open-Source "God Mode" Financial Terminal for the World</strong>
  </p>
  <p align="center">
    A real-time, interactive command center that lets you click any country on a 3D globe and instantly see its economy, stock markets, geopolitics, shipping routes, conflict zones, and breaking news — all in one dense, draggable, multi-pane dashboard.
  </p>
  <p align="center">
    <em>Think Bloomberg Terminal meets Google Earth — but free, open-source, and built for the modern web.</em>
  </p>
</p>

---

## 🚀 The Vision

Most people pay **$24,000/year** for a Bloomberg Terminal. The rest of the world gets Yahoo Finance.

**World Dashboard** exists to close that gap. By combining diamond-tier free data sources (FRED, World Bank, GDELT, ACLED, AIS maritime data, UN Comtrade) with a stunning 3D globe interface, we're building the financial intelligence tool that should already exist — **for free**.

This is not another stock ticker app. This is a **global situational awareness platform** designed from the ground up for:

- **Traders & Portfolio Managers** — Monitor every macro indicator, options flow, and cross-border capital movement in real-time.
- **Investment Bankers** — Country-level due diligence at the speed of thought. Click a country, get its sovereign risk, GDP trajectory, bond yields, and political stability — instantly.
- **Geopolitical Analysts** — Track active conflicts, shipping lane disruptions, sanctions, and diplomatic events overlaid directly on a 3D map.
- **Journalists & Researchers** — A single pane of glass for every data stream that matters.

---

## 📐 Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        WORLD DASHBOARD                               │
│  ┌─────────────┐  ┌──────────────────────────┐  ┌─────────────────┐ │
│  │ Macro Panel  │  │                          │  │  Economy Panel  │ │
│  │ GDP, CPI,    │  │     Interactive 3D       │  │  Stock Index,   │ │
│  │ Interest     │  │     Globe (Three.js)     │  │  Bond Yields,   │ │
│  │ Rates, Debt  │  │                          │  │  FX Rates       │ │
│  ├─────────────┤  │   Click any country →     │  ├─────────────────┤ │
│  │ Breaking     │  │   All panels update      │  │  Options Flow   │ │
│  │ News Feed    │  │                          │  │  Institutional  │ │
│  │ (RSS/GDELT)  │  │   Arcs = Trade Routes    │  │  Order Flow     │ │
│  ├─────────────┤  │   Rings = Conflict Zones  │  ├─────────────────┤ │
│  │ Maritime &   │  │   Heatmap = GDP/Risk     │  │  Geopolitical   │ │
│  │ Shipping     │  │                          │  │  Alerts & Wars  │ │
│  └─────────────┘  └──────────────────────────┘  └─────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
         ▲                      ▲                         ▲
         │                      │                         │
    ┌────┴──────┐         ┌─────┴───────┐          ┌──────┴──────┐
    │ Free APIs │         │ Country     │          │ WebSocket   │
    │ FRED/WB   │         │ Context     │          │ Real-time   │
    │ GDELT     │         │ (React)     │          │ Feeds       │
    └───────────┘         └─────────────┘          └─────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 (App Router) | SSR, API Routes, edge performance |
| **UI System** | Radix UI + shadcn/ui | Accessible, composable, beautiful |
| **3D Globe** | react-globe.gl + Three.js | GPU-accelerated interactive Earth |
| **Grid Layout** | CSS Grid (pure) | Ultra-compact 3-column terminal layout, zero dependencies |
| **Styling** | Tailwind CSS 4 | Dark mode, glassmorphism, micro-animations |
| **State** | React Context + Zustand (planned) | Global country selection state |
| **Data Fetching** | TanStack Query (planned) | Caching, deduplication, background refresh |
| **Charts** | Recharts / Lightweight Charts (planned) | Financial-grade candlestick & line charts |
| **Maps Data** | Natural Earth GeoJSON | 110m admin boundaries for all nations |

---

## ✅ Current Status (~8% Complete)

### What's Working Right Now

| Feature | Status | Details |
|---------|--------|---------|
| 3D Interactive Globe | ✅ Done | Rotatable, zoomable, country polygons with hover/click |
| Country Selection | ✅ Done | Click a country → all panels update dynamically |
| Terminal Layout | ✅ Done | Ultra-compact CSS Grid: 260px side strips + globe center |
| Country Metadata | ✅ Done | 40+ countries with index, currency, capital, region |
| **Live Macro Data** | ✅ **LIVE** | **GDP, GDP Growth, GDP/Capita, Inflation, Unemployment, Debt/GDP, Trade/GDP, FDI — World Bank API (195 nations)** |
| **Live Country Info** | ✅ **LIVE** | **Population, Capital, Area, Region, Currency, Flag, Gini Index — REST Countries API** |
| **Live FX Rates** | ✅ **LIVE** | **30 currency pairs updated daily — Frankfurter API** |
| **Live Ticker Tape** | ✅ **LIVE** | **15 FX rates scrolling in real-time from Frankfurter** |
| **Country Flags** | ✅ **LIVE** | **SVG/PNG flags displayed in status bar from REST Countries** |
| News Widget | 🔶 Mock | Breaking news feed (static placeholder data) |
| Options Flow Widget | 🔶 Mock | Institutional options data display (static) |
| Geopolitical Alerts | 🔶 Mock | Conflict zone alerts with severity levels (static) |
| Maritime Widget | 🔶 Mock | Baltic Dry Index, Suez Canal status (static) |
| Dark Mode | ✅ Done | Premium dark terminal aesthetic |
| No Sidebar / Minimal UI | ✅ Done | Edge-to-edge dense layout, no distractions |

---

## 🗺 Full Roadmap — 100 Phases to Build the Ultimate Free Intelligence Platform

> Current progress: **~2%** (Phases 1-2 complete). 98 phases to go.

---

### 🏗 DOMAIN 1: DATA FOUNDATION (Phases 3-12)

| # | Phase | Free Data Source | What It Adds |
|---|-------|-----------------|-------------|
| 3 | **FRED API - US Macro** | `api.stlouisfed.org` | GDP, CPI, unemployment, fed funds rate, money supply (800k+ series) |
| 4 | **World Bank API - Global Macro** | `api.worldbank.org` | GDP, inflation, population, debt/GDP for every country (16k+ indicators) |
| 5 | **Currency Exchange Rates** | `frankfurter.app` | Real-time FX rates for 170+ currencies, free, no API key |
| 6 | **Yahoo Finance - Indices** | `query1.finance.yahoo.com` | Stock index prices, P/E ratios, market caps (unofficial, free) |
| 7 | **NewsAPI - Headlines** | `newsapi.org` | Breaking news from 150k+ sources filtered by country/topic |
| 8 | **GDELT Project - Events** | `api.gdeltproject.org` | 2.5B+ global events, tone analysis, media monitoring |
| 9 | **RSS Feed Aggregator** | Various RSS feeds | Reuters, Bloomberg, FT, Nikkei tickers via public RSS |
| 10 | **Open Exchange Rates** | `openexchangerates.org` | Hourly currency rates, historical rates back to 1999 |
| 11 | **Alpha Vantage - Stocks** | `alphavantage.co` | Intraday/daily stock data, technical indicators, crypto |
| 12 | **Data Caching Layer** | Local SQLite/Redis | Cache all API responses to respect rate limits, enable offline |

---

### 🌍 DOMAIN 2: GLOBE OVERLAYS (Phases 13-24)

| # | Phase | Free Data Source | What It Adds |
|---|-------|-----------------|-------------|
| 13 | **Trade Route Arcs** | UN Comtrade `comtradeapi.un.org` | Animated arcs showing import/export flows between country pairs |
| 14 | **Conflict Heatmap** | ACLED `acleddata.com` | Pulsating red rings on active battle/riot/protest zones |
| 15 | **Nuclear Facilities** | IAEA PRIS (public data) | Labeled markers for every reactor, enrichment plant worldwide |
| 16 | **Shipping Lanes - AIS** | MarineTraffic community AIS | Animated ship icons along Suez, Hormuz, Malacca, Panama |
| 17 | **GDP Choropleth** | World Bank API | Color countries by GDP per capita, growth rate, or debt ratio |
| 18 | **Sanctions Overlay** | US OFAC SDN List (public) | Red/orange/yellow overlay for sanctioned countries |
| 19 | **Military Bases** | Wikipedia GeoJSON (CC) | Plot major military installations of NATO, China, Russia |
| 20 | **Earthquake Rings** | USGS `earthquake.usgs.gov` | Live earthquake events as expanding rings on the globe |
| 21 | **Volcano Alerts** | Smithsonian GVP (public) | Active volcanic eruption alerts with severity levels |
| 22 | **Refugee Flows** | UNHCR `data.unhcr.org` | Animated arcs showing refugee movement corridors |
| 23 | **Internet Cable Map** | TeleGeography (public data) | Undersea fiber optic cable routes as globe arcs |
| 24 | **Air Traffic Density** | OpenSky Network `opensky-network.org` | Live aircraft positions and density heatmap |

---

### 📊 DOMAIN 3: COUNTRY DEEP DIVE (Phases 25-38)

| # | Phase | Free Data Source | What It Adds |
|---|-------|-----------------|-------------|
| 25 | **Candlestick Charts** | Yahoo Finance / Alpha Vantage | TradingView-style chart for country's main stock index |
| 26 | **Bond Yield Curve** | FRED / World Bank | 2Y, 5Y, 10Y, 30Y government bond yields plotted |
| 27 | **Currency Strength** | frankfurter.app | Historical FX chart vs USD/EUR/GBP |
| 28 | **Top Companies Table** | Yahoo Finance screener | Top 10 companies by market cap per country |
| 29 | **Political Leaders** | CIA World Factbook (public) | Head of state, government type, last election |
| 30 | **Sovereign Credit Rating** | Scraped public ratings | Moody's/S&P/Fitch ratings for 100+ countries |
| 31 | **Population Pyramid** | UN Population `population.un.org` | Age-sex distribution chart |
| 32 | **Trade Partners** | UN Comtrade | Top 5 import/export partners with $ values |
| 33 | **Commodity Production** | USGS Minerals / FAO STAT | What does this country produce? Oil, copper, wheat |
| 34 | **Inflation Timeline** | World Bank / FRED | 20-year historical CPI chart |
| 35 | **Unemployment Trend** | ILO `ilostat.ilo.org` | Country unemployment rate over time |
| 36 | **Foreign Reserves** | IMF `data.imf.org` | Central bank reserves and trends |
| 37 | **National Debt Clock** | World Bank / IMF | Total national debt in real-time with debt/GDP |
| 38 | **Education & HDI** | UNDP `hdr.undp.org` | Human Development Index, literacy, school enrollment |

---

### ⚡ DOMAIN 4: REAL-TIME FEEDS (Phases 39-48)

| # | Phase | Free Data Source | What It Adds |
|---|-------|-----------------|-------------|
| 39 | **WebSocket Ticker** | Finnhub `finnhub.io` (free tier) | Real-time price ticks for US stocks/crypto |
| 40 | **Breaking News Push** | GDELT Real-time API | Auto-updating news feed, polling every 60s |
| 41 | **Market Open/Close Map** | Timezone calculations | Shows which 70+ exchanges are open/closed right now |
| 42 | **VIX Fear Gauge** | CBOE (via Yahoo Finance) | Live volatility index with color-coded threat level |
| 43 | **Crypto Live Feed** | CoinGecko `api.coingecko.com` | Top 50 crypto prices, 24h change, market cap |
| 44 | **Commodity Prices** | Yahoo Finance / Quandl | Oil, Gold, Silver, Copper, Natural Gas live prices |
| 45 | **Treasury Auctions** | US Treasury `treasurydirect.gov` | Upcoming bond auctions, recent results |
| 46 | **Central Bank Calendar** | Scraped from central bank sites | FOMC, ECB, BOJ, BOE meeting dates and decisions |
| 47 | **Earnings Calendar** | Finnhub free tier | Companies reporting earnings this week globally |
| 48 | **IPO Tracker** | SEC EDGAR / Finnhub | Upcoming and recent IPOs worldwide |

---

### 🛡 DOMAIN 5: GEOPOLITICS & SECURITY (Phases 49-60)

| # | Phase | Free Data Source | What It Adds |
|---|-------|-----------------|-------------|
| 49 | **Active Wars Map** | ACLED + Wikipedia | Currently active armed conflicts with casualties |
| 50 | **Terrorism Index** | Global Terrorism Database (public) | Historical terrorism events by country |
| 51 | **Election Calendar** | IFES `electionguide.org` | Upcoming elections worldwide with expected impact |
| 52 | **UN Voting Patterns** | UN Digital Library | How countries vote on key resolutions |
| 53 | **Treaty Tracker** | UN Treaty Collection | Active bilateral/multilateral agreements |
| 54 | **Diplomatic Relations Map** | Wikipedia structured data | Embassy locations, severed/restored diplomatic ties |
| 55 | **Arms Trade Flows** | SIPRI `sipri.org` (public) | Who sells weapons to whom, $ volumes |
| 56 | **Cyber Attack Map** | Kaspersky/Norse (public feeds) | Real-time cyber threat visualization |
| 57 | **Press Freedom Index** | RSF `rsf.org` | Country-level press freedom scores and trends |
| 58 | **Corruption Index** | Transparency International | CPI scores for 180+ countries |
| 59 | **Rule of Law Index** | World Justice Project | Justice system strength by country |
| 60 | **Space Launch Tracker** | Launch Library 2 API (free) | Rocket launches worldwide with live status |

---

### 🚢 DOMAIN 6: TRADE & LOGISTICS (Phases 61-70)

| # | Phase | Free Data Source | What It Adds |
|---|-------|-----------------|-------------|
| 61 | **Port Congestion** | FreightWaves (public data) | Wait times at major ports worldwide |
| 62 | **Container Rates** | Freightos BDI / Drewry | Shipping cost index (Shanghai → LA, Rotterdam, etc.) |
| 63 | **Oil Tanker Tracking** | Community AIS feeds | Track VLCC movements through key chokepoints |
| 64 | **LNG Terminal Map** | GIE `gie.eu` (public data) | LNG import/export terminals with capacity |
| 65 | **Pipeline Map** | Wikipedia / EIA data | Major oil & gas pipelines globally |
| 66 | **Grain Export Flows** | FAO STAT `fao.org` | Wheat, rice, corn export flows by country |
| 67 | **Rare Earth Supply Chain** | USGS Minerals Data | Who produces critical minerals (lithium, cobalt, etc.) |
| 68 | **Semiconductor Supply Chain** | SIA / public trade data | Chip fabrication locations, export dependencies |
| 69 | **Tariff Database** | WTO Tariff Database (public) | Import duties between country pairs |
| 70 | **Free Trade Agreements** | WTO RTA Database | Active FTAs mapped as globe connections |

---

### 🌡 DOMAIN 7: CLIMATE & ENERGY (Phases 71-80)

| # | Phase | Free Data Source | What It Adds |
|---|-------|-----------------|-------------|
| 71 | **Carbon Emissions Map** | Our World in Data `github.com/owid` | CO2 emissions per capita by country |
| 72 | **Renewable Energy Mix** | IRENA `irena.org` (public data) | Solar/wind/hydro % of energy mix per country |
| 73 | **Weather Extremes** | NOAA `api.weather.gov` | Active storms, hurricanes, extreme weather events |
| 74 | **Drought Monitor** | SPEI Global Drought Monitor (free) | Global drought severity map |
| 75 | **Sea Level Rise** | NASA Sea Level `sealevel.nasa.gov` | Satellite-measured sea level change by coast |
| 76 | **Arctic Ice Monitor** | NSIDC `nsidc.org` | Real-time Arctic/Antarctic ice extent |
| 77 | **Wildfire Tracker** | NASA FIRMS (free) | Active fire hotspots from satellite imagery |
| 78 | **Air Quality Index** | OpenAQ `openaq.org` | Real-time AQI for every major city |
| 79 | **Electricity Prices** | ENTSO-E (Europe) / EIA (US) | Real-time electricity spot prices |
| 80 | **Nuclear Power Status** | IAEA PRIS | Operating/under-construction/decommissioned reactors |

---

### 🧠 DOMAIN 8: AI & ANALYTICS (Phases 81-88)

| # | Phase | Free Data Source | What It Adds |
|---|-------|-----------------|-------------|
| 81 | **AI Country Briefing** | Local LLM (Ollama) or Groq | Click a country → AI-generated economic/political summary |
| 82 | **Media Sentiment** | GDELT Tone Scores | Bullish/bearish sentiment gauge from global media |
| 83 | **Correlation Engine** | Calculated from data | Stock index ↔ commodity correlations (oil ↔ Saudi) |
| 84 | **Risk Scoring Model** | Composite calculation | Political + economic + conflict composite risk score |
| 85 | **Anomaly Detection** | Statistical models | Alert when any indicator deviates >2σ from mean |
| 86 | **Scenario Modeling** | Excel-style calculations | "What if oil hits $120?" → cascading impact map |
| 87 | **Portfolio Exposure Map** | User input + geocoding | Input tickers → globe highlights geographic risk |
| 88 | **Trend Predictions** | ARIMA / simple ML | 90-day forecast lines on macro indicator charts |

---

### 🎨 DOMAIN 9: UX, CUSTOMIZATION & ACCESS (Phases 89-96)

| # | Phase | What It Adds |
|---|-------|-------------|
| 89 | **Command Palette** | `Ctrl+K` spotlight search — type "Japan" → instant selection |
| 90 | **Keyboard Shortcuts** | `Ctrl+G` globe focus, arrow keys country navigation |
| 91 | **Saved Layouts** | Save/load custom layouts: "Asia Focus", "War Room", "Commodities" |
| 92 | **Watchlists** | Pin countries, tickers, events for quick access |
| 93 | **Export & Share** | Download any panel as CSV/PDF, share dashboard snapshots |
| 94 | **Responsive Mobile** | Auto-stacking grid on mobile/tablet, touch gestures |
| 95 | **PWA Support** | Installable as standalone app, offline mode with cached data |
| 96 | **Dark/Light/Custom Themes** | Full theming engine with user-defined color palettes |

---

### 🌐 DOMAIN 10: ECOSYSTEM & COMMUNITY (Phases 97-100)

| # | Phase | What It Adds |
|---|-------|-------------|
| 97 | **Plugin System** | Developer SDK to build custom widgets (Crypto Whales, Earthquake Feed) |
| 98 | **Public REST API** | Expose aggregated country risk scores and data via API |
| 99 | **Docker Self-Hosting** | One-command `docker compose up` for full deployment |
| 100 | **Open Dataset Publishing** | Curated, versioned country risk datasets as open data on GitHub |

---

## 💎 The "Diamond-Tier" Free Data Sources

These are the gold-mine APIs that most people don't know exist:

| Source | What It Does | Why It's Special |
|--------|-------------|-----------------|
| **FRED** | 800,000+ economic time series | The Fed's own data. Treasury yields, GDP, money supply, employment — all free |
| **World Bank API** | Every macro indicator for every country | 16,000+ indicators. GDP, Gini, life expectancy, trade, poverty — all free |
| **GDELT Project** | Monitors *every* news article on Earth | 2.5B+ events catalogued. Tone analysis, geolocation, conflict tracking — all free |
| **ACLED** | Armed conflict event data | Exact lat/long of battles, riots, protests worldwide. Updated weekly — free tier |
| **UN Comtrade** | International trade flows | Who imports what from where? $-value trade data for every country pair — free |
| **AIS Marine Traffic** | Ship positions globally | Tracks container ships, tankers, naval vessels. Free tiers via community feeds |
| **IAEA** | Nuclear facility locations | Every reactor, enrichment plant, and research facility on Earth — public data |
| **Natural Earth** | Geographic boundaries | Professional-grade GeoJSON/TopoJSON for every country, state, city — free |
| **Open Exchange Rates** | 170+ currency rates | Updated hourly. Enough for most use cases — free tier |

---

## 🏃 Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/world-dashboard.git
cd world-dashboard

# Install dependencies
npm install

# Enable live aircraft + vessel feeds (optional but recommended)
cp .env.example .env.local
# then fill AISSTREAM_API_KEY (+ OPENSKY_CLIENT_ID/OPENSKY_CLIENT_SECRET for faster aircraft refresh)

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — click any country on the 3D globe and watch the entire dashboard react.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (ThemeProvider, CountryProvider)
│   ├── page.tsx            # Main dashboard page
│   ├── api/live/aircraft/  # OpenSky relay endpoint (cached/rate-aware)
│   ├── api/live/vessels/   # AISStream relay endpoint (server websocket cache)
│   └── globals.css         # Global styles
├── components/
│   ├── dashboard/
│   │   ├── dashboard-grid.tsx   # Multi-pane grid with 7 reactive widgets
│   │   └── world-globe.tsx      # Interactive 3D Globe (react-globe.gl)
│   ├── ui/                      # shadcn/ui components (Card, Badge, etc.)
│   └── theme-provider.tsx       # Dark mode provider
├── context/
│   └── country-context.tsx      # Global state for selected country (40+ countries)
└── lib/
    ├── server/
    │   ├── opensky.ts           # OpenSky auth + normalized aircraft snapshots
    │   └── ais-stream.ts        # AISStream websocket manager + vessel snapshots
    └── utils.ts                 # Utility functions
```

---

## 🤝 Contributing

This project is in its early stages (~2% complete). There are **hundreds of features** waiting to be built. If you're passionate about finance, geopolitics, data visualization, or open-source — this is your playground.

**High-impact first contributions:**
1. Add a new country to `country-context.tsx` with its metadata
2. Connect any free API (FRED, World Bank, NewsAPI) to replace mock data in any widget
3. Add a new globe overlay (trade arcs, conflict rings, shipping lanes)
4. Build a new widget (commodity prices, crypto feed, earnings calendar)
5. Improve mobile responsiveness

---

## 📄 License

MIT — Free as in freedom. Use it, fork it, sell it, whatever. Just build something awesome.

---

<p align="center">
  <strong>Built with 🌍 by humans who believe financial intelligence should be free.</strong>
</p>
