import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
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

type Product = {
  id: string;
  name: string;
  tag: string | null;
  price: number;
  description: string | null;
  image_url: string | null;
  sizes: string[] | null;
  colors: string[] | null;
};

const inquireUrl = (division: string, name: string) =>
  `https://wa.me/254714844809?text=${encodeURIComponent(
    `Hi ${division}, I'd like to inquire about ${name}.`,
  )}`;

function Index() {
  const [productsByCat, setProductsByCat] = useState<Record<string, Product[]>>({
    sidai: [],
    textile: [],
    collective: [],
  });
  const { addItem } = useCart();

  useEffect(() => {
    let active = true;
    supabase
      .from("sidai_products")
      .select("id, name, tag, price, description, image_url, sizes, colors, category")
      .eq("is_published", true)
      .in("category", ["sidai", "textile", "collective"])
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!active || !data) return;
        const grouped: Record<string, Product[]> = { sidai: [], textile: [], collective: [] };
        for (const p of data) {
          const cat = (p as { category: string }).category;
          if (grouped[cat]) grouped[cat].push(p as Product);
        }
        setProductsByCat(grouped);
      });
    return () => {
      active = false;
    };
  }, []);

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
                <DivisionGrid
                  division={w.key}
                  title={w.title}
                  products={productsByCat[w.key] ?? []}
                  onAdd={(p) =>
                    addItem({
                      name: p.name,
                      price: p.price,
                      size: p.sizes?.[0] ?? "One size",
                      color: p.colors?.[0] ?? "Default",
                      img: p.image_url ?? undefined,
                    })
                  }
                />
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

function DivisionGrid({
  division,
  title,
  products,
  onAdd,
}: {
  division: "sidai" | "textile" | "collective";
  title: string;
  products: Product[];
  onAdd: (p: Product) => void;
}) {
  if (products.length === 0) {
    const fallback = worlds.find((w) => w.key === division)!;
    return (
      <Link
        to={fallback.to}
        className="group relative block overflow-hidden bg-muted"
      >
        <div className="aspect-[16/9] overflow-hidden md:aspect-[21/9]">
          <img
            src={fallback.img}
            alt={fallback.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-7 text-background md:p-10">
          <h4 className="font-display text-3xl text-slate-50 md:text-4xl">
            {fallback.title}
          </h4>
          <p className="mt-2 max-w-md text-sm text-background/85">
            {fallback.desc}
          </p>
          <span className="tracking-luxury mt-5 inline-block border-b border-background/50 pb-1 text-[10px]">
            {fallback.cta} →
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <div key={p.id} className="group">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
          </div>
          <div className="mt-4 flex items-start justify-between gap-3">
            <h4 className="font-display text-lg leading-tight">{p.name}</h4>
            {p.price > 0 && (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                KSh {p.price.toLocaleString()}
              </span>
            )}
          </div>
          {division === "sidai" ? (
            <button
              type="button"
              onClick={() => onAdd(p)}
              className="tracking-luxury mt-4 w-full rounded-full bg-foreground px-4 py-3 text-[10px] text-background transition-opacity hover:opacity-90"
            >
              Add to cart
            </button>
          ) : (
            <a
              href={inquireUrl(title, p.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="tracking-luxury mt-4 block w-full rounded-full border border-foreground px-4 py-3 text-center text-[10px] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              View product
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
