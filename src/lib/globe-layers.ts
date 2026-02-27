/**
 * Globe Overlay Data Layer
 * 
 * Provides coordinates and metadata for:
 * - Trade Routes (Arcs)
 * - Nuclear Sites (Points)
 * - Military Bases (Points)
 * - Airplane Routes (Arcs)
 */

export interface GlobePoint {
    lat: number;
    lng: number;
    name: string;
    type: 'nuclear' | 'military';
    details?: string;
    color: string;
    size: number;
}

export interface GlobeArc {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    name: string;
    type: 'trade' | 'plane';
    color: string;
    count?: number; // Represent intensity
}

// ─── Trade Routes ─────────────────────────────────────────
export const TRADE_ROUTES: GlobeArc[] = [
    { startLat: 31.2304, startLng: 121.4737, endLat: 34.0522, endLng: -118.2437, name: "Shanghai -> LA", type: 'trade', color: '#3b82f6' }, // Transpacific
    { startLat: 40.7128, startLng: -74.0060, endLat: 51.5074, endLng: -0.1278, name: "NYC -> London", type: 'trade', color: '#3b82f6' }, // Transatlantic
    { startLat: 1.3521, startLng: 103.8198, endLat: 25.2048, endLng: 55.2708, name: "Singapore -> Dubai", type: 'trade', color: '#3b82f6' }, // Indian Ocean
    { startLat: 52.3676, startLng: 4.9041, endLat: 1.3521, endLng: 103.8198, name: "Rotterdam -> Singapore", type: 'trade', color: '#3b82f6' }, // Europe-Asia
    { startLat: 35.6762, startLng: 139.6503, endLat: 34.0522, endLng: -118.2437, name: "Tokyo -> LA", type: 'trade', color: '#3b82f6' },
    { startLat: -33.8688, startLng: 151.2093, endLat: 31.2304, endLng: 121.4737, name: "Sydney -> Shanghai", type: 'trade', color: '#3b82f6' },
    { startLat: -23.5505, startLng: -46.6333, endLat: 52.3676, endLng: 4.9041, name: "Sao Paulo -> Rotterdam", type: 'trade', color: '#3b82f6' },
    { startLat: 31.2304, startLng: 121.4737, endLat: 1.3521, endLng: 103.8198, name: "Shanghai -> Singapore", type: 'trade', color: '#3b82f6' },
];

// ─── Airplane Routes ──────────────────────────────────────
export const PLANE_ROUTES: GlobeArc[] = [
    { startLat: 40.6413, startLng: -73.7781, endLat: 51.4700, endLng: -0.4543, name: "JFK -> Heathrow", type: 'plane', color: '#f59e0b', count: 20 },
    { startLat: -33.9461, startLng: 151.1772, endLat: 1.3644, endLng: 103.9915, name: "Sydney -> Singapore", type: 'plane', color: '#f59e0b', count: 12 },
    { startLat: 35.7775, startLng: 140.4184, endLat: 34.0522, endLng: -118.2437, name: "Narita -> LAX", type: 'plane', color: '#f59e0b', count: 15 },
    { startLat: 51.4700, startLng: -0.4543, endLat: 25.2532, endLng: 55.3657, name: "Heathrow -> Dubai", type: 'plane', color: '#f59e0b', count: 18 },
    { startLat: 48.7262, startLng: 2.3652, endLat: 1.3644, endLng: 103.9915, name: "Paris -> Singapore", type: 'plane', color: '#f59e0b', count: 8 },
    { startLat: 55.7558, startLng: 37.6173, endLat: 39.9042, endLng: 116.4074, name: "Moscow -> Beijing", type: 'plane', color: '#f59e0b', count: 5 },
    { startLat: -26.1367, startLng: 28.2411, endLat: 51.4700, endLng: -0.4543, name: "Joburg -> Heathrow", type: 'plane', color: '#f59e0b', count: 6 },
];

// ─── Nuclear Sites ────────────────────────────────────────
export const NUCLEAR_SITES: GlobePoint[] = [
    { lat: 37.4215, lng: 141.0326, name: "Fukushima Daiichi", type: 'nuclear', details: "Japan - Decommissioning", color: '#ef4444', size: 1.2 },
    { lat: 47.5111, lng: 34.5861, name: "Zaporizhzhia NPP", type: 'nuclear', details: "Ukraine - Largest in Europe", color: '#ef4444', size: 1.5 },
    { lat: 33.3888, lng: -112.8597, name: "Palo Verde", type: 'nuclear', details: "USA - Arizona", color: '#ef4444', size: 1.2 },
    { lat: 58.0772, lng: 11.2333, name: "Sellafield", type: 'nuclear', details: "UK - Reprocessing", color: '#ef4444', size: 1.0 },
    { lat: 44.4097, lng: 4.7061, name: "Tricastin", type: 'nuclear', details: "France", color: '#ef4444', size: 1.1 },
    { lat: 35.6311, lng: 119.4758, name: "Qinshan", type: 'nuclear', details: "China", color: '#ef4444', size: 1.3 },
    { lat: 51.273, lng: 30.222, name: "Chernobyl", type: 'nuclear', details: "Ukraine - Exclusion Zone", color: '#ef4444', size: 1.0 },
    { lat: -33.676, lng: 18.431, name: "Koeberg", type: 'nuclear', details: "South Africa", color: '#ef4444', size: 1.0 },
];

// ─── Military Bases ───────────────────────────────────────
export const MILITARY_BASES: GlobePoint[] = [
    { lat: 49.4452, lng: 7.5901, name: "Ramstein Air Base", type: 'military', details: "Germany - USAFE Hub", color: '#8b5cf6', size: 1.2 },
    { lat: 35.2931, lng: 139.6644, name: "Yokosuka Naval Base", type: 'military', details: "Japan - US 7th Fleet", color: '#8b5cf6', size: 1.2 },
    { lat: -7.3111, lng: 72.4111, name: "Diego Garcia", type: 'military', details: "BIOT - Strategic US/UK Hub", color: '#8b5cf6', size: 1.5 },
    { lat: 19.9072, lng: -75.0989, name: "Guantanamo Bay", type: 'military', details: "Cuba - US Naval Base", color: '#8b5cf6', size: 1.1 },
    { lat: 13.5900, lng: 144.9100, name: "Andersen Air Force Base", type: 'military', details: "Guam - US Power Projection", color: '#8b5cf6', size: 1.4 },
    { lat: 25.1164, lng: 51.2144, name: "Al Udeid Air Base", type: 'military', details: "Qatar - US CENTCOM Hub", color: '#8b5cf6', size: 1.3 },
    { lat: 59.9016, lng: 30.2608, name: "Kronstadt Naval Base", type: 'military', details: "Russia", color: '#8b5cf6', size: 1.1 },
    { lat: -21.815, lng: 114.166, name: "Naval Communication Station Harold E. Holt", type: 'military', details: "Australia", color: '#8b5cf6', size: 1.0 },
];
