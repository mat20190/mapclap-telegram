export const MAPCLAP_CONFIG = {
  appName: "MapClap",
  mascotName: "Клэп",
  defaultCity: "Москва",
  defaultPosition: { lat: 55.741, lon: 37.653 },
  yandexMapsKey: import.meta.env.VITE_YANDEX_MAPS_API_KEY || import.meta.env.VITE_MAPCLAP_YANDEX_KEY || "",
};

export const EDITING_GUIDE = {
  places: "src/data/places.js",
  styles: "src/styles.css",
  mascot: "src/App.jsx: CorgiFace и CorgiBack",
  map: "src/App.jsx: MapPanel",
  auth: "src/App.jsx: AuthScreen",
};
