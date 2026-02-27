# 🌍 World Dashboard — 1000-Phase Master Roadmap

> **The most ambitious open-source intelligence platform ever attempted.**
> Every phase adds a new layer of free data, visualization, or capability.
> Current progress: **~8%** (Phases 1-80 scoped, ~20 implemented).

---

## How This Roadmap Works

- **Each phase = one deployable feature chunk** (1-3 days of focused work)
- **50 domains × 20 phases each = 1,000 phases total**
- **All data sources are FREE** — no paid APIs, no subscriptions, no vendor lock-in
- **Day-by-day execution** — pick any phase, implement it, check it off

---

## 📊 DOMAIN 1: MACROECONOMIC DATA (Phases 1-20)
*Source: World Bank, FRED, IMF, OECD*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 1 | ✅ Project foundation | Next.js + shadcn/ui | Base framework, dark mode, layout |
| 2 | ✅ Interactive 3D globe | react-globe.gl | Country polygons, hover, click |
| 3 | ✅ World Bank GDP/Inflation | `api.worldbank.org` | GDP, growth, inflation for 195 nations |
| 4 | ✅ REST Countries enrichment | `restcountries.com` | Population, capital, flags, area, Gini |
| 5 | ✅ Live FX rates | `frankfurter.app` | 30 currency pairs, daily updates |
| 6 | FRED US deep dive | `api.stlouisfed.org` | 800K+ series: yield curves, M2, PCE, housing |
| 7 | IMF Article IV data | `data.imf.org` | Balance of payments, reserves, exchange regimes |
| 8 | OECD leading indicators | `stats.oecd.org` | CLI, BCI, manufacturing PMI for 38 OECD nations |
| 9 | Historical GDP 50yr charts | World Bank archive | Interactive time-series charts for GDP since 1970 |
| 10 | Inflation decomposition | FRED + World Bank | CPI sub-components: food, energy, shelter, transport |
| 11 | Interest rate tracker | Central bank websites | Policy rates for 50+ central banks, updated daily |
| 12 | Money supply (M1/M2/M3) | FRED + ECB | Monetary aggregates for US, EU, Japan, China, UK |
| 13 | Government revenue/spending | World Bank GFS | Revenue, expenditure, fiscal balance as % of GDP |
| 14 | Current account balances | IMF BOP | Trade surplus/deficit visualization on globe |
| 15 | Purchasing power parity | World Bank ICP | PPP-adjusted GDP comparison across countries |
| 16 | Producer price index | FRED + OECD | PPI as leading indicator for CPI |
| 17 | Wage growth tracker | ILO + BLS | Nominal/real wage growth by country |
| 18 | Housing price index | BIS `bis.org` | Residential property prices for 60 countries |
| 19 | Consumer confidence | OECD CCI | Consumer confidence indices globally |
| 20 | Macro dashboard presets | — | Pre-built views: "Recession Watch", "Emerging Markets", "G7 Summit" |

---

## 💱 DOMAIN 2: CURRENCY & FOREX (Phases 21-40)
*Source: Frankfurter, ECB, BIS, Open Exchange Rates*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 21 | FX pair deep dive | frankfurter.app | Historical FX charts with 90-day, 1yr, 5yr ranges |
| 22 | Cross-rate matrix | Calculated | NxN cross-rate table for top 20 currencies |
| 23 | Currency strength index | Calculated | Composite strength score (DXY-like for any currency) |
| 24 | Real effective exchange rate | BIS REER data | Inflation-adjusted trade-weighted exchange rates |
| 25 | FX volatility heatmap | Calculated from history | Color globe by 30-day FX volatility per currency |
| 26 | Central bank intervention tracker | News + IMF | Flag known FX interventions (Japan, China, Switzerland) |
| 27 | Currency carry trade monitor | Interest rate diff | Show carry trade returns: high-yield vs low-yield pairs |
| 28 | Dollar milkshake indicator | DXY + flows | USD strength vs EM currencies composite |
| 29 | Crypto cross-rates | CoinGecko | BTC/ETH priced in every fiat currency |
| 30 | Currency regime map | IMF AREAER | Float/peg/managed — color-coded globe overlay |
| 31 | Stablecoin dominance | CoinGecko | USDT/USDC market cap vs local currencies |
| 32 | Gold-backed currency tracker | WGC data | Central bank gold reserves as % of currency backing |
| 33 | Capital controls index | IMF AREAER | Countries with active capital flow restrictions |
| 34 | De-dollarization tracker | SWIFT + IMF | USD vs CNY vs EUR share in global reserves |
| 35 | FX options implied vol | Public data | 25-delta risk reversals for major pairs |
| 36 | Purchasing power map | Big Mac Index + PPP | Real purchasing power comparison across cities |
| 37 | Remittance flows | World Bank | Top remittance corridors as globe arcs |
| 38 | Black market premium | Parallel rate scrapers | Official vs unofficial FX rates (Argentina, Nigeria, etc.) |
| 39 | Currency devaluation alerts | Calculated | Alert when a currency drops >5% in 24 hours |
| 40 | FX correlation matrix | Calculated | Which currencies move together? Heatmap |

---

