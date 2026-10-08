// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = {
  cb: (...args: any[]) => void;
  context: unknown;
  once: boolean;
};

class Emitter {
  events: Record<string, Handler[]> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(name: string, callback: (...args: any[]) => void, context: unknown, once = false) {
    if (!this.events[name]) {
      this.events[name] = [];
    }

    const exists = this.events[name].some(
      (object) => object.cb === callback && object.context === context,
    );
    if (exists) return;

    this.events[name].push({ cb: callback, context, once });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  once(name: string, callback: (...args: any[]) => void, context: unknown) {
    this.on(name, callback, context, true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(name: string, ...data: any[]) {
    if (!this.events[name]) return;

    this.events[name].forEach((object, index) => {
      object.cb.apply(object.context, data);
      if (object.once) {
        delete this.events[name][index];
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(name: string, callback: (...args: any[]) => void, context: unknown) {
    if (!this.events[name]) return;

    this.events[name].forEach((object, index) => {
      if (object.cb === callback && object.context === context) {
        delete this.events[name][index];
      }
    });
  }
}

export default new Emitter();
