import { createFileRoute } from "@tanstack/react-router";
import sidai1 from "@/assets/sidai-1.jpg";
import sidai2 from "@/assets/sidai-2.jpg";
import sidai3 from "@/assets/sidai-3.jpg";
import sidai4 from "@/assets/sidai-4.jpg";
import sidai5 from "@/assets/sidai-5.jpg";
import sidai6 from "@/assets/sidai-6.jpg";
import sidai7 from "@/assets/sidai-7.jpg";

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
  },
  {
    name: "Naserian Cape Dress",
    tag: "Bridal",
    price: 14800,
    img: sidai2,
    desc: "Scarlet mini with flowing white cape and beaded collar — statement piece.",
  },
  {
    name: "Resian Heritage Maxi",
    tag: "Cultural",
    price: 11200,
    img: sidai3,
    desc: "Soft sky-blue gown with red checked sleeve and tribal embroidery.",
  },
  {
    name: "Naipanoi Stage Gown",
    tag: "Couture",
    price: 16500,
    img: sidai4,
    desc: "Ceremonial white & blue gown with vibrant Maasai motif embroidery.",
  },
  {
    name: "Sankau Performance Set",
    tag: "Couture",
    price: 15800,
    img: sidai5,
    desc: "Layered white skirt and structured top with multicolour beadwork.",
  },
  {
    name: "Lavie Mermaid Gown",
    tag: "Featured on TikTok",
    price: 13900,
    img: sidai6,
    desc: "Off-shoulder red corset with flowing white mermaid skirt.",
  },
  {
    name: "Twin Flame Cape Set",
    tag: "Duo",
    price: 11800,
    img: sidai7,
    desc: "Matching beaded red gowns with optional white cape — perfect for sisters & bridal parties.",
  },
];

const tiktoks = [
  "https://www.tiktok.com/embed/v2/7300000000000000001",
  "https://www.tiktok.com/embed/v2/7300000000000000002",
  "https://www.tiktok.com/embed/v2/7300000000000000003",
];

function SidaiPage() {
  return (
    <>
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
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

      {/* EDITORIAL HERO PAIR */}
      <section className="grid grid-cols-1 md:grid-cols-2">
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

      {/* PRODUCT GRID */}
      <section id="collection" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">
              The Sidai Collection
            </p>
            <h2 className="font-display text-4xl md:text-5xl">Featured pieces</h2>
          </div>
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            Each piece is made-to-order. Delivery 7–14 days within Kenya.
          </p>
        </div>
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.name} className="group">
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
                  <a
                    href={wa(p.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tracking-luxury whitespace-nowrap rounded-full bg-foreground px-4 py-2.5 text-[10px] text-background transition-opacity hover:opacity-90"
                  >
                    Order
                  </a>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIKTOK */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">As Seen</p>
              <h2 className="font-display text-4xl md:text-5xl">Trending on TikTok</h2>
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
            {tiktoks.map((src, i) => (
              <div key={i} className="aspect-[9/16] overflow-hidden bg-muted">
                <iframe
                  src={src}
                  className="h-full w-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`TikTok video ${i + 1}`}
                />
              </div>
            ))}
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