## 📈 DOMAIN 3: STOCK MARKETS & EQUITIES (Phases 41-60)
*Source: Yahoo Finance, Alpha Vantage, Finnhub, SEC EDGAR*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 41 | Global indices tracker | Yahoo Finance | 70+ stock indices with live prices |
| 42 | Candlestick charts | Lightweight Charts | TradingView-style OHLCV for any index |
| 43 | Market cap world map | Yahoo Finance | Globe colored by total stock market cap per country |
| 44 | Sector rotation monitor | Yahoo Finance | 11 GICS sectors performance heatmap |
| 45 | Earnings calendar | Finnhub free tier | Companies reporting this week, globally |
| 46 | IPO tracker | SEC EDGAR + Finnhub | Upcoming and recent IPOs worldwide |
| 47 | Top companies by country | Yahoo Finance screener | Top 10 by market cap for each exchange |
| 48 | PE ratio heatmap | Yahoo Finance | Globe colored by average PE ratio per country |
| 49 | Dividend yield map | Yahoo Finance | Highest dividend-yielding markets globally |
| 50 | Market breadth indicators | Calculated | Advance/decline, new highs/lows for each market |
| 51 | Insider trading tracker | SEC EDGAR Form 4 | Insider buys/sells for US equities |
| 52 | Short interest monitor | FINRA data | Most shorted stocks globally |
| 53 | ETF flow tracker | ETF.com + sponsors | Capital inflows/outflows by country ETFs |
| 54 | Volatility surface | CBOE data | VIX term structure and global vol indices |
| 55 | Market correlation matrix | Calculated | Which stock markets move together? |
| 56 | Market opening hours map | Timezone calc | Live view of which exchanges are open now |
| 57 | Index rebalancing alerts | Exchange websites | Additions/removals from major indices |
| 58 | Stock spinoffs & M&A | SEC EDGAR | Major corporate actions globally |
| 59 | Small-cap vs large-cap | Russell 2000 vs S&P 500 | Risk appetite indicator |
| 60 | Market regime detector | Calculated | Bull/bear/sideways classification per market |

---

## 🏦 DOMAIN 4: FIXED INCOME & BONDS (Phases 61-80)
*Source: FRED, US Treasury, ECB, BIS*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 61 | US yield curve | FRED | 1M to 30Y Treasury yields, inversion alerts |
| 62 | Global yield curves | World Bank + scrapers | Yield curves for 20+ countries |
| 63 | Credit spreads | FRED ICE BofA | IG vs HY spreads, stress indicators |
| 64 | Sovereign CDS spreads | Public data | Credit default swap prices for 50 countries |
| 65 | Bond auction tracker | US Treasury Direct | Upcoming auctions, bid-to-cover ratios |
| 66 | Sovereign credit ratings | Moody's/S&P/Fitch | Rating history, outlook, watchlist |
| 67 | EM bond spreads | JPM EMBI (proxy) | Emerging market bond risk premium |
| 68 | Inflation-linked bonds | FRED TIPS | Real yields and breakeven inflation |
| 69 | Central bank balance sheets | FRED + ECB + BOJ | Fed/ECB/BOJ/PBOC balance sheet size over time |
| 70 | QE/QT tracker | Central bank data | Quantitative easing/tightening timeline |
| 71 | Municipal bonds | EMMA MSRB | US municipal bond yields by state |
| 72 | Corporate bond issuance | SIFMA | New corporate bond deals globally |
| 73 | Negative-yielding debt map | BIS + Bloomberg proxy | Countries with negative real yields |
| 74 | Duration risk heatmap | Calculated | Interest rate sensitivity by country |
| 75 | Fiscal deficit alerts | World Bank | Countries where deficit exceeds 5% GDP |
| 76 | Debt maturity wall | IMF + Treasury | Upcoming sovereign debt maturations |
| 77 | Yield curve inversion map | Calculated | Globe showing which countries have inverted curves |
| 78 | Bond market size | BIS | Total outstanding debt by country |
| 79 | Foreign holders of US debt | US Treasury TIC | Who owns US Treasuries? Globe arcs |
| 80 | Fixed income dashboard preset | — | "Bond Bear", "Rate Cut Watch", "EM Stress" views |

---

## ⛽ DOMAIN 5: COMMODITIES & ENERGY (Phases 81-100)
*Source: EIA, USDA, LME, USGS, OPEC*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 81 | Oil prices (WTI/Brent) | Yahoo Finance | Live crude oil with historical charts |
| 82 | Natural gas global | EIA + Yahoo | Henry Hub, TTF, JKM gas prices |
| 83 | Gold & silver | Yahoo Finance | Precious metals with USD/oz charts |
| 84 | Copper & industrial metals | LME (public) | Copper, aluminum, nickel, zinc prices |
| 85 | Agricultural commodities | USDA + Yahoo | Wheat, corn, soybeans, coffee, sugar |
| 86 | OPEC production tracker | OPEC MOMR (public) | Monthly oil production by OPEC member |
| 87 | Strategic petroleum reserves | EIA | US SPR levels with drawdown alerts |
| 88 | Refinery utilization | EIA | US/EU refinery capacity utilization |
| 89 | Commodity futures curves | Yahoo Finance | Contango/backwardation visualization |
| 90 | Producer country map | USGS + FAO | Who produces what? Globe overlay |
| 91 | Rare earth supply chain | USGS Minerals | Lithium, cobalt, nickel, REE production |
| 92 | Water stress index | Aqueduct WRI | Water scarcity risk by country |
| 93 | Fertilizer price tracker | World Bank CMO | Urea, DAP, potash prices |
| 94 | Timber & forestry | FAO FRA | Global forest cover change rates |
| 95 | Fisheries data | FAO | Global fish catch by country |
| 96 | Carbon credit prices | EU ETS + proxy | CO2 allowance prices |
| 97 | Electricity spot prices | ENTSO-E + EIA | Real-time power prices by region |
| 98 | LNG spot rates | Platts proxy | Liquefied natural gas shipping rates |
| 99 | Commodity correlation matrix | Calculated | Oil ↔ Gold ↔ USD ↔ Equities relationships |
| 100 | Commodity supercycle indicator | Calculated composite | Long-term commodity trend strength |

