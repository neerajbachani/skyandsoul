import { SITE } from "@/lib/constants";

export function AnnouncementBar() {
  return (
    <div className="bg-sky px-4 py-2.5 text-center">
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-chocolate sm:text-xs">
        {SITE.announcement}
      </p>
    </div>
  );
}
