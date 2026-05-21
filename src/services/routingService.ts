type Coordinate = {
  latitude: number;
  longitude: number;
};

export type RoutingMode = "walk" | "bike" | "scooter" | "car" | "bus" | "trolley";

export type RouteResult = {
  coordinates: Coordinate[];
  distanceMeters?: number;
  durationSeconds?: number;
  source: "2gis" | "fallback";
};

declare const process:
  | {
      env?: {
        EXPO_PUBLIC_2GIS_KEY?: string;
      };
    }
  | undefined;

const modeTo2gis: Record<RoutingMode, string> = {
  walk: "pedestrian",
  bike: "bicycle",
  scooter: "scooter",
  car: "car",
  bus: "public_transport",
  trolley: "public_transport"
};

function distanceMeters(from: Coordinate, to: Coordinate) {
  const radius = 6371000;
  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fallbackRoute(from: Coordinate, to: Coordinate): RouteResult {
  const steps = 28;
  const coordinates = Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    const curve = Math.sin(t * Math.PI) * 0.0022;
    return {
      latitude: from.latitude + (to.latitude - from.latitude) * t + curve,
      longitude: from.longitude + (to.longitude - from.longitude) * t - curve * 0.55
    };
  });

  return {
    coordinates,
    distanceMeters: distanceMeters(from, to) * 1.28,
    durationSeconds: (distanceMeters(from, to) * 1.28 / 1000 / 4.8) * 3600,
    source: "fallback"
  };
}

function extractCoordinates(payload: unknown): Coordinate[] {
  const routes = (payload as { result?: Array<{ maneuvers?: Array<{ outcoming_path?: { geometry?: number[][] } }> }> })
    .result;

  const points =
    routes?.[0]?.maneuvers?.flatMap((maneuver) =>
      maneuver.outcoming_path?.geometry?.map(([longitude, latitude]) => ({
        latitude,
        longitude
      })) ?? []
    ) ?? [];

  return points.filter(
    (point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude)
  );
}

function extractRouteStats(payload: unknown) {
  const route = (payload as { result?: Array<{ total_distance?: number; total_duration?: number }> })
    .result?.[0];
  return {
    distanceMeters: route?.total_distance,
    durationSeconds: route?.total_duration
  };
}

export async function calculateRoute(
  from: Coordinate,
  to: Coordinate,
  mode: RoutingMode
): Promise<RouteResult> {
  const key =
    typeof process !== "undefined"
      ? process.env?.EXPO_PUBLIC_2GIS_KEY
      : undefined;
  if (!key) {
    return fallbackRoute(from, to);
  }

  try {
    const response = await fetch(`https://routing.api.2gis.com/routing/7.0.0/global?key=${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        points: [
          { type: "walking", lon: from.longitude, lat: from.latitude },
          { type: "walking", lon: to.longitude, lat: to.latitude }
        ],
        transport: modeTo2gis[mode],
        route_mode: "fastest",
        traffic_mode: "jam"
      })
    });

    if (!response.ok) {
      return fallbackRoute(from, to);
    }

    const payload = await response.json();
    const coordinates = extractCoordinates(payload);
    if (coordinates.length < 2) {
      return fallbackRoute(from, to);
    }

    return {
      coordinates,
      ...extractRouteStats(payload),
      source: "2gis"
    };
  } catch {
    return fallbackRoute(from, to);
  }
}
