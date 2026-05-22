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

export function requestTelegramLocation(onLocation, onStatus = () => {}) {
  const webApp = window.Telegram?.WebApp;
  const manager = webApp?.LocationManager || webApp?.locationManager;

  if (manager?.init && manager?.getLocation) {
    onStatus("requesting");
    manager.init(() => {
      if (manager.isLocationAvailable === false) {
        onStatus("unavailable");
        requestBrowserLocation(onLocation, onStatus);
        return;
      }

      manager.getLocation((location) => {
        if (location?.latitude && location?.longitude) {
          onLocation({
            lat: location.latitude,
            lon: location.longitude,
          });
          onStatus("granted");
          return;
        }

        onStatus(manager.isAccessRequested ? "denied" : "idle");
        requestBrowserLocation(onLocation, onStatus);
      });
    });
    return;
  }

  requestBrowserLocation(onLocation, onStatus);
}

export function openTelegramLocationSettings() {
  const manager = window.Telegram?.WebApp?.LocationManager || window.Telegram?.WebApp?.locationManager;
  if (manager?.openSettings) {
    manager.openSettings();
  }
}

function requestBrowserLocation(onLocation, onStatus) {
  if (!navigator.geolocation) {
    onStatus("unavailable");
    onLocation(MAPCLAP_CONFIG.defaultPosition);
    return;
  }

  onStatus("requesting");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      onLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
      onStatus("granted");
    },
    () => {
      onStatus("denied");
      onLocation(MAPCLAP_CONFIG.defaultPosition);
    },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
  );
}
