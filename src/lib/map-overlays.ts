export interface MapCity {
  id: string
  name: string
  country: string
  lat: number
  lng: number
  tier: "global" | "regional"
}

export interface WaterBodyLabel {
  id: string
  name: string
  type: "ocean" | "sea" | "strait"
  lat: number
  lng: number
  details: string
}

export interface StrategicRoute {
  id: string
  name: string
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  type: "energy" | "trade" | "military"
  details: string
  color: string
}

export interface WeatherHub {
  id: string
  name: string
  country: string
  region: string
  lat: number
  lng: number
}

export const MAJOR_CITIES: MapCity[] = [
  { id: "nyc", name: "New York", country: "USA", lat: 40.7128, lng: -74.006, tier: "global" },
  { id: "la", name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437, tier: "regional" },
  { id: "london", name: "London", country: "UK", lat: 51.5072, lng: -0.1276, tier: "global" },
  { id: "paris", name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, tier: "global" },
  { id: "berlin", name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405, tier: "regional" },
  { id: "istanbul", name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784, tier: "regional" },
  { id: "dubai", name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, tier: "global" },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753, tier: "regional" },
  { id: "mumbai", name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777, tier: "global" },
  { id: "delhi", name: "Delhi", country: "India", lat: 28.6139, lng: 77.209, tier: "regional" },
  { id: "singapore", name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, tier: "global" },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456, tier: "regional" },
  { id: "bangkok", name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, tier: "regional" },
  { id: "tokyo", name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, tier: "global" },
  { id: "seoul", name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.978, tier: "regional" },
  { id: "beijing", name: "Beijing", country: "China", lat: 39.9042, lng: 116.4074, tier: "global" },
  { id: "shanghai", name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737, tier: "global" },
  { id: "hong-kong", name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694, tier: "regional" },
  { id: "sydney", name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, tier: "global" },
  { id: "perth", name: "Perth", country: "Australia", lat: -31.9523, lng: 115.8613, tier: "regional" },
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473, tier: "regional" },
  { id: "cairo", name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, tier: "global" },
  { id: "lagos", name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792, tier: "regional" },
  { id: "sao-paulo", name: "Sao Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, tier: "global" },
  { id: "rio", name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729, tier: "regional" },
  { id: "buenos-aires", name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816, tier: "regional" },
  { id: "mexico-city", name: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332, tier: "global" },
  { id: "toronto", name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, tier: "regional" },
  { id: "vancouver", name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207, tier: "regional" },
]

export const WATER_BODY_LABELS: WaterBodyLabel[] = [
  { id: "pacific", name: "Pacific Ocean", type: "ocean", lat: 6, lng: -150, details: "Largest ocean basin" },
  { id: "atlantic", name: "Atlantic Ocean", type: "ocean", lat: 2, lng: -30, details: "Major transatlantic corridor" },
  { id: "indian", name: "Indian Ocean", type: "ocean", lat: -18, lng: 80, details: "Energy shipping highway" },
  { id: "arctic", name: "Arctic Ocean", type: "ocean", lat: 74, lng: 10, details: "Emerging polar routes" },
  { id: "southern", name: "Southern Ocean", type: "ocean", lat: -58, lng: 20, details: "Circumpolar current zone" },
  { id: "med", name: "Mediterranean Sea", type: "sea", lat: 35.5, lng: 17, details: "Europe-MENA chokepoint sea" },
  { id: "south-china-sea", name: "South China Sea", type: "sea", lat: 12, lng: 114, details: "High-density naval and trade traffic" },
  { id: "red-sea", name: "Red Sea", type: "sea", lat: 20, lng: 39, details: "Suez gateway" },
  { id: "hormuz", name: "Strait of Hormuz", type: "strait", lat: 26.5, lng: 56.3, details: "Key global oil chokepoint" },
  { id: "malacca", name: "Strait of Malacca", type: "strait", lat: 2.3, lng: 101.9, details: "Asia's busiest shipping lane" },
  { id: "bab-el-mandeb", name: "Bab el-Mandeb", type: "strait", lat: 12.6, lng: 43.3, details: "Red Sea entrance chokepoint" },
  { id: "suez", name: "Suez Canal", type: "strait", lat: 30.6, lng: 32.3, details: "Europe-Asia shortcut canal" },
  { id: "panama", name: "Panama Canal", type: "strait", lat: 9.1, lng: -79.7, details: "Atlantic-Pacific passage" },
  { id: "bosporus", name: "Bosporus", type: "strait", lat: 41.08, lng: 29.04, details: "Black Sea outlet to Mediterranean" },
]

