import type { ReactNode } from "react";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { LineGrid } from "@/components/home/LineGrid";
import styles from "./FlyingMemoriesCta.module.css";

export function FlyingMemoriesCta({ children }: { children: ReactNode }) {
  return (
    <LineGrid
      className={styles.section}
      innerClassName={styles.inner}
      ariaLabel="Begin with Sky n Soul"
    >
      {children}
    </LineGrid>
  );
}

export function FlyingMemoriesInvite() {
  return (
    <section className={styles.invite} aria-label="Begin with Sky n Soul">
      <Link href="/contact" className={styles.button}>
        Go
      </Link>
      <p className={styles.title}>
        Let&apos;s
        <br />
        begin
      </p>
      <a className={styles.email} href={`mailto:${SITE.email}`}>
        {SITE.email}
      </a>
    </section>
  );
}
