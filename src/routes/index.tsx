import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
                <div className="grid items-center gap-8 md:grid-cols-2">
                  <Link to={w.to} className="group block overflow-hidden bg-muted">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={w.img}
                        alt={w.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div>
                    <h3 className="font-display text-3xl md:text-5xl">{w.title}</h3>
                    <p className="mt-4 max-w-md text-base text-muted-foreground">{w.desc}</p>
                    <Link
                      to={w.to}
                      className="tracking-luxury mt-8 inline-block rounded-full bg-foreground px-7 py-4 text-[11px] text-background transition-opacity hover:opacity-90"
                    >
                      {w.cta} →
                    </Link>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
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
