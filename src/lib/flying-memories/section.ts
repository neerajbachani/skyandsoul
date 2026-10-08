import Emitter from "./emitter";
import Ticker from "./ticker";

type SectionHost = HTMLElement & {
  __flyingSection?: Section;
};

export class FlyingObject {
  parent: Section;
  el: HTMLElement;
  index: number;

  s = 0;
  x = 0;
  y = 0;
  z = -20000;
  rx = 90;
  ry = 0;
  rz = 0;
  vx = 0;
  vy = 0;
  vz = 40;
  vrx = 0;
  vry = 0;

  isWaiting = false;
  isDragging = false;
  isVanishing = false;
  vanishStart = 0;
  vanishDelay = 1000;

  constructor(el: HTMLElement, parent: Section) {
    this.parent = parent;
    this.el = el;
    this.index = Array.from(el.parentNode?.children ?? []).indexOf(el);
  }

  set(fromScratch = true) {
    this.el.style.setProperty("--size", String(0.5 + Math.random() * 0.5));
    this.s = 0;
    this.x = 0;
    this.y = 0;
    this.z = -20000;
    this.rx = 90;
    this.ry = Math.random() * 2 - 1;
    this.rz = 0;
    this.vz = 40 + Math.random() * 10;
    this.vx =
      Math.random() * window.safeWidth * 0.0025 * (this.index % 2 ? -1 : 1);
    this.vy =
      Math.random() * window.safeHeight * 0.0025 * (this.index % 3 ? -1 : 1);
    this.vrx = 0.25 + Math.random() * 1;
    this.vry = 0.25 + Math.random() * 1;

    this.isWaiting = false;
    this.isDragging = false;
    this.isVanishing = false;
    this.vanishStart = 0;

    this.el.classList.remove("is-waiting");
    this.el.classList.remove("is-dragging");
    this.el.classList.remove("is-vanishing");

    if (!fromScratch) {
      this.isWaiting = true;
      this.s = 1;
      this.x = this.vx * Math.random() * 200;
      this.y = this.vy * Math.random() * 200;
      this.rx = Math.random() * 360;
      this.ry = Math.random() * 360;
      this.z = Math.random() * -20000;
    }

    this.el.style.setProperty("--s", String(this.s));
  }

  move(time: number) {
    if (this.isWaiting) return;

    if (this.isDragging) {
      const x = this.parent.mouse.x - this.parent.smiley.rel.x;
      const y = this.parent.mouse.y - this.parent.smiley.rel.y * 1.5;

      this.vx += (x - this.x) * 0.075;
      this.vy += (y - this.y) * 0.075;
      this.vz += (0 - this.z) * 0.3;

      this.ry = this.vx * 0.15;
      this.rx = this.vy * -0.15;
      this.rz = this.ry + this.rx;

      this.vx *= 0.9;
      this.vy *= 0.9;
      this.vz *= 0.75;

      this.x += this.vx * 0.5;
      this.y += this.vy * 0.5;
      this.z += this.vz * 0.25;
      this.z = Math.min(this.z, 500);
      this.s += (1 - this.s) * 0.5;
    } else if (this.isVanishing) {
      this.vy += 0.5;
      this.x += this.vx;
      this.y += this.vy;
      this.rx += this.vrx;
      this.ry += this.vry;

      if (time - this.vanishStart > this.vanishDelay) {
        this.isWaiting = true;
        this.el.classList.add("is-waiting");
        this.parent.objectMoveEnd(this);
      }
    } else if (this.z > 1000) {
      this.isWaiting = true;
      this.el.classList.add("is-waiting");
      this.parent.objectMoveEnd(this);
    } else {
      this.s += 0.005;
      this.s = Math.min(this.s, 1);
      this.z += this.vz;
      this.x += this.vx;
      this.y += this.vy;
      this.rx += this.vrx;
      this.ry += this.vry;
    }

    this.el.style.setProperty("--x", `${this.x}px`);
    this.el.style.setProperty("--y", `${this.y}px`);
    this.el.style.setProperty("--z", `${this.z}px`);
    this.el.style.setProperty("--rx", String(this.rx));
    this.el.style.setProperty("--ry", String(this.ry));
    this.el.style.setProperty("--rz", String(this.rz));
    this.el.style.setProperty("--s", String(this.s));
  }
}

export class Section {
  el: SectionHost;
  svg: SVGSVGElement;
  objectsWrapper: HTMLElement;
  ruler: HTMLElement;

  objects: FlyingObject[] = [];
  canThrow = false;
  lastThrow = 0;
  throwDelay = 2000;
  thrownObjects: FlyingObject[] = [];
  draggedObject: FlyingObject | null = null;

  smiley = {
    el: null as unknown as HTMLElement,
    bounding: null as DOMRect | null,
    rel: { x: 0, y: 0 },
  };

  lines = {
    circularPath: null as unknown as SVGPathElement,
    lines: [] as { p1: { x: number; y: number }; p2: { x: number; y: number } }[],
  };

  bounding = { left: 0, top: 0, width: 0, height: 0 };