---

## 🚢 DOMAIN 6: MARITIME & SHIPPING (Phases 101-120)
*Source: AIS, MarineTraffic, Freightos, Lloyd's*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 101 | Baltic Dry Index live | Yahoo Finance | BDI as leading economic indicator |
| 102 | Container ship tracking | Community AIS | Real-time positions of major container vessels |
| 103 | Oil tanker movements | Community AIS | VLCC tracking through key chokepoints |
| 104 | Suez Canal traffic | AIS + news | Daily transit counts and delays |
| 105 | Panama Canal drought monitor | AIS + news | Draft restrictions and wait times |
| 106 | Strait of Hormuz watch | AIS + ACLED | Military activity near oil shipping lanes |
| 107 | Malacca Strait density | AIS | Traffic congestion in world's busiest waterway |
| 108 | Port congestion index | FreightWaves proxy | Wait times at 50 major global ports |
| 109 | Container freight rates | Freightos BDI | Shanghai→LA, Shanghai→Rotterdam, etc. |
| 110 | Shipbuilding orders | Clarksons proxy | New vessel orders by country/type |
| 111 | Piracy incident map | IMO reports | Live piracy events from ICC IMB |
| 112 | Arctic shipping route | AIS + NSIDC | Northern Sea Route usage tracking |
| 113 | Grain export flows | FAO + vessel tracking | Wheat/corn shipments from US, Ukraine, Brazil |
| 114 | LNG tanker tracking | AIS | LNG carrier movements globally |
| 115 | Naval vessel tracker | Open OSINT | Major navy deployments worldwide |
| 116 | Ship recycling data | NGO platforms | Vessel scrapping rates by market conditions |
| 117 | Fishing fleet monitor | Global Fishing Watch | Commercial fishing intensity heatmap |
| 118 | Maritime insurance rates | Lloyd's proxy | War risk premium by region |
| 119 | Port infrastructure map | World Bank PPI | Port capacity and investment projects |
| 120 | Chokepoint risk score | Composite | Risk rating for 10 major maritime chokepoints |

---

## ⚔️ DOMAIN 7: GEOPOLITICS & CONFLICT (Phases 121-160)
*Source: ACLED, GDELT, SIPRI, IAEA, Uppsala*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 121 | Active armed conflicts | ACLED | Battles, violence against civilians, riots mapped |
| 122 | Conflict fatality tracker | ACLED | Weekly/monthly casualty counts by country |
| 123 | Protest movement monitor | ACLED | Mass demonstrations and civil unrest |
| 124 | Coup d'état tracker | ACLED + Wikipedia | Historical and recent coups worldwide |
| 125 | Sanctions database | OFAC SDN + EU | Sanctioned entities and countries overlay |
| 126 | Arms trade flows | SIPRI | Weapons exports/imports as globe arcs |
| 127 | Military spending | SIPRI MILEX | Defense budgets as % of GDP |
| 128 | Nuclear weapons inventory | FAS Nuclear Notebook | Estimated warheads by country |
| 129 | Nuclear facilities | IAEA PRIS | Reactors, enrichment plants, research sites |
| 130 | Missile test tracker | CSIS Missile Threat | Ballistic/cruise missile tests globally |
| 131 | UN Security Council votes | UN Digital Library | Vetoes, resolutions, voting patterns |
| 132 | Treaty tracker | UN Treaty Collection | Arms control, trade, environmental agreements |
| 133 | Diplomatic relations map | Wikipedia CC | Embassy networks, severed ties |
| 134 | Refugee flows | UNHCR data.unhcr.org | Displacement corridors as globe arcs |
| 135 | IDP tracker | IDMC | Internally displaced persons by country |
| 136 | Peacekeeping missions | UN DPKO | Active UN peacekeeping deployments |
| 137 | Terrorism events | Global Terrorism DB | Historical attacks mapped |
| 138 | Press freedom index | RSF | Country-level media freedom scores |
| 139 | Democracy index | V-Dem Institute | Democracy vs autocracy classification |
| 140 | Corruption perception | Transparency Intl | CPI scores for 180+ countries |
| 141 | Rule of law index | World Justice Project | Justice system strength rankings |
| 142 | Human rights violations | OHCHR reports | Flagged human rights concerns by country |
| 143 | Cyber attack monitor | Public feeds | Real-time cyber threat visualization |
| 144 | Disinformation tracker | EUvsDisinfo + GDELT | State-sponsored propaganda identification |
| 145 | Space militarization | UNOOSA | Anti-satellite tests, space debris events |
| 146 | Territorial disputes map | Wikipedia CC | Active border disputes globally |
| 147 | Ethnic conflict risk | ETH Zurich EPR | Ethnic power relations dataset |
| 148 | Food insecurity alerts | WFP HungerMap | Famine/food crisis early warnings |
| 149 | Chemical weapons sites | OPCW reports | Known CW stockpiles and destruction status |
| 150 | Global peace index | IEP | National peace scores and trends |
| 151 | Foreign military bases | Wikipedia CC | US, Russia, China, France, UK bases mapped |
| 152 | Maritime boundary disputes | UN DOALOS | Contested EEZ and continental shelf claims |
| 153 | Alliance networks | NATO/CSTO/SCO | Military alliance membership visualization |
| 154 | Election calendar | IFES ElectionGuide | Upcoming elections with market impact estimates |
| 155 | Government stability index | World Bank WGI | Government effectiveness scores |
| 156 | Political assassination tracker | ACLED | Targeted killings of officials/journalists |
| 157 | Religious freedom map | Pew Research | Religious restrictions by country |
| 158 | LGBTQ+ rights map | ILGA World | Legal status of same-sex relationships |
| 159 | Internet freedom | Freedom House | Internet censorship levels globally |
| 160 | Geopolitical risk composite | All above | Master risk score combining all geo factors |

