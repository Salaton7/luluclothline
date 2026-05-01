import { createFileRoute } from "@tanstack/react-router";
import sidaiCover from "@/assets/sidai-cover.webp";

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

function SidaiPage() {
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

      {/* Blue shuka strip */}
      <div className="maasai-shuka-blue h-3 w-full" aria-hidden="true" />

      {/* COLLECTION COMING SOON */}
      <section id="collection" className="mx-auto max-w-3xl px-5 py-20 text-center md:px-10 md:py-28">
        <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">
          The Sidai Collection
        </p>
        <h2 className="font-display text-4xl md:text-5xl">Lookbook coming soon</h2>
        <div className="maasai-beads mx-auto mt-4 h-3 w-32" aria-hidden="true" />
        <p className="mt-6 text-muted-foreground">
          Each piece is made-to-order. DM us on WhatsApp to see the latest pieces and
          place a custom order.
        </p>
        <a
          href={wa("a Lulu Sidai piece")}
          target="_blank"
          rel="noopener noreferrer"
          className="tracking-luxury mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-[11px] text-background transition-opacity hover:opacity-90"
        >
          Request the lookbook
        </a>
      </section>

      {/* Chevron divider */}
      <div className="maasai-chevron h-5 w-full" aria-hidden="true" />

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