export function syncSafeViewport() {
  if (typeof window === "undefined") return;
  window.safeWidth = window.innerWidth;
  window.safeHeight = window.innerHeight;
  window.maxScrollTop = document.body.scrollHeight - window.safeHeight;
}

declare global {
  interface Window {
    safeWidth: number;
    safeHeight: number;
    maxScrollTop: number;
  }
}
