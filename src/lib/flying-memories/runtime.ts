import Emitter from "./emitter";
import Ticker from "./ticker";
import { syncSafeViewport } from "./viewport";

let booted = false;

export function ensureFlyingMemoriesRuntime() {
  if (typeof window === "undefined" || booted) return;
  booted = true;

  Ticker.init();
  syncSafeViewport();

  const onResize = () => {
    syncSafeViewport();
    Emitter.emit("resize", false, false);
  };

  const onScroll = () => {
    syncSafeViewport();
    Ticker.nextTick(function emitScroll() {
      Emitter.emit("scroll", window.scrollY);
    }, null);
  };

  const onMouseMove = (event: MouseEvent) => {
    Emitter.emit("mousemove", event.clientX, event.clientY);
  };

  window.addEventListener("resize", onResize);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("mousemove", onMouseMove, { passive: true });

  if (document.readyState === "complete") {
    Emitter.emit("siteLoaded");
  } else {
    window.addEventListener("load", () => Emitter.emit("siteLoaded"), { once: true });
  }

  onScroll();
}