---

## 🌡️ DOMAIN 8: CLIMATE & ENVIRONMENT (Phases 161-200)
*Source: NASA, NOAA, ESA, EPA, USGS*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 161 | CO2 emissions map | Our World in Data | Per capita and total emissions by country |
| 162 | Temperature anomaly | NASA GISS | Global temperature deviation from baseline |
| 163 | Sea level rise | NASA sea level | Satellite-measured coastal changes |
| 164 | Arctic ice extent | NSIDC | Real-time Arctic/Antarctic ice monitoring |
| 165 | Wildfire tracker | NASA FIRMS | Active fire hotspots from satellite |
| 166 | Hurricane/cyclone tracker | NOAA NHC | Active tropical storms with projected paths |
| 167 | Earthquake monitor | USGS | Live seismic events as expanding globe rings |
| 168 | Volcano alert system | Smithsonian GVP | Active eruptions with aviation alerts |
| 169 | Tsunami warning system | NOAA PTWC | Active tsunami warnings/watches |
| 170 | Drought severity map | SPEI Monitor | Global drought index |
| 171 | Flood monitoring | WMO + Copernicus | Active flood events from satellite |
| 172 | Air quality index | OpenAQ | Real-time AQI for every major city |
| 173 | Deforestation tracker | Global Forest Watch | Annual forest loss by country |
| 174 | Renewable energy mix | IRENA | Solar/wind/hydro % per country |
| 175 | Methane emissions | ESA TROPOMI | Satellite-detected methane hotspots |
| 176 | Ozone layer status | NASA | Ozone hole monitoring |
| 177 | Ocean temperature | NOAA OISST | Sea surface temperature anomalies |
| 178 | Coral reef health | NOAA Coral Reef Watch | Bleaching alerts globally |
| 179 | Glacier retreat | WGMS | Glacier mass balance data |
| 180 | Permafrost thaw | NASA ABoVE | Arctic permafrost monitoring |
| 181 | Biodiversity risk | IUCN Red List API | Endangered species count by country |
| 182 | Plastic pollution | Ocean Conservancy | Marine debris concentration zones |
| 183 | Nuclear radiation | CTBTO IMS proxy | Background radiation monitoring stations |
| 184 | Soil health | FAO GLOSIS | Soil degradation risk by region |
| 185 | Water stress | WRI Aqueduct | Water scarcity risk assessment |
| 186 | Wind resource map | Global Wind Atlas | Wind energy potential by location |
| 187 | Solar irradiance | Global Solar Atlas | Solar energy potential by location |
| 188 | EV adoption tracker | IEA GEVO | Electric vehicle market share by country |
| 189 | Climate pledge tracker | UNFCCC NDC | Paris Agreement commitments vs actual progress |
| 190 | Green bond issuance | Climate Bonds Init. | Green bond market size by country |
| 191 | Carbon capture projects | IEA CCUS | DAC and CCS installations globally |
| 192 | Environmental litigation | Sabin Center | Climate change lawsuits by country |
| 193 | Pollution index | Numbeo/OpenAQ | City-level environmental quality rankings |
| 194 | Energy transition score | BloombergNEF proxy | Renewable energy investment ranking |
| 195 | Satellite imagery overlay | Sentinel Hub free | Before/after environmental change visualization |
| 196 | Desert expansion | NASA LP DAAC | Desertification monitoring |
| 197 | Agricultural yield | FAO STAT | Crop yields per hectare by country |
| 198 | ESG country scoring | Composite | Environmental + Social + Governance aggregate |
| 199 | Climate migration risk | World Bank Groundswell | Internal climate migration projections |
| 200 | Climate dashboard preset | — | "Paris Tracker", "Extreme Weather", "Green Transition" |

---

## 🏥 DOMAIN 9: HEALTH & DEMOGRAPHICS (Phases 201-240)
*Source: WHO, UN Population, World Bank, Johns Hopkins*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 201 | Population by country | UN Population | Total population with growth trends |
| 202 | Population pyramids | UN Population | Age-sex distribution charts |
| 203 | Urbanization tracker | World Bank | Urban vs rural population ratio |
| 204 | Life expectancy map | World Bank | Globe colored by life expectancy |
| 205 | Fertility rate tracker | World Bank | Total fertility rate by country |
| 206 | Migration flows | UN DESA | International migration corridors |
| 207 | Disease outbreak monitor | WHO DON | Active disease outbreaks (Ebola, Mpox, etc.) |
| 208 | Vaccination coverage | WHO/UNICEF | Childhood immunization rates |
| 209 | Healthcare spending | WHO GHED | Health expenditure as % of GDP |
| 210 | Hospital bed capacity | World Bank | Hospital beds per 1000 population |
| 211 | Physician density | WHO | Doctors per 10,000 population |
| 212 | Maternal mortality | World Bank | Maternal death rate by country |
| 213 | Child mortality | UNICEF | Under-5 mortality rates |
| 214 | HIV/AIDS prevalence | UNAIDS | HIV infection rates globally |
| 215 | Malaria risk map | WHO | Malaria-endemic zones |
| 216 | Tuberculosis tracker | WHO GTB | TB incidence rates by country |
| 217 | Mental health index | WHO | Depression/anxiety prevalence estimates |
| 218 | Obesity rates | WHO NCD | Obesity prevalence by country |
| 219 | Access to clean water | JMP WHO/UNICEF | Safe drinking water coverage |
| 220 | Sanitation access | JMP WHO/UNICEF | Improved sanitation facilities |
| 221 | Median age map | UN Population | Globe colored by median age |
| 222 | Dependency ratio | World Bank | Working-age vs dependent population |
| 223 | Gender equality index | UNDP GII | Gender Inequality Index by country |
| 224 | Education enrollment | UNESCO UIS | Primary/secondary/tertiary enrollment rates |
| 225 | Literacy rates | UNESCO UIS | Adult literacy by country |
| 226 | PISA scores | OECD PISA | Education quality rankings |
| 227 | University rankings map | QS/THE public data | Top universities by country |
| 228 | Brain drain tracker | World Bank + UN | Skilled emigration rates |
| 229 | HDI composite | UNDP | Human Development Index ranking |
| 230 | Happiness index | World Happiness Report | National subjective well-being scores |
| 231 | Poverty headcount | World Bank PIP | Population below $2.15/day |
| 232 | Income inequality | World Bank Gini | Income distribution visualization |
| 233 | Social mobility | WEF Global Social Mobility | Intergenerational mobility scores |
| 234 | Food security | WFP HungerMap Live | Insufficient food consumption levels |
| 235 | Nutrition data | FAO SOFI | Undernourishment prevalence |
| 236 | Refugee camps | UNHCR | Major refugee camp locations and populations |
| 237 | Stateless population | UNHCR | Stateless persons by country |
| 238 | Child labor | ILO IPEC | Child labor prevalence rates |
| 239 | Modern slavery | Walk Free Foundation | Forced labor estimates |
| 240 | Demographic transition stage | Calculated | Which stage of demographic transition per country |