  scroll = { start: 0, end: 0, p: 0, sp: 0 };

  mouse = { x: 0, y: 0, oy: 0, sx: 0, sy: 0, d: 0, set: false };

  lastTouch = 0;
  isPaused = true;

  private intersectObserver: IntersectionObserver | null = null;

  constructor(el: SectionHost) {
    this.el = el;
    this.svg = el.querySelector(".js-svg")!;
    this.objectsWrapper = el.querySelector(".js-objects")!;
    this.ruler = el.querySelector(".js-ruler")!;
    this.smiley.el = el.querySelector(".js-smiley")!;
    this.lines.circularPath = el.querySelector(".js-lines-circular-path")!;

    Array.from(this.objectsWrapper.children).forEach((child) => {
      this.objects.push(new FlyingObject(child as HTMLElement, this));
    });

    if (document.readyState === "complete") {
      Ticker.nextTick(this.init, this);
    } else {
      Emitter.once("siteLoaded", this.init, this);
    }
  }

  init = () => {
    this.setSize();
    this.setScroll();
    this.setLines();
    this.bindEvents();
    this.firstObjects();
  };

  destroy = () => {
    Emitter.off("mousemove", this.onMouseMove, this);
    Emitter.off("resize", this.onResize, this);
    Emitter.off("scroll", this.onScroll, this);
    Emitter.off("tick", this.tick, this);
    this.intersectObserver?.disconnect();
    this.el.__flyingSection = undefined;
  };

