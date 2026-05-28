const STORAGE_KEY = "mapclap-custom-places";

export function getCustomPlaces() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCustomPlaces(places) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
}

export function createCustomPlace(form, fallbackPosition) {
  const now = Date.now();
  return {
    id: `custom-${now}`,
    title: form.title.trim(),
    category: form.category,
    address: form.address.trim() || "Мое место",
    coordinates: {
      lat: Number(form.lat) || fallbackPosition.lat,
      lon: Number(form.lon) || fallbackPosition.lon,
    },
    site: form.site.trim() || "#",
    schedule: form.schedule.trim() || "По настроению",
    price: form.price.trim() || "Уточнить",
    imageUrl:
      form.imageUrl.trim() ||
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85",
    description: form.description.trim() || "Любимое место пользователя на карте MapClap.",
    custom: true,
  };
}