---

## 🛰️ DOMAIN 10: SPACE & TECHNOLOGY (Phases 241-260)
*Source: UNOOSA, SpaceTrack, NASA, ITU*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 241 | Satellite orbit tracker | Space-Track.org | LEO/MEO/GEO satellite positions on globe |
| 242 | Space launch calendar | Launch Library 2 | Upcoming and recent launches worldwide |
| 243 | Space debris map | ESA Space Debris | Tracked debris objects in orbit |
| 244 | Starlink coverage | Public data | SpaceX Starlink constellation and coverage |
| 245 | GPS/GNSS status | IGS | GPS, GLONASS, Galileo, BeiDou system health |
| 246 | ISS tracker | NASA API | Real-time ISS position on globe |
| 247 | Asteroid close approach | NASA CNEOS | Near-Earth object monitoring |
| 248 | Space weather | NOAA SWPC | Solar flare activity and geomagnetic storms |
| 249 | Internet penetration | ITU + World Bank | Internet users % by country |
| 250 | Mobile connectivity | GSMA Intelligence | Mobile subscription rates globally |
| 251 | 5G rollout map | GSMA + operators | 5G network availability by country |
| 252 | Undersea cable map | TeleGeography | Fiber optic cable routes as globe arcs |
| 253 | Data center locations | Cloudscene/DC Map | Major data center hubs globally |
| 254 | R&D spending | UNESCO UIS | Research & development expenditure as % GDP |
| 255 | Patent filings | WIPO | Innovation output by country |
| 256 | Tech company HQs | Public data | Major tech company headquarters mapped |
| 257 | AI research output | Semantic Scholar API | AI paper publications by country/institution |
| 258 | Semiconductor fabs | SIA / public data | Chip fabrication plant locations |
| 259 | Quantum computing labs | Public data | Quantum research centers globally |
| 260 | Digital government index | UN E-Government | Government digitization scores |

---

## 🏗️ DOMAIN 11: INFRASTRUCTURE & TRANSPORT (Phases 261-280)
*Source: World Bank PPI, IATA, UIC, OpenStreetMap*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 261 | Airport traffic | IATA + OAG | Busiest airports and route networks |
| 262 | Air traffic live | OpenSky Network | Real-time aircraft positions |
| 263 | Railway networks | UIC + OSM | High-speed rail and freight rail maps |
| 264 | Road infrastructure | World Bank | Road density and quality by country |
| 265 | Bridge & tunnel projects | World Bank PPI | Major infrastructure under construction |
| 266 | Electricity grid map | IEA + EIA | Power grid interconnections |
| 267 | Renewable energy projects | IRENA | Solar farm and wind farm locations |
| 268 | Nuclear power plants | IAEA PRIS | Operating, under construction, decommissioned |
| 269 | Hydroelectric dams | Wikipedia + FAO | Major dam locations and capacity |
| 270 | Oil & gas pipelines | EIA + Wikipedia | Pipeline routes globally |
| 271 | Smart city index | IMD Smart City | Urban technology adoption rankings |
| 272 | Urban sprawl tracker | ESA CCI Land Cover | City growth over time from satellite |
| 273 | Construction spending | Oxford Economics proxy | Infrastructure investment by country |
| 274 | Logistics performance | World Bank LPI | Trade logistics quality ranking |
| 275 | Special economic zones | UNCTAD | Free trade zones and SEZ locations |
| 276 | Belt & Road projects | AidData | Chinese BRI investment mapped |
| 277 | Water infrastructure | World Bank | Dam, desalination, irrigation projects |
| 278 | Waste management | World Bank What a Waste | Municipal solid waste generation |
| 279 | Telecom infrastructure | ITU | Fixed broadband, fiber penetration |
| 280 | Infrastructure gap score | Composite | Investment needed vs current state |

---

