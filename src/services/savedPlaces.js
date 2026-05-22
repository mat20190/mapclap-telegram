const STORAGE_KEY = "mapclap-saved-places";

export function getSavedPlaces() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveSavedPlaces(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function toggleSavedPlace(ids, placeId) {
  if (ids.includes(placeId)) return ids.filter((id) => id !== placeId);
  return [...ids, placeId];
}
