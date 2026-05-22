export function distanceKm(a, b) {
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

export function buildDemoRoute(from, to) {
  const points = [];
  for (let i = 0; i <= 18; i += 1) {
    const t = i / 18;
    points.push({
      lat: from.lat + (to.lat - from.lat) * t + Math.sin(t * Math.PI) * 0.0009,
      lon: from.lon + (to.lon - from.lon) * t - Math.sin(t * Math.PI) * 0.0005,
    });
  }

  const km = distanceKm(from, to);
  return {
    points,
    distanceText: `${km.toFixed(1)} км`,
    durationText: `${Math.max(6, Math.round((km / 4.2) * 60))} мин`,
    source: "MapClap",
  };
}

export async function requestRoute(from, to, mode = "walk") {
  try {
    const response = await fetch("/api/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, mode }),
    });
    if (!response.ok) throw new Error("route failed");
    const data = await response.json();
    const route = data.points?.length ? data : buildDemoRoute(from, to);
    return normalizeRoute(route, from, to, mode);
  } catch {
    return normalizeRoute(buildDemoRoute(from, to), from, to, mode);
  }
}

function normalizeRoute(route, from, to, mode) {
  const points = route.points?.length ? route.points : buildDemoRoute(from, to).points;
  return {
    ...route,
    points,
    from,
    to,
    mode,
    distanceText: route.distanceText || buildDemoRoute(from, to).distanceText,
    durationText: route.durationText || buildDemoRoute(from, to).durationText,
    source: route.source || "MapClap",
  };
}
