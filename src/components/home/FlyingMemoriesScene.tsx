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
const FLOWER_CENTER = 38.9;
const PETAL_PATH =
  "M38.9 34.2C29.6 32.6 19.4 27.2 16.8 18.2C14.6 10.6 20.2 4.2 29.2 5.2C33.4 5.6 36.6 8.4 38.9 12.6C41.2 8.4 44.4 5.6 48.6 5.2C57.6 4.2 63.2 10.6 61 18.2C58.4 27.2 48.2 32.6 38.9 34.2Z";
const FRONT_PETAL_ANGLES = [0, 60, 120, 180, 240, 300] as const;
const BACK_PETAL_ANGLES = [30, 90, 150, 210, 270, 330] as const;

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
        <circle cx={FLOWER_CENTER} cy={FLOWER_CENTER} r={FLOWER_CENTER} />
        <g transform={`translate(${FLOWER_CENTER} ${FLOWER_CENTER}) scale(1.05) translate(${-FLOWER_CENTER} ${-FLOWER_CENTER})`}>
          {BACK_PETAL_ANGLES.map((angle) => (
            <path
              key={`back-${angle}`}
              className={styles.petalBack}
              d={PETAL_PATH}
              transform={`rotate(${angle} ${FLOWER_CENTER} ${FLOWER_CENTER})`}
            />
          ))}
        </g>
        {FRONT_PETAL_ANGLES.map((angle) => (
          <path
            key={`petal-${angle}`}
            className={styles.petal}
            d={PETAL_PATH}
            transform={`rotate(${angle} ${FLOWER_CENTER} ${FLOWER_CENTER})`}
          />
        ))}
        {FRONT_PETAL_ANGLES.map((angle) => (
          <path
            key={`vein-${angle}`}
            className={styles.petalVein}
            d={`M${FLOWER_CENTER} 28.8L${FLOWER_CENTER} 15.2`}
            transform={`rotate(${angle} ${FLOWER_CENTER} ${FLOWER_CENTER})`}
          />
        ))}
        <circle className={styles.flowerCenter} cx={FLOWER_CENTER} cy={FLOWER_CENTER} r="8.4" />
        <circle className={styles.flowerCore} cx={FLOWER_CENTER} cy={FLOWER_CENTER} r="4.6" />
        {FRONT_PETAL_ANGLES.map((angle) => {
          const radians = ((angle - 90) * Math.PI) / 180;
          const ring = 6.15;
          return (
            <circle
              key={`stamen-${angle}`}
              className={styles.stamen}
              cx={FLOWER_CENTER + Math.cos(radians) * ring}
              cy={FLOWER_CENTER + Math.sin(radians) * ring}
              r="1.35"
            />
          );
        })}
        <circle className={styles.flowerHeart} cx={FLOWER_CENTER} cy={FLOWER_CENTER} r="1.7" />
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
