import { gsap } from "gsap";
import Emitter from "./emitter";

class Ticker {
  callbacks: { callback: () => void; context: unknown }[] = [];
  delta = 0;
  private started = false;

  init() {
    if (this.started) return;
    this.started = true;
    gsap.ticker.add(this.tick.bind(this));
  }

  tick(time: number, delta: number) {
    this.delta = delta;

    this.callbacks.forEach((object, index) => {
      object.callback.apply(object.context);
      delete this.callbacks[index];
    });

    Emitter.emit("tick", time * 1000);
  }

  nextTick(callback: () => void, context: unknown) {
    this.callbacks.push({ callback, context });
  }
}

export default new Ticker();
