"use client";

import { useEffect, useRef } from "react";
import {
  mountFlyingSection,
  unmountFlyingSection,
} from "@/lib/flying-memories/section";
import { ensureFlyingMemoriesRuntime } from "@/lib/flying-memories/runtime";
import styles from "./FlyingMemoriesScene.module.css";

export type FlyingFrame = {
  src: string;
  alt: string;
  caption: string;
};

type FlyingMemoriesSceneProps = {
  frames: FlyingFrame[];
  ariaLabel: string;
};

const STAR_COUNT = 10;
const HEADLINE_LINES = ["Where", "little", "memories", "begin"] as const;

export function FlyingMemoriesScene({ frames, ariaLabel }: FlyingMemoriesSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureFlyingMemoriesRuntime();
    const section = sectionRef.current;
    if (!section) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      section.classList.add(styles.reducedMotion);
    }

    mountFlyingSection(section);

    const onMotionChange = () => {
      section.classList.toggle(styles.reducedMotion, media.matches);
    };
    media.addEventListener("change", onMotionChange);

    return () => {
      media.removeEventListener("change", onMotionChange);
      unmountFlyingSection(section);
    };
  }, []);

  const headlineHtml = HEADLINE_LINES.map((line) => `${line}<br />`).join("");

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label={ariaLabel}
      data-intersect
    >
      <svg
        className={`${styles.smiley} js-smiley`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 77.8 77.8"
        aria-hidden
      >
        <circle cx="38.9" cy="38.9" r="38.9" />
        <path d="M38.9 77.8c-2 0-4.1-.2-6.2-.5C11.6 73.9-2.9 53.9.5 32.8 2.1 22.5 7.7 13.5 16.1 7.4c8.4-6.1 18.7-8.5 29-6.9 10.3 1.6 19.3 7.2 25.4 15.6 6.1 8.4 8.5 18.7 6.9 29-3.1 19.1-19.7 32.7-38.5 32.7zM38.8 1c-7.9 0-15.6 2.5-22.1 7.2C8.5 14.1 3.1 22.9 1.5 32.9-1.8 53.5 12.3 73 32.9 76.3 53.5 79.6 73 65.5 76.3 44.9l.5.1-.5-.1c1.6-10-.8-20-6.7-28.2S54.9 3.1 44.9 1.5c-2-.3-4.1-.5-6.1-.5zM25.5 23.1c-1.9 0-3.5 2-4.1 5.1l-.1.3 3 2.2-2.9 2.2.1.3c.6 2.5 1.5 5.1 4.1 5.1 2.4 0 4.2-3.3 4.2-7.6s-2.4-7.6-4.3-7.6zm26.6 0c-1.9 0-3.5 2-4.1 5.1v.3l3 2.2-3 2.2.1.3c.6 2.5 1.5 5.1 4.1 5.1 2.4 0 4.2-3.3 4.2-7.6s-2.3-7.6-4.3-7.6zM62 39c0-.3-.2-.5-.5-.5s-.5.2-.5.5c0 12.2-9.9 22.1-22.1 22.1-12.2 0-22.1-9.9-22.1-22.1 0-.3-.2-.5-.5-.5s-.5.2-.5.5c0 12.7 10.4 23.1 23.1 23.1S62 51.7 62 39z" />
      </svg>

      <div className={`${styles.objects} js-objects`}>
        {frames.map((frame, index) => (
          <div key={`${frame.caption}-${index}`} className={`${styles.object} ${styles.objectFrame}`}>
            <figure className={styles.frameInner}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={frame.src} alt={frame.alt} className={styles.frameImg} loading="lazy" />
              <figcaption className={styles.frameCaption}>{frame.caption}</figcaption>
            </figure>
            <div className={`${styles.frameSide} ${styles.frameSideVertical}`} />
            <div className={`${styles.frameSide} ${styles.frameSideHorizontal}`} />
          </div>
        ))}

        {Array.from({ length: STAR_COUNT }, (_, index) => (
          <div key={`star-${index}`} className={`${styles.object} ${styles.objectStar}`}>
            <div className={`${styles.starSide} ${styles.starSideTopLeft}`} />
            <div className={`${styles.starSide} ${styles.starSideTopRight}`} />
            <div className={`${styles.starSide} ${styles.starSideBottomLeft}`} />
            <div className={`${styles.starSide} ${styles.starSideBottomRight}`} />
          </div>
        ))}

        <div className={`${styles.ruler} js-ruler`} />
      </div>

      <div className={styles.catcher}>
        <div className={styles.catcherDistortedWrapper}>
          <div className={styles.catcherDistorted}>
            <div
              className={`${styles.catcherText} ${styles.catcherTextDistorted}`}
              dangerouslySetInnerHTML={{ __html: headlineHtml }}
            />
          </div>
        </div>
        <div className={styles.catcherNormalWrapper}>
          <div className={styles.catcherNormal}>
            <div
              className={`${styles.catcherText} ${styles.catcherTextNormal}`}
              dangerouslySetInnerHTML={{ __html: headlineHtml }}
            />
          </div>
        </div>
      </div>

      <svg className={`${styles.linesSvg} js-svg`} aria-hidden>
        <path className={`${styles.linesPath} js-lines-circular-path`} d="" />
      </svg>
    </section>
  );
}
