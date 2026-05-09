import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import sidaiImg from "@/assets/sidai.jpg";
import textileImg from "@/assets/textile-card.jpg";
import collectiveImg from "@/assets/collective-hero.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lulu Clothline — Kenyan fashion made simple" },
      {
        name: "description",
        content:
          "Shop outfits, buy fabric, and work with us. Made in Kenya.",
      },
      { property: "og:title", content: "Lulu Clothline" },
      {
        property: "og:description",
        content: "Outfits, fabric, and stories — made in Kenya.",
      },
    ],
  }),
  component: Index,
});

const worlds = [
  {
    title: "Lulu Sidai",
    desc: "Handmade Maasai outfits for everyday and special days.",
    cta: "Shop outfits",
    to: "/sidai" as const,
    img: sidaiImg,
  },
  {
    title: "Lulu Textile",
    desc: "Quality fabric for tailors, designers, and home sewists.",
    cta: "Buy fabric",
    to: "/textile" as const,
    img: textileImg,
  },
  {
    title: "Lulu Collective",
    desc: "Photoshoots, stories, and people we work with.",
    cta: "See our work",
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
          <p className="tracking-luxury mb-6 text-[11px] text-background/85">​</p>
          <p className="mt-6 max-w-xl text-base text-background/85 md:text-lg">
            Shop outfits. Buy fabric. Work with us.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/sidai"
              className="tracking-luxury rounded-full bg-foreground px-7 py-4 text-[11px] text-background transition-opacity hover:opacity-90"
            >
              Shop outfits
            </Link>
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR WORLD */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-4xl md:text-6xl">Pick what you need.</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">​Explore the Lulu Clothline divisions</p>
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
        <div className="mx-auto max-w-7xl px-5 py-8 text-center md:px-10">
          <p className="text-sm text-muted-foreground md:text-base">
            We ship worldwide in about a week — pay half upfront so we can start sewing, and the rest before delivery.
          </p>
        </div>
      </section>
    </>
  );
}
