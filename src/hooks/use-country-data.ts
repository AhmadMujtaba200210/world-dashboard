"use client"

import { useEffect, useState, useRef } from "react"
import { useCountry } from "@/context/country-context"
import {
    fetchCountryBasicInfo,
    fetchMacroIndicators,
    fetchFxRates,
    type CountryBasicInfo,
    type MacroIndicators,
    type FxRates,
} from "@/lib/api"

interface CountryData {
    basic: CountryBasicInfo | null
    macro: MacroIndicators | null
    loading: boolean
    error: string | null
}

/**
 * Hook that fetches all country data when a country is selected on the globe.
 * Uses REST Countries + World Bank APIs — both free, no keys needed.
 */
export function useCountryData(): CountryData & { fx: FxRates | null; fxLoading: boolean } {
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

        setLoading(true)
        setError(null)

        // Fetch basic info and macro indicators in parallel
        Promise.all([
            fetchCountryBasicInfo(selectedCountry),
            fetchMacroIndicators(selectedCountry),
        ])
            .then(([basicData, macroData]) => {
                setBasic(basicData)
                setMacro(macroData)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message || "Failed to fetch data")
                setLoading(false)
            })
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

    return { basic, macro, loading, error, fx, fxLoading }
}
