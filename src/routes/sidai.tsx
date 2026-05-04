import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import sidai1 from "@/assets/sidai-1.jpg";
import sidai2 from "@/assets/sidai-2.jpg";
import sidai3 from "@/assets/sidai-3.jpg";
import sidai4 from "@/assets/sidai-4.jpg";
import sidai5 from "@/assets/sidai-5.jpg";
import sidai6 from "@/assets/sidai-6.jpg";
import sidai7 from "@/assets/sidai-7.jpg";
import sidaiReel1 from "@/assets/sidai-reel-1.mp4";
import sidaiCover from "@/assets/sidai-cover.webp";
import sidaiNew1 from "@/assets/sidai-new-1.jpeg";
import sidaiNew2 from "@/assets/sidai-new-2.jpeg";
import sidaiNew3 from "@/assets/sidai-new-3.jpg";
import sidaiNew4 from "@/assets/sidai-new-4.jpg";
import sidaiNew5 from "@/assets/sidai-new-5.webp";
import sidaiNew6 from "@/assets/sidai-new-6.webp";
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
    desc: "Ceremonial gown with vibrant Maasai motif embroidery and multicolour beadwork — available as a flowing gown or layered skirt and structured top set.",
    sizes: ["S", "M", "L"],
    colors: ["White/Blue", "White/Red", "White/Multi", "Black/Multi"],
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
  {
    name: "Empress Royal Beaded Gown",
    tag: "Bridal Couture",
    price: 18500,
    img: sidaiNew1,
    desc: "Royal blue gown with red shuka cape, hand-beaded collar, headpiece and intricate Maasai motif detailing.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Royal Blue/Red"],
  },
  {
    name: "Naimutie Cape Gown",
    tag: "Bridal",
    price: 13500,
    img: sidaiNew2,
    desc: "Sweetheart red maxi with flowing white cape and beaded collar — chevron embellishment from waist to hem.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Red/White"],
  },
  {
    name: "Olosho Sisterhood Gown",
    tag: "Group / Bridal Party",
    price: 12800,
    img: sidaiNew3,
    desc: "Forest green off-shoulder gown with red beaded belt and statement collar — perfect for bridal parties and ceremonies.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Forest Green", "Burgundy", "Navy"],
  },
  {
    name: "Ilayiok Boys Set",
    tag: "Kids",
    price: 4800,
    img: sidaiNew4,
    desc: "Royal blue and white asymmetric tunic with matching trousers for boys — perfect for ceremonies and family events.",
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    colors: ["Royal Blue/White"],
  },
  {
    name: "Nasha Shuka Bustier",
    tag: "Everyday",
    price: 4500,
    img: sidaiNew5,
    desc: "Classic red Maasai-check shuka bustier top — strapless, structured and styled with a beaded choker.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Red Check"],
  },
  {
    name: "Naserian Heart Corset Set",
    tag: "Statement",
    price: 9800,
    img: sidaiNew6,
    desc: "Off-shoulder red heart-cut corset with beaded fringe, paired with crisp white wide-leg trousers.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Red/White"],
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
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    supabase
      .from("sidai_products")
      .select("*")
      .eq("is_published", true)
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

  const allProducts = [...dbProducts, ...products];

  return (
    <>
      {/* Top shuka strip */}
      <div className="maasai-shuka h-3 w-full" aria-hidden="true" />

      <section className="relative overflow-hidden border-b border-border/60 maasai-shuka-soft">
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:px-10 md:py-28">
          <div>
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
          <div className="relative">
            <div className="maasai-shuka absolute -inset-2 -z-10 opacity-40" aria-hidden="true" />
            <div className="aspect-[4/5] overflow-hidden bg-muted ring-1 ring-foreground/10">
              <img
                src={sidaiCover}
                alt="Lulu Sidai cover — model in Maasai beaded headband, statement collar and dress"
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <div className="maasai-beads mt-3 h-3 w-full" aria-hidden="true" />
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
        <div className="maasai-beads mt-4 h-3 w-32" aria-hidden="true" />
        <div className="mt-14 grid gap-10 md:grid-cols-4">
          {[
            { n: "01", t: "Choose your outfit", d: "Browse the Sidai collection." },
            { n: "02", t: "Tap WhatsApp", d: "Click 'Order' on any piece." },
            { n: "03", t: "Confirm details", d: "Share your size and location." },
            { n: "04", t: "Receive it", d: "Delivery in 24–48 hours within Nairobi." },
          ].map((s) => (
            <div key={s.n} className="relative pt-6">
              <div className="maasai-triangles absolute left-0 right-0 top-0 h-2" aria-hidden="true" />
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
            <p className="font-display text-xl">Worldwide delivery</p>
            <p className="mt-1 text-xs text-muted-foreground">Arrives in ~1 week</p>
          </div>
          <div>
            <p className="font-display text-xl">M-Pesa accepted</p>
            <p className="mt-1 text-xs text-muted-foreground">60% deposit to begin production</p>
          </div>
          <div>
            <p className="font-display text-xl">Balance before delivery</p>
            <p className="mt-1 text-xs text-muted-foreground">Full payment clears dispatch</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="maasai-shuka h-3 w-full" aria-hidden="true" />
      <section className="mx-auto max-w-7xl px-5 py-24 text-center md:px-10">
        <h2 className="font-display text-4xl md:text-6xl">Ready to wear it?</h2>
        <p className="mt-4 text-muted-foreground">DM us and we'll style you.</p>
        <div className="maasai-beads mx-auto mt-6 h-3 w-40" aria-hidden="true" />
        <a
          href={wa("a piece from the Sidai collection")}
          target="_blank"
          rel="noopener noreferrer"
          className="tracking-luxury mt-8 inline-block rounded-full bg-whatsapp px-8 py-4 text-[11px] text-whatsapp-foreground transition-transform hover:scale-105"
        >
          Order on WhatsApp
        </a>
      </section>
      <div className="maasai-shuka-blue h-3 w-full" aria-hidden="true" />
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
      <div className="relative overflow-hidden bg-muted ring-1 ring-foreground/10">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          width={900}
          height={1200}
          className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="maasai-shuka absolute inset-x-0 top-0 h-1.5" aria-hidden="true" />
        <span className="tracking-luxury absolute left-3 top-4 rounded-full bg-background/90 px-3 py-1 text-[9px] text-foreground backdrop-blur">
          {p.tag}
        </span>
        <div className="maasai-beads absolute inset-x-0 bottom-0 h-2 opacity-90" aria-hidden="true" />
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