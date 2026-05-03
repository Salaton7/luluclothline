import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import sidaiImg from "@/assets/sidai.jpg";
import textileImg from "@/assets/textile.jpg";
import collectiveImg from "@/assets/collective.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lulu Clothline — Modern Kenyan Fashion" },
      {
        name: "description",
        content:
          "Shop fashion. Source textiles. Join the collective. A modern Kenyan fashion ecosystem.",
      },
      { property: "og:title", content: "Lulu Clothline" },
      {
        property: "og:description",
        content: "A modern Kenyan fashion ecosystem of style, fabric, and creative culture.",
      },
    ],
  }),
  component: Index,
});

const WHATSAPP_URL = `https://wa.me/254714844809?text=${encodeURIComponent(
  "Hi Lulu Clothline! I'd like to place an order.",
)}`;

const worlds = [
  {
    title: "Lulu Sidai",
    desc: "Everyday fashion made for confidence and style.",
    cta: "Shop Sidai",
    to: "/sidai" as const,
    img: sidaiImg,
  },
  {
    title: "Lulu Textile",
    desc: "Premium fabrics and materials for creators and designers.",
    cta: "Explore Textile",
    to: "/textile" as const,
    img: textileImg,
  },
  {
    title: "Lulu Collective",
    desc: "A creative space for fashion storytelling and collaborations.",
    cta: "Join Collective",
    to: "/collective" as const,
    img: collectiveImg,
  },
];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <img
          src={heroImg}
          alt="Lulu Clothline editorial"
          width={1600}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-foreground/20 to-foreground/80" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
          <p className="tracking-luxury mb-6 text-[11px] text-background/85">
            A Kenyan Fashion Ecosystem
          </p>
          <h1 className="font-display text-5xl leading-[1.05] text-background md:text-7xl lg:text-8xl">
            Style. Fabric.<br />
            <span className="italic text-accent">Creative culture.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-background/85 md:text-lg">
            Shop fashion. Source textiles. Join the collective.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/sidai"
              className="tracking-luxury rounded-full bg-foreground px-7 py-4 text-[11px] text-background transition-opacity hover:opacity-90"
            >
              Explore Sidai
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="tracking-luxury rounded-full border border-background/50 bg-background/10 px-7 py-4 text-[11px] text-background backdrop-blur transition-colors hover:bg-background hover:text-foreground"
            >
              Shop on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR WORLD */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="tracking-luxury mb-3 text-[10px] text-muted-foreground">
              The Ecosystem
            </p>
            <h2 className="font-display text-4xl md:text-6xl">Choose your world.</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Three divisions, one creative vision — rooted in Kenya, designed for the world.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {worlds.map((w) => (
            <Link
              key={w.title}
              to={w.to}
              className="group relative block overflow-hidden bg-muted"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={w.img}
                  alt={w.title}
                  loading="lazy"
                  width={900}
                  height={1200}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-background">
                <h3 className="font-display text-3xl">{w.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-background/85">{w.desc}</p>
                <span className="tracking-luxury mt-5 inline-block border-b border-background/50 pb-1 text-[10px]">
                  {w.cta} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 text-center md:grid-cols-3 md:px-10">
          <div>
            <p className="tracking-luxury text-[10px] text-muted-foreground">DELIVERY</p>
            <p className="font-display mt-2 text-xl">Worldwide Shipping</p>
            <p className="mt-1 text-xs text-muted-foreground">Delivered within 1 week</p>
          </div>
          <div>
            <p className="tracking-luxury text-[10px] text-muted-foreground">PAYMENT</p>
            <p className="font-display mt-2 text-xl">60% Deposit</p>
            <p className="mt-1 text-xs text-muted-foreground">Required to start production</p>
          </div>
          <div>
            <p className="tracking-luxury text-[10px] text-muted-foreground">BEFORE DELIVERY</p>
            <p className="font-display mt-2 text-xl">Balance Cleared</p>
            <p className="mt-1 text-xs text-muted-foreground">Full payment required before dispatch</p>
          </div>
        </div>
      </section>
    </>
  );
}