## 💼 DOMAIN 12: TRADE & SUPPLY CHAINS (Phases 281-320)
*Source: UN Comtrade, WTO, UNCTAD, WCO*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 281 | Bilateral trade flows | UN Comtrade | Import/export values between any two countries |
| 282 | Trade route visualization | UN Comtrade | Animated arcs showing top trade corridors |
| 283 | Product-level trade | UN Comtrade HS codes | What specific goods flow between countries |
| 284 | Services trade | WTO | Cross-border service exports (IT, finance, tourism) |
| 285 | Tariff database | WTO Tariff Data | Import duty rates between country pairs |
| 286 | Free trade agreements | WTO RTA | Active FTAs mapped as globe connections |
| 287 | Trade war monitor | News + tariff changes | Retaliatory tariff escalations tracked |
| 288 | Food trade flows | FAO | Agricultural product trade networks |
| 289 | Oil trade flows | IEA + AIS | Crude oil shipment corridors |
| 290 | Gas trade flows | IEA | Pipeline gas + LNG trade routes |
| 291 | Steel trade | WSA | Steel production and trade by country |
| 292 | Automotive supply chain | OICA | Vehicle production and export flows |
| 293 | Pharmaceutical trade | UN Comtrade | Drug/vaccine export networks |
| 294 | Textile trade flows | UN Comtrade | Fashion industry supply chains |
| 295 | Electronics trade | UN Comtrade | Consumer electronics supply chains |
| 296 | WTO dispute tracker | WTO DSU | Active trade disputes between countries |
| 297 | Export concentration risk | Calculated | Countries dependent on single export |
| 298 | Import dependency map | Calculated | Critical import dependencies per country |
| 299 | Supply chain disruption index | Calculated | Real-time supply chain stress score |
| 300 | Trade openness ranking | World Bank | Trade as % of GDP ranking |
| 301-320 | *(Continued)* | Various | FDI flows, BIT treaties, port-to-port routes, customs delays, trade finance gaps, value chain mapping, nearshoring trends, friend-shoring networks, mineral supply security, critical tech dependencies, agricultural subsidies, dumping investigations, trade facilitation scores, e-commerce cross-border, SEZ performance metrics, bonded warehouse networks, customs union impacts, regional trade bloc analysis, trade in value added, intermediate goods flows |

---

## 🏦 DOMAIN 13: BANKING & FINANCE (Phases 321-360)
*Source: BIS, IMF, World Bank Findex, SWIFT*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 321 | Banking system health | World Bank GFD | Non-performing loans, bank capital ratios |
| 322 | Financial inclusion | World Bank Findex | Bank account ownership by country |
| 323 | Microfinance data | MIX Market | Microfinance institution coverage |
| 324 | Mobile money adoption | GSMA | M-Pesa and mobile payment platforms |
| 325 | Fintech landscape | Public data | Major fintech hubs and unicorns |
| 326 | Insurance penetration | Swiss Re sigma | Insurance premiums as % of GDP |
| 327 | Pension fund assets | OECD | Pension system size by country |
| 328 | Sovereign wealth funds | SWFI | SWF assets and investment patterns |
| 329 | Shadow banking | FSB | Non-bank financial intermediation |
| 330 | SWIFT message volumes | SWIFT BI | International payment flows |
| 331 | Cross-border lending | BIS | International bank claims by country |
| 332 | Housing bubble risk | BIS + national data | Property price-to-income/rent ratios |
| 333 | Banking crisis history | World Bank | Historical banking crises mapped |
| 334 | Financial center ranking | GFCI | Global Financial Centres Index |
| 335 | Stock exchange profiles | WFE | Exchange trading volumes and listings |
| 336 | Derivatives market size | BIS | OTC and exchange-traded derivatives |
| 337 | Money laundering risk | Basel AML Index | Anti-money laundering scores |
| 338 | Tax haven tracker | Tax Justice Network | Financial secrecy jurisdiction index |
| 339 | Foreign aid flows | OECD ODA | Official development assistance arcs |
| 340 | Multilateral lending | World Bank + ADB | Development bank project locations |
| 341-360 | *(Continued)* | Various | Credit bureau coverage, interest rate spreads, bank branch density, ATM coverage, digital banking adoption, central bank digital currencies, open banking regulations, payment system infrastructure, correspondent banking networks, debt sustainability analysis, fiscal transparency, public financial management, government bond market development, financial literacy scores, venture capital flows, angel investment networks, crowdfunding platforms, Islamic finance markets, green finance initiatives, impact investing landscape |

---

## 🪙 DOMAIN 14: CRYPTOCURRENCY & WEB3 (Phases 361-380)
*Source: CoinGecko, DeFiLlama, Etherscan, Glasschain*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 361 | Top 100 crypto prices | CoinGecko API | Live prices, market cap, 24h volume |
| 362 | Bitcoin dominance chart | CoinGecko | BTC market share over time |
| 363 | DeFi TVL tracker | DeFiLlama | Total value locked across protocols |
| 364 | Stablecoin supply | CoinGecko | USDT/USDC/DAI market caps and flows |
| 365 | Exchange volumes | CoinGecko | Top crypto exchange trading volumes |
| 366 | Bitcoin hashrate | Blockchain.com API | Mining hash rate and difficulty |
| 367 | Ethereum gas tracker | Etherscan API | Gas prices and network congestion |
| 368 | NFT market tracker | OpenSea API proxy | Top NFT collections by volume |
| 369 | Crypto regulation map | Library of Congress | Legal status of crypto by country |
| 370 | CBDC tracker | Atlantic Council | Central bank digital currency development stages |
| 371 | Whale watching | On-chain data | Large BTC/ETH transfers |
| 372 | Mining map | Cambridge Bitcoin | Bitcoin mining energy consumption by country |
| 373 | Layer 2 TVL | DeFiLlama | Arbitrum, Optimism, Base, zkSync TVL |
| 374 | Crypto fear & greed | Alternative.me | Crypto market sentiment gauge |
| 375 | Token unlock calendar | TokenUnlocks (free) | Upcoming token vesting events |
| 376 | Crypto funding rounds | Crunchbase proxy | VC investment in crypto/Web3 startups |
| 377 | Cross-chain bridge flows | DeFiLlama | Capital movement between blockchains |
| 378 | Real-world asset tokenization | Public data | RWA protocol TVL and growth |
| 379 | DAO treasury tracker | DeepDAO free tier | DAO governance treasury sizes |
| 380 | Crypto tax policies | Global comparison | Capital gains tax on crypto by country |