export const STRATEGIC_ROUTES: StrategicRoute[] = [
  {
    id: "asia-europe-suez",
    name: "Asia-Europe Container Spine",
    startLat: 1.35,
    startLng: 103.82,
    endLat: 51.92,
    endLng: 4.48,
    type: "trade",
    details: "Singapore -> Suez -> Rotterdam",
    color: "#38bdf8",
  },
  {
    id: "gulf-asia-energy",
    name: "Gulf to East Asia Energy Route",
    startLat: 25.2,
    startLng: 55.27,
    endLat: 31.23,
    endLng: 121.47,
    type: "energy",
    details: "Hormuz -> Malacca -> East Asia",
    color: "#f97316",
  },
  {
    id: "atlantic-pacific-panama",
    name: "Atlantic-Pacific Panama Flow",
    startLat: 29.76,
    startLng: -95.37,
    endLat: 34.05,
    endLng: -118.24,
    type: "trade",
    details: "US Gulf/Atlantic -> Panama -> US West Coast",
    color: "#22d3ee",
  },
  {
    id: "north-atlantic-air-sea",
    name: "North Atlantic Core Corridor",
    startLat: 40.71,
    startLng: -74.0,
    endLat: 51.5,
    endLng: -0.12,
    type: "trade",
    details: "NYC to London strategic flow",
    color: "#60a5fa",
  },
  {
    id: "indo-pacific-defense",
    name: "Indo-Pacific Defense Arc",
    startLat: 13.44,
    startLng: 144.79,
    endLat: 35.68,
    endLng: 139.76,
    type: "military",
    details: "Guam -> Japan strategic alignment",
    color: "#a78bfa",
  },
  {
    id: "cape-diversion",
    name: "Cape of Good Hope Diversion",
    startLat: 25.2,
    startLng: 55.27,
    endLat: 51.5,
    endLng: -0.12,
    type: "trade",
    details: "Fallback when Red Sea/Suez disrupted",
    color: "#06b6d4",
  },
]

export const WEATHER_HUBS: WeatherHub[] = [
  { id: "nyc", name: "New York", country: "USA", region: "North America", lat: 40.7128, lng: -74.006 },
  { id: "london", name: "London", country: "UK", region: "Europe", lat: 51.5072, lng: -0.1276 },
  { id: "paris", name: "Paris", country: "France", region: "Europe", lat: 48.8566, lng: 2.3522 },
  { id: "dubai", name: "Dubai", country: "UAE", region: "Middle East", lat: 25.2048, lng: 55.2708 },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", region: "Middle East", lat: 24.7136, lng: 46.6753 },
  { id: "mumbai", name: "Mumbai", country: "India", region: "South Asia", lat: 19.076, lng: 72.8777 },
  { id: "delhi", name: "Delhi", country: "India", region: "South Asia", lat: 28.6139, lng: 77.209 },
  { id: "singapore", name: "Singapore", country: "Singapore", region: "Southeast Asia", lat: 1.3521, lng: 103.8198 },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", region: "Southeast Asia", lat: -6.2088, lng: 106.8456 },
  { id: "tokyo", name: "Tokyo", country: "Japan", region: "East Asia", lat: 35.6762, lng: 139.6503 },
  { id: "beijing", name: "Beijing", country: "China", region: "East Asia", lat: 39.9042, lng: 116.4074 },
  { id: "shanghai", name: "Shanghai", country: "China", region: "East Asia", lat: 31.2304, lng: 121.4737 },
  { id: "hong-kong", name: "Hong Kong", country: "China", region: "East Asia", lat: 22.3193, lng: 114.1694 },
  { id: "sydney", name: "Sydney", country: "Australia", region: "Oceania", lat: -33.8688, lng: 151.2093 },
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", region: "Africa", lat: -26.2041, lng: 28.0473 },
  { id: "cairo", name: "Cairo", country: "Egypt", region: "Africa", lat: 30.0444, lng: 31.2357 },
  { id: "lagos", name: "Lagos", country: "Nigeria", region: "Africa", lat: 6.5244, lng: 3.3792 },
  { id: "sao-paulo", name: "Sao Paulo", country: "Brazil", region: "South America", lat: -23.5505, lng: -46.6333 },
  { id: "buenos-aires", name: "Buenos Aires", country: "Argentina", region: "South America", lat: -34.6037, lng: -58.3816 },
  { id: "mexico-city", name: "Mexico City", country: "Mexico", region: "North America", lat: 19.4326, lng: -99.1332 },
]
