import type { CityOption } from '@/types/trip';

// Simple Mapbox Geocoding client (browser fetch)
// Expects NEXT_PUBLIC_MAPBOX_TOKEN to be set. We fall back to a small static list.

const STATIC_CITIES: CityOption[] = [
  { id: 'manila-ph', name: 'Manila, Philippines', country: 'Philippines' },
  { id: 'cebu-ph', name: 'Cebu, Philippines', country: 'Philippines' },
  { id: 'bangkok-th', name: 'Bangkok, Thailand', country: 'Thailand' },
  { id: 'bali-id', name: 'Bali, Indonesia', country: 'Indonesia' },
  { id: 'tokyo-jp', name: 'Tokyo, Japan', country: 'Japan' },
];

type MapboxContextItem = {
  id?: string;
  text?: string;
};

type MapboxFeature = {
  id?: string;
  place_name?: string;
  context?: MapboxContextItem[];
};

type MapboxGeocodeResponse = {
  features?: MapboxFeature[];
};

export async function searchCitiesWithMapbox(query: string): Promise<CityOption[]> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const trimmed = query.trim();
  if (!trimmed) return [];

  if (!token) {
    // Fallback to static matches
    const lower = trimmed.toLowerCase();
    return STATIC_CITIES.filter(c => c.name.toLowerCase().includes(lower));
  }

  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json?types=place%2Cregion%2Clocality&limit=5&access_token=${token}`
    );
    if (!res.ok) throw new Error('Mapbox request failed');
    const data: MapboxGeocodeResponse = await res.json();
    const features: MapboxFeature[] = Array.isArray(data?.features) ? data.features : [];
    return features.map((feature) => {
      const placeId = feature.id ?? feature.place_name ?? '';
      const placeName = feature.place_name ?? '';
      const context = Array.isArray(feature.context) ? feature.context : [];
      const countryText = context.find((c) => (c.id ?? '').startsWith('country'))?.text ?? '';
      const regionText = context.find((c) => (c.id ?? '').startsWith('region'))?.text ?? '';
      return {
        id: String(placeId),
        name: String(placeName),
        country: String(countryText),
        region: String(regionText),
      };
    });
  } catch {
    return [];
  }
}

export function getStaticCities(): CityOption[] {
  return STATIC_CITIES;
}


