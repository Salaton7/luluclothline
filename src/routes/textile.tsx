import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      {items.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
          <div className="mb-12">
            <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">Available now</p>
            <h2 className="font-display text-4xl md:text-5xl">In stock fabric</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <a
                key={p.id}
                href={inquire(p.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl">{p.name}</h3>
                  {p.price > 0 && (
                    <span className="text-sm text-muted-foreground">
                      KSh {p.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {p.tag && (
                  <span className="tracking-luxury mt-1 inline-block text-[10px] text-muted-foreground">
                    {p.tag}
                  </span>
                )}
                {p.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {p.description}
                  </p>
                )}
                <span className="tracking-luxury mt-3 inline-block text-[10px] text-muted-foreground transition-colors group-hover:text-accent">
                  Ask about this →
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}