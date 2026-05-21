import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { categoryColors, categoryLabels, places } from "./data/places";
import "./styles.css";

const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

function distanceKm(from, to) {
  if (!from) return 1.8;
  const radius = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLon = ((to.lon - from.lon) * Math.PI) / 180;
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.25;
}

function ClapFace({ small = false }) {
  return (
    <div className={small ? "clap-face small" : "clap-face"}>
      <span className="ear left" />
      <span className="ear right" />
      <span className="stripe" />
      <span className="eye left" />
      <span className="eye right" />
      <span className="muzzle" />
      <span className="nose" />
    </div>
  );
}

function ClapBack() {
  return (
    <div className="clap-back">
      <span className="tail" />
      <span className="body" />
      <span className="back" />
      <span className="head" />
      <span className="ear left" />
      <span className="ear right" />
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("register");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", city: "Москва", phone: "" });

  function submit(event) {
    event.preventDefault();
    const users = JSON.parse(localStorage.getItem("mapclap-users") || "[]");
    const exists = users.find((user) => user.phone && user.phone === form.phone);
    if (mode === "register" && exists) {
      setMessage("Аккаунт уже зарегистрирован. Нажмите «Войти».");
      setMode("login");
      return;
    }
    if (mode === "login" && form.phone && !exists) {
      setMessage("Аккаунт не найден. Зарегистрируйтесь.");
      return;
    }
    const user = {
      name: form.name || tg?.initDataUnsafe?.user?.first_name || "Гость",
      city: form.city || "Москва",
      phone: form.phone
    };
    if (mode === "register") {
      localStorage.setItem("mapclap-users", JSON.stringify([...users, user]));
    }
    localStorage.setItem("mapclap-user", JSON.stringify(user));
    onAuth(user);
  }

  return (
    <section className="auth-screen">
      <div className="auth-mascot"><ClapFace /></div>
      <p className="kicker">MapClap</p>
      <h1>{mode === "register" ? "Найди место под настроение" : "Вход в MapClap"}</h1>
      <p className="lead">Клэп подбирает интересные места в вашем городе и рядом с вами.</p>
      <div className="auth-tabs">
        <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Регистрация</button>
        <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Войти</button>
      </div>
      <form className="auth-form" onSubmit={submit}>
        {mode === "register" && (
          <input placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        )}
        <input placeholder="Ваш город" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input placeholder="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button type="submit">{mode === "register" ? "Регистрация" : "Войти в MapClap"}</button>
      </form>
      <button className="secondary-button" onClick={() => setMessage("Ссылка восстановления отправлена в демо-режиме.")}>Забыли пароль?</button>
      {message && <p className="auth-message">{message}</p>}
    </section>
  );
}

function UserNavigation({ active, onChange }) {
  return (
    <nav className="top-nav">
      <button className={active === "profile" ? "active" : ""} onClick={() => onChange("profile")}>Кабинет</button>
      <button className={active === "map" ? "active" : ""} onClick={() => onChange("map")}>Карта</button>
      <button className={active === "catalog" ? "active" : ""} onClick={() => onChange("catalog")}>Разделы</button>
    </nav>
  );
}

function MapPanel({ activeTab, selected, userPosition, route }) {
  return (
    <section className={`map-card ${activeTab === "map" ? "map-full" : ""}`}>
      <div className="fake-map">
        <div className="map-grid" />
        {route && <div className="route-line visible" />}
        <ClapBack />
        {selected && <div className="place-pin visible" />}
      </div>
    </section>
  );
}

function MascotDock() {
  return (
    <section className="mascot-dock">
      <ClapFace small />
      <div>
        <strong>Клэп рядом</strong>
        <p>Спроси меня, и я подберу место под твое настроение.</p>
      </div>
    </section>
  );
}

function RoutePanel({ selected, routeSource, route }) {
  return (
    <section className="route-panel">
      <span className="route-icon">⌁</span>
      <div>
        <strong>{selected ? `Маршрут до ${selected.title}` : "Маршрут от Клэпа"}</strong>
        <div className="route-metrics">
          <span>{route?.minutes || "—"}</span>
          <span>{route?.distance || "—"}</span>
          <span>Маршрут</span>
        </div>
        <p>{selected ? `Источник: ${routeSource}. Клэп строит путь от вашей геопозиции.` : "Нажмите на место, и Клэп построит маршрут."}</p>
      </div>
    </section>
  );
}

function AdvisorChat({ items, onPick }) {
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("Введи запрос, например: хочу спокойное место с красивым интерьером.");
  function submit(event) {
    event.preventDefault();
    const value = text.toLowerCase();
    const picked =
      items.find((item) => `${item.title} ${item.description}`.toLowerCase().includes(value)) ||
      items[0];
    if (!picked) return;
    setAnswer(`Я бы начал с «${picked.title}»: ${picked.description}`);
    onPick(picked);
  }
  return (
    <section className="advisor-chat">
      <div className="chat-head"><span>Советник Клэп</span><small>подбор места</small></div>
      <div className="chat-bubble">{answer}</div>
      <form className="advisor-form" onSubmit={submit}>
        <input placeholder="Введи свой запрос" value={text} onChange={(e) => setText(e.target.value)} />
        <button>Подобрать</button>
      </form>
    </section>
  );
}

function GuideCard({ item, onPick }) {
  return (
    <button className="place-card" onClick={() => onPick(item)}>
      <img src={item.imageUrl} alt={item.title} />
      <div>
        <h3>{item.title}</h3>
        <p className="meta">{categoryLabels[item.category]} · {item.price}</p>
        <p>{item.description}</p>
        <div className="card-actions"><span>Маршрут</span><span>Сайт</span><span>Сохранить</span></div>
      </div>
    </button>
  );
}

function DetailCard({ item, onClose, onSave, onRoute }) {
  if (!item) return null;
  return (
    <section className="detail-card">
      <button className="close" onClick={onClose}>×</button>
      <img src={item.imageUrl} alt={item.title} />
      <div className="detail-body">
        <p className="kicker">{categoryLabels[item.category]}</p>
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <p>{item.address} · {item.price} · {item.schedule}</p>
        <div className="detail-actions">
          <button onClick={() => onRoute(item)}>Маршрут</button>
          <a href={item.site} target="_blank" rel="noreferrer">Сайт</a>
          <button onClick={() => onSave(item)}>Сохранить</button>
        </div>
      </div>
    </section>
  );
}

function ProfilePanel({ user, savedCount, onLogout, onGeo }) {
  return (
    <section className="profile-panel">
      <h2>Профиль</h2>
      <p>Имя: {user.name || "не указано"}</p>
      <p>Город: {user.city || "не указан"}</p>
      <p>Сохраненные места: {savedCount}</p>
      <button onClick={onGeo}>Обновить геопозицию</button>
      <button onClick={onLogout}>Выйти из приложения</button>
    </section>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mapclap-user") || "null"); } catch { return null; }
  });
  const [activeTab, setActiveTab] = useState("map");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mapclap-saved") || "[]"); } catch { return []; }
  });
  const [userPosition, setUserPosition] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeSource, setRouteSource] = useState("демо-расчет");

  const filtered = useMemo(() => {
    return places.filter((item) => {
      const categoryOk = category === "all" || item.category === category;
      const haystack = `${item.title} ${item.address} ${item.description} ${categoryLabels[item.category]}`.toLowerCase();
      return categoryOk && (!query || haystack.includes(query.toLowerCase()));
    });
  }, [category, query]);

  function locate() {
    navigator.geolocation?.getCurrentPosition(
      (position) => setUserPosition({ lat: position.coords.latitude, lon: position.coords.longitude }),
      () => tg?.showAlert?.("Разрешите геолокацию в Telegram.")
    );
  }

  useEffect(() => {
    if (!user) return;
    locate();
    const watch = navigator.geolocation?.watchPosition((position) => {
      setUserPosition({ lat: position.coords.latitude, lon: position.coords.longitude });
    });
    return () => watch && navigator.geolocation.clearWatch(watch);
  }, [user]);

  async function buildRoute(item) {
    setSelected(item);
    const km = distanceKm(userPosition, item.coordinates);
    let minutes = Math.max(3, Math.round((km / 4.8) * 60));
    let distance = km;
    try {
      const response = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: userPosition, to: item.coordinates })
      });
      const result = await response.json();
      if (result.ok) {
        setRouteSource(result.source === "2gis" ? "2ГИС Routing API" : "демо-расчет");
        minutes = result.durationSeconds ? Math.max(1, Math.round(result.durationSeconds / 60)) : minutes;
        distance = result.distanceMeters ? result.distanceMeters / 1000 : distance;
      }
    } catch {
      setRouteSource("демо-расчет");
    }
    setRoute({ minutes: `${minutes} мин`, distance: `${distance.toFixed(1)} км` });
  }

  function savePlace(item) {
    const next = saved.includes(item.id) ? saved : [...saved, item.id];
    setSaved(next);
    localStorage.setItem("mapclap-saved", JSON.stringify(next));
    tg?.showAlert?.("Место сохранено.");
  }

  if (!user) return <AuthScreen onAuth={setUser} />;

  return (
    <main className="app-shell">
      <header className="header">
        <div>
          <p className="kicker">MAPCLAP</p>
          <h1>MapClap</h1>
          <p className="lead small">Клэп подбирает интересные места в вашем городе и рядом с вами.</p>
        </div>
        <button className="geo-button" onClick={locate}>⌖</button>
      </header>
      <UserNavigation active={activeTab} onChange={setActiveTab} />
      <MapPanel activeTab={activeTab} selected={selected} userPosition={userPosition} route={route} />
      <MascotDock />
      <RoutePanel selected={selected} route={route} routeSource={routeSource} />
      <AdvisorChat items={filtered} onPick={buildRoute} />
      <section className="search-panel"><input placeholder="Найти место, категорию или настроение" value={query} onChange={(e) => setQuery(e.target.value)} /></section>
      {activeTab === "profile" && (
        <ProfilePanel
          user={user}
          savedCount={saved.length}
          onGeo={locate}
          onLogout={() => {
            localStorage.removeItem("mapclap-user");
            setUser(null);
          }}
        />
      )}
      {activeTab !== "profile" && (
        <>
          <section className="section-grid">
            {Object.entries(categoryLabels).filter(([id]) => id !== "all").map(([id, label]) => (
              <button key={id} className={`section-card ${category === id ? "active" : ""}`} onClick={() => setCategory(id)}>
                <strong>{label}</strong><span>{places.filter((place) => place.category === id).length} мест</span>
              </button>
            ))}
          </section>
          <nav className="chips">
            {Object.entries(categoryLabels).map(([id, label]) => (
              <button key={id} className={category === id ? "active" : ""} onClick={() => setCategory(id)}>{label}</button>
            ))}
          </nav>
          <div className="feed-head"><strong>{category === "all" ? "Москва от Клэпа" : categoryLabels[category]}</strong><span>{filtered.length} мест</span></div>
          <section className="cards-rail">
            {filtered.map((item) => <GuideCard key={item.id} item={item} onPick={buildRoute} />)}
          </section>
        </>
      )}
      <DetailCard item={selected} onClose={() => setSelected(null)} onSave={savePlace} onRoute={buildRoute} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
