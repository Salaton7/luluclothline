import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import sidai3 from "@/assets/sidai-3.jpg";
import { useCart } from "@/lib/cart";
import { WishlistHeartButton } from "@/components/WishlistDrawer";
import { wishlistId } from "@/lib/wishlist";

export const Route = createFileRoute("/sidai")({
  head: () => ({
    meta: [
      { title: "Lulu Sidai — Handmade Maasai outfits · Lulu Clothline" },
      {
        name: "description",
        content:
          "Handmade Maasai-inspired outfits. Beaded dresses, capes, and special-day pieces, made in Kenya. Order on WhatsApp.",
      },
      { property: "og:title", content: "Lulu Sidai — Handmade Maasai outfits" },
      {
        property: "og:description",
        content: "Handmade Maasai-inspired outfits. Made in Kenya.",
      },
      { property: "og:image", content: "/og-sidai.jpg" },
    ],
  }),
  component: SidaiPage,
});

type Product = {
  name: string;
  tag: string;
  price: number;
  img: string;
  desc: string;
  sizes: string[];
  colors: string[];
};

const reels: { type: "video" | "poster"; src: string; poster?: string; caption: string }[] = [
  {
    type: "poster",
    src: sidai3,
    caption: "Resian Heritage Maxi — Universal Day of Culture",
  },
];

function SidaiPage() {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    supabase
      .from("sidai_products")
      .select("*")
      .eq("is_published", true)
      .eq("category", "sidai")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!active || !data) return;
        const mapped: Product[] = data
          .filter((p) => !!p.image_url)
          .map((p) => ({
            name: p.name,
            tag: p.tag ?? "New",
            price: p.price,
            img: p.image_url as string,
            desc: p.description ?? "",
            sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ["One size"],
            colors: p.colors && p.colors.length > 0 ? p.colors : ["Default"],
          }));
        setDbProducts(mapped);
      });
    return () => {
      active = false;
    };
  }, []);

  const allProducts = dbProducts;

  return (
    <>
      {/* Top shuka strip */}
      <div className="maasai-shuka h-3 w-full" aria-hidden="true" />


      {/* PRODUCT GRID */}
      <section id="collection" className="mx-auto max-w-7xl px-5 pt-28 pb-24 md:px-10 md:pt-36 md:pb-32">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">
              Shop Sidai
            </p>
            <h2 className="font-display text-4xl md:text-5xl">Our outfits</h2>
            <div className="maasai-beads mt-4 h-3 w-32" aria-hidden="true" />
          </div>
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            We make each outfit just for you. Ready in 1–2 weeks within Kenya.
          </p>
        </div>
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {allProducts.map((p) => (
            <ProductCard key={p.name} p={p} />
          ))}
        </div>
      </section>

      {/* Blue shuka strip */}
      <div className="maasai-shuka-blue h-3 w-full" aria-hidden="true" />

      {/* TIKTOK */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">Watch</p>
              <h2 className="font-display text-4xl md:text-5xl">See it in action</h2>
            </div>
            <a
              href="https://www.tiktok.com/@luluclothline"
              target="_blank"
              rel="noopener noreferrer"
              className="tracking-luxury hidden text-[10px] text-muted-foreground hover:text-foreground md:inline"
            >
              @luluclothline →
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reels.map((r, i) => (
              <figure key={i} className="group relative">
                <div className="relative aspect-[9/16] overflow-hidden bg-muted">
                  {r.type === "video" ? (
                    <video
                      src={r.src}
                      poster={r.poster}
                      className="h-full w-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={r.src}
                      alt={r.caption}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <figcaption className="mt-3 text-xs text-muted-foreground">
                  {r.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 flex justify-center md:hidden">
            <a
              href="https://www.tiktok.com/@luluclothline"
              target="_blank"
              rel="noopener noreferrer"
              className="tracking-luxury text-[10px] text-muted-foreground hover:text-foreground"
            >
              @luluclothline on TikTok →
            </a>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 text-center md:grid-cols-3 md:px-10">
          <div>
            <p className="font-display text-xl">We ship worldwide</p>
            <p className="mt-1 text-xs text-muted-foreground">Arrives in about a week</p>
          </div>
          <div>
            <p className="font-display text-xl">Pay with M-Pesa</p>
            <p className="mt-1 text-xs text-muted-foreground">Pay half to start sewing</p>
          </div>
          <div>
            <p className="font-display text-xl">Pay the rest later</p>
            <p className="mt-1 text-xs text-muted-foreground">Before we send it out</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="maasai-shuka h-3 w-full" aria-hidden="true" />
      <section className="mx-auto max-w-7xl px-5 py-24 text-center md:px-10">
        <h2 className="font-display text-4xl md:text-6xl">Like what you see?</h2>
        <p className="mt-4 text-muted-foreground">Message us — we'll help you pick.</p>
        <div className="maasai-beads mx-auto mt-6 h-3 w-40" aria-hidden="true" />
      </section>
      <div className="maasai-shuka-blue h-3 w-full" aria-hidden="true" />
    </>
  );
}

function ProductCard({ p }: { p: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(p.sizes[0]);

  const handleAdd = () => {
    addItem({ name: p.name, price: p.price, size, color: p.colors[0], img: p.img });
  };

  return (
    <div className="group">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted ring-1 ring-foreground/10">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          width={900}
          height={1125}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-transparent" aria-hidden="true" />
        <div className="maasai-shuka absolute inset-x-0 top-0 h-1.5" aria-hidden="true" />
        <div className="maasai-beads absolute inset-x-0 bottom-0 h-2 opacity-90" aria-hidden="true" />
        <WishlistHeartButton
          item={{ id: wishlistId(p.name), name: p.name, price: p.price, img: p.img }}
          className="absolute right-3 top-3"
        />
      </div>
      <div className="mt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl leading-tight">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              KSh {p.price.toLocaleString()}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {p.desc}
        </p>

        {/* Size selector */}
        <div className="mt-4">
          <p className="tracking-luxury mb-2 text-[9px] text-muted-foreground">Size</p>
          <div className="flex flex-wrap gap-1.5">
            {p.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`rounded-full border px-3 py-1 text-[11px] transition-colors ${
                  size === s
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground/60"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="tracking-luxury mt-5 w-full rounded-full bg-foreground px-4 py-3 text-[10px] text-background transition-opacity hover:opacity-90"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}