  bindEvents() {
    Emitter.on("mousemove", this.onMouseMove, this);
    Emitter.on("resize", this.onResize, this);
    Emitter.on("scroll", this.onScroll, this);
    Emitter.on("tick", this.tick, this);

    this.objects.forEach((object) => {
      object.el.addEventListener("mousedown", this.objectDragStart);
      object.el.addEventListener("touchstart", this.objectDragStart, { passive: false });
    });

    this.el.addEventListener("mouseup", this.objectDragEnd);
    this.el.addEventListener("touchend", this.objectDragEnd);
    this.objectsWrapper.addEventListener("touchmove", this.onTouchMove, { passive: false });
    this.el.addEventListener("intersect", this.onIntersect, { passive: true });

    this.intersectObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.dispatchEvent(
            new CustomEvent("intersect", {
              detail: { isIntersecting: entry.isIntersecting },
            }),
          );

          if (entry.isIntersecting) {
            entry.target.classList.remove(
              "is-out-of-view",
              "is-out-of-view-top",
              "is-out-of-view-bottom",
            );
          } else {
            entry.target.classList.add("is-out-of-view");
            entry.target.classList.toggle(
              "is-out-of-view-top",
              entry.boundingClientRect.top < 0,
            );
            entry.target.classList.toggle(
              "is-out-of-view-bottom",
              entry.boundingClientRect.top > 0,
            );
          }
        });
      },
      { threshold: 0 },
    );
    this.intersectObserver.observe(this.el);
  }

  onIntersect = (event: Event) => {
    const { isIntersecting } = (event as CustomEvent<{ isIntersecting: boolean }>).detail;
    this.isPaused = !isIntersecting;
    this.canThrow = isIntersecting;

    if (!this.isPaused) {
      this.thrownObjects.forEach((object) => {
        object.isWaiting = false;
      });
    }
  };

  onMouseMove = (x: number, y: number) => {
    this.updateMousePosition(x, y);
  };

  onTouchMove = (e: TouchEvent) => {
    e.preventDefault();

    const delta = performance.now() - this.lastTouch;
    if (delta < Ticker.delta) return;

    const touch = e.touches[0];
    if (!touch) return;
    this.updateMousePosition(touch.clientX, touch.clientY);
    this.lastTouch = performance.now();
  };

  updateMousePosition(x: number, y: number) {
    this.mouse.x = x - this.bounding.left;
    this.mouse.y = y - this.mouse.oy + window.scrollY;

    if (!this.mouse.set) {
      this.mouse.sx = this.mouse.x;
      this.mouse.sy = this.mouse.y;
      this.mouse.set = true;
    }
  }

  onResize = () => {
    this.setSize();
    this.setScroll();
    this.setLines();
  };

  onScroll = (scrollY: number) => {
    const trigger = scrollY + window.safeHeight;

    if (trigger < this.scroll.start) {
      this.scroll.p = 0;
    } else if (trigger > this.scroll.end) {
      this.scroll.p = 1;
    } else {
      this.scroll.p = (trigger - this.scroll.start) / (this.scroll.end - this.scroll.start);
    }
  };

  setSize() {
    const bounding = this.el.getBoundingClientRect();
    this.bounding = {
      left: bounding.left,
      top: bounding.top,
      width: bounding.width,
      height: bounding.height,
    };

    this.svg.style.width = `${bounding.width}px`;
    this.svg.style.height = `${bounding.height}px`;

    this.smiley.bounding = this.smiley.el.getBoundingClientRect();
    this.smiley.rel.x =
      this.smiley.bounding.left - this.bounding.left + this.smiley.bounding.width / 2;
    this.smiley.rel.y =
      this.smiley.bounding.top - this.bounding.top + this.smiley.bounding.height / 2;

    this.mouse.oy = this.bounding.top + window.scrollY;

    const pOriginY = this.ruler.clientHeight;
    this.objectsWrapper.style.perspectiveOrigin = `50% ${pOriginY}px `;
  }

  setScroll() {
    this.scroll = {
      start: this.bounding.top + window.scrollY,
      end: this.bounding.top + window.scrollY + this.bounding.height + window.safeHeight,
      p: 0,
      sp: 0,
    };
    this.onScroll(window.scrollY);
    this.scroll.sp = this.scroll.p;
  }

  setLines() {
    this.lines.lines = [];

    const { height } = this.bounding;
    const vLines = window.safeWidth > 767 ? 12 : 8;
    const gapX = this.bounding.width / vLines;

    for (let i = 0; i <= vLines; i++) {
      this.lines.lines.push({
        p1: { x: gapX * i, y: 0 },
        p2: { x: this.smiley.rel.x, y: this.smiley.rel.y },
      });
      this.lines.lines.push({
        p1: { x: gapX * i, y: height },
        p2: { x: this.smiley.rel.x, y: this.smiley.rel.y },
      });
    }

    const dx = this.bounding.width;
    const dy = (height - this.smiley.rel.y) / 2;
    this.el.style.setProperty("--distortion", String(Math.hypot(dx, dy) * 0.14));

    const hLines = vLines;
    const gapY = height / hLines;
    const offsetY = (height - gapY * hLines) / 2;

    for (let i = 1; i < hLines; i++) {
      this.lines.lines.push({
        p1: { x: 0, y: offsetY + gapY * i },
        p2: { x: this.smiley.rel.x, y: this.smiley.rel.y },
      });
      this.lines.lines.push({
        p1: { x: this.bounding.width, y: offsetY + gapY * i },
        p2: { x: this.smiley.rel.x, y: this.smiley.rel.y },
      });
    }

    this.drawLines();
  }

  drawLines() {
    const { height, width } = this.bounding;
    let d = `M 0 ${height} L ${width} ${height}`;
    this.lines.lines.forEach((line) => {
      d += `M ${line.p1.x} ${line.p1.y} L ${line.p2.x} ${line.p2.y} `;
    });
    this.lines.circularPath.setAttribute("d", d);
  }

  throwObject() {
    if (this.objects.length > 0) {
      const object = this.objects.splice(Math.floor(Math.random() * this.objects.length), 1)[0];
      object.set();
      this.thrownObjects.push(object);
    }
    this.lastThrow = performance.now();
    const rate = window.safeWidth > 767 ? 1 : 2;
    this.throwDelay = (500 + Math.random() * 500) * rate;
  }

  firstObjects() {
    const totalObjects = Math.max(Math.min(Math.round(window.safeWidth * 0.025), 5), 2);
    for (let i = 0; i < totalObjects; i++) {
      if (this.objects.length === 0) break;
      const object = this.objects.splice(Math.floor(Math.random() * this.objects.length), 1)[0];
      object.set(false);
      this.thrownObjects.push(object);
    }
  }

  objectMoveEnd(object: FlyingObject) {
    const index = this.thrownObjects.indexOf(object);
    if (index >= 0) this.thrownObjects.splice(index, 1);
    this.objects.push(object);
  }

  objectDragStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    this.lastTouch = performance.now();

    if (e instanceof MouseEvent === false) {
      this.onTouchMove(e);
    }

    const el = e.currentTarget as HTMLElement;
    const object = this.thrownObjects.find((o) => o.el === el);
    if (!object || object.isDragging || object.isVanishing) return;

    this.draggedObject = object;
    object.isDragging = true;
    el.classList.add("is-dragging");
  };

  objectDragEnd = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const object = this.draggedObject;
    if (!object) return;

    object.isDragging = false;
    object.el.classList.remove("is-dragging");
    object.isVanishing = true;
    object.el.classList.add("is-vanishing");
    object.vanishStart = performance.now();
    this.draggedObject = null;
  };

  tick = (time: number) => {
    const { scroll, mouse, el } = this;

    mouse.sx += (mouse.x - mouse.sx) * 0.1;
    mouse.sy += (mouse.y - mouse.sy) * 0.1;

    const dx = mouse.x - mouse.sx;
    const dy = mouse.y - mouse.sy;
    mouse.d = Math.hypot(dx, dy);

    scroll.sp += (scroll.p - scroll.sp) * 0.1;
    el.style.setProperty("--scroll-progress", String(scroll.sp));

    this.thrownObjects.forEach((object) => {
      object.move(time);
    });

    if (this.isPaused) return;

    if (this.canThrow && time - this.lastThrow > this.throwDelay) {
      this.throwObject();
    }
  };
}

export function mountFlyingSection(el: SectionHost) {
  if (el.__flyingSection) return el.__flyingSection;
  const section = new Section(el);
  el.__flyingSection = section;
  return section;
}

export function unmountFlyingSection(el: SectionHost) {
  el.__flyingSection?.destroy();
}
