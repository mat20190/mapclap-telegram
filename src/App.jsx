import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { categoryColors, categoryLabels, places } from "./data/places";
import "./styles.css";

const tg = window.Telegram?.WebApp;

const defaultPosition = { lat: 55.741, lon: 37.653 };

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distanceKm(a, b) {
  const radius = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function buildDemoRoute(from, to) {
  const points = [];
  for (let i = 0; i <= 18; i += 1) {
    const t = i / 18;
    points.push({
      lat: from.lat + (to.lat - from.lat) * t + Math.sin(t * Math.PI) * 0.0009,
      lon: from.lon + (to.lon - from.lon) * t - Math.sin(t * Math.PI) * 0.0005,
    });
  }

  const km = distanceKm(from, to);
  return {
    points,
    distanceText: `${km.toFixed(1)} км`,
    durationText: `${Math.max(6, Math.round((km / 4.2) * 60))} мин`,
    source: "Демо-маршрут",
  };
}

function CorgiFace({ small = false }) {
  return (
    <div className={`corgi-face ${small ? "small" : ""}`} aria-hidden="true">
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

function MapPanel({ items, selected, userPosition, route, routeProgress, onPick, expanded }) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const markerLayer = useRef(null);
  const routeLayer = useRef(null);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;
    const map = L.map(mapNode.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: true,
      touchZoom: true,
    }).setView([defaultPosition.lat, defaultPosition.lon], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      crossOrigin: true,
    }).addTo(map);
    markerLayer.current = L.layerGroup().addTo(map);
    routeLayer.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 80);
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !markerLayer.current) return;
    markerLayer.current.clearLayers();
    items.forEach((place) => {
      const marker = L.circleMarker([place.coordinates.lat, place.coordinates.lon], {
        radius: selected?.id === place.id ? 10 : 7,
        color: "#15100b",
        weight: 3,
        fillColor: categoryColors[place.category] || "#f7cc62",
        fillOpacity: 1,
      })
        .addTo(markerLayer.current)
        .on("click", () => onPick(place));
      marker.bindTooltip(place.title, { direction: "top", offset: [0, -8] });
    });
  }, [items, selected, onPick]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userPosition) return;
    if (!userMarkerRef.current) {
      const icon = L.divIcon({
        className: "leaflet-clap-icon",
        html: '<div class="leaflet-clap-dot"></div>',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      userMarkerRef.current = L.marker([userPosition.lat, userPosition.lon], { icon }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng([userPosition.lat, userPosition.lon]);
    }
  }, [userPosition]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !routeLayer.current) return;
    routeLayer.current.clearLayers();
    if (route?.points?.length) {
      const line = route.points.map((point) => [point.lat, point.lon]);
      L.polyline(line, {
        color: "#f0b85a",
        weight: 5,
        opacity: 0.92,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(routeLayer.current);
    }
  }, [route]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    setTimeout(() => map.invalidateSize(), 80);
    if (route?.points?.length) {
      map.fitBounds(route.points.map((point) => [point.lat, point.lon]), { padding: [42, 42], maxZoom: 15 });
      return;
    }
    if (selected) {
      map.setView([selected.coordinates.lat, selected.coordinates.lon], 14);
    }
  }, [expanded, selected, route]);

  const dogPoint = route?.points?.length
    ? route.points[Math.min(route.points.length - 1, Math.floor(routeProgress * (route.points.length - 1)))]
    : userPosition || defaultPosition;

  return (
    <section className={`map-card ${expanded ? "expanded" : ""}`}>
      <div className="map-stack">
        <div ref={mapNode} className="real-map" />
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

  useEffect(() => {
    tg?.ready();
    tg?.expand();
    document.documentElement.style.setProperty("--tg-bg", tg?.themeParams?.bg_color || "#12100d");
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("mapclap-user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem("mapclap-user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        setUserPosition(defaultPosition);
      },
      { enableHighAccuracy: true, maximumAge: 8000, timeout: 12000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
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
    try {
      const response = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to }),
      });
      if (!response.ok) throw new Error("route failed");
      const data = await response.json();
      setRoute(data.points?.length ? data : buildDemoRoute(from, to));
    } catch {
      setRoute(buildDemoRoute(from, to));
    }
    setRouteProgress(0);
  };

  const logout = () => {
    localStorage.removeItem("mapclap-user");
    setUser(null);
    setSelected(null);
    setRoute(null);
  };

  if (!user) return <AuthScreen onAuth={setUser} />;

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p>MapClap</p>
          <h1>Куда пойдем?</h1>
        </div>
        <CorgiFace small />
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
          />
          <RoutePanel selected={selected} route={route} onRoute={buildRoute} />
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
