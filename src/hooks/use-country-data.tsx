"use client"

import { createContext, useContext, useEffect, useMemo, useState, useRef, type ReactNode } from "react"
import { useCountry } from "@/context/country-context"
import {
    fetchCountryBasicInfo,
    fetchMacroIndicators,
    fetchFxRates,
    type CountryBasicInfo,
    type MacroIndicators,
    type FxRates,
} from "@/lib/api"

interface CountryDataState {
    basic: CountryBasicInfo | null
    macro: MacroIndicators | null
    loading: boolean
    error: string | null
    fx: FxRates | null
    fxLoading: boolean
}

const CountryDataContext = createContext<CountryDataState>({
    basic: null,
    macro: null,
    loading: false,
    error: null,
    fx: null,
    fxLoading: false,
})

// In-memory cache for previously fetched country data
const countryCache = new Map<string, { basic: CountryBasicInfo | null; macro: MacroIndicators | null }>()

/**
 * Provider that fetches country data once and shares it across all consumers.
 * Uses REST Countries + World Bank APIs — both free, no keys needed.
 */
export function CountryDataProvider({ children }: { children: ReactNode }) {
    const { selectedCountry } = useCountry()
    const [basic, setBasic] = useState<CountryBasicInfo | null>(null)
    const [macro, setMacro] = useState<MacroIndicators | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fx, setFx] = useState<FxRates | null>(null)
    const [fxLoading, setFxLoading] = useState(false)
    const prevCountry = useRef<string | null>(null)

    // Fetch country data when selection changes
    useEffect(() => {
        if (!selectedCountry) {
            setBasic(null)
            setMacro(null)
            setError(null)
            prevCountry.current = null
            return
        }

        // Don't refetch if same country
        if (selectedCountry === prevCountry.current) return
        prevCountry.current = selectedCountry

        // Serve from cache if available (instant re-selection)
        const cached = countryCache.get(selectedCountry)
        if (cached) {
            setBasic(cached.basic)
            setMacro(cached.macro)
            setLoading(false)
            setError(null)
            return
        }

        setLoading(true)
        setError(null)

        let cancelled = false

        // Fetch basic info and macro indicators in parallel
        Promise.all([
            fetchCountryBasicInfo(selectedCountry),
            fetchMacroIndicators(selectedCountry),
        ])
            .then(([basicData, macroData]) => {
                if (cancelled) return
                setBasic(basicData)
                setMacro(macroData)
                setLoading(false)
                // Cache for future re-selections
                countryCache.set(selectedCountry, { basic: basicData, macro: macroData })
            })
            .catch((err) => {
                if (cancelled) return
                setError(err.message || "Failed to fetch data")
                setLoading(false)
            })

        return () => { cancelled = true }
    }, [selectedCountry])

    // Fetch FX rates once on mount (global, not per-country)
    useEffect(() => {
        setFxLoading(true)
        fetchFxRates("USD")
            .then((data) => {
                setFx(data)
                setFxLoading(false)
            })
            .catch(() => setFxLoading(false))
    }, [])

    const value = useMemo(() => ({
        basic, macro, loading, error, fx, fxLoading
    }), [basic, macro, loading, error, fx, fxLoading])

    return (
        <CountryDataContext.Provider value={value}>
            {children}
        </CountryDataContext.Provider>
    )
}

/**
 * Hook that returns shared country data from the nearest CountryDataProvider.
 * All consumers share the same data — no redundant API calls.
 */
export function useCountryData(): CountryDataState {
    return useContext(CountryDataContext)
}
