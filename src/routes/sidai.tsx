import { createFileRoute } from "@tanstack/react-router";
import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";
import look4 from "@/assets/look-4.jpg";
import look5 from "@/assets/look-5.jpg";
import look6 from "@/assets/look-6.jpg";

export const Route = createFileRoute("/sidai")({
  head: () => ({
    meta: [
      { title: "Lulu Sidai — Everyday Fashion · Lulu Clothline" },
      {
        name: "description",
        content:
          "Shop the Lulu Sidai collection — everyday fashion made for confidence and style. Order on WhatsApp, delivery across Kenya.",
      },
      { property: "og:title", content: "Lulu Sidai Collection" },
      {
        property: "og:description",
        content: "Everyday fashion made for confidence and style. M-Pesa accepted.",
      },
    ],
  }),
  component: SidaiPage,
});

const wa = (item: string) =>
  `https://wa.me/254714844809?text=${encodeURIComponent(
    `Hi Lulu Clothline! I'd like to order: ${item}.`,
  )}`;

const products = [
  { name: "Sahara Slip Dress", price: 3500, img: look1 },
  { name: "Oversized Camel Blazer", price: 5800, img: look2 },
  { name: "Cream Maxi Dress", price: 3200, img: look3 },
  { name: "Knit Turtleneck Set", price: 4200, img: look4 },
  { name: "Earth Tone Co-ord (Men)", price: 4800, img: look5 },
  { name: "Amber Linen Jumpsuit", price: 5200, img: look6 },
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
            The Collection
          </p>
          <h1 className="font-display text-5xl md:text-7xl">Lulu Sidai Collection</h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Everyday fashion made for confidence and style. Curated drops, ordered straight on
            WhatsApp, delivered to your door.
          </p>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.name} className="group">
              <div className="overflow-hidden bg-muted">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={900}
                  height={1200}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl">{p.name}</h3>
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