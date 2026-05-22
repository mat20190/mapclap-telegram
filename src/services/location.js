import { MAPCLAP_CONFIG } from "../config/mapclap";

export function getStoredUser() {
  try {
    const saved = localStorage.getItem("mapclap-user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveUser(user) {
  localStorage.setItem("mapclap-user", JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem("mapclap-user");
}

export function watchUserLocation(onLocation) {
  if (!navigator.geolocation) {
    onLocation(MAPCLAP_CONFIG.defaultPosition);
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    },
    () => {
      onLocation(MAPCLAP_CONFIG.defaultPosition);
    },
    { enableHighAccuracy: true, maximumAge: 8000, timeout: 12000 }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}
