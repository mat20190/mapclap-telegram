import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
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
            <CorgiFace />
          </div>
          <h1>Город под твое настроение</h1>
          <p className="intro-copy">
            Клэп подберет места, построит маршрут и поможет быстро понять, куда идти прямо сейчас.
          </p>
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
          <CorgiFace small />
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
          iconImageHref:
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 58 58"><ellipse cx="29" cy="49" rx="16" ry="5" fill="rgba(0,0,0,.28)"/><path d="M17 18l-6-13c10 2 14 9 15 15zM41 18L47 5c-10 2-14 9-15 15z" fill="#c98346" stroke="#6f3d1d" stroke-width="2"/><ellipse cx="29" cy="25" rx="17" ry="14" fill="#c98346"/><path d="M24 12h10v25H24z" fill="#fff1dc"/><ellipse cx="29" cy="43" rx="22" ry="11" fill="#c98346"/><path d="M22 39h14v15H22z" fill="#fff1dc"/><circle cx="13" cy="43" r="6" fill="#fff1dc" stroke="#c98346" stroke-width="3"/></svg>'
            ),
          iconImageSize: [58, 58],
          iconImageOffset: [-29, -48],
        }
      );
      map.geoObjects.add(userPlacemarkRef.current);
    } else {
      userPlacemarkRef.current?.geometry.setCoordinates([userPosition.lat, userPosition.lon]);
    }
  }, [userPosition, mapReady]);

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

  const dogPoint = route?.points?.length
    ? route.points[Math.min(route.points.length - 1, Math.floor(routeProgress * (route.points.length - 1)))]
    : userPosition || defaultPosition;

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
          <div className="dog-floating" style={{ left: `${clamp(48 + (dogPoint.lon - defaultPosition.lon) * 900, 18, 78)}%`, top: `${clamp(48 - (dogPoint.lat - defaultPosition.lat) * 900, 22, 70)}%` }}>
            <CorgiBack progress={routeProgress} />
          </div>
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
    const matched =
      items.find((place) => text.includes(categoryLabels[place.category].toLowerCase())) ||
      items.find((place) => place.title.toLowerCase().includes(text.split(" ")[0])) ||
      items[Math.floor(Math.random() * items.length)];
    setAnswer(`Я бы начал с места: ${matched.title}. ${matched.description}`);
    onPick(matched);
  };

  return (
    <section className="advisor">
      <div className="advisor-head">
        <CorgiFace small />
        <div>
          <p>Клэп советует</p>
          <h3>Подбор места под настроение</h3>
        </div>
      </div>
      <p className="advisor-answer">{answer}</p>
      <div className="advisor-input">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Например: хочу музыку и красивый вечер" />
        <button onClick={ask}>Подобрать</button>
      </div>
    </section>
  );
}

function PlaceCard({ place, onPick }) {
  return (
    <article className="place-card" onClick={() => onPick(place)}>
      <img src={place.imageUrl} alt={place.title} loading="lazy" />
      <div className="place-body">
        <div className="place-meta">
          <span style={{ background: categoryColors[place.category] }}>{categoryLabels[place.category]}</span>
          <small>{place.price}</small>
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

function DetailCard({ place, route, onClose, onRoute }) {
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

function ProfilePanel({ user, onLogout }) {
  return (
    <section className="profile-panel">
      <CorgiFace small />
      <div>
        <p>Кабинет пользователя</p>
        <h2>{user.name}</h2>
        <span>{user.city}</span>
      </div>
      <button className="ghost-button" onClick={onLogout}>
        Выйти
      </button>
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

  useEffect(() => {
    tg?.ready();
    tg?.expand();
    document.documentElement.style.setProperty("--tg-bg", tg?.themeParams?.bg_color || "#12100d");
  }, []);

  useEffect(() => {
    const saved = getStoredUser();
    if (saved) setUser(saved);
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
    if (activeCategory === "all") return places;
    return places.filter((place) => place.category === activeCategory);
  }, [activeCategory]);

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
        <CorgiFace small calm />
      </header>

      <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab !== "profile" && <CategoryRail activeCategory={activeCategory} setActiveCategory={setActiveCategory} />}

      {activeTab === "profile" ? (
        <ProfilePanel user={user} onLogout={logout} />
      ) : (
        <>
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
          <FeaturedStrip items={visiblePlaces} onPick={buildRoute} />
          <AdvisorChat items={visiblePlaces} onPick={buildRoute} />
          {activeTab === "sections" && (
            <section className="section-grid">
              {Object.entries(categoryLabels)
                .filter(([id]) => id !== "all")
                .map(([id, title]) => (
                  <button
                    key={id}
                    className="section-tile"
                    onClick={() => {
                      setActiveCategory(id);
                      setActiveTab("home");
                    }}
                    style={{ "--accent": categoryColors[id] }}
                  >
                    <span>{title}</span>
                    <small>{places.filter((place) => place.category === id).length} мест</small>
                  </button>
                ))}
            </section>
          )}
          <section className="places-list">
            {visiblePlaces.map((place) => (
              <PlaceCard key={place.id} place={place} onPick={buildRoute} />
            ))}
          </section>
        </>
      )}

      <DetailCard place={selected} route={route} onClose={() => setSelected(null)} onRoute={buildRoute} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
