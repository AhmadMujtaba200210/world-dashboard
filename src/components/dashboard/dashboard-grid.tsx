"use client"

import React from "react"
import { Separator } from "@/components/ui/separator"
import GodModeGlobe from "./world-globe"
import { useCountry, COUNTRY_DATA } from "@/context/country-context"
import { useCountryData } from "@/hooks/use-country-data"
import { formatLargeNumber, formatPercent, formatPopulation, formatArea } from "@/lib/api"
import {
    Globe2, TrendingUp, Newspaper, Shield, BarChart3,
    Anchor, Activity, Zap, Radio, X, Loader2
} from "lucide-react"

// ─── Shared Panel Shell ───────────────────────────────────
function Panel({ icon: Icon, label, color, children }: {
    icon: React.ElementType
    label: string
    color: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/5 shrink-0">
                <Icon className={`h-3 w-3 ${color}`} />
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{label}</span>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
                {children}
            </div>
        </div>
    )
}

// ─── Row: key-value data row ──────────────────────────────
function Row({ label, value, valueColor = "text-slate-200" }: {
    label: string, value: string, valueColor?: string
}) {
    return (
        <div className="flex items-center justify-between px-3 py-[5px] border-b border-white/[0.03] last:border-b-0">
            <span className="text-[10px] text-slate-500">{label}</span>
            <span className={`text-[10px] font-mono ${valueColor}`}>{value}</span>
        </div>
    )
}

// ─── Loading Row ──────────────────────────────────────────
function LoadingRow({ label }: { label: string }) {
    return (
        <div className="flex items-center justify-between px-3 py-[5px] border-b border-white/[0.03]">
            <span className="text-[10px] text-slate-500">{label}</span>
            <div className="h-2.5 w-16 bg-white/[0.06] rounded animate-pulse" />
        </div>
    )
}

