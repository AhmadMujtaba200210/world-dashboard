/**
 * World Dashboard — Free API Data Layer
 * 
 * All data sources are completely free, no API keys required.
 * 
 * Sources:
 * - REST Countries API: https://restcountries.com (195 nations, basic info)
 * - World Bank API v2: https://api.worldbank.org (macro indicators for every country)
 * - Frankfurter API: https://api.frankfurter.app (30 currency FX rates)
 */

// ─── Types ────────────────────────────────────────────────

export interface CountryBasicInfo {
    name: string
    officialName: string
    capital: string
    population: number
    area: number
    region: string
    subregion: string
    currencies: { code: string; name: string; symbol: string }[]
    flag: string  // SVG URL
    flagPng: string  // PNG URL
    gini: number | null
}

export interface MacroIndicators {
    gdp: number | null                // GDP (current US$)
    gdpGrowth: number | null          // GDP growth (annual %)
    gdpPerCapita: number | null       // GDP per capita (current US$)
    inflation: number | null          // Inflation, consumer prices (annual %)
    unemployment: number | null       // Unemployment, total (% of labor force)
    population: number | null         // Total population
    debtToGdp: number | null          // Central govt. debt, total (% of GDP)
    tradeBalance: number | null       // Trade (% of GDP)
    fdi: number | null                // Foreign direct investment, net inflows (% of GDP)
    lifeExpectancy: number | null     // Life expectancy at birth
    year: string                      // Year of the data
}

export interface FxRates {
    base: string
    date: string
    rates: Record<string, number>
}

// ─── Input Validation ─────────────────────────────────────

const ISO_A3_PATTERN = /^[A-Z]{2,3}$/
const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/

const ALLOWED_FLAG_HOSTS = ["flagcdn.com", "upload.wikimedia.org", "mainfacts.com"]

function sanitizeFlagUrl(url: unknown): string {
    if (typeof url !== "string" || !url) return ""
    try {
        const parsed = new URL(url)
        if (parsed.protocol !== "https:") return ""
        if (!ALLOWED_FLAG_HOSTS.some((h) => parsed.hostname === h)) return ""
        return url
    } catch {
        return ""
    }
}

function isValidIsoCode(code: string): boolean {
    return ISO_A3_PATTERN.test(code)
}

function isValidCurrencyCode(code: string): boolean {
    return CURRENCY_CODE_PATTERN.test(code)
}

// ─── REST Countries API ───────────────────────────────────

const REST_COUNTRIES_BASE = "https://restcountries.com/v3.1"

export async function fetchCountryBasicInfo(isoA3: string): Promise<CountryBasicInfo | null> {
    if (!isValidIsoCode(isoA3)) return null

    try {
        const res = await fetch(
            `${REST_COUNTRIES_BASE}/alpha/${encodeURIComponent(isoA3)}?fields=name,capital,population,region,subregion,currencies,flags,gini,area`
        )
        if (!res.ok) return null
        const d = await res.json()

        const currencyEntries = d.currencies
            ? Object.entries(d.currencies).map(([code, val]: [string, any]) => ({
                code,
                name: val.name || code,
                symbol: val.symbol || ""
            }))
            : []

        const giniYears = d.gini ? Object.values(d.gini) as number[] : []

        return {
            name: d.name?.common || isoA3,
            officialName: d.name?.official || d.name?.common || isoA3,
            capital: d.capital?.[0] || "N/A",
            population: d.population || 0,
            area: d.area || 0,
            region: d.region || "Unknown",
            subregion: d.subregion || "",
            currencies: currencyEntries,
            flag: sanitizeFlagUrl(d.flags?.svg),
            flagPng: sanitizeFlagUrl(d.flags?.png),
            gini: giniYears.length > 0 ? giniYears[giniYears.length - 1] : null,
        }
    } catch {
        return null
    }
}

// ─── World Bank API v2 ────────────────────────────────────

const WB_BASE = "https://api.worldbank.org/v2"

// Indicator codes for the metrics we want
const WB_INDICATORS = {
    gdp: "NY.GDP.MKTP.CD",              // GDP (current US$)
    gdpGrowth: "NY.GDP.MKTP.KD.ZG",     // GDP growth (annual %)
    gdpPerCapita: "NY.GDP.PCAP.CD",      // GDP per capita (current US$)
    inflation: "FP.CPI.TOTL.ZG",         // Inflation, consumer prices (annual %)
    unemployment: "SL.UEM.TOTL.ZS",      // Unemployment, total (% of labor force)
    population: "SP.POP.TOTL",           // Total population
    debtToGdp: "GC.DOD.TOTL.GD.ZS",     // Central government debt (% of GDP)
    tradeBalance: "NE.TRD.GNFS.ZS",     // Trade (% of GDP)
    fdi: "BX.KLT.DINV.WD.GD.ZS",       // Foreign direct investment (% of GDP)
    lifeExpectancy: "SP.DYN.LE00.IN",   // Life expectancy at birth
}

