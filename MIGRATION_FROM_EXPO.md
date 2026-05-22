# Перенос Expo -> Telegram Mini App

Telegram Mini App не запускает React Native напрямую, поэтому Expo-версия переносится в web-слой по функциям и данным.

## Уже перенесено

- Регистрация и вход пользователя.
- Сохранение пользователя в локальном хранилище.
- Геолокация через Telegram LocationManager и браузерный fallback.
- Яндекс.Карта в web-интерфейсе.
- Точки мест на карте.
- Маршрут от геопозиции пользователя до выбранного места.
- Клэп на карте как отдельная метка.
- Подбор мест по текстовому запросу.
- Категории: спорт, музыка, театр, музеи, еда, развлечения.
- Карточки мест.
- Большая карточка места.
- Ссылки на сайты мест.
- Сохраненные места.
- Кабинет пользователя.
- Горизонтальные подборки.
- Поддержка Blender-модели через `.glb`.

## Что редактировать

- Места: `src/data/places.js`
- Тексты приложения: `src/data/appContent.js`
- Основной интерфейс: `src/App.jsx`
- Внешний вид: `src/styles.css`
- Геолокация: `src/services/location.js`
- Маршруты: `src/services/routing.js`
- Яндекс.Карты: `src/services/yandexMaps.js`

## Маскот из Blender

Файл модели должен лежать в одном из путей:

```text
public/models/clap-corgi.glb
public/models/clap.glb
public/models/corgi.glb
public/clap-corgi.glb
public/assets/clap-corgi.glb
```

Лучший путь:

```text
public/models/clap-corgi.glb
```
