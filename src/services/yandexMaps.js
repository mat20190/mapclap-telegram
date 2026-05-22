import { MAPCLAP_CONFIG } from "../config/mapclap";

export function loadYandexMaps() {
  if (window.ymaps) return Promise.resolve(window.ymaps);
  if (window.__mapclapYmapsPromise) return window.__mapclapYmapsPromise;

  window.__mapclapYmapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const params = new URLSearchParams({ lang: "ru_RU", load: "package.full" });
    if (MAPCLAP_CONFIG.yandexMapsKey) params.set("apikey", MAPCLAP_CONFIG.yandexMapsKey);
    script.src = `https://api-maps.yandex.ru/2.1/?${params.toString()}`;
    script.async = true;
    script.onload = () => window.ymaps.ready(() => resolve(window.ymaps));
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return window.__mapclapYmapsPromise;
}
