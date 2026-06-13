import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import heroImg from "@/assets/hero.jpg";
import sidaiImg from "@/assets/sidai.jpg";
import textileImg from "@/assets/textile-card.jpg";
import collectiveImg from "@/assets/collective-hero.webp";
import sidaiNew1 from "@/assets/sidai-new-1.jpeg";
import sidaiNew2 from "@/assets/sidai-new-2.jpeg";
import sidaiNew3 from "@/assets/sidai-new-3.jpg";
import sidaiNew4 from "@/assets/sidai-new-4.jpg";
import sidaiNew5 from "@/assets/sidai-new-5.webp";
import sidaiNew6 from "@/assets/sidai-new-6.webp";
import fabricAnkara from "@/assets/fabric-ankara.jpg";
import fabricCotton from "@/assets/fabric-cotton.jpg";
import fabricLinen from "@/assets/fabric-linen.jpg";
import fabricSilk from "@/assets/fabric-silk.jpg";
import collectiveNew1 from "@/assets/collective-new-1.jpeg";
import collectiveNew2 from "@/assets/collective-new-2.jpg";
import collectiveNew3 from "@/assets/collective-new-3.jpg";
import collectiveNew4 from "@/assets/collective-new-4.webp";
import collectiveNew5 from "@/assets/collective-new-5.webp";
import collectiveNew6 from "@/assets/collective-new-6.webp";

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
    key: "sidai" as const,
    title: "Lulu Sidai",
    desc: "Handmade Maasai outfits for everyday and special days.",
    cta: "Shop outfits",
    to: "/sidai" as const,
    img: sidaiImg,
  },
  {
    key: "textile" as const,
    title: "Lulu Textile",
    desc: "Quality fabric for tailors, designers, and home sewists.",
    cta: "Buy fabric",
    to: "/textile" as const,
    img: textileImg,
  },
  {
    key: "collective" as const,
    title: "Lulu Collective",
    desc: "Photoshoots, stories, and people we work with.",
    cta: "See our work",
    to: "/collective" as const,
    img: collectiveImg,
  },
];

type Card = {
  title: string;
  desc: string;
  img: string;
  cta: string;
  to?: "/sidai" | "/textile" | "/collective";
  href?: string;
};

const wa = (msg: string) =>
  `https://wa.me/254714844809?text=${encodeURIComponent(msg)}`;

