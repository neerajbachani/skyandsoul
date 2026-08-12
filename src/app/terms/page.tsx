import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of use for the Sky n Soul website and catalog.",
};

export default function TermsPage() {
  return (
    <ContentPageLayout
      eyebrow="Legal"
      title="Terms of Service"
      intro="By using the Sky n Soul website, you agree to these simple terms."
    >
      <p>
        Product descriptions, images, and prices on this site are for browsing and inquiry. Online
        checkout, carts, and payments are not yet available. Orders placed through contact are
        confirmed individually.
      </p>
      <p>
        Handmade products may show natural variation in texture and color. We do our best to
        present each piece accurately through photography and copy.
      </p>
      <p>
        These terms may be updated as Phase B commerce features launch. Continued use of the site
        after updates means you accept the revised terms.
      </p>
    </ContentPageLayout>
  );
}
