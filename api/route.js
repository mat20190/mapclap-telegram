function distanceKm(a, b) {
  const radius = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const modeSpeed = {
  walk: 4.2,
  bike: 13,
  scooter: 10,
  car: 22,
};

function fallbackRoute(from, to, mode = "walk") {
  const points = [];
  for (let i = 0; i <= 22; i += 1) {
    const t = i / 22;
    points.push({
      lat: from.lat + (to.lat - from.lat) * t + Math.sin(t * Math.PI) * 0.0007,
      lon: from.lon + (to.lon - from.lon) * t - Math.sin(t * Math.PI) * 0.0004,
    });
  }

  const km = distanceKm(from, to);
  return {
    points,
    distanceText: `${km.toFixed(1)} км`,
    durationText: `${Math.max(4, Math.round((km / (modeSpeed[mode] || 4.2)) * 60))} мин`,
    source: "MapClap",
    mode,
  };
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { from, to, mode = "walk" } = request.body || {};
    if (!from?.lat || !from?.lon || !to?.lat || !to?.lon) {
      response.status(400).json({ error: "Missing coordinates" });
      return;
    }

    const apiKey = process.env.VITE_YANDEX_MAPS_API_KEY || process.env.YANDEX_MAPS_API_KEY;

    if (apiKey) {
      const url = new URL("https://api.routing.yandex.net/v2/route");
      url.searchParams.set("apikey", apiKey);
      url.searchParams.set("waypoints", `${from.lat},${from.lon}|${to.lat},${to.lon}`);
      url.searchParams.set("mode", mode === "car" ? "driving" : "walking");

      const routeResponse = await fetch(url.toString());
      if (routeResponse.ok) {
        const data = await routeResponse.json();
        const route = data?.route || data?.routes?.[0];
        const geometry = route?.geometry?.coordinates || route?.legs?.flatMap((leg) => leg.steps?.flatMap((step) => step.polyline?.points || []) || []);
        if (Array.isArray(geometry) && geometry.length) {
          const points = geometry.map((point) => {
            if (Array.isArray(point)) return { lat: point[1], lon: point[0] };
            return { lat: point.lat || point.latitude, lon: point.lon || point.lng || point.longitude };
          });
          response.status(200).json({
            points,
            distanceText: route?.distance?.text || fallbackRoute(from, to, mode).distanceText,
            durationText: route?.duration?.text || fallbackRoute(from, to, mode).durationText,
            source: "Yandex Routing API",
            mode,
          });
          return;
        }
      }
    }

    response.status(200).json(fallbackRoute(from, to, mode));
  } catch (error) {
    const from = request.body?.from || { lat: 55.741, lon: 37.653 };
    const to = request.body?.to || { lat: 55.744, lon: 37.655 };
    response.status(200).json(fallbackRoute(from, to, request.body?.mode || "walk"));
  }
}
