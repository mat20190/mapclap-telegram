# MapClap Telegram Mini App

Это web-версия приложения для Telegram. Она сделана как перенос Expo-логики в браузерный формат, потому что Telegram Mini App запускает не React Native, а обычный сайт внутри Telegram.

## Где что редактировать

- `src/data/places.js` — все места, категории, координаты, сайты, фото и описания.
- `src/App.jsx` — экраны приложения: вход, регистрация, карта, карточка места, Клэп, подбор.
- `src/styles.css` — весь внешний вид приложения.
- `src/services/location.js` — вход/выход пользователя и геолокация.
- `src/services/routing.js` — расчет маршрута.
- `src/services/yandexMaps.js` — подключение Яндекс.Карт.
- `api/route.js` — серверный маршрут на Vercel.

## Какие ключи нужны в Vercel

В Vercel открой Project Settings -> Environment Variables и добавь:

```text
VITE_YANDEX_MAPS_API_KEY
YANDEX_MAPS_API_KEY
```

Первый ключ нужен для карты в интерфейсе, второй можно использовать для серверного маршрута.

## Как обновлять приложение

1. Меняешь файлы в этой папке.
2. Загружаешь изменения в GitHub.
3. Нажимаешь Commit.
4. Нажимаешь Push origin.
5. Vercel сам делает новый деплой.
6. В Telegram открываешь mini app. Если кэш старый, добавляешь к ссылке `?v=11`.