---

## 🎓 DOMAIN 15: RESEARCH & INNOVATION (Phases 381-400)
*Source: WIPO, UNESCO, Semantic Scholar, arXiv*

| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 381 | R&D spending by country | UNESCO UIS | Research expenditure as % of GDP |
| 382 | Patent applications | WIPO IP Statistics | Innovation output by country |
| 383 | Scientific publications | Semantic Scholar | Research paper output by country/field |
| 384 | Nobel laureates map | Public data | Nobel Prize winners by country/institution |
| 385 | University rankings | QS + THE free data | Top universities mapped globally |
| 386 | Tech transfer offices | AUTM proxy | University-to-industry innovation |
| 387 | Startup ecosystem | Startup Genome proxy | Best cities for startups |
| 388 | Unicorn tracker | CB Insights proxy | $1B+ private companies by country |
| 389 | Open source contribution | GitHub Archive | Open source developer distribution |
| 390 | AI capability index | Stanford HAI | National AI readiness scores |
| 391 | Biotech clusters | Public data | Major biotech research hubs |
| 392 | Clinical trials | ClinicalTrials.gov | Active clinical trials by country |
| 393 | Space agency programs | UNOOSA | National space program budgets/missions |
| 394 | Nuclear fusion projects | ITER + research labs | Fusion research facilities |
| 395 | Quantum computing readiness | Public data | Quantum technology investment by country |
| 396 | Robotics density | IFR | Industrial robot installations per worker |
| 397 | Electric vehicle innovation | IEA GEVO | EV patent filings and adoption |
| 398 | Gene therapy advances | NIH + EMA | Gene/cell therapy approvals globally |
| 399 | Brain-computer interfaces | Research papers | BCI development labs mapped |
| 400 | Innovation composite index | WIPO GII | Global Innovation Index ranking |

---

## 🏛️ DOMAIN 16: GOVERNANCE & INSTITUTIONS (Phases 401-420)
| # | Phase | Source | What It Adds |
|---|-------|--------|-------------|
| 401 | Government type map | CIA World Factbook | Democracy, monarchy, authoritarian classification |
| 402 | Parliament composition | IPU Parline | Legislative body size and gender balance |
| 403 | Election results archive | IFES + Wikipedia | Historical election data |
| 404 | Political party strength | V-Dem | Party system institutionalization |
| 405 | Judicial independence | WJP + V-Dem | Court independence scores |
| 406 | Anti-corruption enforcement | TI + UNCAC | Corruption prosecution rates |
| 407 | Bureaucratic quality | World Bank WGI | Regulatory quality scores |
| 408 | Government digital services | UN E-Government | Online public services availability |
| 409 | Open data portals | OECD OURdata | Government data openness ranking |
| 410 | Regulatory environment | World Bank Doing Business | Ease of doing business scores |
| 411 | Property rights | Heritage Foundation | Economic freedom components |
| 412 | Contract enforcement | World Bank | Time/cost to enforce contracts |
| 413 | Tax system comparison | OECD Revenue Stats | Tax-to-GDP ratios and structures |
| 414 | Customs efficiency | World Bank LPI | Border crossing times |
| 415 | Civil service reform | World Bank | Public administration quality |
| 416 | Decentralization index | OECD | Fiscal decentralization levels |
| 417 | State fragility | Fund for Peace FSI | Fragile States Index |
| 418 | Post-conflict reconstruction | World Bank | Countries in transition/reconstruction |
| 419 | Constitutional amendments | Constitute Project | Constitutional text analysis |
| 420 | Governance composite | Mo Ibrahim Index | African/global governance composite |

---

## 🎭 DOMAIN 17: CULTURE & SOCIETY (Phases 421-440)
## 🏅 DOMAIN 18: SPORTS & EVENTS (Phases 441-460)
## 🍽️ DOMAIN 19: FOOD & AGRICULTURE (Phases 461-480)
## 🏠 DOMAIN 20: REAL ESTATE & HOUSING (Phases 481-500)

*(Phases 421-500: Culture indices, UNESCO heritage sites, language distribution, religious demographics, social media penetration, sports league economics, Olympic medal tracking, FIFA rankings, food price indices, crop yield monitoring, arable land data, housing affordability, property markets, construction activity, urban planning indices, smart city metrics)*

---

## 🤖 DOMAIN 21: AI & MACHINE LEARNING (Phases 501-540)
| # | Range | What It Adds |
|---|-------|-------------|
| 501-510 | **AI Country Briefings** — Click any country → LLM-generated economic/political summary (Ollama/Groq) |
| 511-520 | **Sentiment Engine** — GDELT tone analysis, social media sentiment, news polarity scoring |
| 521-530 | **Anomaly Detection** — Statistical alerts when any metric deviates >2σ; cross-indicator cascade detection |
| 531-540 | **Predictive Models** — ARIMA/Prophet forecasting for GDP, inflation; scenario modeling ("What if oil = $120?") |

