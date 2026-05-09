import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import textileImg from "@/assets/textile.jpg";

export const Route = createFileRoute("/textile")({
  head: () => ({
    meta: [
      { title: "Lulu Textile — Quality fabric for sewists · Lulu Clothline" },
      {
        name: "description",
        content:
          "Quality fabric for tailors, designers, and home sewists across Kenya.",
      },
      { property: "og:title", content: "Lulu Textile" },
      {
        property: "og:description",
        content: "Quality fabric for tailors, designers, and home sewists.",
      },
    ],
  }),
  component: TextilePage,
});

const inquire = (fabric: string) =>
  `https://wa.me/254714844809?text=${encodeURIComponent(
    `Hi Lulu Textile, I'd like to inquire about ${fabric}.`,
  )}`;

function TextilePage() {
  const [items, setItems] = useState<
    Array<{
      id: string;
      name: string;
      tag: string | null;
      price: number;
      description: string | null;
      image_url: string | null;
    }>
  >([]);

  useEffect(() => {
    let active = true;
    supabase
      .from("sidai_products")
      .select("id, name, tag, price, description, image_url")
      .eq("is_published", true)
      .eq("category", "textile")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (active && data) setItems(data);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="grid border-b border-border/60 md:grid-cols-2">
        <div className="flex items-center px-5 py-20 md:px-16 md:py-28">
          <div>
            <p className="tracking-luxury mb-4 text-[10px] text-muted-foreground">
              Fabric
            </p>
            <h1 className="font-display text-5xl md:text-7xl">Lulu Textile</h1>
            <p className="mt-6 max-w-md text-muted-foreground">
              Quality fabric for tailors, designers, and home sewists — anywhere in Kenya.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={inquire("your fabric collection")}
                target="_blank"
                rel="noopener noreferrer"
                className="tracking-luxury rounded-full bg-foreground px-7 py-4 text-[11px] text-background hover:opacity-90"
              >
                Ask about fabric
              </a>
              <a
                href={inquire("a custom inquiry")}
                target="_blank"
                rel="noopener noreferrer"
                className="tracking-luxury rounded-full border border-foreground/30 px-7 py-4 text-[11px] hover:bg-foreground hover:text-background"
              >
                Ask a question
              </a>
            </div>
          </div>
        </div>
        <div className="aspect-[4/3] md:aspect-auto">
          <img
            src={textileImg}
            alt="Lulu Textile fabrics"
            width={1024}
            height={1280}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* BULK */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center md:px-10 md:py-28">
          <p className="tracking-luxury mb-4 text-[10px] text-muted-foreground">Buying in bulk</p>
          <h2 className="font-display text-3xl md:text-5xl">
            Bulk orders for shops and tailors — just ask.
          </h2>
          <a
            href={inquire("bulk fabric orders for my boutique")}
            target="_blank"
            rel="noopener noreferrer"
            className="tracking-luxury mt-10 inline-block rounded-full bg-whatsapp px-8 py-4 text-[11px] text-whatsapp-foreground transition-transform hover:scale-105"
          >
            Chat with us on WhatsApp
          </a>
        </div>
      </section>

    </>
  );
}