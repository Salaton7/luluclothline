import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import cotton from "@/assets/fabric-cotton.jpg";
import ankara from "@/assets/fabric-ankara.jpg";
import linen from "@/assets/fabric-linen.jpg";
import silk from "@/assets/fabric-silk.jpg";
import textileImg from "@/assets/textile.jpg";

export const Route = createFileRoute("/textile")({
  head: () => ({
    meta: [
      { title: "Lulu Textile — Premium Fabrics for Creators · Lulu Clothline" },
      {
        name: "description",
        content:
          "High-quality fabrics and materials for designers, tailors, and fashion creatives across Kenya.",
      },
      { property: "og:title", content: "Lulu Textile" },
      {
        property: "og:description",
        content: "Premium fabrics and materials for creators and designers.",
      },
    ],
  }),
  component: TextilePage,
});

const inquire = (fabric: string) =>
  `https://wa.me/254714844809?text=${encodeURIComponent(
    `Hi Lulu Textile, I'd like to inquire about ${fabric}.`,
  )}`;

const fabrics = [
  { name: "Cotton", desc: "Soft, breathable, daily wear", img: cotton },
  { name: "Ankara", desc: "Bold prints, rich heritage", img: ankara },
  { name: "Linen", desc: "Natural texture, easy drape", img: linen },
  { name: "Silk", desc: "Fluid, refined, luxurious", img: silk },
];

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
              The Material
            </p>
            <h1 className="font-display text-5xl md:text-7xl">Lulu Textile</h1>
            <p className="mt-6 max-w-md text-muted-foreground">
              High-quality fabrics and materials for designers, tailors, and fashion creatives
              across Kenya.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={inquire("your fabric collection")}
                target="_blank"
                rel="noopener noreferrer"
                className="tracking-luxury rounded-full bg-foreground px-7 py-4 text-[11px] text-background hover:opacity-90"
              >
                Request Fabric on WhatsApp
              </a>
              <a
                href={inquire("a custom inquiry")}
                target="_blank"
                rel="noopener noreferrer"
                className="tracking-luxury rounded-full border border-foreground/30 px-7 py-4 text-[11px] hover:bg-foreground hover:text-background"
              >
                Send Inquiry
              </a>
            </div>
          </div>
        </div>
        <div className="aspect-[4/3] md:aspect-auto">
          <img
            src={textileImg}
            alt="Stack of premium fabrics"
            width={1024}
            height={1280}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="mb-12">
          <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">Categories</p>
          <h2 className="font-display text-4xl md:text-5xl">Fabric library.</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fabrics.map((f) => (
            <a
              key={f.name}
              href={inquire(f.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={f.img}
                  alt={f.name}
                  loading="lazy"
                  width={900}
                  height={900}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-display mt-4 text-2xl">{f.name}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
              <span className="tracking-luxury mt-3 inline-block text-[10px] text-muted-foreground transition-colors group-hover:text-accent">
                Inquire →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* BULK */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center md:px-10 md:py-28">
          <p className="tracking-luxury mb-4 text-[10px] text-muted-foreground">For the trade</p>
          <h2 className="font-display text-3xl md:text-5xl">
            Minimum order support available for designers and boutiques.
          </h2>
          <a
            href={inquire("bulk fabric orders for my boutique")}
            target="_blank"
            rel="noopener noreferrer"
            className="tracking-luxury mt-10 inline-block rounded-full bg-whatsapp px-8 py-4 text-[11px] text-whatsapp-foreground transition-transform hover:scale-105"
          >
            Talk to us on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}