const curated: Record<"sidai" | "textile" | "collective", Card[]> = {
  sidai: [
    {
      title: "Maasai Beaded Dress",
      desc: "Signature handbeaded silhouette in soft cotton.",
      img: sidaiNew1,
      cta: "Shop the look",
      to: "/sidai",
    },
    {
      title: "Heritage Shuka Set",
      desc: "Two-piece tailored from authentic Maasai shuka.",
      img: sidaiNew2,
      cta: "Shop the look",
      to: "/sidai",
    },
    {
      title: "Ceremonial Wrap",
      desc: "Statement wrap for weddings and special days.",
      img: sidaiNew3,
      cta: "Shop the look",
      to: "/sidai",
    },
    {
      title: "Everyday Sidai",
      desc: "Easy, breathable outfits made for daily wear.",
      img: sidaiNew4,
      cta: "Shop the look",
      to: "/sidai",
    },
    {
      title: "Bridal Edit",
      desc: "Hand-finished pieces for your big day.",
      img: sidaiNew5,
      cta: "Shop the look",
      to: "/sidai",
    },
    {
      title: "Festival Capsule",
      desc: "Bold colour, bold beadwork, bold you.",
      img: sidaiNew6,
      cta: "Shop the look",
      to: "/sidai",
    },
  ],
  textile: [
    {
      title: "Ankara Print",
      desc: "Vibrant wax-print cotton, sold per metre.",
      img: fabricAnkara,
      cta: "Inquire",
      href: wa("Hi Lulu Textile, I'd like to inquire about Ankara Print fabric."),
    },
    {
      title: "Pure Cotton",
      desc: "Soft, breathable cotton for everyday tailoring.",
      img: fabricCotton,
      cta: "Inquire",
      href: wa("Hi Lulu Textile, I'd like to inquire about Pure Cotton fabric."),
    },
    {
      title: "Linen Blend",
      desc: "Lightweight linen with a crisp natural feel.",
      img: fabricLinen,
      cta: "Inquire",
      href: wa("Hi Lulu Textile, I'd like to inquire about Linen Blend fabric."),
    },
    {
      title: "Silk Touch",
      desc: "Luxe silk-touch fabric for special pieces.",
      img: fabricSilk,
      cta: "Inquire",
      href: wa("Hi Lulu Textile, I'd like to inquire about Silk Touch fabric."),
    },
    {
      title: "Maasai Shuka",
      desc: "Authentic shuka in heritage red and check patterns.",
      img: textileImg,
      cta: "Inquire",
      href: wa("Hi Lulu Textile, I'd like to inquire about Maasai Shuka fabric."),
    },
    {
      title: "Custom Bulk Order",
      desc: "Wholesale fabric for designers and studios.",
      img: fabricAnkara,
      cta: "Talk to us",
      href: wa("Hi Lulu Textile, I'd like a bulk fabric quote."),
    },
  ],
  collective: [
    {
      title: "Editorial: Heritage in Motion",
      desc: "A photoshoot celebrating Maasai craft and modern silhouettes.",
      img: collectiveNew1,
      cta: "See the story",
      to: "/collective",
    },
    {
      title: "Behind the Beadwork",
      desc: "The women and the hands shaping every Sidai piece.",
      img: collectiveNew2,
      cta: "See the story",
      to: "/collective",
    },
    {
      title: "Studio Sessions",
      desc: "On set with our collaborators and creative partners.",
      img: collectiveNew3,
      cta: "See the story",
      to: "/collective",
    },
    {
      title: "Campaign: Sidai SS",
      desc: "The seasonal campaign — colour, light, and culture.",
      img: collectiveNew4,
      cta: "See the story",
      to: "/collective",
    },
    {
      title: "Stories From Home",
      desc: "Conversations with artisans across Kenya.",
      img: collectiveNew5,
      cta: "See the story",
      to: "/collective",
    },
    {
      title: "Work With Us",
      desc: "Collaborations with brands, stylists, and creatives.",
      img: collectiveNew6,
      cta: "Get in touch",
      to: "/collective",
    },
  ],
};

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
            Shop outfits. Buy fabric. Collaborate with us.
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

      {/* DIVISIONS TABS — right below the hero */}
      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
          <Tabs defaultValue={worlds[0].title} className="w-full">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 rounded-none border-b border-border/60 bg-transparent p-0">
              {worlds.map((w) => (
                <TabsTrigger
                  key={w.title}
                  value={w.title}
                  className="tracking-luxury rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 text-[11px] text-muted-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  {w.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {worlds.map((w) => (
              <TabsContent key={w.title} value={w.title} className="mt-8">
                <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl">{w.title}</h3>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">{w.desc}</p>
                  </div>
                  <Link
                    to={w.to}
                    className="tracking-luxury inline-block rounded-full border border-foreground/20 px-5 py-2.5 text-[10px] text-foreground transition-colors hover:bg-foreground hover:text-background"
                  >
                    {w.cta} →
                  </Link>
                </div>
                <DivisionGrid cards={curated[w.key]} />
              </TabsContent>
            ))}
          </Tabs>
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
                <h3 className="font-display text-3xl text-slate-50">{w.title}</h3>
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
            We ship worldwide in about a week , pay 60% upfront so we can start sewing, and the rest before delivery.
          </p>
        </div>
      </section>
    </>
  );
}

function DivisionGrid({ cards }: { cards: Card[] }) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <article key={c.title} className="group flex flex-col">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
            <img
              src={c.img}
              alt={c.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <h4 className="font-display mt-4 text-lg leading-tight">{c.title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
          {c.to ? (
            <Link
              to={c.to}
              className="tracking-luxury mt-4 inline-block w-full rounded-full bg-foreground px-4 py-3 text-center text-[10px] text-background transition-opacity hover:opacity-90"
            >
              {c.cta} →
            </Link>
          ) : (
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tracking-luxury mt-4 block w-full rounded-full border border-foreground px-4 py-3 text-center text-[10px] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {c.cta} →
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
