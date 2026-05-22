# Архитектура Telegram-версии MapClap

Цель этой папки — повторить Expo-приложение в формате Telegram Mini App.

## Слои

### Данные

- `src/data/places.js` — места, категории, адреса, координаты, сайты, изображения.
- `src/data/appContent.js` — тексты онбординга, быстрые запросы, интересы пользователя.

### Сервисы

- `src/services/location.js` — Telegram LocationManager + browser geolocation.
- `src/services/routing.js` — построение маршрута и fallback.
- `src/services/yandexMaps.js` — загрузка Yandex Maps JS API.
- `src/services/savedPlaces.js` — сохраненные места пользователя.
- `src/services/telegramApp.js` — Telegram WebApp SDK, хаптики, оформление.

### UI

- `src/App.jsx` — текущий главный файл UI. Следующий этап — разнести его на компоненты:
  - `components/Mascot`
  - `components/Map`
  - `components/Auth`
  - `components/Places`
  - `components/Profile`

### Assets

- `public/models/clap-corgi.glb` — правильное место для Blender-модели Клэпа.

## Почему не копируется один в один

Expo использует React Native компоненты (`View`, `Text`, `Pressable`, `StyleSheet`, native maps). Telegram Mini App использует обычный web (`div`, `button`, CSS, browser APIs). Поэтому перенос делается по архитектуре и поведению, а не простым копированием JSX.
