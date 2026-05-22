import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { onboardingCards, profileInterests, quickPrompts } from "./data/appContent";
import { categoryColors, categoryLabels, places } from "./data/places";
import { MAPCLAP_CONFIG } from "./config/mapclap";
import {
  clearUser,
  getStoredUser,
  openTelegramLocationSettings,
  requestTelegramLocation,
  saveUser,
  watchUserLocation,
} from "./services/location";
import { requestRoute } from "./services/routing";
import { getSavedPlaces, saveSavedPlaces, toggleSavedPlace } from "./services/savedPlaces";
import { loadYandexMaps } from "./services/yandexMaps";
import "./styles.css";

const tg = window.Telegram?.WebApp;
const defaultPosition = MAPCLAP_CONFIG.defaultPosition;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function CorgiFace({ small = false, calm = false }) {
  return (
    <div className={`corgi-face ${small ? "small" : ""} ${calm ? "calm" : ""}`} aria-hidden="true">
      <div className="ear left" />
      <div className="ear right" />
      <div className="head">
        <div className="mask" />
        <div className="eye left">
          <span />
        </div>
        <div className="eye right">
          <span />
        </div>
        <div className="snout">
          <i />
        </div>
      </div>
      <div className="body" />
    </div>
  );
}

function Mascot3D({ small = false }) {
  const [hasModel, setHasModel] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/models/clap-corgi.glb", { method: "HEAD" })
      .then((response) => {
        if (alive) setHasModel(response.ok);
      })
      .catch(() => {
        if (alive) setHasModel(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!hasModel) return <CorgiFace small={small} calm />;

  return (
    <model-viewer
      class={`mascot-model ${small ? "small" : ""}`}
      src="/models/clap-corgi.glb"
      camera-controls={false}
      auto-rotate
      auto-rotate-delay="0"
      rotation-per-second="18deg"
      disable-zoom
      shadow-intensity="0.45"
      exposure="1.05"
      camera-orbit="10deg 78deg 2.6m"
      field-of-view="28deg"
      interaction-prompt="none"
      aria-label="Клэп"
    />
  );
}

function CorgiBack({ progress = 0 }) {
  const step = Math.sin(progress * Math.PI * 2) * 2.5;
  return (
    <div className="corgi-map" style={{ transform: `translateY(${step}px)` }}>
      <div className="map-ear left" />
      <div className="map-ear right" />
      <div className="map-head-back">
        <div className="map-white-neck" />
      </div>
      <div className="map-body-back">
        <div className="map-white-back" />
        <div className="map-tail" />
      </div>
      <div className="map-leg one" />
      <div className="map-leg two" />
      <div className="map-leg three" />
      <div className="map-leg four" />
    </div>
  );
}

function corgiBackSvg() {
  return (
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="82" height="92" viewBox="0 0 82 92">
        <ellipse cx="41" cy="82" rx="22" ry="6" fill="rgba(0,0,0,.28)"/>
        <path d="M23 23 13 4c13 3 20 11 22 23zM59 23 69 4c-13 3-20 11-22 23z" fill="#c98346" stroke="#713d1d" stroke-width="3" stroke-linejoin="round"/>
        <path d="M26 16c5-5 25-5 30 0 7 7 8 27 1 35-7 8-25 8-32 0-7-8-6-28 1-35z" fill="#c98346"/>
        <path d="M35 13h12v45H35z" fill="#fff1dc"/>
        <path d="M22 54c9-10 29-11 38 0 8 10 8 24-1 29-9 5-27 5-36 0-9-5-9-19-1-29z" fill="#c98346"/>
        <path d="M33 52h16v35H33z" fill="#fff1dc"/>
        <circle cx="17" cy="65" r="9" fill="#fff1dc" stroke="#c98346" stroke-width="5"/>
        <rect x="23" y="76" width="10" height="13" rx="5" fill="#fff1dc"/>
        <rect x="35" y="76" width="10" height="13" rx="5" fill="#fff1dc"/>
        <rect x="48" y="76" width="10" height="13" rx="5" fill="#fff1dc"/>
      </svg>`
    )
  );
}

function pickPlaceByQuery(query, items) {
  const text = query.toLowerCase();
  const rules = [
    { keys: ["спорт", "бег", "трен", "актив", "вел", "прогул"], category: "sport" },
    { keys: ["музык", "концерт", "джаз", "танц", "звук"], category: "music" },
    { keys: ["театр", "спектак", "сцена", "постанов"], category: "theatre" },
    { keys: ["музей", "выстав", "искус", "истор", "культур"], category: "museum" },
    { keys: ["есть", "еда", "кофе", "ужин", "завтрак", "ресторан", "кафе"], category: "food" },
    { keys: ["развлеч", "кино", "квест", "весел", "компани"], category: "fun" },
  ];

  const direct = items.find((place) => text.includes(place.title.toLowerCase()));
  if (direct) return direct;

  const scored = items
    .map((place) => {
      const rule = rules.find((entry) => entry.category === place.category);
      const keywordScore = rule?.keys.some((key) => text.includes(key)) ? 8 : 0;
      const descriptionWords = `${place.title} ${place.description} ${place.address}`.toLowerCase();
      const textScore = text
        .split(/\s+/)
        .filter((word) => word.length > 3 && descriptionWords.includes(word)).length;
      return { place, score: keywordScore + textScore };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0].place : items[0];
}

function AuthScreen({ onAuth }) {
  const [stage, setStage] = useState("intro");
  const [mode, setMode] = useState("register");
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const submit = () => {
    const name = form.name.trim() || tg?.initDataUnsafe?.user?.first_name || "Пользователь";
    onAuth({
      id: form.email.trim() || form.phone.trim() || `guest-${Date.now()}`,
      name,
      surname: form.surname.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim() || "Москва",
      role: "user",
    });
  };

  if (stage === "intro") {
    return (
      <main className="auth-shell">
        <section className="hero-card">
          <div className="brand-row">
            <div className="brand-mark">MC</div>
            <div>
              <p>MapClap</p>
              <span>Telegram Mini App</span>
            </div>
          </div>
          <div className="intro-mascot">
            <Mascot3D />
          </div>
          <h1>Город под твое настроение</h1>
          <p className="intro-copy">
            Клэп подберет места, построит маршрут и поможет быстро понять, куда идти прямо сейчас.
          </p>
          <div className="onboarding-grid">
            {onboardingCards.map((card) => (
              <article key={card.title}>
                <strong>{card.title}</strong>
                <span>{card.text}</span>
              </article>
            ))}
          </div>
          <div className="auth-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setMode("register");
                setStage("form");
              }}
            >
              Регистрация
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={() => {
                setMode("login");
                setStage("form");
              }}
            >
              Войти
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <button type="button" className="text-button" onClick={() => setStage("intro")}>
          Назад
        </button>
        <div className="auth-top">
          <Mascot3D small />
          <div>
            <h1>{mode === "register" ? "Регистрация" : "Вход"}</h1>
            <p>
              {mode === "register"
                ? "Создай аккаунт, чтобы Клэп запоминал город, интересы и сохраненные места."
                : "Войди в аккаунт, чтобы продолжить подборки и маршруты."}
            </p>
          </div>
        </div>

        <div className="segmented">
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            Регистрация
          </button>
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Войти
          </button>
        </div>

        {mode === "register" && (
          <div className="two-columns">
            <input placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input
              placeholder="Фамилия"
              value={form.surname}
              onChange={(e) => setForm({ ...form, surname: e.target.value })}
            />
          </div>
        )}
        <input placeholder="Почта" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {mode === "register" && (
          <>
            <input
              placeholder="Телефон"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              placeholder="Город"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </>
        )}
        <input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {mode === "login" && <button className="forgot-button">Забыли пароль?</button>}
        <button type="button" className="primary-button wide" onClick={submit}>
          {mode === "register" ? "Регистрация" : "Войти"}
        </button>
      </section>
    </main>
  );
}

function TopNav({ activeTab, setActiveTab }) {
  return (
    <nav className="top-nav">
      {[
        ["home", "Карта"],
        ["sections", "Разделы"],
        ["profile", "Кабинет"],
      ].map(([id, title]) => (
        <button key={id} className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}>
          {title}
        </button>
      ))}
    </nav>
  );
}

function CategoryRail({ activeCategory, setActiveCategory }) {
  return (
    <div className="category-rail">
      {Object.entries(categoryLabels).map(([id, title]) => (
        <button
          key={id}
          className={activeCategory === id ? "active" : ""}
          onClick={() => setActiveCategory(id)}
          style={id !== "all" ? { "--accent": categoryColors[id] } : undefined}
        >
          {title}
        </button>
      ))}
    </div>
  );
}

function MapPanel({
  items,
  selected,
  userPosition,
  route,
  routeProgress,
  onPick,
  expanded,
  locationStatus,
  onRequestLocation,
}) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const routeRef = useRef(null);
  const userPlacemarkRef = useRef(null);
  const markerRefs = useRef([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;
    loadYandexMaps()
      .then((ymaps) => {
        if (mapRef.current || !mapNode.current) return;
        const map = new ymaps.Map(
          mapNode.current,
          {
            center: [userPosition?.lat || defaultPosition.lat, userPosition?.lon || defaultPosition.lon],
            zoom: 13,
            controls: [],
          },
          {
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true,
          }
        );
        map.behaviors.enable(["drag", "multiTouch", "scrollZoom"]);
        mapRef.current = map;
        setMapReady(true);
      })
      .catch(() => setMapError(true));
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const ymaps = window.ymaps;
    if (!map || !ymaps) return;
    markerRefs.current.forEach((marker) => map.geoObjects.remove(marker));
    markerRefs.current = [];
    items.forEach((place) => {
      const marker = new ymaps.Placemark(
        [place.coordinates.lat, place.coordinates.lon],
        {
          hintContent: place.title,
          balloonContent: place.title,
        },
        {
          preset: selected?.id === place.id ? "islands#yellowStretchyIcon" : "islands#circleDotIcon",
          iconColor: categoryColors[place.category] || "#f0b85a",
        }
      );
      marker.events.add("click", () => onPick(place));
      map.geoObjects.add(marker);
      markerRefs.current.push(marker);
    });
  }, [items, selected, onPick, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    const ymaps = window.ymaps;
    if (!map || !userPosition) return;
    if (!userPlacemarkRef.current && ymaps) {
      userPlacemarkRef.current = new ymaps.Placemark(
        [userPosition.lat, userPosition.lon],
        { hintContent: "Ты здесь. Клэп стартует отсюда." },
        {
          iconLayout: "default#imageWithContent",
          iconImageHref: corgiBackSvg(),
          iconImageSize: [82, 92],
          iconImageOffset: [-41, -78],
        }
      );
      map.geoObjects.add(userPlacemarkRef.current);
    } else {
      userPlacemarkRef.current?.geometry.setCoordinates([userPosition.lat, userPosition.lon]);
    }
  }, [userPosition, mapReady]);

  useEffect(() => {
    if (!userPlacemarkRef.current) return;
    const movingPoint = route?.points?.length
      ? route.points[Math.min(route.points.length - 1, Math.floor(routeProgress * (route.points.length - 1)))]
      : userPosition;
    if (movingPoint) {
      userPlacemarkRef.current.geometry.setCoordinates([movingPoint.lat, movingPoint.lon]);
    }
  }, [route, routeProgress, userPosition]);

  useEffect(() => {
    const map = mapRef.current;
    const ymaps = window.ymaps;
    if (!map || !ymaps) return;
    if (routeRef.current) {
      map.geoObjects.remove(routeRef.current);
      routeRef.current = null;
    }
    if (route?.from && route?.to && ymaps.multiRouter) {
      routeRef.current = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [
            [route.from.lat, route.from.lon],
            [route.to.lat, route.to.lon],
          ],
          params: {
            routingMode: "auto",
            avoidTrafficJams: true,
          },
        },
        {
          boundsAutoApply: false,
          routeActiveStrokeColor: "#f0b85a",
          routeActiveStrokeWidth: 6,
          routeStrokeStyle: "solid",
          wayPointVisible: false,
          viaPointVisible: false,
          pinVisible: false,
        }
      );
      map.geoObjects.add(routeRef.current);
      return;
    }
    if (route?.points?.length) {
      routeRef.current = new ymaps.Polyline(
        route.points.map((point) => [point.lat, point.lon]),
        {},
        {
          strokeColor: "#f0b85a",
          strokeWidth: 6,
          strokeOpacity: 0.95,
        }
      );
      map.geoObjects.add(routeRef.current);
    }
  }, [route, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.ymaps) return;
    map.container.fitToViewport();
    if (route?.points?.length) {
      map.setBounds(window.ymaps.util.bounds.fromPoints(route.points.map((point) => [point.lat, point.lon])), {
        checkZoomRange: true,
        zoomMargin: 44,
      });
      return;
    }
    if (selected) {
      map.setCenter([selected.coordinates.lat, selected.coordinates.lon], 14, { duration: 320 });
    }
  }, [expanded, selected, route, mapReady]);

  return (
    <section className={`map-card ${expanded ? "expanded" : ""}`}>
      <div className="map-stack">
        <div ref={mapNode} className="real-map" />
        {locationStatus !== "granted" && (
          <button type="button" className="location-request" onClick={onRequestLocation}>
            {locationStatus === "requesting" ? "Ищу тебя..." : "Включить геолокацию"}
          </button>
        )}
        {mapError && (
          <div className="map-error">
            <strong>Карта не загрузилась</strong>
            <span>Проверь ключ Yandex Maps в Vercel: VITE_YANDEX_MAPS_API_KEY</span>
          </div>
        )}
        <div className="map-overlay">
          <span className="map-hint">Клэп стартует от твоей геопозиции</span>
        </div>
      </div>
    </section>
  );
}

function RoutePanel({ selected, route, onRoute }) {
  return (
    <section className="route-panel">
      <div>
        <p>Маршрут</p>
        <h3>{selected ? selected.title : "Выбери место на карте или в подборке"}</h3>
      </div>
      {selected ? (
        <>
          <div className="route-stats">
            <span>{route?.durationText || "Считаю"}</span>
            <span>{route?.distanceText || "Маршрут"}</span>
            <span>{route?.source || "MapClap"}</span>
          </div>
          <button className="primary-button compact" onClick={() => onRoute(selected)}>
            Построить маршрут
          </button>
        </>
      ) : (
        <p className="muted">Клэп встанет в точку пользователя и построит путь до выбранного места.</p>
      )}
    </section>
  );
}

function AdvisorChat({ items, onPick }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("Введи свой запрос, а Клэп подберет место под настроение.");

  const ask = () => {
    const text = query.trim().toLowerCase();
    if (!text) {
      setAnswer("Напиши, чего хочется: музыка, прогулка, музей, еда, спорт или спокойный вечер.");
      return;
    }
    const matched = pickPlaceByQuery(text, items);
    setAnswer(`Я бы начал с места: ${matched.title}. ${matched.description}`);
    onPick(matched);
  };

  return (
    <section className="advisor">
      <div className="advisor-head">
      <Mascot3D small />
        <div>
          <p>Клэп советует</p>
          <h3>Подбор места под настроение</h3>
        </div>
      </div>
      <p className="advisor-answer">{answer}</p>
      <div className="quick-prompts">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => {
              setQuery(prompt);
              const matched = pickPlaceByQuery(prompt, items);
              setAnswer(`Я бы начал с места: ${matched.title}. ${matched.description}`);
              onPick(matched);
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
      <div className="advisor-input">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Например: хочу музыку и красивый вечер" />
        <button onClick={ask}>Подобрать</button>
      </div>
    </section>
  );
}

function PlaceCard({ place, onPick, saved }) {
  return (
    <article className="place-card" onClick={() => onPick(place)}>
      <img src={place.imageUrl} alt={place.title} loading="lazy" />
      <div className="place-body">
        <div className="place-meta">
          <span style={{ background: categoryColors[place.category] }}>{categoryLabels[place.category]}</span>
          <small>{saved ? "Сохранено" : place.price}</small>
        </div>
        <h3>{place.title}</h3>
        <p>{place.description}</p>
        <div className="place-footer">
          <span>{place.address}</span>
          <button>Открыть</button>
        </div>
      </div>
    </article>
  );
}

function DetailCard({ place, route, onClose, onRoute, onSave, isSaved }) {
  if (!place) return null;
  return (
    <div className="detail-backdrop" onClick={onClose}>
      <article className="detail-card" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          Закрыть
        </button>
        <img src={place.imageUrl} alt={place.title} />
        <div className="detail-content">
          <div className="place-meta">
            <span style={{ background: categoryColors[place.category] }}>{categoryLabels[place.category]}</span>
            <small>{place.schedule}</small>
          </div>
          <h2>{place.title}</h2>
          <p>{place.description}</p>
          <dl>
            <div>
              <dt>Адрес</dt>
              <dd>{place.address}</dd>
            </div>
            <div>
              <dt>Маршрут</dt>
              <dd>{route ? `${route.durationText}, ${route.distanceText}` : "Можно построить"}</dd>
            </div>
          </dl>
          <div className="detail-actions">
            <button className="primary-button" onClick={() => onRoute(place)}>
              Маршрут
            </button>
            <button className="ghost-button" onClick={() => onSave(place.id)}>
              {isSaved ? "Убрано" : "Сохранить"}
            </button>
            <a className="ghost-link" href={place.site} target="_blank" rel="noreferrer">
              Сайт места
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

function FeaturedStrip({ items, onPick }) {
  return (
    <section className="featured-strip">
      <div className="section-title">
        <p>Подборка Клэпа</p>
        <h2>Лучшее рядом</h2>
      </div>
      <div className="featured-scroll">
        {items.slice(0, 8).map((place) => (
          <button key={place.id} className="featured-card" onClick={() => onPick(place)}>
            <img src={place.imageUrl} alt={place.title} loading="lazy" />
            <span>{place.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SearchPanel({ value, onChange }) {
  return (
    <section className="search-panel">
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Найти место, еду, музыку или музей" />
    </section>
  );
}

function ProfilePanel({ user, savedItems, onPick, onLogout }) {
  return (
    <section className="profile-screen">
      <div className="profile-panel">
        <CorgiFace small />
        <div>
          <p>Кабинет пользователя</p>
          <h2>{user.name}</h2>
          <span>{user.city}</span>
        </div>
        <button className="ghost-button" onClick={onLogout}>
          Выйти
        </button>
      </div>
      <div className="interest-cloud">
        {profileInterests.map((interest) => (
          <span key={interest}>{interest}</span>
        ))}
      </div>
      <div className="section-title">
        <p>Мои места</p>
        <h2>{savedItems.length ? `${savedItems.length} сохранено` : "Пока пусто"}</h2>
      </div>
      <section className="places-list horizontal">
        {savedItems.length ? (
          savedItems.map((place) => <PlaceCard key={place.id} place={place} onPick={onPick} saved />)
        ) : (
          <article className="empty-state">Сохрани место из карточки, и оно появится здесь.</article>
        )}
      </section>
    </section>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeProgress, setRouteProgress] = useState(0);
  const [userPosition, setUserPosition] = useState(defaultPosition);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [savedIds, setSavedIds] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    tg?.ready();
    tg?.expand();
    document.documentElement.style.setProperty("--tg-bg", tg?.themeParams?.bg_color || "#12100d");
  }, []);

  useEffect(() => {
    const saved = getStoredUser();
    if (saved) setUser(saved);
    setSavedIds(getSavedPlaces());
  }, []);

  useEffect(() => {
    if (!user) return;
    saveUser(user);
    requestTelegramLocation(setUserPosition, setLocationStatus);
  }, [user]);

  useEffect(() => {
    return watchUserLocation(setUserPosition);
  }, []);

  useEffect(() => {
    if (!route?.points?.length) return undefined;
    const timer = window.setInterval(() => {
      setRouteProgress((value) => (value >= 1 ? 0 : value + 0.018));
    }, 120);
    return () => window.clearInterval(timer);
  }, [route]);

  const visiblePlaces = useMemo(() => {
    const byCategory = activeCategory === "all" ? places : places.filter((place) => place.category === activeCategory);
    const query = search.trim().toLowerCase();
    if (!query) return byCategory;
    return byCategory.filter((place) =>
      `${place.title} ${place.address} ${place.description} ${categoryLabels[place.category]}`.toLowerCase().includes(query)
    );
  }, [activeCategory, search]);

  const savedItems = useMemo(() => places.filter((place) => savedIds.includes(place.id)), [savedIds]);

  const buildRoute = async (place) => {
    setSelected(place);
    setActiveTab("home");
    const from = userPosition || defaultPosition;
    const to = place.coordinates;
    setRoute(await requestRoute(from, to));
    setRouteProgress(0);
  };

  const logout = () => {
    clearUser();
    setUser(null);
    setSelected(null);
    setRoute(null);
  };

  const toggleSaved = (placeId) => {
    setSavedIds((current) => {
      const next = toggleSavedPlace(current, placeId);
      saveSavedPlaces(next);
      return next;
    });
  };

  const askLocation = () => {
    requestTelegramLocation(setUserPosition, (status) => {
      setLocationStatus(status);
      if (status === "denied") openTelegramLocationSettings();
    });
  };

  if (!user) return <AuthScreen onAuth={setUser} />;

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p>MapClap</p>
          <h1>Куда пойдем?</h1>
        </div>
        <Mascot3D small />
      </header>

      <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab !== "profile" && <CategoryRail activeCategory={activeCategory} setActiveCategory={setActiveCategory} />}

      {activeTab === "profile" ? (
        <ProfilePanel user={user} savedItems={savedItems} onPick={buildRoute} onLogout={logout} />
      ) : (
        <>
          <SearchPanel value={search} onChange={setSearch} />
          <MapPanel
            items={visiblePlaces}
            selected={selected}
            userPosition={userPosition}
            route={route}
            routeProgress={routeProgress}
            onPick={buildRoute}
            expanded={activeTab === "home"}
            locationStatus={locationStatus}
            onRequestLocation={askLocation}
          />
          <RoutePanel selected={selected} route={route} onRoute={buildRoute} />
          {activeTab === "sections" && (
            <>
              <FeaturedStrip items={visiblePlaces} onPick={buildRoute} />
              <AdvisorChat items={visiblePlaces} onPick={buildRoute} />
              <section className="section-grid horizontal">
                {Object.entries(categoryLabels)
                  .filter(([id]) => id !== "all")
                  .map(([id, title]) => (
                    <button
                      key={id}
                      className="section-tile"
                      onClick={() => setActiveCategory(id)}
                      style={{ "--accent": categoryColors[id] }}
                    >
                      <span>{title}</span>
                      <small>{places.filter((place) => place.category === id).length} мест</small>
                    </button>
                  ))}
              </section>
              <section className="places-list horizontal">
                {visiblePlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} onPick={buildRoute} saved={savedIds.includes(place.id)} />
                ))}
              </section>
            </>
          )}
        </>
      )}

      <DetailCard
        place={selected}
        route={route}
        onClose={() => setSelected(null)}
        onRoute={buildRoute}
        onSave={toggleSaved}
        isSaved={selected ? savedIds.includes(selected.id) : false}
      />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
