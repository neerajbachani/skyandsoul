"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ensureFlyingMemoriesRuntime } from "@/lib/flying-memories/runtime";
import styles from "./LineGrid.module.css";

type Point = { x: number; y: number };

/**
 * Line mesh from SCTA `setGrid` / `drawLines`, drawn at rest (no wave offset).
 */
function drawGrid(section: HTMLElement) {
  const gridEl = section.querySelector<HTMLElement>("[data-scta-grid]");
  const container = section.querySelector<HTMLElement>("[data-scta-inner]");
  const svg = section.querySelector<SVGSVGElement>("[data-scta-svg]");
  const path = section.querySelector<SVGPathElement>("[data-scta-path]");
  if (!gridEl || !container || !svg || !path) return;

  const width = gridEl.getBoundingClientRect().width;
  const height = gridEl.getBoundingClientRect().height;
  const innerHeight = container.getBoundingClientRect().height;
  if (width <= 0 || height <= 0 || innerHeight <= 0) return;

  svg.style.width = `${width}px`;
  svg.style.height = `${height}px`;

  const safeWidth = window.safeWidth || window.innerWidth;
  const vLines = safeWidth > 767 ? 12 : 8;
  const gapX = width / vLines;
  const gapY = innerHeight / 8;
  const hLines = Math.max(Math.floor(height / gapY), 1);
  const offsetY = height - gapY * hLines;

  const columns: Point[][] = [];
  for (let i = 0; i <= vLines; i++) {
    const column: Point[] = [];
    for (let j = 0; j <= hLines; j++) {
      column.push({
        x: gapX * i,
        y: gapY * j + (j !== 0 ? offsetY : 0),
      });
    }
    columns.push(column);
  }

  let d = "";
  columns.forEach((column) => {
    column.forEach((point, index) => {
      d += index === 0 ? `M ${point.x} ${point.y} ` : `L ${point.x} ${point.y} `;
    });
  });
  for (let y = 0; y < hLines; y++) {
    columns.forEach((column, x) => {
      const point = column[y];
      d += x === 0 ? `M ${point.x} ${point.y} ` : `L ${point.x} ${point.y} `;
    });
  }
  path.setAttribute("d", d);
}

type LineGridProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  ariaLabel?: string;
};

export function LineGrid({ children, className, innerClassName, ariaLabel }: LineGridProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureFlyingMemoriesRuntime();
    const section = sectionRef.current;
    if (!section) return;

    const update = () => drawGrid(section);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(section);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.section} ${className ?? ""}`} aria-label={ariaLabel}>
      <div className={`${styles.inner} ${innerClassName ?? ""}`} data-scta-inner>
        {children}
      </div>
      <div className={styles.grid} data-scta-grid aria-hidden>
        <svg className={styles.gridSvg} data-scta-svg>
          <path className={styles.gridPath} data-scta-path d="" />
        </svg>
      </div>
    </section>
  );
}
