import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Sky n Soul handles your personal information.",
};

export default function PrivacyPage() {
  return (
    <ContentPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      intro="We respect your privacy and only collect what we need to care for your inquiry or order."
    >
      <p>
        When you contact us or browse the catalog, we may receive your name, email address, and
        message details. We use this information to respond to you and improve the Sky n Soul
        experience.
      </p>
      <p>
        We do not sell personal information. Payment processing details will be handled by trusted
        providers when checkout launches in Phase B.
      </p>
      <p>
        Questions about privacy can be sent to{" "}
        <a
          href={`mailto:${SITE.email}`}
          className="text-earth underline underline-offset-4"
        >
          {SITE.email}
        </a>
        .
      </p>
    </ContentPageLayout>
  );
}
