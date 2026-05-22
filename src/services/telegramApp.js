export function setupTelegramApp() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  tg.ready();
  tg.expand();
  tg.setHeaderColor?.("#12100d");
  tg.setBackgroundColor?.("#12100d");
  tg.disableVerticalSwipes?.();
}

export function impact(style = "light") {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.(style);
}

export function selectionChanged() {
  window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.();
}

export function notify(type = "success") {
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.(type);
}
