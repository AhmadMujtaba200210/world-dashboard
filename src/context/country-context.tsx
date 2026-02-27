"use client"

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react"

// Country data enrichment – maps ISO A3 codes to useful metadata
export const COUNTRY_DATA: Record<string, {
    name: string
    currency: string
    mainIndex: string
    region: string
    capitalCity: string
    iso2: string
}> = {
    USA: { name: "United States", currency: "USD", mainIndex: "S&P 500", region: "North America", capitalCity: "Washington, D.C.", iso2: "US" },
    GBR: { name: "United Kingdom", currency: "GBP", mainIndex: "FTSE 100", region: "Europe", capitalCity: "London", iso2: "GB" },
    JPN: { name: "Japan", currency: "JPY", mainIndex: "Nikkei 225", region: "Asia", capitalCity: "Tokyo", iso2: "JP" },
    CHN: { name: "China", currency: "CNY", mainIndex: "Shanghai Composite", region: "Asia", capitalCity: "Beijing", iso2: "CN" },
    DEU: { name: "Germany", currency: "EUR", mainIndex: "DAX", region: "Europe", capitalCity: "Berlin", iso2: "DE" },
    FRA: { name: "France", currency: "EUR", mainIndex: "CAC 40", region: "Europe", capitalCity: "Paris", iso2: "FR" },
    IND: { name: "India", currency: "INR", mainIndex: "NIFTY 50", region: "Asia", capitalCity: "New Delhi", iso2: "IN" },
    BRA: { name: "Brazil", currency: "BRL", mainIndex: "Bovespa", region: "South America", capitalCity: "Brasília", iso2: "BR" },
    CAN: { name: "Canada", currency: "CAD", mainIndex: "S&P/TSX", region: "North America", capitalCity: "Ottawa", iso2: "CA" },
    AUS: { name: "Australia", currency: "AUD", mainIndex: "ASX 200", region: "Oceania", capitalCity: "Canberra", iso2: "AU" },
    KOR: { name: "South Korea", currency: "KRW", mainIndex: "KOSPI", region: "Asia", capitalCity: "Seoul", iso2: "KR" },
    RUS: { name: "Russia", currency: "RUB", mainIndex: "MOEX", region: "Europe/Asia", capitalCity: "Moscow", iso2: "RU" },
    SAU: { name: "Saudi Arabia", currency: "SAR", mainIndex: "Tadawul", region: "Middle East", capitalCity: "Riyadh", iso2: "SA" },
    ZAF: { name: "South Africa", currency: "ZAR", mainIndex: "JSE Top 40", region: "Africa", capitalCity: "Pretoria", iso2: "ZA" },
    MEX: { name: "Mexico", currency: "MXN", mainIndex: "IPC", region: "North America", capitalCity: "Mexico City", iso2: "MX" },
    CHE: { name: "Switzerland", currency: "CHF", mainIndex: "SMI", region: "Europe", capitalCity: "Bern", iso2: "CH" },
    SGP: { name: "Singapore", currency: "SGD", mainIndex: "STI", region: "Asia", capitalCity: "Singapore", iso2: "SG" },
    ARE: { name: "UAE", currency: "AED", mainIndex: "ADX", region: "Middle East", capitalCity: "Abu Dhabi", iso2: "AE" },
    NGA: { name: "Nigeria", currency: "NGN", mainIndex: "NGX ASI", region: "Africa", capitalCity: "Abuja", iso2: "NG" },
    TUR: { name: "Turkey", currency: "TRY", mainIndex: "BIST 100", region: "Europe/Asia", capitalCity: "Ankara", iso2: "TR" },
    IDN: { name: "Indonesia", currency: "IDR", mainIndex: "IDX Composite", region: "Asia", capitalCity: "Jakarta", iso2: "ID" },
    PAK: { name: "Pakistan", currency: "PKR", mainIndex: "KSE 100", region: "Asia", capitalCity: "Islamabad", iso2: "PK" },
    ARG: { name: "Argentina", currency: "ARS", mainIndex: "S&P Merval", region: "South America", capitalCity: "Buenos Aires", iso2: "AR" },
    EGY: { name: "Egypt", currency: "EGP", mainIndex: "EGX 30", region: "Africa", capitalCity: "Cairo", iso2: "EG" },
    ISR: { name: "Israel", currency: "ILS", mainIndex: "TA-125", region: "Middle East", capitalCity: "Jerusalem", iso2: "IL" },
    ITA: { name: "Italy", currency: "EUR", mainIndex: "FTSE MIB", region: "Europe", capitalCity: "Rome", iso2: "IT" },
    ESP: { name: "Spain", currency: "EUR", mainIndex: "IBEX 35", region: "Europe", capitalCity: "Madrid", iso2: "ES" },
    NLD: { name: "Netherlands", currency: "EUR", mainIndex: "AEX", region: "Europe", capitalCity: "Amsterdam", iso2: "NL" },
    POL: { name: "Poland", currency: "PLN", mainIndex: "WIG20", region: "Europe", capitalCity: "Warsaw", iso2: "PL" },
    SWE: { name: "Sweden", currency: "SEK", mainIndex: "OMX Stockholm 30", region: "Europe", capitalCity: "Stockholm", iso2: "SE" },
    NOR: { name: "Norway", currency: "NOK", mainIndex: "OBX", region: "Europe", capitalCity: "Oslo", iso2: "NO" },
    THA: { name: "Thailand", currency: "THB", mainIndex: "SET", region: "Asia", capitalCity: "Bangkok", iso2: "TH" },
    MYS: { name: "Malaysia", currency: "MYR", mainIndex: "KLCI", region: "Asia", capitalCity: "Kuala Lumpur", iso2: "MY" },
    PHL: { name: "Philippines", currency: "PHP", mainIndex: "PSEi", region: "Asia", capitalCity: "Manila", iso2: "PH" },
    VNM: { name: "Vietnam", currency: "VND", mainIndex: "VN-Index", region: "Asia", capitalCity: "Hanoi", iso2: "VN" },
    COL: { name: "Colombia", currency: "COP", mainIndex: "COLCAP", region: "South America", capitalCity: "Bogotá", iso2: "CO" },
    CHL: { name: "Chile", currency: "CLP", mainIndex: "IPSA", region: "South America", capitalCity: "Santiago", iso2: "CL" },
    IRN: { name: "Iran", currency: "IRR", mainIndex: "TEDPIX", region: "Middle East", capitalCity: "Tehran", iso2: "IR" },
    IRQ: { name: "Iraq", currency: "IQD", mainIndex: "ISX", region: "Middle East", capitalCity: "Baghdad", iso2: "IQ" },
    UKR: { name: "Ukraine", currency: "UAH", mainIndex: "PFTS", region: "Europe", capitalCity: "Kyiv", iso2: "UA" },
    TWN: { name: "Taiwan", currency: "TWD", mainIndex: "TAIEX", region: "Asia", capitalCity: "Taipei", iso2: "TW" },
    HKG: { name: "Hong Kong", currency: "HKD", mainIndex: "Hang Seng", region: "Asia", capitalCity: "Hong Kong", iso2: "HK" },
}

interface CountryContextType {
    selectedCountry: string | null        // ISO A3 code (e.g., "USA")
    selectedCountryName: string | null    // Human name (e.g., "United States")
    selectCountry: (isoA3: string, name: string) => void
    clearCountry: () => void
}

const CountryContext = createContext<CountryContextType>({
    selectedCountry: null,
    selectedCountryName: null,
    selectCountry: () => { },
    clearCountry: () => { },
})

export function CountryProvider({ children }: { children: ReactNode }) {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
    const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null)

    const selectCountry = useCallback((isoA3: string, name: string) => {
        setSelectedCountry(isoA3)
        setSelectedCountryName(name)
    }, [])

    const clearCountry = useCallback(() => {
        setSelectedCountry(null)
        setSelectedCountryName(null)
    }, [])

    const value = useMemo(() => ({
        selectedCountry, selectedCountryName, selectCountry, clearCountry
    }), [selectedCountry, selectedCountryName, selectCountry, clearCountry])

    return (
        <CountryContext.Provider value={value}>
            {children}
        </CountryContext.Provider>
    )
}

export function useCountry() {
    return useContext(CountryContext)
}