## 📊 DOMAIN 22: ADVANCED VISUALIZATION (Phases 541-560)
| # | Range | What It Adds |
|---|-------|-------------|
| 541-545 | **3D Trade Arcs** — Animated import/export flow arcs with $ volume thickness on the globe |
| 546-550 | **Heatmap Layers** — GDP, risk, temperature, conflict intensity — togglable globe overlays |
| 551-555 | **Time-lapse Mode** — Scrub through years to see GDP growth, population change, conflict evolution |
| 556-560 | **Comparison Mode** — Side-by-side country comparison with radar charts and parallel coordinates |

## 🔔 DOMAIN 23: ALERTING & NOTIFICATIONS (Phases 561-580)
## 🎛️ DOMAIN 24: USER EXPERIENCE (Phases 581-620)
## 📱 DOMAIN 25: MOBILE & PWA (Phases 621-640)

*(Phases 561-640: Push notifications, email digests, Slack/Discord bots, webhook integrations, command palette, keyboard shortcuts, saved layouts, watchlists, export CSV/PDF, responsive mobile grid, PWA installable, offline mode, touch gestures, AR globe view)*

---

## 🌐 DOMAIN 26-30: REGIONAL DEEP DIVES (Phases 641-740)

| Domain | Region | Phases | Unique Data Sources |
|--------|--------|--------|-------------------|
| 26 | **Americas** | 641-660 | BLS, Census Bureau, BEA, Banxico, IBGE, INDEC |
| 27 | **Europe** | 661-680 | Eurostat, ECB SDW, ONS, Destatis, INSEE |
| 28 | **Asia-Pacific** | 681-700 | NBS China, BOJ, RBI, ABS Australia, CEIC |
| 29 | **Middle East & Africa** | 701-720 | AfDB, SAMA, CBN, EIA oil data, OPEC, AU |
| 30 | **Emerging & Frontier** | 721-740 | Vietnam GSO, Bangladesh BBS, Kenya KNBS, Nigeria NBS |

---

## 🔗 DOMAIN 31-35: INTEGRATIONS & ECOSYSTEM (Phases 741-840)

| Domain | Focus | Phases | What It Adds |
|--------|-------|--------|-------------|
| 31 | **Plugin System** | 741-760 | Developer SDK, widget marketplace, custom overlays |
| 32 | **Public API** | 761-780 | REST/GraphQL API exposing all aggregated data |
| 33 | **Collaboration** | 781-800 | Shared dashboards, annotations, team workspaces |
| 34 | **Data Pipeline** | 801-820 | ETL engine, scheduling, data quality monitoring |
| 35 | **Self-Hosting** | 821-840 | Docker Compose, Kubernetes, Terraform, CI/CD |

---

## 🧪 DOMAIN 36-40: EXPERIMENTAL FEATURES (Phases 841-920)

| Domain | Focus | Phases | What It Adds |
|--------|-------|--------|-------------|
| 36 | **Voice Interface** | 841-860 | "What's the GDP of Nigeria?" — voice commands for the globe |
| 37 | **AR/VR Globe** | 861-880 | WebXR globe you can walk around in VR |
| 38 | **Natural Language Queries** | 881-900 | "Show me countries with >5% inflation and negative GDP growth" |
| 39 | **Live Video Feeds** | 901-920 | Public webcam feeds from world cities, port cameras |

---

## 🌟 DOMAIN 41-45: SOCIAL IMPACT (Phases 921-960)

| Domain | Focus | Phases | What It Adds |
|--------|-------|--------|-------------|
| 41 | **Education Mode** | 921-930 | Guided tours explaining economics, geopolitics for students |
| 42 | **Journalist Toolkit** | 931-940 | Citation-ready data export, source tracking, fact-check mode |
| 43 | **NGO Dashboard** | 941-950 | Humanitarian crisis monitoring, aid flow tracking |
| 44 | **Policy Simulator** | 951-960 | "What if Country X raises tariffs 10%?" — agent-based models |

---

## 🚀 DOMAIN 46-50: THE FUTURE (Phases 961-1000)

| # | Phase | What It Adds |
|---|-------|-------------|
| 961 | **Autonomous Data Agents** — AI agents that continuously discover and integrate new free data sources |
| 962 | **Multi-modal Search** — Upload an image of a location → identify country + show all data |
| 963 | **Real-time Translation** — Every news item translated to user's language via local LLM |
| 964 | **Digital Twin Earth** — High-fidelity 3D Earth with weather, ocean currents, air traffic simultaneously |
| 965 | **Federated Learning** — Users contribute anonymized usage patterns to improve predictions |
| 966 | **Blockchain Audit Trail** — Every data point source-tracked on an immutable ledger |
| 967 | **Offline-First Architecture** — Full functionality with 30 days of cached data |
| 968 | **Personal Dashboard AI** — Agent learns your interests and auto-surfaces relevant events |
| 969 | **Cross-Platform Native** — Electron desktop app, native mobile (React Native) |
| 970 | **Hardware Integration** — Raspberry Pi kiosk mode for always-on wall displays |
| 971-980 | **Community-Contributed Datasets** — Open data submissions, peer review, quality scoring |
| 981-990 | **Academic Partnership Program** — University research integration, citation tracking |
| 991-999 | **Open Standard Development** — Propose W3C/ISO standard for global dashboard data interchange |
| 1000 | **🌍 The World Dashboard Foundation** — Non-profit governance, sustainability model, global advisory board |

---

> **This roadmap will take years. That's the point.**
>
> Every phase makes the world's information more accessible, more visual, and more free.
> Day by day. Phase by phase. Until Bloomberg charges $24,000/year for something worse.
