import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import sidai1 from "@/assets/sidai-1.jpg";
import sidai2 from "@/assets/sidai-2.jpg";
import sidai3 from "@/assets/sidai-3.jpg";
import sidai4 from "@/assets/sidai-4.jpg";
import sidai5 from "@/assets/sidai-5.jpg";
import sidai6 from "@/assets/sidai-6.jpg";
import sidai7 from "@/assets/sidai-7.jpg";
import sidaiReel1 from "@/assets/sidai-reel-1.mp4";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/sidai")({
  head: () => ({
    meta: [
      { title: "Lulu Sidai — Maasai Couture · Lulu Clothline" },
      {
        name: "description",
        content:
          "Lulu Sidai — handcrafted Maasai-inspired couture. Beaded gowns, capes, and cultural statement pieces, made in Kenya. Order on WhatsApp.",
      },
      { property: "og:title", content: "Lulu Sidai — Maasai Couture" },
      {
        property: "og:description",
        content: "Handcrafted Maasai-inspired couture. Made in Kenya 🇰🇪",
      },
      { property: "og:image", content: "/og-sidai.jpg" },
    ],
  }),
  component: SidaiPage,
});

const wa = (item: string) =>
  `https://wa.me/254714844809?text=${encodeURIComponent(
    `Hi Lulu Clothline! I'd like to order: ${item}.`,
  )}`;

const products = [
  {
    name: "Nashipai Beaded Gown",
    tag: "Signature",
    price: 12500,
    img: sidai1,
    desc: "Crimson maxi with hand-beaded chevron detailing and matching shawl.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Crimson", "Black", "Ivory"],
  },
  {
    name: "Naserian Cape Dress",
    tag: "Bridal",
    price: 14800,
    img: sidai2,
    desc: "Scarlet mini with flowing white cape and beaded collar — statement piece.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Scarlet/White", "Black/White"],
  },
  {
    name: "Resian Heritage Maxi",
    tag: "Cultural",
    price: 11200,
    img: sidai3,
    desc: "Soft sky-blue gown with red checked sleeve and tribal embroidery.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sky Blue", "Sand", "Olive"],
  },
  {
    name: "Naipanoi Stage Gown",
    tag: "Couture",
    price: 16500,
    img: sidai4,
    desc: "Ceremonial white & blue gown with vibrant Maasai motif embroidery.",
    sizes: ["S", "M", "L"],
    colors: ["White/Blue", "White/Red"],
  },
  {
    name: "Sankau Performance Set",
    tag: "Couture",
    price: 15800,
    img: sidai5,
    desc: "Layered white skirt and structured top with multicolour beadwork.",
    sizes: ["S", "M", "L"],
    colors: ["White/Multi", "Black/Multi"],
  },
  {
    name: "Lavie Mermaid Gown",
    tag: "Featured on TikTok",
    price: 13900,
    img: sidai6,
    desc: "Off-shoulder red corset with flowing white mermaid skirt.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Red/White", "Black/White"],
  },
  {
    name: "Twin Flame Cape Set",
    tag: "Duo",
    price: 11800,
    img: sidai7,
    desc: "Matching beaded red gowns with optional white cape — perfect for sisters & bridal parties.",
    sizes: ["S", "M", "L"],
    colors: ["Red", "Red/White Cape"],
  },
];

const reels: { type: "video" | "poster"; src: string; poster?: string; caption: string }[] = [
  {
    type: "poster",
    src: sidai6,
    caption: "Lavie Mermaid Gown — featured on @lulu_clothline",
  },
  {
    type: "video",
    src: sidaiReel1,
    poster: sidai1,
    caption: "Behind the scenes — Nashipai gown in motion",
  },
  {
    type: "poster",
    src: sidai3,
    caption: "Resian Heritage Maxi — Universal Day of Culture",
  },
];

function SidaiPage() {
  return (
    <>
      {/* Top shuka strip */}
      <div className="maasai-shuka h-3 w-full" aria-hidden="true" />

      <section className="relative overflow-hidden border-b border-border/60 maasai-shuka-soft">
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <p className="tracking-luxury mb-4 text-[10px] text-muted-foreground">
            Maasai Couture · Made in Kenya 🇰🇪
          </p>
          <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
            Lulu Sidai
            <br />
            <span className="italic text-accent">Heritage in every stitch.</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            A couture line rooted in Maasai craftsmanship — handcrafted gowns, beaded capes
            and cultural statement pieces, designed and made in Kenya. Each piece is
            tailored on order.
          </p>
          <div className="maasai-beads mt-8 h-4 w-40" aria-hidden="true" />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={wa("a Lulu Sidai piece")}
              target="_blank"
              rel="noopener noreferrer"
              className="tracking-luxury rounded-full bg-foreground px-6 py-3 text-[11px] text-background transition-opacity hover:opacity-90"
            >
              Order on WhatsApp
            </a>
            <a
              href="#collection"
              className="tracking-luxury rounded-full border border-foreground/30 px-6 py-3 text-[11px] hover:bg-foreground hover:text-background"
            >
              View Collection
            </a>
          </div>
        </div>
      </section>

      {/* Chevron beadwork divider */}
      <div className="maasai-chevron h-6 w-full" aria-hidden="true" />

      {/* EDITORIAL HERO PAIR */}
      <section className="grid grid-cols-1 gap-1 bg-foreground md:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden bg-muted md:aspect-auto">
          <img
            src={sidai1}
            alt="Nashipai Beaded Gown — signature crimson Maasai couture"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="aspect-[4/5] overflow-hidden bg-muted md:aspect-auto">
          <img
            src={sidai4}
            alt="Naipanoi Stage Gown — ceremonial Maasai couture"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* Blue shuka strip */}
      <div className="maasai-shuka-blue h-3 w-full" aria-hidden="true" />

      {/* PRODUCT GRID */}
      <section id="collection" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">
              The Sidai Collection
            </p>
            <h2 className="font-display text-4xl md:text-5xl">Featured pieces</h2>
            <div className="maasai-beads mt-4 h-3 w-32" aria-hidden="true" />
          </div>
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            Each piece is made-to-order. Delivery 7–14 days within Kenya.
          </p>
        </div>
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.name} p={p} />
          ))}
        </div>
      </section>

      {/* Chevron divider */}
      <div className="maasai-chevron h-5 w-full" aria-hidden="true" />

      {/* TIKTOK */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">In Motion</p>
              <h2 className="font-display text-4xl md:text-5xl">Sidai, on screen</h2>
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

      {/* HOW TO ORDER */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">Simple as that</p>
        <h2 className="font-display text-4xl md:text-5xl">How to order</h2>
        <div className="mt-14 grid gap-10 md:grid-cols-4">
          {[
            { n: "01", t: "Choose your outfit", d: "Browse the Sidai collection." },
            { n: "02", t: "Tap WhatsApp", d: "Click 'Order' on any piece." },
            { n: "03", t: "Confirm details", d: "Share your size and location." },
            { n: "04", t: "Receive it", d: "Delivery in 24–48 hours within Nairobi." },
          ].map((s) => (
            <div key={s.n} className="border-t border-foreground/20 pt-5">
              <p className="font-display text-3xl text-accent">{s.n}</p>
              <h3 className="font-display mt-3 text-xl">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 text-center md:grid-cols-3 md:px-10">
          <div>
            <p className="font-display text-xl">Delivery in Kenya 🇰🇪</p>
          </div>
          <div>
            <p className="font-display text-xl">M-Pesa accepted 💳</p>
          </div>
          <div>
            <p className="font-display text-xl">Cash on delivery 🚚</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-24 text-center md:px-10">
        <h2 className="font-display text-4xl md:text-6xl">Ready to wear it?</h2>
        <p className="mt-4 text-muted-foreground">DM us and we'll style you.</p>
        <a
          href={wa("a piece from the Sidai collection")}
          target="_blank"
          rel="noopener noreferrer"
          className="tracking-luxury mt-8 inline-block rounded-full bg-whatsapp px-8 py-4 text-[11px] text-whatsapp-foreground transition-transform hover:scale-105"
        >
          Order on WhatsApp
        </a>
      </section>
    </>
  );
}

type Product = (typeof products)[number];

function ProductCard({ p }: { p: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(p.sizes[0]);
  const [color, setColor] = useState(p.colors[0]);

  const handleAdd = () => {
    addItem({ name: p.name, price: p.price, size, color, img: p.img });
  };

  return (
    <div className="group">
      <div className="relative overflow-hidden bg-muted">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          width={900}
          height={1200}
          className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="tracking-luxury absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-[9px] text-foreground backdrop-blur">
          {p.tag}
        </span>
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

        {/* Color selector */}
        <div className="mt-3">
          <p className="tracking-luxury mb-2 text-[9px] text-muted-foreground">Color</p>
          <div className="flex flex-wrap gap-1.5">
            {p.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`rounded-full border px-3 py-1 text-[11px] transition-colors ${
                  color === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground/60"
                }`}
              >
                {c}
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