// ─── Macro Panel (LIVE: World Bank + REST Countries) ──────
function MacroPanel() {
    const { selectedCountryName, selectedCountry } = useCountry()
    const { basic, macro, loading } = useCountryData()

    if (!selectedCountry) {
        return (
            <Panel icon={TrendingUp} label="Macro · Global" color="text-blue-400">
                <Row label="Select a country" value="Click the globe" valueColor="text-slate-500" />
                <Row label="Data source" value="World Bank API" valueColor="text-blue-400" />
                <Row label="Coverage" value="195 nations" valueColor="text-emerald-400" />
                <Row label="Indicators" value="16,000+" valueColor="text-emerald-400" />
                <Row label="Cost" value="FREE" valueColor="text-green-400" />
            </Panel>
        )
    }

    if (loading) {
        return (
            <Panel icon={TrendingUp} label={`Macro · ${selectedCountryName}`} color="text-blue-400">
                <div className="flex items-center gap-2 px-3 py-2">
                    <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
                    <span className="text-[10px] text-slate-500">Fetching from World Bank API...</span>
                </div>
                <LoadingRow label="GDP" />
                <LoadingRow label="GDP Growth" />
                <LoadingRow label="GDP/Capita" />
                <LoadingRow label="Inflation" />
                <LoadingRow label="Unemployment" />
            </Panel>
        )
    }

    return (
        <Panel icon={TrendingUp} label={`Macro · ${selectedCountryName}`} color="text-blue-400">
            <Row
                label="GDP"
                value={formatLargeNumber(macro?.gdp ?? null)}
                valueColor={macro?.gdp ? "text-emerald-400" : "text-slate-500"}
            />
            <Row
                label="GDP Growth"
                value={formatPercent(macro?.gdpGrowth ?? null)}
                valueColor={
                    macro?.gdpGrowth != null
                        ? macro.gdpGrowth >= 0 ? "text-green-400" : "text-red-400"
                        : "text-slate-500"
                }
            />
            <Row
                label="GDP/Capita"
                value={macro?.gdpPerCapita != null ? `$${macro.gdpPerCapita.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                valueColor="text-slate-200"
            />
            <Row
                label="Inflation"
                value={formatPercent(macro?.inflation ?? null)}
                valueColor={
                    macro?.inflation != null
                        ? macro.inflation > 5 ? "text-red-400" : macro.inflation > 3 ? "text-orange-400" : "text-green-400"
                        : "text-slate-500"
                }
            />
            <Row
                label="Unemployment"
                value={formatPercent(macro?.unemployment ?? null)}
                valueColor={
                    macro?.unemployment != null
                        ? macro.unemployment > 10 ? "text-red-400" : macro.unemployment > 6 ? "text-orange-400" : "text-green-400"
                        : "text-slate-500"
                }
            />
            <Row
                label="Debt/GDP"
                value={macro?.debtToGdp != null ? `${macro.debtToGdp.toFixed(1)}%` : "—"}
                valueColor={
                    macro?.debtToGdp != null
                        ? macro.debtToGdp > 100 ? "text-red-400" : macro.debtToGdp > 60 ? "text-orange-400" : "text-green-400"
                        : "text-slate-500"
                }
            />
            <Row
                label="Trade/GDP"
                value={macro?.tradeBalance != null ? `${macro.tradeBalance.toFixed(1)}%` : "—"}
                valueColor="text-slate-200"
            />
            <Row
                label="FDI/GDP"
                value={macro?.fdi != null ? `${macro.fdi.toFixed(2)}%` : "—"}
                valueColor="text-slate-200"
            />
            {macro?.year && (
                <Row label="Data Year" value={macro.year} valueColor="text-slate-600" />
            )}
        </Panel>
    )
}

// ─── Economy Panel (LIVE: REST Countries + COUNTRY_DATA) ──
function EconomyPanel() {
    const { selectedCountryName, selectedCountry } = useCountry()
    const { basic, macro, loading } = useCountryData()
    const meta = selectedCountry ? COUNTRY_DATA[selectedCountry] : null

    if (!selectedCountry) {
        return (
            <Panel icon={BarChart3} label="Economy · Global" color="text-emerald-400">
                <Row label="S&P 500" value="5,088.80" valueColor="text-green-400" />
                <Row label="NASDAQ" value="15,996" valueColor="text-green-400" />
                <Row label="DAX" value="17,556" valueColor="text-green-400" />
                <Row label="NIKKEI" value="39,166" valueColor="text-green-400" />
                <Row label="FTSE" value="7,682" valueColor="text-red-400" />
            </Panel>
        )
    }

    if (loading) {
        return (
            <Panel icon={BarChart3} label={`Economy · ${selectedCountryName}`} color="text-emerald-400">
                <div className="flex items-center gap-2 px-3 py-2">
                    <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                    <span className="text-[10px] text-slate-500">Fetching data...</span>
                </div>
                <LoadingRow label="Population" />
                <LoadingRow label="Area" />
                <LoadingRow label="Capital" />
            </Panel>
        )
    }

    return (
        <Panel icon={BarChart3} label={`Economy · ${selectedCountryName}`} color="text-emerald-400">
            {meta && <Row label="Index" value={meta.mainIndex} valueColor="text-emerald-400" />}
            {basic?.currencies?.[0] && (
                <Row
                    label="Currency"
                    value={`${basic.currencies[0].code} (${basic.currencies[0].symbol})`}
                    valueColor="text-slate-200"
                />
            )}
            <Row
                label="Population"
                value={formatPopulation(basic?.population ?? macro?.population ?? null)}
                valueColor="text-slate-200"
            />
            <Row label="Capital" value={basic?.capital || meta?.capitalCity || "—"} />
            <Row label="Region" value={basic?.subregion || basic?.region || meta?.region || "—"} />
            <Row label="Area" value={formatArea(basic?.area ?? null)} />
            <Row
                label="Life Expect."
                value={macro?.lifeExpectancy != null ? `${macro.lifeExpectancy.toFixed(1)} yrs` : "—"}
                valueColor={
                    macro?.lifeExpectancy != null
                        ? macro.lifeExpectancy > 75 ? "text-green-400" : macro.lifeExpectancy > 65 ? "text-yellow-400" : "text-red-400"
                        : "text-slate-500"
                }
            />
            {basic?.gini != null && (
                <Row
                    label="Gini Index"
                    value={basic.gini.toFixed(1)}
                    valueColor={basic.gini > 40 ? "text-red-400" : basic.gini > 30 ? "text-orange-400" : "text-green-400"}
                />
            )}
        </Panel>
    )
}

// ─── News Panel ───────────────────────────────────────────
function NewsPanel() {
    const { selectedCountryName } = useCountry()

    const items = [
        { t: "08:45", s: "REUTERS", h: "OPEC+ extends voluntary oil output cuts into Q2." },
        { t: "07:30", s: "BLOOM.", h: "European markets open broadly higher on tech rally." },
        { t: "06:15", s: "GDELT", h: "Red Sea disruptions increase maritime insurance." },
        { t: "05:00", s: "FT", h: "Fed officials signal patience on rate cuts." },
        { t: "03:20", s: "NIKKEI", h: "Japan chip stocks surge after TSMC earnings." },
    ]

    return (
        <Panel icon={Newspaper} label={selectedCountryName ? `News · ${selectedCountryName}` : "Breaking"} color="text-amber-400">
            {items.map((n, i) => (
                <div key={i} className="px-3 py-[5px] border-b border-white/[0.03] last:border-b-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-slate-600 font-mono">{n.t}</span>
                        <span className="text-[9px] text-amber-500/80 font-mono">{n.s}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-tight mt-0.5">{n.h}</p>
                </div>
            ))}
        </Panel>
    )
}

// ─── Options Panel ────────────────────────────────────────
function OptionsPanel() {
    const { selectedCountryName } = useCountry()

    const flows = [
        { t: "NVDA 850C", exp: "03/15", p: "$2.4M", v: "12k", b: true },
        { t: "SPY 500P", exp: "Today", p: "$4.1M", v: "45k", b: false },
        { t: "TSLA 200C", exp: "03/22", p: "$1.1M", v: "8k", b: true },
        { t: "AAPL 180P", exp: "03/08", p: "$890K", v: "6k", b: false },
    ]

    return (
        <Panel icon={Activity} label={selectedCountryName ? `Options · ${selectedCountryName}` : "Flow"} color="text-violet-400">
            {flows.map((f, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-[5px] border-b border-white/[0.03] last:border-b-0">
                    <div>
                        <span className="text-[10px] font-mono text-slate-200 block">{f.t}</span>
                        <span className="text-[9px] text-slate-600">{f.exp}</span>
                    </div>
                    <div className="text-right">
                        <span className={`text-[10px] font-mono block ${f.b ? 'text-green-400' : 'text-red-400'}`}>{f.p}</span>
                        <span className="text-[9px] text-slate-600">{f.v}</span>
                    </div>
                </div>
            ))}
        </Panel>
    )
}

// ─── Alerts Panel ─────────────────────────────────────────
function AlertsPanel() {
    const { selectedCountryName } = useCountry()

    const alerts = [
        { r: "Middle East", h: "Hormuz tanker routing delayed.", t: "2m", s: "bg-red-500" },
        { r: "E. Europe", h: "Energy infrastructure damaged.", t: "1h", s: "bg-orange-500" },
        { r: "S. China Sea", h: "Naval patrol activity increased.", t: "3h", s: "bg-yellow-500" },
        { r: "Horn of Africa", h: "Piracy attempts near Bab al-Mandab.", t: "5h", s: "bg-red-500" },
    ]

    return (
        <Panel icon={Shield} label={selectedCountryName ? `Alerts · ${selectedCountryName}` : "Geo-Risk"} color="text-red-400">
            {alerts.map((a, i) => (
                <div key={i} className="px-3 py-[5px] border-b border-white/[0.03] last:border-b-0 flex gap-2">
                    <div className={`w-[3px] shrink-0 rounded-full ${a.s} mt-0.5`} style={{ height: '24px' }} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-slate-200">{a.r}</span>
                            <span className="text-[9px] text-slate-600">{a.t}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight truncate">{a.h}</p>
                    </div>
                </div>
            ))}
        </Panel>
    )
}

// ─── Maritime Panel ───────────────────────────────────────
function MaritimePanel() {
    const { selectedCountryName } = useCountry()
    return (
        <Panel icon={Anchor} label={selectedCountryName ? `Maritime · ${selectedCountryName}` : "Maritime"} color="text-cyan-400">
            <Row label="Baltic Dry" value="1,842" valueColor="text-cyan-400" />
            <Row label="Suez Transit" value="DELAYED" valueColor="text-orange-400" />
            <Row label="Panama Canal" value="NORMAL" valueColor="text-green-400" />
            <Row label="Malacca Strait" value="NORMAL" valueColor="text-green-400" />
            <Row label="Hormuz" value="CAUTION" valueColor="text-yellow-400" />
        </Panel>
    )
}

// ─── FX Panel (LIVE: Frankfurter API) ─────────────────────
function FxPanel() {
    const { fx, fxLoading } = useCountryData()
    const { selectedCountry } = useCountry()
    const meta = selectedCountry ? COUNTRY_DATA[selectedCountry] : null

    // Show the selected country's currency rate prominently if available
    const countryCurrency = meta?.currency || null
    const countryRate = countryCurrency && fx?.rates?.[countryCurrency]
        ? fx.rates[countryCurrency]
        : null

    if (fxLoading) {
        return (
            <Panel icon={Zap} label="FX / Commodities" color="text-yellow-400">
                <div className="flex items-center gap-2 px-3 py-2">
                    <Loader2 className="h-3 w-3 animate-spin text-yellow-400" />
                    <span className="text-[10px] text-slate-500">Fetching live rates...</span>
                </div>
                <LoadingRow label="EUR/USD" />
                <LoadingRow label="GBP/USD" />
                <LoadingRow label="JPY/USD" />
            </Panel>
        )
    }

    const r = fx?.rates || {}

    return (
        <Panel icon={Zap} label={fx?.date ? `FX · ${fx.date}` : "FX / Commodities"} color="text-yellow-400">
            {/* Show selected country's currency first */}
            {countryCurrency && countryRate && countryCurrency !== "USD" && (
                <Row
                    label={`USD/${countryCurrency}`}
                    value={countryRate.toFixed(countryRate > 100 ? 0 : countryRate > 10 ? 2 : 4)}
                    valueColor="text-yellow-400"
                />
            )}
            <Row label="EUR/USD" value={r.EUR ? (1 / r.EUR).toFixed(4) : "—"} valueColor="text-green-400" />
            <Row label="GBP/USD" value={r.GBP ? (1 / r.GBP).toFixed(4) : "—"} valueColor="text-green-400" />
            <Row label="USD/JPY" value={r.JPY?.toFixed(2) || "—"} valueColor="text-red-400" />
            <Row label="USD/CNY" value={r.CNY?.toFixed(4) || "—"} valueColor="text-slate-200" />
            <Row label="USD/INR" value={r.INR?.toFixed(2) || "—"} valueColor="text-slate-200" />
            <Row label="USD/BRL" value={r.BRL?.toFixed(4) || "—"} valueColor="text-slate-200" />
            <Row label="USD/KRW" value={r.KRW?.toFixed(2) || "—"} valueColor="text-slate-200" />
            <Row label="USD/MXN" value={r.MXN?.toFixed(4) || "—"} valueColor="text-slate-200" />
            <Row label="USD/ZAR" value={r.ZAR?.toFixed(4) || "—"} valueColor="text-slate-200" />
            <Row label="USD/TRY" value={r.TRY?.toFixed(2) || "—"} valueColor="text-red-400" />
        </Panel>
    )
}


// ─── Status Bar (Top) ─────────────────────────────────────
function StatusBar() {
    const { selectedCountryName, selectedCountry, clearCountry } = useCountry()
    const { basic, loading } = useCountryData()
    const meta = selectedCountry ? COUNTRY_DATA[selectedCountry] : null

    return (
        <div className="h-8 bg-black/60 border-b border-white/[0.06] flex items-center justify-between px-3 shrink-0 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <Globe2 className="h-3 w-3 text-blue-400" />
                    <span className="text-[10px] font-bold tracking-widest text-slate-300">
                        WORLD DASHBOARD
                    </span>
                </div>
                {selectedCountryName && (
                    <>
                        <Separator orientation="vertical" className="h-3 bg-white/10" />
                        <div className="flex items-center gap-1.5">
                            {loading ? (
                                <Loader2 className="h-2.5 w-2.5 animate-spin text-blue-400" />
                            ) : (
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            )}
                            {/* Show flag if available */}
                            {basic?.flagPng && (
                                <img src={basic.flagPng} alt="" className="h-3 w-4 object-cover rounded-[1px]" />
                            )}
                            <span className="text-[10px] font-mono text-emerald-400">
                                {selectedCountryName.toUpperCase()}
                            </span>
                            {basic && (
                                <span className="text-[9px] text-slate-600">
                                    {basic.subregion || basic.region} · {basic.currencies?.[0]?.code || ""} · Pop: {formatPopulation(basic.population)}
                                </span>
                            )}
                            {!basic && meta && (
                                <span className="text-[9px] text-slate-600">
                                    {meta.region} · {meta.currency} · {meta.mainIndex}
                                </span>
                            )}
                            <button
                                onClick={clearCountry}
                                className="ml-1 p-0.5 hover:bg-white/10 rounded transition-colors"
                            >
                                <X className="h-2.5 w-2.5 text-slate-500 hover:text-white" />
                            </button>
                        </div>
                    </>
                )}
            </div>
            <div className="flex items-center gap-4 text-[9px] font-mono text-slate-600">
                <span>195 NATIONS</span>
                <span className="flex items-center gap-1">
                    <Radio className="h-2.5 w-2.5 text-green-500" />
                    <span className="text-green-500">LIVE</span>
                </span>
            </div>
        </div>
    )
}

// ─── Ticker Tape ──────────────────────────────────────────
function TickerTape() {
    const { fx } = useCountryData()
    const r = fx?.rates || {}

    return (
        <div className="h-5 bg-black/40 border-b border-white/[0.04] flex items-center overflow-hidden shrink-0">
            <div className="flex gap-6 text-[9px] font-mono tracking-wide animate-marquee whitespace-nowrap px-3">
                <span className="text-red-500">● LIVE</span>
                {/* FX from live API */}
                {r.EUR && <span>EUR <span className="text-green-400">{(1 / r.EUR).toFixed(4)}</span></span>}
                {r.GBP && <span>GBP <span className="text-green-400">{(1 / r.GBP).toFixed(4)}</span></span>}
                {r.JPY && <span>JPY <span className="text-red-400">{r.JPY.toFixed(2)}</span></span>}
                {r.CNY && <span>CNY <span className="text-slate-300">{r.CNY.toFixed(4)}</span></span>}
                {r.INR && <span>INR <span className="text-slate-300">{r.INR.toFixed(2)}</span></span>}
                {r.BRL && <span>BRL <span className="text-slate-300">{r.BRL.toFixed(4)}</span></span>}
                {r.KRW && <span>KRW <span className="text-slate-300">{r.KRW.toFixed(0)}</span></span>}
                {r.MXN && <span>MXN <span className="text-slate-300">{r.MXN.toFixed(4)}</span></span>}
                {r.CHF && <span>CHF <span className="text-green-400">{r.CHF.toFixed(4)}</span></span>}
                {r.AUD && <span>AUD <span className="text-slate-300">{r.AUD.toFixed(4)}</span></span>}
                {r.SGD && <span>SGD <span className="text-slate-300">{r.SGD.toFixed(4)}</span></span>}
                {r.ZAR && <span>ZAR <span className="text-red-400">{r.ZAR.toFixed(4)}</span></span>}
                {r.TRY && <span>TRY <span className="text-red-400">{r.TRY.toFixed(2)}</span></span>}
                {r.SEK && <span>SEK <span className="text-slate-300">{r.SEK.toFixed(4)}</span></span>}
                {r.NOK && <span>NOK <span className="text-slate-300">{r.NOK.toFixed(4)}</span></span>}
                {/* Repeat for seamless loop */}
                {r.EUR && <span>EUR <span className="text-green-400">{(1 / r.EUR).toFixed(4)}</span></span>}
                {r.GBP && <span>GBP <span className="text-green-400">{(1 / r.GBP).toFixed(4)}</span></span>}
                {r.JPY && <span>JPY <span className="text-red-400">{r.JPY.toFixed(2)}</span></span>}
            </div>
        </div>
    )
}

// ─── Main Dashboard ───────────────────────────────────────
export function DashboardGrid() {
    return (
        <div className="flex flex-col w-full h-screen bg-[#0a0a0f] text-white overflow-hidden">
            {/* Status Bar */}
            <StatusBar />

            {/* Ticker Tape */}
            <TickerTape />

            {/* Main Content: 3-column grid */}
            <div className="flex-1 grid grid-cols-[260px_1fr_260px] min-h-0 overflow-hidden">

                {/* ── Left Column ── */}
                <div className="overflow-y-auto border-r border-white/[0.06]">
                    <MacroPanel />
                    <NewsPanel />
                    <MaritimePanel />
                </div>

                {/* ── Center: Globe ── */}
                <div className="relative min-h-0 overflow-hidden">
                    <GodModeGlobe />
                </div>

                {/* ── Right Column ── */}
                <div className="overflow-y-auto border-l border-white/[0.06]">
                    <EconomyPanel />
                    <OptionsPanel />
                    <AlertsPanel />
                    <FxPanel />
                </div>
            </div>
        </div>
    )
}