async function fetchWorldBankIndicator(
    countryCode: string,
    indicatorCode: string
): Promise<{ value: number | null; year: string }> {
    if (!isValidIsoCode(countryCode)) return { value: null, year: "" }

    try {
        // Fetch last 5 years to find most recent non-null value
        const res = await fetch(
            `${WB_BASE}/country/${encodeURIComponent(countryCode)}/indicator/${encodeURIComponent(indicatorCode)}?format=json&per_page=5&date=2019:2025`
        )
        if (!res.ok) return { value: null, year: "" }

        const data = await res.json()

        // World Bank returns [metadata, records] array
        if (!Array.isArray(data) || data.length < 2 || !data[1]) {
            return { value: null, year: "" }
        }

        // Find the most recent non-null value
        for (const entry of data[1]) {
            if (entry.value !== null && entry.value !== undefined) {
                return { value: entry.value, year: entry.date || "" }
            }
        }

        return { value: null, year: "" }
    } catch {
        return { value: null, year: "" }
    }
}

export async function fetchMacroIndicators(isoA3: string): Promise<MacroIndicators> {
    // Fetch all indicators in parallel for speed
    const [gdp, gdpGrowth, gdpPerCapita, inflation, unemployment,
        population, debtToGdp, tradeBalance, fdi, lifeExpectancy] =
        await Promise.all([
            fetchWorldBankIndicator(isoA3, WB_INDICATORS.gdp),
            fetchWorldBankIndicator(isoA3, WB_INDICATORS.gdpGrowth),
            fetchWorldBankIndicator(isoA3, WB_INDICATORS.gdpPerCapita),
            fetchWorldBankIndicator(isoA3, WB_INDICATORS.inflation),
            fetchWorldBankIndicator(isoA3, WB_INDICATORS.unemployment),
            fetchWorldBankIndicator(isoA3, WB_INDICATORS.population),
            fetchWorldBankIndicator(isoA3, WB_INDICATORS.debtToGdp),
            fetchWorldBankIndicator(isoA3, WB_INDICATORS.tradeBalance),
            fetchWorldBankIndicator(isoA3, WB_INDICATORS.fdi),
            fetchWorldBankIndicator(isoA3, WB_INDICATORS.lifeExpectancy),
        ])

    return {
        gdp: gdp.value,
        gdpGrowth: gdpGrowth.value,
        gdpPerCapita: gdpPerCapita.value,
        inflation: inflation.value,
        unemployment: unemployment.value,
        population: population.value,
        debtToGdp: debtToGdp.value,
        tradeBalance: tradeBalance.value,
        fdi: fdi.value,
        lifeExpectancy: lifeExpectancy.value,
        year: gdp.year || gdpGrowth.year || "N/A",
    }
}

// ─── Frankfurter FX API ───────────────────────────────────

export async function fetchFxRates(baseCurrency: string = "USD"): Promise<FxRates | null> {
    if (!isValidCurrencyCode(baseCurrency)) return null

    try {
        const res = await fetch(`https://api.frankfurter.app/latest?from=${encodeURIComponent(baseCurrency)}`)
        if (!res.ok) return null
        return await res.json()
    } catch {
        return null
    }
}

// ─── Formatting Utilities ─────────────────────────────────

export function formatLargeNumber(num: number | null): string {
    if (num === null || num === undefined) return "—"
    const abs = Math.abs(num)
    if (abs >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (abs >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (abs >= 1e6) return `$${(num / 1e6).toFixed(1)}M`
    if (abs >= 1e3) return `$${(num / 1e3).toFixed(1)}K`
    return `$${num.toFixed(0)}`
}

export function formatPercent(num: number | null): string {
    if (num === null || num === undefined) return "—"
    const sign = num >= 0 ? "+" : ""
    return `${sign}${num.toFixed(2)}%`
}

export function formatPopulation(num: number | null): string {
    if (num === null || num === undefined) return "—"
    const abs = Math.abs(num)
    if (abs >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (abs >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (abs >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return `${num}`
}

export function formatArea(num: number | null): string {
    if (num === null || num === undefined) return "—"
    return `${num.toLocaleString()} km²`
}
