/**
 * Service to calculate distance, travel duration, and delivery shipping fee.
 * 
 * Base Origin:
 * 7°48'33.3"S 112°01'20.0"E -> (-7.809250, 112.022222)
 * 
 * Rules:
 * - Free shipping if within 9 km radius.
 * - If > 9 km, calculate estimated travel duration from origin to customer.
 * - Delivery fee formula: {(estimasi waktu tempuh dalam menit * 1.000) - 5.000}
 * - Free shipping if fee <= 0.
 */

export const STORE_ORIGIN = {
  lat: -7.809250,
  lng: 112.022222,
  label: 'Ortukill ATLAS AMER KEDIRI (7°48\'33.3"S 112°01\'20.0"E)',
  freeShippingRadiusKm: 10
};

export interface DeliveryEstimate {
  distanceKm: number;
  durationMinutes: number;
  isFreeShipping: boolean;
  shippingFee: number;
  isDirectRoute: boolean;
  source: 'osrm' | 'haversine-estimate';
}

/**
 * Calculate Great Circle Distance in KM using Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Rumus Waktu Tempuh Riil (Jalan Berliku/Padat):
 * (Jarak ÷ 60) × 120 = ... Menit
 */
export function computeTravelDurationMinutes(distanceKm: number): number {
  return Math.max(1, Math.round((distanceKm / 60) * 120));
}

/**
 * Calculate shipping fee based on travel duration in minutes:
 * - Radius <= 10 km: GRATIS (0)
 * - Di luar radius 10 km: {(estimasi waktu tempuh * 1.000) - 5.000}
 */
export function computeShippingFee(distanceKm: number, durationMinutes: number): { isFree: boolean; fee: number } {
  if (distanceKm <= STORE_ORIGIN.freeShippingRadiusKm) {
    return { isFree: true, fee: 0 };
  }

  const rawFee = Math.round(durationMinutes * 1000 - 5000);
  const fee = Math.max(0, rawFee);
  return {
    isFree: fee <= 0,
    fee
  };
}

/**
 * Fetch real driving route from OSRM to determine road distance,
 * then calculate duration with user's formula (Jarak/60)*120
 * and fee with {(durasi * 1.000) - 5.000}.
 */
export async function getDeliveryEstimate(
  destLat: number,
  destLng: number
): Promise<DeliveryEstimate> {
  const originLat = STORE_ORIGIN.lat;
  const originLng = STORE_ORIGIN.lng;

  // 1. Calculate direct straight-line distance
  const straightDistKm = calculateHaversineDistanceKm(originLat, originLng, destLat, destLng);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=false`;
    const response = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const routeDistanceKm = Math.round((route.distance / 1000) * 10) / 10;
        
        // Rumus Waktu Tempuh Riil: (Jarak ÷ 60) × 120
        const durationMinutes = computeTravelDurationMinutes(routeDistanceKm);

        // Hitung status gratis dan ongkir berdasarkan jarak rute riil (<= 10km)
        const { isFree, fee } = computeShippingFee(routeDistanceKm, durationMinutes);

        return {
          distanceKm: routeDistanceKm,
          durationMinutes,
          isFreeShipping: isFree,
          shippingFee: fee,
          isDirectRoute: true,
          source: 'osrm'
        };
      }
    }
  } catch (err) {
    console.warn('OSRM routing fetch failed or timed out, falling back to estimation:', err);
  }

  // 2. High-precision fallback estimate for Kediri / Indonesian city delivery
  // Faktor jalan berliku ~1.35x dari garis lurus
  const roadDistKm = Math.round(straightDistKm * 1.35 * 10) / 10;
  const estMinutes = computeTravelDurationMinutes(roadDistKm);

  const { isFree, fee } = computeShippingFee(roadDistKm, estMinutes);

  return {
    distanceKm: roadDistKm,
    durationMinutes: estMinutes,
    isFreeShipping: isFree,
    shippingFee: fee,
    isDirectRoute: false,
    source: 'haversine-estimate'
  };
}
